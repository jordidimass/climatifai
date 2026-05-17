import { z } from "zod";

import { getCrop, isCropId } from "@/lib/api/crops";
import { getRegion } from "@/lib/api/regions";
import { getCropSuitability } from "@/lib/agri/crop-suitability";
import { serverEnv } from "@/lib/env";
import type { CropId } from "@/types/crop";

const bodySchema = z.object({
  regionId: z.string().min(1),
  cropIds: z
    .array(z.string().refine(isCropId, "cultivo inválido"))
    .length(2, "selecciona exactamente 2 cultivos"),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "cuerpo inválido", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { regionId, cropIds } = parsed.data as { regionId: string; cropIds: [CropId, CropId] };
  const region = getRegion(regionId);
  const crops = cropIds.map((id) => getCrop(id));

  if (!region || crops.some((crop) => !crop)) {
    return Response.json({ error: "región o cultivo no encontrado" }, { status: 404 });
  }

  if (serverEnv.AGRI_API_BASE_URL) {
    const upstream = await fetch(`${serverEnv.AGRI_API_BASE_URL}/agri/compare`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ regionId, cropIds }),
    });
    return Response.json(await upstream.json(), { status: upstream.status });
  }

  const suitability = await getCropSuitability({
    location: {
      lat: region.center.lat,
      lng: region.center.lng,
      label: `${region.name}, ${region.country}`,
      regionId: region.id,
    },
    cropIds,
  });

  return Response.json({
    regionId,
    cropIds,
    generatedAt: new Date().toISOString(),
    sourceLabel: suitability.sourceLabel,
    summary: `${crops[0]?.name} y ${crops[1]?.name} comparados para ${region.name} con ${suitability.sourceLabel}.`,
    comparison: cropIds.map((id) => {
      const crop = getCrop(id);
      const cropSuitability = suitability.crops.find((item) => item.cropId === id);
      return {
        cropId: id,
        name: crop?.name,
        suitability: cropSuitability,
        heatStressC: crop?.heatStressC,
        idealPrecipMm: crop?.idealPrecipMm,
        note: "Comparación compatible con la futura Intelligence API.",
      };
    }),
  });
}

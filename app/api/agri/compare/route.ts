import { z } from "zod";

import { compareTwoCropsStub } from "@/lib/agri/compare-stub";
import { getCrop, isCropId } from "@/lib/api/crops";
import { getRegion } from "@/lib/api/regions";
import { getCropSuitability } from "@/lib/agri/crop-suitability";
import { serverEnv } from "@/lib/env";
import type { CropId } from "@/types/crop";

const bodySchema = z.preprocess(
  (raw) => {
    if (typeof raw !== "object" || raw === null) return raw;
    const o = { ...(raw as Record<string, unknown>) };
    if (!("cropIds" in o) && Array.isArray(o.crops)) {
      o.cropIds = o.crops;
    }
    return o;
  },
  z.object({
    regionId: z.string().min(1),
    cropIds: z
      .array(z.string().refine(isCropId, "cultivo inválido"))
      .length(2, "selecciona exactamente 2 cultivos"),
  }),
);

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

  const stub = compareTwoCropsStub(regionId, crops[0]!, crops[1]!);

  if (serverEnv.AGRI_API_BASE_URL) {
    const upstream = await fetch(`${serverEnv.AGRI_API_BASE_URL}/agri/compare`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ regionId, cropIds }),
    });
    const data: unknown = await upstream.json().catch(() => ({}));
    const merged =
      typeof data === "object" && data !== null
        ? { ...stub, ...(data as Record<string, unknown>) }
        : stub;
    return Response.json(merged, { status: upstream.status });
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
    ...stub,
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

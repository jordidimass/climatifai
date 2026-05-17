import { z } from "zod";

import { getCrop, isCropId } from "@/lib/api/crops";
import { getRegion } from "@/lib/api/regions";
import { getCropSuitability } from "@/lib/agri/crop-suitability";
import { serverEnv } from "@/lib/env";
import type { CropId } from "@/types/crop";

const bodySchema = z.object({
  regionId: z.string().min(1),
  cropId: z.string().refine(isCropId, "cultivo inválido"),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "cuerpo inválido", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { regionId, cropId } = parsed.data as { regionId: string; cropId: CropId };
  const region = getRegion(regionId);
  const crop = getCrop(cropId);

  if (!region || !crop) {
    return Response.json({ error: "región o cultivo no encontrado" }, { status: 404 });
  }

  if (serverEnv.AGRI_API_BASE_URL) {
    const upstream = await fetch(`${serverEnv.AGRI_API_BASE_URL}/agri/advisor`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ regionId, cropId }),
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
    cropIds: [cropId],
  });
  const cropSuitability = suitability.crops[0];

  return Response.json({
    regionId,
    cropId,
    generatedAt: new Date().toISOString(),
    suitability: cropSuitability,
    sourceLabel: suitability.sourceLabel,
    advisories: [
      {
        title: `${crop.name} en ${region.name}`,
        severity: cropSuitability?.status === "not_recommended" ? "alta" : "media",
        message: cropSuitability?.reasons[0] ?? `Monitorea temperatura máxima sobre ${crop.heatStressC}°C y ajusta riego si la precipitación cae fuera de ${crop.idealPrecipMm.min}-${crop.idealPrecipMm.max} mm anuales.`,
      },
      {
        title: "Fuente de datos",
        severity: "baja",
        message: `Lectura generada con ${suitability.sourceLabel}. Se reemplazará por la Intelligence API cuando esté disponible.`,
      },
    ],
  });
}

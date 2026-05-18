import { z } from "zod";

import { getCrop, isCropId } from "@/lib/api/crops";
import { getRegion } from "@/lib/api/regions";
import { getCropSuitability } from "@/lib/agri/crop-suitability";
import { gqlFetch } from "@/lib/api/gql-client";
import { serverEnv } from "@/lib/env";
import type { CropId } from "@/types/crop";

const bodySchema = z.object({
  regionId: z.string().min(1),
  cropId: z.string().refine(isCropId, "cultivo inválido"),
});

interface AdvisorGql {
  advisor: {
    cropId: string;
    score: number;
    aptitude: string;
    recommendationText: string;
    factors: { label: string; score: number; weight: number; status: string; description?: string | null }[];
    season: string;
    lat: number;
    lon: number;
  };
}

function aptitudeToStatus(aptitude: string) {
  if (aptitude === "Alta") return "suitable" as const;
  if (aptitude === "Media") return "moderate" as const;
  if (aptitude === "Baja") return "risky" as const;
  return "not_recommended" as const;
}

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

  if (serverEnv.CLIMATIFAI_API_URL) {
    try {
      const { advisor: a } = await gqlFetch<AdvisorGql>(
        `query Advisor($lat: Float!, $lon: Float!, $cropId: String!) {
          advisor(lat: $lat, lon: $lon, cropId: $cropId) {
            cropId score aptitude recommendationText season lat lon
            factors { label score weight status description }
          }
        }`,
        { lat: region.center.lat, lon: region.center.lng, cropId },
        { next: { revalidate: 3600 } },
      );
      const status = aptitudeToStatus(a.aptitude);
      return Response.json({
        regionId,
        cropId,
        generatedAt: new Date().toISOString(),
        suitability: {
          cropId,
          status,
          score: Math.round(a.score),
          confidence: "high",
          reasons: [a.recommendationText],
          constraints: [],
          source: "intelligence-api",
        },
        sourceLabel: "Intelligence API",
        advisories: [
          {
            title: `${crop.name} en ${region.name}`,
            severity: status === "not_recommended" || status === "risky" ? "alta" : "media",
            message: a.recommendationText,
          },
        ],
      });
    } catch {
      // fall through to local fallback
    }
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
        message:
          cropSuitability?.reasons[0] ??
          `Monitorea temperatura máxima sobre ${crop.heatStressC}°C y ajusta riego si la precipitación cae fuera de ${crop.idealPrecipMm.min}-${crop.idealPrecipMm.max} mm anuales.`,
      },
      {
        title: "Fuente de datos",
        severity: "baja",
        message: `Lectura generada con ${suitability.sourceLabel}. Se reemplazará por la Intelligence API cuando esté disponible.`,
      },
    ],
  });
}

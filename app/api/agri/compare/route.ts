import { z } from "zod";

import { getCrop, isCropId } from "@/lib/api/crops";
import { getRegion } from "@/lib/api/regions";
import { getCropSuitability } from "@/lib/agri/crop-suitability";
import { gqlFetch } from "@/lib/api/gql-client";
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

interface AdvisorBrief {
  cropId: string;
  score: number;
  aptitude: string;
  recommendationText: string;
  season: string;
}

interface CompareGql {
  compare: {
    lat: number;
    lon: number;
    season: string;
    winner: string | null;
    cropA: AdvisorBrief;
    cropB: AdvisorBrief;
  };
}

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

  if (serverEnv.CLIMATIFAI_API_URL) {
    try {
      const { compare } = await gqlFetch<CompareGql>(
        `query Compare($lat: Float!, $lon: Float!, $cropIdA: String!, $cropIdB: String!) {
          compare(lat: $lat, lon: $lon, cropIdA: $cropIdA, cropIdB: $cropIdB) {
            lat lon season winner
            cropA { cropId score aptitude recommendationText season }
            cropB { cropId score aptitude recommendationText season }
          }
        }`,
        { lat: region.center.lat, lon: region.center.lng, cropIdA: cropIds[0], cropIdB: cropIds[1] },
        { next: { revalidate: 3600 } },
      );
      return Response.json({
        regionId,
        cropIds,
        generatedAt: new Date().toISOString(),
        sourceLabel: "Intelligence API",
        summary: `${crops[0]?.name} y ${crops[1]?.name} comparados para ${region.name}.`,
        winner: compare.winner,
        comparison: [
          {
            cropId: compare.cropA.cropId,
            name: crops[0]?.name,
            score: Math.round(compare.cropA.score),
            aptitude: compare.cropA.aptitude,
            recommendationText: compare.cropA.recommendationText,
          },
          {
            cropId: compare.cropB.cropId,
            name: crops[1]?.name,
            score: Math.round(compare.cropB.score),
            aptitude: compare.cropB.aptitude,
            recommendationText: compare.cropB.recommendationText,
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
      };
    }),
  });
}

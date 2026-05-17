import { z } from "zod";

import { isCropId } from "@/lib/api/crops";
import { getCropSuitability } from "@/lib/agri/crop-suitability";
import { gqlFetch } from "@/lib/api/gql-client";
import { serverEnv } from "@/lib/env";
import type { CropId } from "@/types/crop";
import type { CropSuitability, CropSuitabilityStatus } from "@/types/agri";

const bodySchema = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    label: z.string().optional(),
    regionId: z.string().optional(),
  }),
  cropIds: z.array(z.string().refine(isCropId, "cultivo inválido")).min(1),
});

interface AdvisorGql {
  advisor: {
    cropId: string;
    score: number;
    aptitude: string;
    recommendationText: string;
  };
}

function aptitudeToStatus(aptitude: string): CropSuitabilityStatus {
  if (aptitude === "Alta") return "suitable";
  if (aptitude === "Media") return "moderate";
  if (aptitude === "Baja") return "risky";
  return "not_recommended";
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "cuerpo inválido", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { location, cropIds } = parsed.data as {
    location: { lat: number; lng: number; label?: string; regionId?: string };
    cropIds: CropId[];
  };

  if (serverEnv.AGRI_GRAPHQL_URL) {
    try {
      const results = await Promise.all(
        cropIds.map((cropId) =>
          gqlFetch<AdvisorGql>(
            `query Advisor($lat: Float!, $lon: Float!, $cropId: String!) {
              advisor(lat: $lat, lon: $lon, cropId: $cropId) {
                cropId score aptitude recommendationText
              }
            }`,
            { lat: location.lat, lon: location.lng, cropId },
            { next: { revalidate: 3600 } },
          ),
        ),
      );

      const crops: CropSuitability[] = results.map(({ advisor: a }) => ({
        cropId: a.cropId as CropId,
        status: aptitudeToStatus(a.aptitude),
        score: Math.round(a.score),
        confidence: "high",
        reasons: [a.recommendationText],
        constraints: [],
        source: "intelligence-api",
      }));

      return Response.json({
        location,
        generatedAt: new Date().toISOString(),
        source: "intelligence-api",
        sourceLabel: "Intelligence API",
        crops,
      });
    } catch {
      // fall through to local fallback
    }
  }

  const response = await getCropSuitability({ location, cropIds });
  return Response.json(response);
}

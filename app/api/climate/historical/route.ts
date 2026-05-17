import { z } from "zod";

import { getRegion } from "@/lib/api/regions";
import { fetchClimateSeries } from "@/lib/api/climate";
import { gqlFetch } from "@/lib/api/gql-client";
import { serverEnv } from "@/lib/env";
import type { ClimatePoint } from "@/types/climate";

const querySchema = z.object({
  regionId: z.string().min(1),
  cropId: z.string().min(1),
  from: z.string().regex(/^\d{4}-\d{2}$/, "se esperaba YYYY-MM"),
  to: z.string().regex(/^\d{4}-\d{2}$/, "se esperaba YYYY-MM"),
});

interface ClimateMonthGql {
  year: number;
  month: number;
  tempC: number | null;
  precipMm: number | null;
}

interface ClimateGql {
  climate: {
    historical: ClimateMonthGql[];
  };
}

function monthToPoint(m: ClimateMonthGql): ClimatePoint {
  return {
    month: `${m.year}-${String(m.month).padStart(2, "0")}`,
    tempMeanC: +(m.tempC ?? 0).toFixed(2),
    precipMm: Math.round(m.precipMm ?? 0),
    gdd: 0,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    regionId: searchParams.get("regionId"),
    cropId: searchParams.get("cropId"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "consulta inválida", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { regionId, cropId, from, to } = parsed.data;

  if (serverEnv.AGRI_GRAPHQL_URL) {
    const region = getRegion(regionId);
    if (region) {
      try {
        const fromYear = parseInt(from.slice(0, 4), 10);
        const toYear = parseInt(to.slice(0, 4), 10);
        const { climate } = await gqlFetch<ClimateGql>(
          `query Climate($lat: Float!, $lon: Float!, $from: Int!, $to: Int!) {
            climate(lat: $lat, lon: $lon, from: $from, to: $to) {
              historical { year month tempC precipMm }
            }
          }`,
          { lat: region.center.lat, lon: region.center.lng, from: fromYear, to: toYear },
          { next: { revalidate: 86400, tags: ["climate", "historical"] } },
        );
        return Response.json({
          regionId,
          cropId,
          range: { from, to },
          kind: "historical",
          points: climate.historical.map(monthToPoint),
        });
      } catch {
        // fall through
      }
    }
  }

  const series = await fetchClimateSeries(regionId, cropId, { from, to }, "historical");
  return Response.json(series);
}

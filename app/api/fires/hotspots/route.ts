import { z } from "zod";

import {
  FirmsKeyMissingError,
  fetchFirmsHotspotsMulti,
} from "@/lib/api/fires";
import { pointInPolygon } from "@/lib/geo/brazil-polygon";
import type { FireDayRange, FirmsSource } from "@/types/fires";

/**
 * Hard LATAM clamp applied to every incoming bbox. The fire map is
 * scoped to Latin America (Brazil excluded by polygon filter further
 * down), so queries that spill into Florida, the western US, the deep
 * Pacific, etc. are trimmed to this rectangle before hitting FIRMS.
 */
const LATAM_BBOX = {
  west: -118.5, // Baja California Sur
  south: -56.0, // Tierra del Fuego
  east: -34.0, // Easternmost Caribbean / Argentina
  north: 33.0, // Northern Mexico / US border
} as const;

const SOURCES: readonly FirmsSource[] = [
  "VIIRS_SNPP_NRT",
  "VIIRS_NOAA20_NRT",
  "VIIRS_NOAA21_NRT",
  "MODIS_NRT",
];

const DAY_RANGES: readonly FireDayRange[] = [1, 2, 7, 30];

const bboxSchema = z
  .string()
  .regex(
    /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/,
    "bbox debe ser west,south,east,north",
  )
  .transform((s) => s.split(",").map(Number))
  .refine((arr) => arr.every(Number.isFinite), "bbox numérico");

const querySchema = z.object({
  bbox: bboxSchema,
  dayRange: z
    .string()
    .optional()
    .transform((s) => (s ? Number(s) : 1))
    .pipe(
      z
        .number()
        .refine(
          (n): n is FireDayRange => DAY_RANGES.includes(n as FireDayRange),
          "dayRange debe ser 1, 2, 7 ó 30",
        ),
    ),
  sources: z
    .string()
    .optional()
    .transform((s) =>
      (s ?? "VIIRS_SNPP_NRT,VIIRS_NOAA20_NRT").split(",").map((v) => v.trim()),
    )
    .pipe(
      z
        .array(
          z.string().refine(
            (v): v is FirmsSource => (SOURCES as readonly string[]).includes(v),
            "fuente no soportada",
          ),
        )
        .min(1),
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")
    .optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    bbox: searchParams.get("bbox"),
    dayRange: searchParams.get("dayRange") ?? undefined,
    sources: searchParams.get("sources") ?? undefined,
    date: searchParams.get("date") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: "consulta inválida", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const [rawWest, rawSouth, rawEast, rawNorth] = parsed.data.bbox;
  const west = Math.max(LATAM_BBOX.west, rawWest);
  const south = Math.max(LATAM_BBOX.south, rawSouth);
  const east = Math.min(LATAM_BBOX.east, rawEast);
  const north = Math.min(LATAM_BBOX.north, rawNorth);

  if (west >= east || south >= north) {
    return Response.json(
      { type: "FeatureCollection", features: [] },
      {
        headers: {
          "content-type": "application/geo+json",
          "cache-control": "public, s-maxage=300",
        },
      },
    );
  }

  try {
    const fc = await fetchFirmsHotspotsMulti(
      parsed.data.sources,
      { west, south, east, north },
      parsed.data.dayRange,
      parsed.data.date,
    );
    // Brazil exclusion per product spec.
    fc.features = fc.features.filter((f) => {
      const [lng, lat] = f.geometry.coordinates;
      return !pointInPolygon(lng, lat);
    });
    return new Response(JSON.stringify(fc), {
      status: 200,
      headers: {
        "content-type": "application/geo+json",
        "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    if (err instanceof FirmsKeyMissingError) {
      return Response.json(
        {
          error: "FIRMS_MAP_KEY no configurada",
          hint: "Solicita una key en https://firms.modaps.eosdis.nasa.gov/api/map_key/ y añádela a .env.local.",
        },
        { status: 503 },
      );
    }
    const message = err instanceof Error ? err.message : "FIRMS error";
    console.error("[/api/fires/hotspots]", err);
    return Response.json({ error: message }, { status: 502 });
  }
}

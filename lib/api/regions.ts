import type { Region } from "@/types/region";

/**
 * Seed region catalog. Centered on Latin America. Replace with a proper
 * geo-source (Natural Earth admin-1 or similar) when the project graduates
 * beyond scaffold. Brazil is intentionally excluded per product spec.
 */
export const REGIONS: Region[] = [
  {
    id: "mx-bajio",
    name: "Bajío",
    country: "MX",
    subdivision: "Guanajuato · Querétaro · Michoacán",
    center: { lat: 20.6, lng: -101.2 },
    zoom: 6,
    summary: "Corredor agrícola intensivo · maíz, trigo, hortalizas y estrés hídrico creciente.",
  },
  {
    id: "gt-altiplano",
    name: "Altiplano y vertiente Pacífico (GT)",
    country: "GT",
    subdivision: "Guatemala · altiplano urbano-departamental",
    center: { lat: 14.65, lng: -90.45 },
    zoom: 6,
    summary:
      "Mix milpa (maíz, frijol, calabaza), hortícola y algunos café agroforestal montano; ciclo corto lluviosa / canícula.",
  },
  {
    id: "ar-pampa",
    name: "Pampa húmeda",
    country: "AR",
    subdivision: "Buenos Aires · Santa Fe · Córdoba",
    center: { lat: -34.6, lng: -61.0 },
    zoom: 5,
    summary: "Núcleo granario · soya, maíz, trigo y variabilidad de lluvias interanual.",
  },
  {
    id: "co-cafetera",
    name: "Eje cafetero",
    country: "CO",
    subdivision: "Caldas · Quindío · Risaralda",
    center: { lat: 4.9, lng: -75.6 },
    zoom: 7,
    summary: "Zona andina cafetera · cambios de temperatura, lluvias y altitud productiva.",
  },
  {
    id: "cl-valle-central",
    name: "Valle Central",
    country: "CL",
    subdivision: "O'Higgins · Maule · Ñuble",
    center: { lat: -35.4, lng: -71.4 },
    zoom: 6,
    summary: "Agricultura mediterránea · frutales, viñedos y déficit hídrico persistente.",
  },
];

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

/** Default selection used before the user picks anything. */
export const DEFAULT_REGION =
  REGIONS.find((r) => r.id === "gt-altiplano") ?? REGIONS[0];

/**
 * Haversine distance between two points on Earth, in kilometres.
 */
function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Snaps an arbitrary coordinate to the closest registered region in the
 * seed catalog. Used by the LocationPicker so downstream code that keys on
 * `regionId` keeps working with free-form picks.
 */
export function findNearestRegion(
  lat: number,
  lng: number,
): { region: Region; distanceKm: number } {
  let best = { region: REGIONS[0], distanceKm: Infinity };
  for (const region of REGIONS) {
    const d = haversineKm(lat, lng, region.center.lat, region.center.lng);
    if (d < best.distanceKm) best = { region, distanceKm: d };
  }
  return best;
}

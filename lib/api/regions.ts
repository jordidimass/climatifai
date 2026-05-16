import type { Region } from "@/types/region";

/**
 * Seed region catalog. Centered on the Iberian Peninsula as a neutral
 * EU-leaning starting point. Replace with a proper geo-source (Natural
 * Earth admin-1 or similar) when the project graduates beyond scaffold.
 */
export const REGIONS: Region[] = [
  {
    id: "es-cat",
    name: "Catalonia",
    country: "ES",
    subdivision: "Comunidad Autónoma",
    center: { lat: 41.82, lng: 1.83 },
    zoom: 7,
    summary: "Mediterranean basin · vineyards, olives, almonds, irrigated grains.",
  },
  {
    id: "es-and",
    name: "Andalusia",
    country: "ES",
    subdivision: "Comunidad Autónoma",
    center: { lat: 37.6, lng: -4.7 },
    zoom: 7,
    summary: "Olive heartland · long, hot summers, growing aridity stress.",
  },
  {
    id: "pt-alentejo",
    name: "Alentejo",
    country: "PT",
    subdivision: "Região",
    center: { lat: 38.5, lng: -7.9 },
    zoom: 7,
    summary: "Cork, olive, rainfed cereals · pronounced summer drought.",
  },
  {
    id: "fr-occ",
    name: "Occitanie",
    country: "FR",
    subdivision: "Région",
    center: { lat: 43.6, lng: 2.0 },
    zoom: 6,
    summary: "Vineyards, durum wheat, sunflower · transitional climate.",
  },
  {
    id: "it-tos",
    name: "Tuscany",
    country: "IT",
    subdivision: "Regione",
    center: { lat: 43.45, lng: 11.05 },
    zoom: 7,
    summary: "Hill agriculture · wine, oil, mixed cereals, warming trend.",
  },
];

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

/** Default selection used before the user picks anything. */
export const DEFAULT_REGION = REGIONS[0];

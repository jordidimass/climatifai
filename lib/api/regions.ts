import type { Region } from "@/types/region";

/**
 * Seed region catalog. Centered on the Iberian Peninsula as a neutral
 * EU-leaning starting point. Replace with a proper geo-source (Natural
 * Earth admin-1 or similar) when the project graduates beyond scaffold.
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
    id: "br-cerrado",
    name: "Cerrado brasileño",
    country: "BR",
    subdivision: "Mato Grosso · Goiás · Minas Gerais",
    center: { lat: -15.8, lng: -47.9 },
    zoom: 5,
    summary: "Frontera productiva tropical · soya, maíz safrinha y presión por sequías.",
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
export const DEFAULT_REGION = REGIONS[0];

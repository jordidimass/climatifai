import type { Crop } from "@/types/crop";

/**
 * Seed crop catalog. Real implementations will source this from an external
 * database (e.g. FAO ECOCROP) — kept inline for the scaffold so the UI is
 * testable with zero external dependencies.
 */
export const CROPS: Crop[] = [
  {
    id: "maize",
    name: "Maíz",
    scientificName: "Zea mays",
    gddBaseC: 10,
    idealPrecipMm: { min: 500, max: 800 },
    heatStressC: 35,
    tagline: "Cereal de temporada cálida, tolerante al calor hasta cierto punto.",
  },
  {
    id: "wheat",
    name: "Trigo",
    scientificName: "Triticum aestivum",
    gddBaseC: 4,
    idealPrecipMm: { min: 350, max: 700 },
    heatStressC: 32,
    tagline: "Cultivo de temporada fresca, sensible a picos de calor en primavera.",
  },
  {
    id: "coffee",
    name: "Café",
    scientificName: "Coffea arabica",
    gddBaseC: 7,
    idealPrecipMm: { min: 1200, max: 2200 },
    heatStressC: 32,
    tagline: "Cultivo tropical de altura, sensible al calor nocturno y a lluvias erráticas.",
  },
  {
    id: "soybean",
    name: "Soya",
    scientificName: "Glycine max",
    gddBaseC: 10,
    idealPrecipMm: { min: 450, max: 900 },
    heatStressC: 35,
    tagline: "Oleaginosa clave para el Cono Sur y Brasil, sensible al estrés hídrico.",
  },
  {
    id: "vineyard",
    name: "Vid",
    scientificName: "Vitis vinifera",
    gddBaseC: 10,
    idealPrecipMm: { min: 300, max: 700 },
    heatStressC: 35,
    tagline: "Definida por el terroir; pequeños cambios climáticos mueven la vendimia.",
  },
];

export function getCrop(id: string): Crop | undefined {
  return CROPS.find((c) => c.id === id);
}

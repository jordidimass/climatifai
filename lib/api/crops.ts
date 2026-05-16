import type { Crop } from "@/types/crop";

/**
 * Seed crop catalog. Real implementations will source this from an external
 * database (e.g. FAO ECOCROP) — kept inline for the scaffold so the UI is
 * testable with zero external dependencies.
 */
export const CROPS: Crop[] = [
  {
    id: "maize",
    name: "Maize",
    scientificName: "Zea mays",
    gddBaseC: 10,
    idealPrecipMm: { min: 500, max: 800 },
    heatStressC: 35,
    tagline: "Warm-season cereal, heat-tolerant up to a point.",
  },
  {
    id: "wheat",
    name: "Wheat",
    scientificName: "Triticum aestivum",
    gddBaseC: 4,
    idealPrecipMm: { min: 350, max: 700 },
    heatStressC: 32,
    tagline: "Cool-season staple, sensitive to spring heat spikes.",
  },
  {
    id: "olive",
    name: "Olive",
    scientificName: "Olea europaea",
    gddBaseC: 7,
    idealPrecipMm: { min: 250, max: 600 },
    heatStressC: 40,
    tagline: "Drought-hardy tree crop with Mediterranean rhythm.",
  },
  {
    id: "almond",
    name: "Almond",
    scientificName: "Prunus dulcis",
    gddBaseC: 7,
    idealPrecipMm: { min: 400, max: 700 },
    heatStressC: 38,
    tagline: "Early bloomer — vulnerable to late frosts.",
  },
  {
    id: "vineyard",
    name: "Vineyard",
    scientificName: "Vitis vinifera",
    gddBaseC: 10,
    idealPrecipMm: { min: 300, max: 700 },
    heatStressC: 35,
    tagline: "Terroir-defined; small climate shifts move the harvest window.",
  },
];

export function getCrop(id: string): Crop | undefined {
  return CROPS.find((c) => c.id === id);
}

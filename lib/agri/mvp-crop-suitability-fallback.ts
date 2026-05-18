import { type CropId } from "@/types/crop";
import type { CropSuitability } from "@/types/agri";

type RegionCropAllowlist = Record<string, readonly CropId[]>;

export const MVP_REGION_CROP_ALLOWLIST: RegionCropAllowlist = {
  "mx-bajio": [
    "maize",
    "bean",
    "tomato",
    "potato",
    "avocado",
    "chile",
    "sorghum",
  ],
  "br-cerrado": [
    "maize",
    "bean",
    "rice",
    "sugarcane",
    "tomato",
    "banana",
    "sorghum",
    "cassava",
  ],
  "ar-pampa": ["maize", "bean", "rice", "tomato", "potato", "chile", "sorghum"],
  "co-cafetera": [
    "maize",
    "bean",
    "coffee",
    "cacao",
    "rice",
    "sugarcane",
    "tomato",
    "potato",
    "avocado",
    "banana",
    "cassava",
    "cardamom",
  ],
  "cl-valle-central": ["maize", "bean", "tomato", "potato", "avocado", "chile", "sorghum"],
};

export function getMvpFallbackSuitability(
  regionId: string | undefined,
  cropId: CropId,
): CropSuitability {
  const supported = regionId
    ? MVP_REGION_CROP_ALLOWLIST[regionId]?.includes(cropId)
    : undefined;

  if (supported) {
    return {
      cropId,
      status: "moderate",
      score: 62,
      confidence: "low",
      reasons: [
        "Coincidencia basada en plausibilidad agroecológica regional declarada.",
        "Validar con datos territoriales antes de usar en campo.",
      ],
      constraints: [
        {
          type: "data",
          label: "Fuente provisional hasta API completa",
          severity: "info",
        },
      ],
      source: "mvp-fallback",
    };
  }

  return {
    cropId,
    status: "unknown",
    score: null,
    confidence: "low",
    reasons: ["Sin datos suficientes para esta combinación region‑cultivo con el método provisional vigente."],
    constraints: [
      {
        type: "data",
        label: "Sin cobertura regional en provisional",
        severity: "warning",
      },
    ],
    source: "mvp-fallback",
  };
}

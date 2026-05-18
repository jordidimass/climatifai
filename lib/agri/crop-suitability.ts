import "server-only";

import { getCrop } from "@/lib/api/crops";
import { getMvpFallbackSuitability } from "@/lib/agri/mvp-crop-suitability-fallback";
import { serverEnv } from "@/lib/env";
import type {
  CropSuitability,
  CropSuitabilityInput,
  CropSuitabilityResponse,
  CropSuitabilityStatus,
} from "@/types/agri";

interface NasaPowerClimate {
  annualPrecipMm: number | null;
  meanTempC: number | null;
  maxTempC: number | null;
}

const SOURCE_LABELS = {
  "intelligence-api": "Intelligence API",
  "nasa-power": "NASA POWER · climatología agroclimática",
  "mvp-fallback": "Estimación MVP local",
} as const;

export async function getCropSuitability(
  input: CropSuitabilityInput,
): Promise<CropSuitabilityResponse> {
  if (serverEnv.CLIMATIFAI_API_URL) {
    const apiResponse = await fetchIntelligenceApi(input).catch(() => null);
    if (apiResponse) return apiResponse;
  }

  const nasaClimate = await fetchNasaPowerClimate(input.location.lat, input.location.lng).catch(
    () => null,
  );

  if (nasaClimate) {
    const crops = input.cropIds.map((cropId) => scoreCropWithClimate(cropId, nasaClimate));
    return {
      location: input.location,
      generatedAt: new Date().toISOString(),
      source: "nasa-power",
      sourceLabel: SOURCE_LABELS["nasa-power"],
      crops,
    };
  }

  const crops = input.cropIds.map((cropId) =>
    getMvpFallbackSuitability(input.location.regionId, cropId),
  );

  return {
    location: input.location,
    generatedAt: new Date().toISOString(),
    source: "mvp-fallback",
    sourceLabel: SOURCE_LABELS["mvp-fallback"],
    crops,
  };
}

async function fetchIntelligenceApi(
  input: CropSuitabilityInput,
): Promise<CropSuitabilityResponse | null> {
  if (!serverEnv.CLIMATIFAI_API_URL) return null;

  const response = await fetch(serverEnv.CLIMATIFAI_API_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `
        query CropSuitability($input: CropSuitabilityInput!) {
          cropSuitability(input: $input) {
            location { lat lng label regionId }
            generatedAt
            source
            sourceLabel
            crops {
              cropId
              status
              score
              confidence
              reasons
              source
              constraints { type label value unit severity }
            }
          }
        }
      `,
      variables: { input },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data?.data?.cropSuitability ?? null;
}

async function fetchNasaPowerClimate(lat: number, lng: number): Promise<NasaPowerClimate> {
  const params = new URLSearchParams({
    parameters: "T2M,T2M_MAX,PRECTOTCORR",
    community: "AG",
    longitude: String(lng),
    latitude: String(lat),
    format: "JSON",
  });
  const response = await fetch(
    `https://power.larc.nasa.gov/api/temporal/climatology/point?${params}`,
    { next: { revalidate: 86400 } },
  );

  if (!response.ok) throw new Error("NASA POWER no disponible");
  const data = await response.json();
  const parameter = data?.properties?.parameter;

  return {
    annualPrecipMm: sumMonthly(parameter?.PRECTOTCORR),
    meanTempC: averageMonthly(parameter?.T2M),
    maxTempC: averageMonthly(parameter?.T2M_MAX),
  };
}

function scoreCropWithClimate(cropId: string, climate: NasaPowerClimate): CropSuitability {
  const crop = getCrop(cropId);
  if (!crop) {
    return getMvpFallbackSuitability(undefined, cropId as never);
  }

  const reasons: string[] = [];
  const constraints: CropSuitability["constraints"] = [];
  let score = 100;

  if (typeof climate.annualPrecipMm === "number") {
    const { min, max } = crop.idealPrecipMm;
    if (climate.annualPrecipMm < min) {
      const penalty = Math.min(45, ((min - climate.annualPrecipMm) / min) * 55);
      score -= penalty;
      reasons.push(`Precipitación estimada por debajo del rango ideal (${Math.round(climate.annualPrecipMm)} mm/año vs. ${min}-${max} mm).`);
      constraints.push({
        type: "precipitation",
        label: "Déficit de precipitación",
        value: Math.round(climate.annualPrecipMm),
        unit: "mm/año",
        severity: penalty > 25 ? "critical" : "warning",
      });
    } else if (climate.annualPrecipMm > max) {
      const penalty = Math.min(35, ((climate.annualPrecipMm - max) / max) * 45);
      score -= penalty;
      reasons.push(`Precipitación estimada por encima del rango ideal (${Math.round(climate.annualPrecipMm)} mm/año vs. ${min}-${max} mm).`);
      constraints.push({
        type: "precipitation",
        label: "Exceso de humedad potencial",
        value: Math.round(climate.annualPrecipMm),
        unit: "mm/año",
        severity: penalty > 25 ? "critical" : "warning",
      });
    } else {
      reasons.push(`Precipitación dentro del rango de referencia (${Math.round(climate.annualPrecipMm)} mm/año).`);
    }
  }

  if (typeof climate.maxTempC === "number") {
    if (climate.maxTempC > crop.heatStressC) {
      const penalty = Math.min(45, (climate.maxTempC - crop.heatStressC) * 9);
      score -= penalty;
      reasons.push(`Temperatura máxima media cerca o sobre umbral de estrés (${climate.maxTempC.toFixed(1)}°C vs. ${crop.heatStressC}°C).`);
      constraints.push({
        type: "temperature",
        label: "Riesgo de estrés térmico",
        value: Number(climate.maxTempC.toFixed(1)),
        unit: "°C",
        severity: penalty > 25 ? "critical" : "warning",
      });
    } else {
      reasons.push(`Temperatura máxima media bajo el umbral de estrés (${climate.maxTempC.toFixed(1)}°C).`);
    }
  }

  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  return {
    cropId: crop.id,
    status: statusFromScore(normalized),
    score: normalized,
    confidence: "medium",
    reasons,
    constraints,
    source: "nasa-power",
  };
}

function statusFromScore(score: number): CropSuitabilityStatus {
  if (score >= 75) return "suitable";
  if (score >= 55) return "moderate";
  if (score >= 35) return "risky";
  return "not_recommended";
}

function sumMonthly(values: Record<string, number> | undefined): number | null {
  if (!values) return null;
  const nums = Object.entries(values)
    .filter(([key]) => key !== "ANN")
    .map(([, value]) => Number(value))
    .filter(Number.isFinite);
  if (nums.length === 0) return null;
  return nums.reduce((sum, value) => sum + value, 0);
}

function averageMonthly(values: Record<string, number> | undefined): number | null {
  if (!values) return null;
  const nums = Object.entries(values)
    .filter(([key]) => key !== "ANN")
    .map(([, value]) => Number(value))
    .filter(Number.isFinite);
  if (nums.length === 0) return null;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

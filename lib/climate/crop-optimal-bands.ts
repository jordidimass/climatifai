/** Rangos típicos de temperatura cómoda para la banda de referencia (°C). */
const OPTIMAL_TEMP_C: Record<string, { min: number; max: number }> = {
  maize: { min: 18, max: 31 },
  wheat: { min: 14, max: 24 },
  coffee: { min: 17, max: 26 },
  soybean: { min: 20, max: 30 },
  vineyard: { min: 17, max: 29 },
};

const DEFAULT_TEMP = { min: 17, max: 28 };

export function cropOptimalTempRange(cropId: string): {
  min: number;
  max: number;
} {
  return OPTIMAL_TEMP_C[cropId] ?? DEFAULT_TEMP;
}

/** Lluvia mensual plausible a partir del rango anual ideal dividido entre 12. */
export function cropOptimalMonthlyPrecipMm(cropIdealAnnual: {
  min: number;
  max: number;
}): { min: number; max: number } {
  return {
    min: +(cropIdealAnnual.min / 12).toFixed(0),
    max: +(cropIdealAnnual.max / 12).toFixed(0),
  };
}

export function cropOptimalSoilMoisture(): { min: number; max: number } {
  return { min: 0.18, max: 0.32 };
}

export type TimeRange = {

  from: string;
  to: string;
};

export interface ClimatePoint {

  month: string;

  tempMeanC: number;

  precipMm: number;

  gdd: number;
}

export interface ClimateSeries {
  regionId: string;
  cropId: string;
  range: TimeRange;

  kind: "historical" | "projected";
  points: ClimatePoint[];
}

export type AnomalyDirection = "warmer" | "cooler" | "wetter" | "drier" | "neutral";

export interface Anomaly {

  delta: number;

  sigma: number;
  direction: AnomalyDirection;

  label: string;
}

export type ClimateMetricTriple = {
  historical: number;
  actual: number | null;
  projected: number;

  deviationPct?: number | null;
};

export type ClimateComparisonMonthRow = {
  monthIndex: number;
  monthLabel: string;
  temperature: ClimateMetricTriple;
  precipitation: ClimateMetricTriple;
  soilMoisture: ClimateMetricTriple;
  optimalTemp: { min: number; max: number };
  optimalPrecipMmMonthly: { min: number; max: number };
  optimalSoilMoisture: { min: number; max: number };
};

export type ClimateComparison = ClimateComparisonMonthRow[];

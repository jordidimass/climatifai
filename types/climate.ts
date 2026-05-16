export type TimeRange = {
  /** ISO month, e.g. "2015-01". */
  from: string;
  to: string;
};

export interface ClimatePoint {
  /** ISO month, e.g. "2024-03". */
  month: string;
  /** Mean temperature in °C. */
  tempMeanC: number;
  /** Total monthly precipitation in mm. */
  precipMm: number;
  /** Growing-degree-days accumulated that month at the crop's base. */
  gdd: number;
}

export interface ClimateSeries {
  regionId: string;
  cropId: string;
  range: TimeRange;
  /** Whether the series is historical observations or a projection. */
  kind: "historical" | "projected";
  points: ClimatePoint[];
}

export type AnomalyDirection = "warmer" | "cooler" | "wetter" | "drier" | "neutral";

export interface Anomaly {
  /** Δ relative to the historical baseline (e.g. +1.8 means +1.8°C). */
  delta: number;
  /** Anomaly expressed in standard deviations. */
  sigma: number;
  direction: AnomalyDirection;
  /** Human label rendered in badges. */
  label: string;
}

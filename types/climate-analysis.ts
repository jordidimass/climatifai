/**
 * Canonical climate-analysis contract — this is the shape the future
 * ClimatifaiAPI (GraphQL/FastAPI, see arch diagram: External APIs →
 * Ingestion → Normalization → Postgres/Vector → Intelligence → GraphQL)
 * will return.
 *
 * Frontend consumes this shape; provider impls (Open-Meteo direct stub,
 * later real ClimatifaiAPI GraphQL) map their raw responses into it.
 *
 * Design rules:
 *  - GraphQL-friendly (nested, nullable leaves, no implicit ordering)
 *  - Provider-agnostic (no Open-Meteo-specific field names)
 *  - Partial-tolerant (every section can be null when upstream fails)
 *  - All numeric units explicit in field names or comments
 */

export type SsPathway =
  | "ssp1-2.6"
  | "ssp2-4.5"
  | "ssp3-7.0"
  | "ssp5-8.5";

export type ProviderId = "open-meteo" | "climatifai";

export interface YearMonth {
  /** 1–12. */
  month: number;
  /** 4-digit year. Omitted for climatologies (multi-year averages). */
  year?: number;
}

export interface DistributionStat {
  /** 10th percentile across the reference period. */
  p10: number;
  /** Mean across the reference period. */
  mean: number;
  /** 90th percentile across the reference period. */
  p90: number;
}

export interface BaselineMonth {
  month: number;
  /** °C. */
  tempMean: DistributionStat;
  tempMax: DistributionStat;
  tempMin: DistributionStat;
  /** mm/month total. */
  precipSum: DistributionStat;
  /** m³/m³ volumetric. */
  soilMoisture: DistributionStat;
  /** mm/day FAO-56 reference ET. */
  et0: DistributionStat;
}

export interface ObservedMonth {
  month: number;
  year: number;
  tempMean: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipSum: number | null;
  soilMoisture: number | null;
  et0: number | null;
}

export interface ProjectedMonth {
  month: number;
  year: number;
  tempMean: number | null;
  precipSum: number | null;
}

export interface DailyForecastPoint {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  tempMean: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipSum: number | null;
  /** 0–100 %. */
  precipProb: number | null;
}

export interface SeasonalForecastMonth {
  month: number;
  year: number;
  tempMean: number | null;
  precipSum: number | null;
}

export interface AirQualitySnapshot {
  pm2_5: number | null;
  pm10: number | null;
  /** 0–500-ish European AQI scale. */
  europeanAqi: number | null;
  sampledAt: string;
}

export interface FloodSnapshot {
  /** m³/s river discharge. */
  riverDischargeM3s: number | null;
  sampledAt: string;
}

export interface MonthlyDeviation {
  month: number;
  /** (observed - baseline.mean) / baseline.mean * 100; null when undefined. */
  tempMeanPct: number | null;
  precipSumPct: number | null;
  soilMoisturePct: number | null;
  et0Pct: number | null;
}

export interface ClimateAnalysisLocation {
  lat: number;
  lon: number;
  elevation: number | null;
  regionId?: string | null;
  regionName?: string | null;
}

export interface ClimateAnalysisCrop {
  id: string;
  name?: string | null;
}

export interface ClimateAnalysisMeta {
  /** Which provider produced this payload. */
  provider: ProviderId;
  /** ISO timestamp of when the payload was assembled. */
  generatedAt: string;
  /** True when one or more sections failed and were returned null. */
  partial: boolean;
  /** Human-readable error messages, one per failed upstream call. */
  errors: string[];
  /** ms wall-clock time spent assembling this payload. */
  latencyMs: number;
}

export interface BaselineBlock {
  /** Inclusive year range, e.g. { from: 1994, to: 2024 }. */
  period: { from: number; to: number };
  months: BaselineMonth[];
}

export interface CurrentYearBlock {
  year: number;
  /** Only months with at least one observation present. */
  months: ObservedMonth[];
}

export interface ProjectionBlock {
  scenario: SsPathway;
  period: { from: number; to: number };
  /** Names of the source CMIP6 models combined into the ensemble mean. */
  models: string[];
  months: ProjectedMonth[];
}

export interface ForecastBlock {
  daily16d: DailyForecastPoint[] | null;
  seasonal6mo: SeasonalForecastMonth[] | null;
}

/**
 * Top-level response shape. Every block under `data` is independently
 * nullable so a single upstream failure degrades gracefully.
 */
export interface ClimateAnalysis {
  location: ClimateAnalysisLocation;
  crop: ClimateAnalysisCrop;
  data: {
    baseline: BaselineBlock | null;
    current: CurrentYearBlock | null;
    projection: ProjectionBlock | null;
    forecast: ForecastBlock | null;
    airQuality: AirQualitySnapshot | null;
    flood: FloodSnapshot | null;
    deviations: MonthlyDeviation[] | null;
  };
  meta: ClimateAnalysisMeta;
}

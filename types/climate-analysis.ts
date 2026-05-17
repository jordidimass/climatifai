export type SsPathway =
  | "ssp1-2.6"
  | "ssp2-4.5"
  | "ssp3-7.0"
  | "ssp5-8.5";

export type ProviderId = "open-meteo" | "climatifai";

export interface YearMonth {

  month: number;

  year?: number;
}

export interface DistributionStat {

  p10: number;

  mean: number;

  p90: number;
}

export interface BaselineMonth {
  month: number;

  tempMean: DistributionStat;
  tempMax: DistributionStat;
  tempMin: DistributionStat;

  precipSum: DistributionStat;

  soilMoisture: DistributionStat;

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

  date: string;
  tempMean: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipSum: number | null;

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

  europeanAqi: number | null;
  sampledAt: string;
}

export interface FloodSnapshot {

  riverDischargeM3s: number | null;
  sampledAt: string;
}

export interface MonthlyDeviation {
  month: number;

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

  provider: ProviderId;

  generatedAt: string;

  partial: boolean;

  errors: string[];

  latencyMs: number;
}

export interface BaselineBlock {

  period: { from: number; to: number };
  months: BaselineMonth[];
}

export interface CurrentYearBlock {
  year: number;

  months: ObservedMonth[];
}

export interface ProjectionBlock {
  scenario: SsPathway;
  period: { from: number; to: number };

  models: string[];
  months: ProjectedMonth[];
}

export interface ForecastBlock {
  daily16d: DailyForecastPoint[] | null;
  seasonal6mo: SeasonalForecastMonth[] | null;
}

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

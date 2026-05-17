/**
 * Type contracts for the Open-Meteo client (CVA-56). Each fetcher in
 * `lib/api/open-meteo.ts` returns one of these shapes.
 *
 * Months are 1–12 (calendar month), not array indices.
 */

export interface MonthlyStat {
  /** Calendar month, 1 (Jan) – 12 (Dec). */
  month: number;
  /** 10th percentile across years. */
  p10: number;
  /** Climatological mean across years. */
  mean: number;
  /** 90th percentile across years. */
  p90: number;
}

/**
 * 30-year monthly baseline (1994–2024) used to detect anomalies in the
 * current year and to anchor CMIP6 projections.
 */
export interface MonthlyBaseline {
  month: number;
  tempMean: MonthlyStat;
  tempMax: MonthlyStat;
  tempMin: MonthlyStat;
  precipSum: MonthlyStat;
  soilMoisture: MonthlyStat;
  et0: MonthlyStat;
}

/** Observed monthly value for the current year so far. */
export interface MonthlyData {
  month: number;
  year: number;
  tempMean: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipSum: number | null;
  soilMoisture: number | null;
  et0: number | null;
}

/** CMIP6 HighResMIP ensemble-mean monthly projection. */
export interface MonthlyProjection {
  month: number;
  year: number;
  tempMean: number | null;
  precipSum: number | null;
}

/** Daily forecast point from the public Open-Meteo `/forecast` endpoint. */
export interface DailyForecast {
  date: string;
  tempMean: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipSum: number | null;
  precipProb: number | null;
}

/** Monthly seasonal forecast point (6-month outlook). */
export interface MonthlyForecast {
  month: number;
  year: number;
  tempMean: number | null;
  precipSum: number | null;
}

export interface AirQualityData {
  pm2_5: number | null;
  pm10: number | null;
  europeanAqi: number | null;
  sampledAt: string;
}

export interface FloodData {
  riverDischargeM3s: number | null;
  sampledAt: string;
}

/** Geocoded place with elevation. Aliases the existing GeocodeResult shape. */
export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  elevation: number | null;
  country: string;
  admin1: string | null;
}

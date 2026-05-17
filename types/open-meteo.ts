export interface MonthlyStat {

  month: number;

  p10: number;

  mean: number;

  p90: number;
}

export interface MonthlyBaseline {
  month: number;
  tempMean: MonthlyStat;
  tempMax: MonthlyStat;
  tempMin: MonthlyStat;
  precipSum: MonthlyStat;
  soilMoisture: MonthlyStat;
  et0: MonthlyStat;
}

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

export interface MonthlyProjection {
  month: number;
  year: number;
  tempMean: number | null;
  precipSum: number | null;
}

export interface DailyForecast {
  date: string;
  tempMean: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipSum: number | null;
  precipProb: number | null;
}

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

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  elevation: number | null;
  country: string;
  admin1: string | null;
}

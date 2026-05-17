import "server-only";

import {
  fetchAirQuality,
  fetchCmip6Projection,
  fetchCurrentYear,
  fetchFloodRisk,
  fetchForecast16d,
  fetchHistoricalBaseline,
  fetchSeasonalForecast,
} from "@/lib/api/open-meteo";
import type {
  ClimateProvider,
  GetAnalysisInput,
} from "@/lib/data/climate-provider";
import type {
  AirQualitySnapshot,
  BaselineBlock,
  ClimateAnalysis,
  CurrentYearBlock,
  FloodSnapshot,
  ForecastBlock,
  MonthlyDeviation,
  ProjectionBlock,
} from "@/types/climate-analysis";
import type {
  AirQualityData,
  DailyForecast,
  FloodData,
  MonthlyBaseline,
  MonthlyData,
  MonthlyForecast,
  MonthlyProjection,
} from "@/types/open-meteo";

/**
 * Open-Meteo direct-consumption provider. Stub until the ClimatifaiAPI
 * pipeline (Python ingestion → Postgres → Intelligence → GraphQL) is
 * online. Maps raw Open-Meteo fetchers into the canonical
 * `ClimateAnalysis` contract from `types/climate-analysis.ts`.
 */

const CMIP6_MODELS = ["EC_Earth3P_HR", "MPI_ESM1_2_XR", "CMCC_CM2_VHR4"];
const DEFAULT_PROJECTION_RANGE = { from: 2026, to: 2030 } as const;

function deviationPct(
  current: number | null,
  baseline: number,
): number | null {
  if (current === null) return null;
  if (!Number.isFinite(baseline) || baseline === 0) return null;
  return +(((current - baseline) / baseline) * 100).toFixed(2);
}

function valueOrNull<T>(
  result: PromiseSettledResult<T>,
  errors: string[],
  label: string,
): T | null {
  if (result.status === "fulfilled") return result.value;
  errors.push(
    `${label}: ${String((result.reason as Error)?.message ?? result.reason)}`,
  );
  return null;
}

function buildBaselineBlock(
  months: MonthlyBaseline[] | null,
): BaselineBlock | null {
  if (!months) return null;
  return { period: { from: 1994, to: 2024 }, months };
}

function buildCurrentBlock(
  rows: MonthlyData[] | null,
): CurrentYearBlock | null {
  if (!rows || rows.length === 0) return null;
  return { year: rows[0].year, months: rows };
}

function buildProjectionBlock(
  rows: MonthlyProjection[] | null,
  range: { from: number; to: number },
  scenario: ClimateAnalysis["data"]["projection"] extends infer T
    ? T extends { scenario: infer S }
      ? S
      : never
    : never,
): ProjectionBlock | null {
  if (!rows) return null;
  return {
    scenario,
    period: range,
    models: [...CMIP6_MODELS],
    months: rows,
  };
}

function buildForecastBlock(
  daily: DailyForecast[] | null,
  seasonal: MonthlyForecast[] | null,
): ForecastBlock | null {
  if (daily === null && seasonal === null) return null;
  return { daily16d: daily, seasonal6mo: seasonal };
}

function buildDeviations(
  baseline: MonthlyBaseline[] | null,
  current: MonthlyData[] | null,
): MonthlyDeviation[] | null {
  if (!baseline || !current) return null;
  const baseByMonth = new Map(baseline.map((b) => [b.month, b]));
  return current.map<MonthlyDeviation>((c) => {
    const b = baseByMonth.get(c.month);
    return {
      month: c.month,
      tempMeanPct: b ? deviationPct(c.tempMean, b.tempMean.mean) : null,
      precipSumPct: b ? deviationPct(c.precipSum, b.precipSum.mean) : null,
      soilMoisturePct: b
        ? deviationPct(c.soilMoisture, b.soilMoisture.mean)
        : null,
      et0Pct: b ? deviationPct(c.et0, b.et0.mean) : null,
    };
  });
}

export class OpenMeteoProvider implements ClimateProvider {
  readonly id = "open-meteo" as const;

  async getAnalysis(input: GetAnalysisInput): Promise<ClimateAnalysis> {
    const startedAt = Date.now();
    const scenario = input.scenario ?? "ssp3-7.0";
    const projectionRange = input.projectionRange ?? DEFAULT_PROJECTION_RANGE;

    const settled = await Promise.allSettled([
      fetchHistoricalBaseline(input.lat, input.lon),
      fetchCurrentYear(input.lat, input.lon, input.now),
      fetchCmip6Projection(input.lat, input.lon),
      fetchForecast16d(input.lat, input.lon),
      fetchSeasonalForecast(input.lat, input.lon),
      fetchAirQuality(input.lat, input.lon),
      fetchFloodRisk(input.lat, input.lon),
    ]);

    const errors: string[] = [];
    const baseline = valueOrNull<MonthlyBaseline[]>(
      settled[0],
      errors,
      "baseline",
    );
    const current = valueOrNull<MonthlyData[]>(
      settled[1],
      errors,
      "current",
    );
    const projection = valueOrNull<MonthlyProjection[]>(
      settled[2],
      errors,
      "projection",
    );
    const daily = valueOrNull<DailyForecast[]>(
      settled[3],
      errors,
      "forecast16d",
    );
    const seasonal = valueOrNull<MonthlyForecast[]>(
      settled[4],
      errors,
      "seasonal",
    );
    const aqi = valueOrNull<AirQualityData>(settled[5], errors, "airQuality");
    const flood = valueOrNull<FloodData>(settled[6], errors, "flood");

    const airQuality: AirQualitySnapshot | null = aqi
      ? {
          pm2_5: aqi.pm2_5,
          pm10: aqi.pm10,
          europeanAqi: aqi.europeanAqi,
          sampledAt: aqi.sampledAt,
        }
      : null;
    const floodBlock: FloodSnapshot | null = flood
      ? {
          riverDischargeM3s: flood.riverDischargeM3s,
          sampledAt: flood.sampledAt,
        }
      : null;

    const baselineBlock = buildBaselineBlock(baseline);
    const currentBlock = buildCurrentBlock(current);
    const projectionBlock = buildProjectionBlock(
      projection,
      projectionRange,
      scenario,
    );
    const forecastBlock = buildForecastBlock(daily, seasonal);
    const deviations = buildDeviations(baseline, current);

    return {
      location: {
        lat: input.lat,
        lon: input.lon,
        elevation: null,
        regionId: input.regionId ?? null,
      },
      crop: { id: input.cropId },
      data: {
        baseline: baselineBlock,
        current: currentBlock,
        projection: projectionBlock,
        forecast: forecastBlock,
        airQuality,
        flood: floodBlock,
        deviations,
      },
      meta: {
        provider: this.id,
        generatedAt: new Date().toISOString(),
        partial: errors.length > 0,
        errors,
        latencyMs: Date.now() - startedAt,
      },
    };
  }
}

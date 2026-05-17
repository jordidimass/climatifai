import "server-only";

import { searchLatamPlaces } from "@/lib/api/geocoding";
import type {
  AirQualityData,
  DailyForecast,
  FloodData,
  GeoLocation,
  MonthlyBaseline,
  MonthlyData,
  MonthlyForecast,
  MonthlyProjection,
  MonthlyStat,
} from "@/types/open-meteo";

const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const SEASONAL_URL = "https://seasonal-api.open-meteo.com/v1/seasonal";
const AIR_QUALITY_URL =
  "https://air-quality-api.open-meteo.com/v1/air-quality";
const FLOOD_URL = "https://flood-api.open-meteo.com/v1/flood";

const CMIP6_MODELS = [
  "EC_Earth3P_HR",
  "MPI_ESM1_2_XR",
  "CMCC_CM2_VHR4",
] as const;

const BASELINE_DECADES: ReadonlyArray<readonly [string, string]> = [
  ["1994-01-01", "2003-12-31"],
  ["2004-01-01", "2013-12-31"],
  ["2014-01-01", "2024-12-31"],
];

const BASELINE_DAILY_VARS = [
  "temperature_2m_mean",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "soil_moisture_0_to_10cm_mean",
  "et0_fao_evapotranspiration",
].join(",");

const FORECAST_DAILY_VARS = [
  "temperature_2m_mean",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_mean",
].join(",");

interface DailyPayload {
  time: string[];
  [variable: string]: (number | null)[] | string[] | undefined;
}

interface HourlyPayload {
  time: string[];
  [variable: string]: (number | null)[] | string[] | undefined;
}

interface OpenMeteoResponse {
  daily?: DailyPayload;
  hourly?: HourlyPayload;
  error?: boolean;
  reason?: string;
}

const TAG_REVALIDATE_SECONDS: Record<string, number> = {
  baseline: 86_400 * 30, // 30d — 30-yr climatology shifts slowly
  current: 86_400, // 1d — month-to-month observations
  projection: 86_400 * 7, // 1w — CMIP6 runs are static
  forecast: 60 * 30, // 30m — 16-day forecast refreshes often
  seasonal: 86_400, // 1d
  aqi: 60 * 30,
  flood: 60 * 60 * 6,
};

async function fetchOpenMeteo(
  url: URL,
  tag: keyof typeof TAG_REVALIDATE_SECONDS | string,
): Promise<OpenMeteoResponse> {
  const revalidate = TAG_REVALIDATE_SECONDS[tag] ?? 86_400;
  const res = await fetch(url, {
    next: { revalidate, tags: ["climate", `open-meteo:${tag}`] },
  });
  if (!res.ok) {
    throw new Error(
      `Open-Meteo ${tag} ${res.status}: ${await res.text()}`,
    );
  }
  const json = (await res.json()) as OpenMeteoResponse;
  if (json.error) {
    throw new Error(
      `Open-Meteo ${tag}: ${json.reason ?? "unknown error"}`,
    );
  }
  return json;
}

function numAt(
  payload: DailyPayload | HourlyPayload | undefined,
  variable: string,
  i: number,
): number | null {
  const arr = payload?.[variable] as (number | null)[] | undefined;
  const v = arr?.[i];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function avgAcrossModels(
  payload: DailyPayload | undefined,
  variable: string,
  i: number,
): number | null {
  if (!payload) return null;
  const values: number[] = [];
  for (const model of CMIP6_MODELS) {
    const v = numAt(payload, `${variable}_${model}`, i);
    if (v !== null) values.push(v);
  }
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function statsOf(values: number[]): MonthlyStat {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    month: 0, // overwritten by caller
    p10: round2(percentile(sorted, 0.1)),
    mean: round2(mean(values)),
    p90: round2(percentile(sorted, 0.9)),
  };
}

function monthKey(date: string): number {
  return Number(date.slice(5, 7));
}

function yearKey(date: string): number {
  return Number(date.slice(0, 4));
}

interface ArchiveDailyRow {
  date: string;
  tempMean: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precip: number | null;
  soil: number | null;
  et0: number | null;
}

async function fetchArchiveChunk(
  lat: number,
  lon: number,
  start: string,
  end: string,
  tag: string,
): Promise<ArchiveDailyRow[]> {
  const url = new URL(ARCHIVE_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  url.searchParams.set("daily", BASELINE_DAILY_VARS);
  url.searchParams.set("timezone", "UTC");

  const json = await fetchOpenMeteo(url, tag);
  const time = json.daily?.time ?? [];
  return time.map((date, i) => ({
    date,
    tempMean: numAt(json.daily, "temperature_2m_mean", i),
    tempMax: numAt(json.daily, "temperature_2m_max", i),
    tempMin: numAt(json.daily, "temperature_2m_min", i),
    precip: numAt(json.daily, "precipitation_sum", i),
    soil: numAt(json.daily, "soil_moisture_0_to_10cm_mean", i),
    et0: numAt(json.daily, "et0_fao_evapotranspiration", i),
  }));
}

export async function fetchHistoricalBaseline(
  lat: number,
  lon: number,
): Promise<MonthlyBaseline[]> {
  const chunks = await Promise.all(
    BASELINE_DECADES.map(([s, e]) =>
      fetchArchiveChunk(lat, lon, s, e, "baseline"),
    ),
  );
  const rows = chunks.flat();

  const monthYearBuckets = new Map<
    string,
    {
      month: number;
      tempMean: number[];
      tempMax: number[];
      tempMin: number[];
      precip: number;
      soil: number[];
      et0: number[];
    }
  >();

  for (const r of rows) {
    const key = r.date.slice(0, 7);
    const m = monthKey(r.date);
    const b =
      monthYearBuckets.get(key) ??
      {
        month: m,
        tempMean: [],
        tempMax: [],
        tempMin: [],
        precip: 0,
        soil: [],
        et0: [],
      };
    if (r.tempMean !== null) b.tempMean.push(r.tempMean);
    if (r.tempMax !== null) b.tempMax.push(r.tempMax);
    if (r.tempMin !== null) b.tempMin.push(r.tempMin);
    if (r.precip !== null) b.precip += r.precip;
    if (r.soil !== null) b.soil.push(r.soil);
    if (r.et0 !== null) b.et0.push(r.et0);
    monthYearBuckets.set(key, b);
  }

  const byMonth = new Map<
    number,
    {
      tempMean: number[];
      tempMax: number[];
      tempMin: number[];
      precip: number[];
      soil: number[];
      et0: number[];
    }
  >();
  for (const b of monthYearBuckets.values()) {
    const slot =
      byMonth.get(b.month) ??
      {
        tempMean: [],
        tempMax: [],
        tempMin: [],
        precip: [],
        soil: [],
        et0: [],
      };
    if (b.tempMean.length) slot.tempMean.push(mean(b.tempMean));
    if (b.tempMax.length) slot.tempMax.push(mean(b.tempMax));
    if (b.tempMin.length) slot.tempMin.push(mean(b.tempMin));
    slot.precip.push(b.precip);
    if (b.soil.length) slot.soil.push(mean(b.soil));
    if (b.et0.length) slot.et0.push(mean(b.et0));
    byMonth.set(b.month, slot);
  }

  const baseline: MonthlyBaseline[] = [];
  for (let m = 1; m <= 12; m++) {
    const slot = byMonth.get(m) ?? {
      tempMean: [],
      tempMax: [],
      tempMin: [],
      precip: [],
      soil: [],
      et0: [],
    };
    baseline.push({
      month: m,
      tempMean: { ...statsOf(slot.tempMean), month: m },
      tempMax: { ...statsOf(slot.tempMax), month: m },
      tempMin: { ...statsOf(slot.tempMin), month: m },
      precipSum: { ...statsOf(slot.precip), month: m },
      soilMoisture: { ...statsOf(slot.soil), month: m },
      et0: { ...statsOf(slot.et0), month: m },
    });
  }
  return baseline;
}

export async function fetchCurrentYear(
  lat: number,
  lon: number,
  today: Date = new Date(),
): Promise<MonthlyData[]> {
  const year = today.getUTCFullYear();

  const lastCompletedMonth = today.getUTCMonth();
  if (lastCompletedMonth === 0) return [];

  const start = `${year}-01-01`;
  const endMonth = lastCompletedMonth;
  const endDay = new Date(Date.UTC(year, endMonth, 0)).getUTCDate();
  const end = `${year}-${String(endMonth).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;

  const rows = await fetchArchiveChunk(lat, lon, start, end, "current");

  const buckets = new Map<
    number,
    {
      tempMean: number[];
      tempMax: number[];
      tempMin: number[];
      precip: number;
      soil: number[];
      et0: number[];
    }
  >();
  for (const r of rows) {
    const m = monthKey(r.date);
    const b =
      buckets.get(m) ??
      {
        tempMean: [],
        tempMax: [],
        tempMin: [],
        precip: 0,
        soil: [],
        et0: [],
      };
    if (r.tempMean !== null) b.tempMean.push(r.tempMean);
    if (r.tempMax !== null) b.tempMax.push(r.tempMax);
    if (r.tempMin !== null) b.tempMin.push(r.tempMin);
    if (r.precip !== null) b.precip += r.precip;
    if (r.soil !== null) b.soil.push(r.soil);
    if (r.et0 !== null) b.et0.push(r.et0);
    buckets.set(m, b);
  }

  const out: MonthlyData[] = [];
  for (let m = 1; m <= endMonth; m++) {
    const b = buckets.get(m);
    if (!b) continue;
    out.push({
      month: m,
      year,
      tempMean: b.tempMean.length ? round2(mean(b.tempMean)) : null,
      tempMax: b.tempMax.length ? round2(mean(b.tempMax)) : null,
      tempMin: b.tempMin.length ? round2(mean(b.tempMin)) : null,
      precipSum: round2(b.precip),
      soilMoisture: b.soil.length ? round2(mean(b.soil)) : null,
      et0: b.et0.length ? round2(mean(b.et0)) : null,
    });
  }
  return out;
}

export async function fetchCmip6Projection(
  lat: number,
  lon: number,
): Promise<MonthlyProjection[]> {
  const url = new URL(CLIMATE_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("start_date", "2026-01-01");
  url.searchParams.set("end_date", "2030-12-31");
  url.searchParams.set("models", CMIP6_MODELS.join(","));
  url.searchParams.set(
    "daily",
    "temperature_2m_mean,precipitation_sum",
  );

  const json = await fetchOpenMeteo(url, "projection");
  const time = json.daily?.time ?? [];

  const buckets = new Map<
    string,
    { month: number; year: number; temp: number[]; precip: number }
  >();
  for (let i = 0; i < time.length; i++) {
    const d = time[i];
    const key = d.slice(0, 7);
    const t = avgAcrossModels(json.daily, "temperature_2m_mean", i);
    const p = avgAcrossModels(json.daily, "precipitation_sum", i);
    const b =
      buckets.get(key) ??
      { month: monthKey(d), year: yearKey(d), temp: [], precip: 0 };
    if (t !== null) b.temp.push(t);
    if (p !== null) b.precip += p;
    buckets.set(key, b);
  }

  return [...buckets.keys()]
    .sort()
    .map((k) => {
      const b = buckets.get(k)!;
      return {
        month: b.month,
        year: b.year,
        tempMean: b.temp.length ? round2(mean(b.temp)) : null,
        precipSum: round2(b.precip),
      };
    });
}

export async function fetchForecast16d(
  lat: number,
  lon: number,
): Promise<DailyForecast[]> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("daily", FORECAST_DAILY_VARS);
  url.searchParams.set("forecast_days", "16");
  url.searchParams.set("timezone", "auto");

  const json = await fetchOpenMeteo(url, "forecast");
  const time = json.daily?.time ?? [];
  return time.map((date, i) => ({
    date,
    tempMean: numAt(json.daily, "temperature_2m_mean", i),
    tempMax: numAt(json.daily, "temperature_2m_max", i),
    tempMin: numAt(json.daily, "temperature_2m_min", i),
    precipSum: numAt(json.daily, "precipitation_sum", i),
    precipProb: numAt(json.daily, "precipitation_probability_mean", i),
  }));
}

export async function fetchSeasonalForecast(
  lat: number,
  lon: number,
): Promise<MonthlyForecast[]> {
  const url = new URL(SEASONAL_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set(
    "six_hourly",
    "temperature_2m,precipitation",
  );
  url.searchParams.set("forecast_days", "180");
  url.searchParams.set("timezone", "UTC");

  type SeasonalResponse = {
    six_hourly?: {
      time?: string[];
      temperature_2m_member01?: (number | null)[];
      precipitation_member01?: (number | null)[];
      [k: string]: unknown;
    };
    error?: boolean;
    reason?: string;
  };

  const res = await fetch(url, {
    next: {
      revalidate: TAG_REVALIDATE_SECONDS.seasonal,
      tags: ["climate", "open-meteo:seasonal"],
    },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo seasonal ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as SeasonalResponse;
  if (json.error) {
    throw new Error(
      `Open-Meteo seasonal: ${json.reason ?? "unknown error"}`,
    );
  }
  const six = json.six_hourly;
  if (!six?.time?.length) return [];

  const tempKeys = Object.keys(six).filter((k) =>
    k.startsWith("temperature_2m_member"),
  );
  const precipKeys = Object.keys(six).filter((k) =>
    k.startsWith("precipitation_member"),
  );

  const ensembleTemp = (i: number): number | null => {
    const vals: number[] = [];
    for (const k of tempKeys) {
      const arr = six[k] as (number | null)[] | undefined;
      const v = arr?.[i];
      if (typeof v === "number" && Number.isFinite(v)) vals.push(v);
    }
    return vals.length ? mean(vals) : null;
  };
  const ensemblePrecip = (i: number): number | null => {
    const vals: number[] = [];
    for (const k of precipKeys) {
      const arr = six[k] as (number | null)[] | undefined;
      const v = arr?.[i];
      if (typeof v === "number" && Number.isFinite(v)) vals.push(v);
    }
    return vals.length ? mean(vals) : null;
  };

  const buckets = new Map<
    string,
    { month: number; year: number; temp: number[]; precip: number }
  >();
  for (let i = 0; i < six.time.length; i++) {
    const t = six.time[i];
    const key = t.slice(0, 7);
    const temp = ensembleTemp(i);
    const precip = ensemblePrecip(i);
    const b =
      buckets.get(key) ??
      { month: monthKey(t), year: yearKey(t), temp: [], precip: 0 };
    if (temp !== null) b.temp.push(temp);
    if (precip !== null) b.precip += precip;
    buckets.set(key, b);
  }

  return [...buckets.keys()]
    .sort()
    .slice(0, 6)
    .map((k) => {
      const b = buckets.get(k)!;
      return {
        month: b.month,
        year: b.year,
        tempMean: b.temp.length ? round2(mean(b.temp)) : null,
        precipSum: round2(b.precip),
      };
    });
}

export async function fetchAirQuality(
  lat: number,
  lon: number,
): Promise<AirQualityData> {
  const url = new URL(AIR_QUALITY_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("current", "pm2_5,pm10,european_aqi");
  url.searchParams.set("timezone", "auto");

  type AqiResponse = {
    current?: {
      time?: string;
      pm2_5?: number | null;
      pm10?: number | null;
      european_aqi?: number | null;
    };
    error?: boolean;
    reason?: string;
  };

  const res = await fetch(url, {
    next: {
      revalidate: TAG_REVALIDATE_SECONDS.aqi,
      tags: ["climate", "open-meteo:aqi"],
    },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo aqi ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as AqiResponse;
  if (json.error) {
    throw new Error(`Open-Meteo aqi: ${json.reason ?? "unknown error"}`);
  }
  const cur = json.current ?? {};
  return {
    pm2_5: typeof cur.pm2_5 === "number" ? cur.pm2_5 : null,
    pm10: typeof cur.pm10 === "number" ? cur.pm10 : null,
    europeanAqi:
      typeof cur.european_aqi === "number" ? cur.european_aqi : null,
    sampledAt: cur.time ?? new Date().toISOString(),
  };
}

export async function fetchFloodRisk(
  lat: number,
  lon: number,
): Promise<FloodData> {
  const url = new URL(FLOOD_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("daily", "river_discharge");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("past_days", "0");

  type FloodResponse = {
    daily?: { time?: string[]; river_discharge?: (number | null)[] };
    error?: boolean;
    reason?: string;
  };

  const res = await fetch(url, {
    next: {
      revalidate: TAG_REVALIDATE_SECONDS.flood,
      tags: ["climate", "open-meteo:flood"],
    },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo flood ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as FloodResponse;
  if (json.error) {
    throw new Error(`Open-Meteo flood: ${json.reason ?? "unknown error"}`);
  }
  const time = json.daily?.time?.[0];
  const discharge = json.daily?.river_discharge?.[0];
  return {
    riverDischargeM3s:
      typeof discharge === "number" && Number.isFinite(discharge)
        ? discharge
        : null,
    sampledAt: time ?? new Date().toISOString(),
  };
}

export async function fetchGeocoding(
  query: string,
  language: "es" | "en" | "pt" = "es",
): Promise<GeoLocation[]> {

  void language;
  const places = await searchLatamPlaces(query);
  return places.map<GeoLocation>((p) => ({
    name: p.name,
    lat: p.lat,
    lon: p.lng,
    elevation: typeof p.elevation === "number" ? p.elevation : null,
    country: p.country,
    admin1: p.admin1 ?? null,
  }));
}

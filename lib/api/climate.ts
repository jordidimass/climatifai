import "server-only";

import { getCrop } from "@/lib/api/crops";
import { getRegion } from "@/lib/api/regions";
import type { ClimatePoint, ClimateSeries, TimeRange } from "@/types/climate";

/**
 * Climate series fetcher backed by Open-Meteo. Historical reads the
 * ERA5-based Archive API; projections read the CMIP6 HighResMIP Climate
 * API (multi-model average). No API key required.
 *
 * Note on scenarios: Open-Meteo's free Climate API surfaces HighResMIP
 * runs that are forced toward SSP5-8.5. The route layer still accepts a
 * `scenario` param and echoes it back in the response wrapper, but the
 * underlying series is the same across scenarios for now. Swap in a
 * scenario-aware provider (Copernicus C3S CDS, NEX-GDDP-CMIP6) when
 * that becomes a requirement.
 */

const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate";

const CLIMATE_MODELS = [
  "EC_Earth3P_HR",
  "MPI_ESM1_2_XR",
  "CMCC_CM2_VHR4",
] as const;

interface DailyPayload {
  time: string[];
  [variable: string]: (number | null)[] | string[] | undefined;
}

interface OpenMeteoResponse {
  daily?: DailyPayload;
  error?: boolean;
  reason?: string;
}

interface DailySample {
  date: string;
  temp: number | null;
  precip: number | null;
}

export async function fetchClimateSeries(
  regionId: string,
  cropId: string,
  range: TimeRange,
  kind: ClimateSeries["kind"],
): Promise<ClimateSeries> {
  const region = getRegion(regionId);
  if (!region) {
    return { regionId, cropId, range, kind, points: [] };
  }

  const gddBaseC = getCrop(cropId)?.gddBaseC ?? 10;
  const { lat, lng } = region.center;
  const start = monthStart(range.from);
  const end = monthEnd(range.to);

  const samples =
    kind === "historical"
      ? await fetchArchive(lat, lng, start, end)
      : await fetchProjection(lat, lng, start, end);

  return {
    regionId,
    cropId,
    range,
    kind,
    points: aggregateMonthly(samples, gddBaseC),
  };
}

async function fetchArchive(
  lat: number,
  lng: number,
  start: string,
  end: string,
): Promise<DailySample[]> {
  const url = new URL(ARCHIVE_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lng.toFixed(4));
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  url.searchParams.set("daily", "temperature_2m_mean,precipitation_sum");
  url.searchParams.set("timezone", "UTC");

  const json = await fetchJson(url, "historical");
  const time = json.daily?.time ?? [];
  return time.map((date, i) => ({
    date,
    temp: numAt(json.daily, "temperature_2m_mean", i),
    precip: numAt(json.daily, "precipitation_sum", i),
  }));
}

async function fetchProjection(
  lat: number,
  lng: number,
  start: string,
  end: string,
): Promise<DailySample[]> {
  const url = new URL(CLIMATE_URL);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lng.toFixed(4));
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  url.searchParams.set("models", CLIMATE_MODELS.join(","));
  url.searchParams.set("daily", "temperature_2m_mean,precipitation_sum");

  const json = await fetchJson(url, "projected");
  const time = json.daily?.time ?? [];
  return time.map((date, i) => ({
    date,
    temp: avgAcrossModels(json.daily, "temperature_2m_mean", i),
    precip: avgAcrossModels(json.daily, "precipitation_sum", i),
  }));
}

async function fetchJson(url: URL, tag: string): Promise<OpenMeteoResponse> {
  const res = await fetch(url, {
    next: {
      revalidate: tag === "historical" ? 86_400 : 86_400 * 7,
      tags: ["climate", tag],
    },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo ${tag} ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as OpenMeteoResponse;
  if (json.error) {
    throw new Error(`Open-Meteo ${tag}: ${json.reason ?? "unknown error"}`);
  }
  return json;
}

function numAt(
  daily: DailyPayload | undefined,
  variable: string,
  i: number,
): number | null {
  const arr = daily?.[variable] as (number | null)[] | undefined;
  const v = arr?.[i];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function avgAcrossModels(
  daily: DailyPayload | undefined,
  variable: string,
  i: number,
): number | null {
  if (!daily) return null;
  const values: number[] = [];
  for (const model of CLIMATE_MODELS) {
    const v = numAt(daily, `${variable}_${model}`, i);
    if (v !== null) values.push(v);
  }
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function aggregateMonthly(
  samples: DailySample[],
  gddBaseC: number,
): ClimatePoint[] {
  const buckets = new Map<
    string,
    { temps: number[]; precips: number[]; gdd: number }
  >();

  for (const s of samples) {
    const month = s.date.slice(0, 7);
    const bucket =
      buckets.get(month) ?? { temps: [], precips: [], gdd: 0 };
    if (s.temp !== null) {
      bucket.temps.push(s.temp);
      bucket.gdd += Math.max(0, s.temp - gddBaseC);
    }
    if (s.precip !== null) bucket.precips.push(s.precip);
    buckets.set(month, bucket);
  }

  return [...buckets.keys()]
    .sort()
    .map((month) => {
      const b = buckets.get(month)!;
      const meanTemp = b.temps.length
        ? b.temps.reduce((a, c) => a + c, 0) / b.temps.length
        : 0;
      return {
        month,
        tempMeanC: +meanTemp.toFixed(2),
        precipMm: Math.round(b.precips.reduce((a, c) => a + c, 0)),
        gdd: Math.round(b.gdd),
      };
    });
}

function monthStart(yyyymm: string): string {
  return `${yyyymm}-01`;
}

function monthEnd(yyyymm: string): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${yyyymm}-${String(last).padStart(2, "0")}`;
}

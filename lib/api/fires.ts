import "server-only";

import { serverEnv } from "@/lib/env";
import type {
  BBox,
  FireConfidenceBand,
  FireDayRange,
  FirmsSource,
  HotspotFC,
  HotspotFeature,
  HotspotProperties,
} from "@/types/fires";

const FIRMS_BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv";

export class FirmsKeyMissingError extends Error {
  constructor() {
    super("FIRMS_MAP_KEY is not set");
    this.name = "FirmsKeyMissingError";
  }
}

interface FetchHotspotsInput {
  source: FirmsSource;
  bbox: BBox;

  dayRange: number;

  date?: string;
}

export async function fetchFirmsHotspots(
  input: FetchHotspotsInput,
): Promise<HotspotFeature[]> {
  const key = serverEnv.FIRMS_MAP_KEY;
  if (!key) throw new FirmsKeyMissingError();

  const { source, bbox, dayRange, date } = input;
  const bboxStr = [bbox.west, bbox.south, bbox.east, bbox.north]
    .map((n) => n.toFixed(4))
    .join(",");

  const url = date
    ? `${FIRMS_BASE}/${key}/${source}/${bboxStr}/${dayRange}/${date}`
    : `${FIRMS_BASE}/${key}/${source}/${bboxStr}/${dayRange}`;

  const res = await fetch(url, {
    next: { revalidate: 300, tags: ["fires", source] },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`FIRMS ${source} ${res.status}: ${body.slice(0, 200)}`);
  }

  const csv = await res.text();
  return parseFirmsCsv(csv, source);
}

const FIRMS_MAX_WINDOW_DAYS = 5;

export async function fetchFirmsHotspotsMulti(
  sources: FirmsSource[],
  bbox: BBox,
  totalDays: FireDayRange,
  endDate?: string,
): Promise<HotspotFC> {
  if (!serverEnv.FIRMS_MAP_KEY) throw new FirmsKeyMissingError();

  const windows = buildWindows(totalDays, endDate);
  const requests = sources.flatMap((source) =>
    windows.map((w) =>
      fetchFirmsHotspots({
        source,
        bbox,
        dayRange: w.dayRange,
        date: w.date,
      }).catch((err) => {
        console.warn(`[fires] ${source} window ${w.dayRange}/${w.date ?? "now"} failed:`, err);
        return [] as HotspotFeature[];
      }),
    ),
  );

  const batches = await Promise.all(requests);
  const seen = new Set<string>();
  const features: HotspotFeature[] = [];
  for (const batch of batches) {
    for (const f of batch) {
      const [lng, lat] = f.geometry.coordinates;
      const key = `${lat.toFixed(5)},${lng.toFixed(5)},${f.properties.ts},${f.properties.source}`;
      if (seen.has(key)) continue;
      seen.add(key);
      features.push(f);
    }
  }
  return { type: "FeatureCollection", features };
}

interface FirmsWindow {

  dayRange: number;

  date?: string;
}

function buildWindows(
  totalDays: FireDayRange,
  endDate: string | undefined,
): FirmsWindow[] {
  if (totalDays <= FIRMS_MAX_WINDOW_DAYS) {
    return [{ dayRange: totalDays, date: endDate }];
  }
  const windows: FirmsWindow[] = [];
  let remaining = totalDays as number;
  let daysBack = 0;
  while (remaining > 0) {
    const chunk = Math.min(FIRMS_MAX_WINDOW_DAYS, remaining);
    const date = daysBack === 0
      ? endDate
      : isoDateMinusDays(endDate, daysBack);
    windows.push({ dayRange: chunk, date });
    daysBack += chunk;
    remaining -= chunk;
  }
  return windows;
}

function isoDateMinusDays(
  anchor: string | undefined,
  days: number,
): string {
  const base = anchor ? new Date(`${anchor}T00:00:00Z`) : new Date();
  base.setUTCDate(base.getUTCDate() - days);
  return base.toISOString().slice(0, 10);
}

function parseFirmsCsv(csv: string, source: FirmsSource): HotspotFeature[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const idx = (name: string) => header.indexOf(name);
  const iLat = idx("latitude");
  const iLng = idx("longitude");
  const iAcqDate = idx("acq_date");
  const iAcqTime = idx("acq_time");
  const iSat = idx("satellite");
  const iInst = idx("instrument");
  const iFrp = idx("frp");
  const iConf = idx("confidence");
  const iDayNight = idx("daynight");
  const iBrightT21 = idx("bright_t21");
  const iBrightTi4 = idx("bright_ti4");
  const iBrightness = idx("brightness");

  if (iLat < 0 || iLng < 0 || iAcqDate < 0) return [];

  const features: HotspotFeature[] = [];
  for (let row = 1; row < lines.length; row++) {
    const cells = lines[row].split(",");
    const lat = Number(cells[iLat]);
    const lng = Number(cells[iLng]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const acqDate = (cells[iAcqDate] ?? "").trim();
    const acqTime = (cells[iAcqTime] ?? "0000").trim().padStart(4, "0");
    const ts = toEpochMs(acqDate, acqTime);

    const brightness =
      readNumber(cells, iBrightT21) ??
      readNumber(cells, iBrightTi4) ??
      readNumber(cells, iBrightness) ??
      0;

    const props: HotspotProperties = {
      ts,
      acqDate,
      acqTime,
      satellite: (cells[iSat] ?? "").trim(),
      instrument: (cells[iInst] ?? "").trim(),
      source,
      frp: readNumber(cells, iFrp) ?? 0,
      brightness,
      confidence: normalizeConfidence(cells[iConf]),
      daynight: normalizeDayNight(cells[iDayNight]),
    };

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [lng, lat] },
      properties: props,
    });
  }
  return features;
}

function readNumber(cells: string[], i: number): number | null {
  if (i < 0) return null;
  const v = Number((cells[i] ?? "").trim());
  return Number.isFinite(v) ? v : null;
}

function toEpochMs(acqDate: string, acqTime: string): number {

  const hh = acqTime.slice(0, 2);
  const mm = acqTime.slice(2, 4);
  const iso = `${acqDate}T${hh}:${mm}:00Z`;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function normalizeConfidence(raw: string | undefined): FireConfidenceBand {
  const v = (raw ?? "").trim().toLowerCase();
  if (!v) return "nominal";

  if (v === "l" || v === "low") return "low";
  if (v === "h" || v === "high") return "high";
  if (v === "n" || v === "nominal") return "nominal";

  const n = Number(v);
  if (Number.isFinite(n)) {
    if (n < 30) return "low";
    if (n >= 80) return "high";
    return "nominal";
  }
  return "nominal";
}

function normalizeDayNight(raw: string | undefined): "D" | "N" | "U" {
  const v = (raw ?? "").trim().toUpperCase();
  if (v === "D" || v === "N") return v;
  return "U";
}

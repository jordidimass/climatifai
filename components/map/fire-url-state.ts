import { buildSelectionSearchParams } from "@/components/selection/selection-from-search-params";
import { DEFAULT_REGION } from "@/lib/api/regions";
import type { CustomLocation } from "@/stores/selection-store";
import type { FireDayRange, FirmsSource } from "@/types/fires";

import type { FireViewMode } from "@/stores/fire-store";

const VALID_DAY_RANGES: FireDayRange[] = [1, 2, 7, 30];
const VALID_SOURCES: FirmsSource[] = [
  "VIIRS_SNPP_NRT",
  "VIIRS_NOAA20_NRT",
  "VIIRS_NOAA21_NRT",
  "MODIS_NRT",
];
const VALID_VIEW_MODES: FireViewMode[] = ["live", "history"];

export const FIRE_URL_DEFAULTS = {
  dayRange: 1 as FireDayRange,
  sources: ["VIIRS_NOAA20_NRT", "VIIRS_SNPP_NRT"] as FirmsSource[],
  viewMode: "live" as FireViewMode,
  opacity: 0.85,
  windowHours: 6,
  playhead: null as number | null,
} as const;

export interface FireUrlParams {
  dayRange?: FireDayRange;
  sources?: FirmsSource[];
  viewMode?: FireViewMode;
  opacity?: number;
  windowHours?: number;
  playhead?: number;
}

function isFireDayRange(value: number): value is FireDayRange {
  return (VALID_DAY_RANGES as number[]).includes(value);
}

function isFirmsSource(value: string): value is FirmsSource {
  return (VALID_SOURCES as string[]).includes(value);
}

function isViewMode(value: string): value is FireViewMode {
  return (VALID_VIEW_MODES as string[]).includes(value);
}

export function parseFireUrlParams(sp: URLSearchParams): FireUrlParams {
  const out: FireUrlParams = {};

  const dayRangeRaw = sp.get("dayRange");
  if (dayRangeRaw != null) {
    const n = Number(dayRangeRaw);
    if (Number.isFinite(n) && isFireDayRange(n)) out.dayRange = n;
  }

  const sourcesRaw = sp.get("sources");
  if (sourcesRaw != null && sourcesRaw.length > 0) {
    const parsed = sourcesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(isFirmsSource);
    const unique = Array.from(new Set(parsed));
    if (unique.length > 0) out.sources = unique;
  }

  const viewModeRaw = sp.get("viewMode");
  if (viewModeRaw != null && isViewMode(viewModeRaw)) {
    out.viewMode = viewModeRaw;
  }

  const opacityRaw = sp.get("opacity");
  if (opacityRaw != null) {
    const n = Number(opacityRaw);
    if (Number.isFinite(n) && n >= 0.1 && n <= 1) {
      out.opacity = Math.round(n * 100) / 100;
    }
  }

  const windowHoursRaw = sp.get("windowHours");
  if (windowHoursRaw != null) {
    const n = Number(windowHoursRaw);
    if (Number.isFinite(n) && Number.isInteger(n) && n > 0 && n <= 168) {
      out.windowHours = n;
    }
  }

  const playheadRaw = sp.get("playhead");
  if (playheadRaw != null) {
    const n = Number(playheadRaw);
    if (Number.isFinite(n) && n > 0) out.playhead = Math.trunc(n);
  }

  return out;
}

interface FireStateForUrl {
  dayRange: FireDayRange;
  sources: FirmsSource[];
  viewMode: FireViewMode;
  opacity: number;
  windowHours: number;
  playhead: number | null;
}

function sameSources(a: FirmsSource[], b: FirmsSource[]): boolean {
  if (a.length !== b.length) return false;
  const aSorted = [...a].sort();
  const bSorted = [...b].sort();
  return aSorted.every((s, i) => s === bSorted[i]);
}

export function appendFireSearchParams(
  p: URLSearchParams,
  fire: FireStateForUrl,
): URLSearchParams {
  if (fire.dayRange !== FIRE_URL_DEFAULTS.dayRange) {
    p.set("dayRange", String(fire.dayRange));
  }

  if (!sameSources(fire.sources, FIRE_URL_DEFAULTS.sources)) {
    const sorted = [...fire.sources].sort().join(",");
    p.set("sources", sorted);
  }

  if (fire.viewMode !== FIRE_URL_DEFAULTS.viewMode) {
    p.set("viewMode", fire.viewMode);
  }

  const opacity2 = Math.round(fire.opacity * 100) / 100;
  if (opacity2 !== FIRE_URL_DEFAULTS.opacity) {
    p.set("opacity", opacity2.toFixed(2));
  }

  if (fire.windowHours !== FIRE_URL_DEFAULTS.windowHours) {
    p.set("windowHours", String(fire.windowHours));
  }

  if (fire.viewMode === "history" && fire.playhead != null) {
    p.set("playhead", String(Math.trunc(fire.playhead)));
  }

  return p;
}

export interface SelectionStateForUrl {
  region: { id: string };
  customLocation: CustomLocation | null;
}

export function buildFireMapSearchParams(
  selection: SelectionStateForUrl,
  fire: FireStateForUrl,
): URLSearchParams {
  const p = new URLSearchParams();

  if (selection.customLocation) {
    const { lat, lng, elevation, label, countryCode } = selection.customLocation;
    p.set("lat", lat.toString());
    p.set("lng", lng.toString());
    if (typeof elevation === "number") {
      p.set("elev", String(Math.round(elevation)));
    }
    if (label) p.set("label", label);
    if (countryCode) p.set("country", countryCode);
  } else if (selection.region?.id && selection.region.id !== DEFAULT_REGION.id) {
    p.set("regionId", selection.region.id);
  }

  appendFireSearchParams(p, fire);
  return p;
}

export { buildSelectionSearchParams };

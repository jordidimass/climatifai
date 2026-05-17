/**
 * Derives deterministic month rotations for illustrative crop-cycle bars from
 * lat/lng + crop so different pins shift siembra·crece·cosecha in the UI.
 * MVP scaffolding until a crop_calendar backend exists.
 */

import type { CropId } from "@/types/crop";

export type CropPhaseKey =
  | "planting"
  | "growing"
  | "harvest"
  | "off";

export type CropTimelineAnchors = {
  cycleRotation: number;
  stressRotation: number;
};

/** Base phase per calendar month (0 = Jan … 11 = Dec); parity with legacy UX. */
const BASE_MONTH_PHASE: CropPhaseKey[] = [
  "off",
  "off",
  "planting",
  "planting",
  "growing",
  "growing",
  "growing",
  "growing",
  "growing",
  "harvest",
  "harvest",
  "harvest",
];

function hashCoordsCrop(lat: number, lng: number, cropId: string): number {
  const s = `${cropId}:${lat.toFixed(3)},${lng.toFixed(3)}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return h >>> 0;
}

export function getCropTimelineAnchors(
  lat: number,
  lng: number,
  cropId: CropId | string,
): CropTimelineAnchors {
  let cycleRotation = hashCoordsCrop(lat, lng, cropId) % 12;

  /* Southern Hemisphere: coarse half-year flip for illustrative seasons */
  if (lat < -5) cycleRotation = (cycleRotation + 6) % 12;

  /* Northern tropics: small shift by longitude bands (Pacífico vs Atlántico) */
  else if (Math.abs(lat) < 23.5 && lat >= 0) {
    const band = Math.floor(((lng + 180 + 720) % 360) / 30) % 3;
    cycleRotation = (cycleRotation + band) % 12;
  }

  const stressRotation =
    (hashCoordsCrop(lat * 1.003, lng * 1.002, `${cropId}:stress`) %
      (Math.abs(lat) < 38 ? 7 : 11)) %
    12;

  return { cycleRotation, stressRotation };
}

export function phaseForCalendarMonth(
  calendarMonthIdx: number,
  cycleRotation: number,
): CropPhaseKey {
  const j = (((calendarMonthIdx - cycleRotation) % 12) + 12) % 12;
  return BASE_MONTH_PHASE[j]!;
}

export function stressMonthIndices(stressRotation: number): Set<number> {
  return new Set([(6 + stressRotation) % 12, (7 + stressRotation) % 12]);
}

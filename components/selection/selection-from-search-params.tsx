"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { getCrop, isCropId } from "@/lib/api/crops";
import { getRegion } from "@/lib/api/regions";
import { useSelectionStore } from "@/stores/selection-store";

/**
 * Hydrates the selection store from URL search params so /analizar-siembra
 * and its /resultado are shareable. Mounted once per flows subtree; runs
 * whenever the params string changes (i.e. on navigation), then sits idle.
 *
 * Recognised params:
 *   regionId   — catalog region id (mx-bajio, ar-pampa, …)
 *   cropId     — catalog crop id  (maize, coffee, …)
 *   date       — sowing date YYYY-MM-DD
 *   lat, lng   — custom-location coordinates (numbers)
 *   elev       — elevation in metres (optional)
 *   label      — human label for the custom location
 *   country    — ISO-3166 α-2 of the custom location
 */
export function SelectionFromSearchParams() {
  const params = useSearchParams();
  const setRegion = useSelectionStore((s) => s.setRegion);
  const setCrop = useSelectionStore((s) => s.setCrop);
  const setSowingDate = useSelectionStore((s) => s.setSowingDate);
  const setCustomLocation = useSelectionStore((s) => s.setCustomLocation);
  const paramsKey = params.toString();

  React.useEffect(() => {
    const sp = new URLSearchParams(paramsKey);

    const cropId = sp.get("cropId");
    if (cropId && isCropId(cropId)) {
      const crop = getCrop(cropId);
      if (crop) setCrop(crop);
    }

    const date = sp.get("date");
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setSowingDate(date);
    }

    const latRaw = sp.get("lat");
    const lngRaw = sp.get("lng");
    const lat = latRaw != null ? Number(latRaw) : NaN;
    const lng = lngRaw != null ? Number(lngRaw) : NaN;

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const elevRaw = sp.get("elev");
      const elevation =
        elevRaw != null && Number.isFinite(Number(elevRaw))
          ? Number(elevRaw)
          : undefined;
      setCustomLocation({
        lat,
        lng,
        elevation,
        label: sp.get("label") ?? `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
        countryCode: sp.get("country") ?? "",
      });
    } else {
      const regionId = sp.get("regionId");
      if (regionId) {
        const region = getRegion(regionId);
        if (region) setRegion(region);
      }
    }
  }, [paramsKey, setRegion, setCrop, setSowingDate, setCustomLocation]);

  return null;
}

/**
 * Build the shareable URL search string from the current selection state.
 * Caller passes the state snapshot so this is callable from event handlers
 * (avoids the `useSelectionStore.getState()` import elsewhere).
 */
export function buildSelectionSearchParams(state: {
  region: { id: string };
  crop: { id: string };
  sowingDate: string;
  customLocation: {
    lat: number;
    lng: number;
    elevation?: number;
    label: string;
    countryCode: string;
  } | null;
}): URLSearchParams {
  const p = new URLSearchParams();
  p.set("regionId", state.region.id);
  p.set("cropId", state.crop.id);
  p.set("date", state.sowingDate);
  if (state.customLocation) {
    p.set("lat", state.customLocation.lat.toString());
    p.set("lng", state.customLocation.lng.toString());
    if (typeof state.customLocation.elevation === "number") {
      p.set("elev", String(Math.round(state.customLocation.elevation)));
    }
    if (state.customLocation.label) p.set("label", state.customLocation.label);
    if (state.customLocation.countryCode) {
      p.set("country", state.customLocation.countryCode);
    }
  }
  return p;
}

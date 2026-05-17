"use client";

import { create } from "zustand";

import type { ClimateSeries, TimeRange } from "@/types/climate";

interface ClimateState {

  series: Record<string, ClimateSeries>;
  get: (key: string) => ClimateSeries | undefined;
  set: (key: string, series: ClimateSeries) => void;
  clear: () => void;
}

export const useClimateStore = create<ClimateState>((set, get) => ({
  series: {},
  get: (key) => get().series[key],
  set: (key, series) =>
    set((state) => ({ series: { ...state.series, [key]: series } })),
  clear: () => set({ series: {} }),
}));

export function climateCacheKey(
  regionId: string,
  cropId: string,
  kind: ClimateSeries["kind"],
  range: TimeRange,
) {
  return `${regionId}:${cropId}:${kind}:${range.from}-${range.to}`;
}

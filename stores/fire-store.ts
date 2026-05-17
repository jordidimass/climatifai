"use client";

import { create } from "zustand";

import type {
  FireDayRange,
  FirmsSource,
  HotspotFeature,
} from "@/types/fires";

export type FireViewMode = "live" | "history";

const DEFAULT_SOURCES: FirmsSource[] = [
  "VIIRS_SNPP_NRT",
  "VIIRS_NOAA20_NRT",
];

interface FireState {
  dayRange: FireDayRange;
  sources: FirmsSource[];

  playhead: number | null;

  windowHours: number;
  playing: boolean;
  opacity: number;
  viewMode: FireViewMode;
  selectedHotspot: HotspotFeature | null;

  dataSpan: { from: number; to: number } | null;
  reportOpen: boolean;

  error: { message: string; hint?: string } | null;
  loading: boolean;

  setDayRange: (dr: FireDayRange) => void;
  toggleSource: (s: FirmsSource) => void;
  setSources: (sources: FirmsSource[]) => void;
  setPlayhead: (ms: number | null) => void;
  setWindowHours: (h: number) => void;
  setPlaying: (playing: boolean) => void;
  setOpacity: (o: number) => void;
  setViewMode: (mode: FireViewMode) => void;
  selectHotspot: (f: HotspotFeature | null) => void;
  setDataSpan: (span: { from: number; to: number } | null) => void;
  setReportOpen: (open: boolean) => void;
  setError: (err: { message: string; hint?: string } | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useFireStore = create<FireState>((set) => ({
  dayRange: 1,
  sources: DEFAULT_SOURCES,
  playhead: null,
  windowHours: 6,
  playing: false,
  opacity: 0.85,
  viewMode: "live",
  selectedHotspot: null,
  dataSpan: null,
  reportOpen: false,
  error: null,
  loading: false,

  setDayRange: (dayRange) => set({ dayRange, playhead: null, playing: false }),
  toggleSource: (s) =>
    set((state) => {
      const next = state.sources.includes(s)
        ? state.sources.filter((x) => x !== s)
        : [...state.sources, s];
      return { sources: next.length ? next : state.sources };
    }),
  setSources: (sources) =>
    set((state) => {
      if (!sources.length) return state;
      if (
        state.sources.length === sources.length &&
        [...state.sources].sort().join(",") === [...sources].sort().join(",")
      ) {
        return state;
      }
      return { sources };
    }),
  setPlayhead: (playhead) =>
    set((state) =>
      state.playhead === playhead ? state : { playhead },
    ),
  setWindowHours: (windowHours) =>
    set((state) =>
      state.windowHours === windowHours ? state : { windowHours },
    ),
  setPlaying: (playing) =>
    set((state) => (state.playing === playing ? state : { playing })),
  setOpacity: (opacity) =>
    set((state) => (state.opacity === opacity ? state : { opacity })),
  setViewMode: (viewMode) =>
    set(viewMode === "live"
      ? { viewMode, playing: false, playhead: null }
      : { viewMode }),
  selectHotspot: (selectedHotspot) =>
    set((state) =>
      state.selectedHotspot === selectedHotspot
        ? state
        : { selectedHotspot },
    ),
  setDataSpan: (dataSpan) =>
    set((state) => {
      if (dataSpan === state.dataSpan) return state;
      if (
        dataSpan &&
        state.dataSpan &&
        dataSpan.from === state.dataSpan.from &&
        dataSpan.to === state.dataSpan.to
      ) {
        return state;
      }
      if (dataSpan == null && state.dataSpan == null) return state;
      return { dataSpan };
    }),
  setReportOpen: (reportOpen) => set({ reportOpen }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
}));

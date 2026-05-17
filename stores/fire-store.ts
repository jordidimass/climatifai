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
  /** Selected window center, epoch ms. `null` = no filter (show all in range). */
  playhead: number | null;
  /** Half-width in hours around playhead used to filter visible features. */
  windowHours: number;
  playing: boolean;
  opacity: number;
  viewMode: FireViewMode;
  selectedHotspot: HotspotFeature | null;
  /** Last-fetched bbox window (epoch ms) so the timeline knows the data span. */
  dataSpan: { from: number; to: number } | null;
  reportOpen: boolean;
  /** Latest BFF error (e.g. missing FIRMS_MAP_KEY). `null` when the last fetch succeeded. */
  error: { message: string; hint?: string } | null;
  loading: boolean;

  setDayRange: (dr: FireDayRange) => void;
  toggleSource: (s: FirmsSource) => void;
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
  setPlayhead: (playhead) => set({ playhead }),
  setWindowHours: (windowHours) => set({ windowHours }),
  setPlaying: (playing) => set({ playing }),
  setOpacity: (opacity) => set({ opacity }),
  setViewMode: (viewMode) =>
    set(viewMode === "live"
      ? { viewMode, playing: false, playhead: null }
      : { viewMode }),
  selectHotspot: (selectedHotspot) => set({ selectedHotspot }),
  setDataSpan: (dataSpan) => set({ dataSpan }),
  setReportOpen: (reportOpen) => set({ reportOpen }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
}));

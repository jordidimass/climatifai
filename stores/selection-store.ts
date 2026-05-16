"use client";

import { create } from "zustand";

import type { Crop } from "@/types/crop";
import type { Region } from "@/types/region";
import { CROPS, getCrop } from "@/lib/api/crops";
import { DEFAULT_REGION } from "@/lib/api/regions";
import {
  getSowingPreset,
  SOWING_PRESETS,
  type SowingPresetId,
} from "@/lib/constants/sowing-presets";

interface SelectionState {
  region: Region;
  crop: Crop;
  compareCrop: Crop;
  sowingPresetId: SowingPresetId;
  sowingDate: string;
  setRegion: (region: Region) => void;
  setCrop: (crop: Crop) => void;
  setCompareCrop: (crop: Crop) => void;
  setSowingPresetId: (id: SowingPresetId) => void;
  setSowingDate: (isoDate: string) => void;
  applySowingPreset: (id: SowingPresetId) => void;
  reset: () => void;
}

const DEFAULT_CROP = CROPS[0];
const DEFAULT_COMPARE_CROP = CROPS.length > 1 ? CROPS[1]! : CROPS[0]!;
const DEFAULT_PRESET = SOWING_PRESETS[0];

function defaultSowingDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/**
 * Holds the user's current focus — which region and which crop are
 * driving every downstream query (map viewport, climate series, AI
 * prompts). Deliberately not persisted: every session opens with the
 * defaults so the dashboard is never in a stale state.
 */
export const useSelectionStore = create<SelectionState>((set) => ({
  region: DEFAULT_REGION,
  crop: DEFAULT_CROP,
  compareCrop: DEFAULT_COMPARE_CROP,
  sowingPresetId: DEFAULT_PRESET.id,
  sowingDate: defaultSowingDate(),
  setRegion: (region) => set({ region }),
  setCrop: (crop) => set({ crop }),
  setCompareCrop: (compareCrop) => set({ compareCrop }),
  setSowingPresetId: (id) => set({ sowingPresetId: id }),
  setSowingDate: (isoDate) => set({ sowingDate: isoDate }),
  applySowingPreset: (id) => {
    const preset = getSowingPreset(id);
    const crop = preset ? getCrop(preset.cropId) : undefined;
    set({
      sowingPresetId: id,
      ...(crop ? { crop } : {}),
    });
  },
  reset: () =>
    set({
      region: DEFAULT_REGION,
      crop: DEFAULT_CROP,
      compareCrop: DEFAULT_COMPARE_CROP,
      sowingPresetId: DEFAULT_PRESET.id,
      sowingDate: defaultSowingDate(),
    }),
}));

"use client";

import { create } from "zustand";

import type { Crop } from "@/types/crop";
import type { Region } from "@/types/region";
import { CROPS, getCrop } from "@/lib/api/crops";
import { DEFAULT_REGION, findNearestRegion } from "@/lib/api/regions";
import {
  getSowingPreset,
  SOWING_PRESETS,
  type SowingPresetId,
} from "@/lib/constants/sowing-presets";

export interface CustomLocation {
  lat: number;
  lng: number;

  elevation?: number;

  label: string;

  countryCode: string;
}

interface SelectionState {
  region: Region;
  crop: Crop;
  compareCrop: Crop;
  comparisonMode: boolean;
  sowingPresetId: SowingPresetId;
  sowingDate: string;

  customLocation: CustomLocation | null;
  setRegion: (region: Region) => void;
  setCrop: (crop: Crop) => void;
  setCompareCrop: (crop: Crop) => void;
  enterComparisonMode: () => void;
  leaveComparisonMode: () => void;
  setSowingPresetId: (id: SowingPresetId) => void;
  setSowingDate: (isoDate: string) => void;
  applySowingPreset: (id: SowingPresetId) => void;
  setCustomLocation: (location: CustomLocation | null) => void;
  reset: () => void;
}

const DEFAULT_CROP = CROPS[0];
const DEFAULT_COMPARE_CROP = CROPS.length > 1 ? CROPS[1]! : CROPS[0]!;
const DEFAULT_PRESET = SOWING_PRESETS[0];

function defaultSowingDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export const useSelectionStore = create<SelectionState>((set) => ({
  region: DEFAULT_REGION,
  crop: DEFAULT_CROP,
  compareCrop: DEFAULT_COMPARE_CROP,
  comparisonMode: false,
  sowingPresetId: DEFAULT_PRESET.id,
  sowingDate: defaultSowingDate(),
  customLocation: null,
  setRegion: (region) => set({ region }),
  setCrop: (crop) => set({ crop }),
  setCompareCrop: (compareCrop) => set({ compareCrop }),
  enterComparisonMode: () => set({ comparisonMode: true }),
  leaveComparisonMode: () => set({ comparisonMode: false }),
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
  setCustomLocation: (location) => {
    if (!location) {
      set({ customLocation: null });
      return;
    }
    const snapped = findNearestRegion(location.lat, location.lng).region;
    set({ customLocation: location, region: snapped });
  },
  reset: () =>
    set({
      region: DEFAULT_REGION,
      crop: DEFAULT_CROP,
      compareCrop: DEFAULT_COMPARE_CROP,
      comparisonMode: false,
      sowingPresetId: DEFAULT_PRESET.id,
      sowingDate: defaultSowingDate(),
      customLocation: null,
    }),
}));

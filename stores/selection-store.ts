"use client";

import { create } from "zustand";

import type { Crop } from "@/types/crop";
import type { Region } from "@/types/region";
import { CROPS } from "@/lib/api/crops";
import { DEFAULT_REGION } from "@/lib/api/regions";

interface SelectionState {
  region: Region;
  crop: Crop;
  setRegion: (region: Region) => void;
  setCrop: (crop: Crop) => void;
  reset: () => void;
}

const DEFAULT_CROP = CROPS[0];

/**
 * Holds the user's current focus — which region and which crop are
 * driving every downstream query (map viewport, climate series, AI
 * prompts). Deliberately not persisted: every session opens with the
 * defaults so the dashboard is never in a stale state.
 */
export const useSelectionStore = create<SelectionState>((set) => ({
  region: DEFAULT_REGION,
  crop: DEFAULT_CROP,
  setRegion: (region) => set({ region }),
  setCrop: (crop) => set({ crop }),
  reset: () => set({ region: DEFAULT_REGION, crop: DEFAULT_CROP }),
}));

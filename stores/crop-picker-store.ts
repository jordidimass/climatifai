"use client";

import { create } from "zustand";

import type { CropId } from "@/types/crop";

type CropPickerMode = "advisor" | "compare";

interface AdvisorResponse {
  advisories?: { title: string; severity: string; message: string }[];
  generatedAt?: string;
}

interface CompareResponse {
  summary?: string;
  comparison?: unknown[];
  generatedAt?: string;
}

interface CropPickerState {
  mode: CropPickerMode;
  selectedAdvisorCropId: CropId | null;
  compareSelection: CropId[];
  advisorResponse: AdvisorResponse | null;
  compareResponse: CompareResponse | null;
  loading: boolean;
  error: string | null;
  setMode: (mode: CropPickerMode) => void;
  selectAdvisorCrop: (cropId: CropId) => void;
  toggleCompareCrop: (cropId: CropId) => void;
  fetchAdvisor: (regionId: string, cropId: CropId) => Promise<void>;
  fetchCompare: (regionId: string) => Promise<void>;
}

async function readApiError(response: Response) {
  const data = await response.json().catch(() => null);
  return data?.error ?? "No se pudo completar la solicitud";
}

export const useCropPickerStore = create<CropPickerState>((set, get) => ({
  mode: "advisor",
  selectedAdvisorCropId: "maize",
  compareSelection: [],
  advisorResponse: null,
  compareResponse: null,
  loading: false,
  error: null,
  setMode: (mode) => set({ mode, error: null }),
  selectAdvisorCrop: (cropId) =>
    set({
      selectedAdvisorCropId: cropId,
      error: null,
      compareResponse: null,
    }),
  toggleCompareCrop: (cropId) =>
    set((state) => {
      const exists = state.compareSelection.includes(cropId);
      const compareSelection = exists
        ? state.compareSelection.filter((id) => id !== cropId)
        : [...state.compareSelection, cropId].slice(0, 2);

      return { compareSelection, error: null, advisorResponse: null };
    }),
  fetchAdvisor: async (regionId, cropId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/agri/advisor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ regionId, cropId }),
      });

      if (!response.ok) throw new Error(await readApiError(response));

      set({ advisorResponse: await response.json(), loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error inesperado",
        loading: false,
      });
    }
  },
  fetchCompare: async (regionId) => {
    const cropIds = get().compareSelection;
    if (cropIds.length !== 2) return;

    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/agri/compare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ regionId, cropIds }),
      });

      if (!response.ok) throw new Error(await readApiError(response));

      set({ compareResponse: await response.json(), loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error inesperado",
        loading: false,
      });
    }
  },
}));

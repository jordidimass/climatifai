"use client";

import { ClimateChartPanel } from "@/app/(app)/dashboard/_components/climate-chart-panel";
import { useSelectionStore } from "@/stores/selection-store";

/** Misma vista de series climáticas triples que el dashboard comparador. */
export function ResultadoClimatePanel() {
  const regionId = useSelectionStore((s) => s.region.id);
  const cropId = useSelectionStore((s) => s.crop.id);

  return (
    <ClimateChartPanel regionId={regionId} cropId={cropId} />
  );
}

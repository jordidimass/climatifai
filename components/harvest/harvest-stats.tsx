"use client";

import { AnomalyBadge } from "@/components/data/anomaly-badge";
import { StatCard } from "@/components/data/stat-card";
import { deriveStats } from "@/lib/dashboard-stats";
import { useSelectionStore } from "@/stores/selection-store";

export function HarvestStats() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const stats = deriveStats(region.id, crop.id);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:gap-3">
      <StatCard
        label="Ola de calor (riesgo)"
        value={`+${stats.tempDelta}`}
        unit="°C"
        caption={`Δ vs. línea base 1991–2020 · ${crop.name}`}
        badge={<AnomalyBadge value={stats.tempDelta} unit="°C" />}
      />
      <StatCard
        label="Mejor ventana (índice)"
        value={`${stats.precipDelta}`}
        unit="%"
        caption="Precipitación anual vs. línea base"
        badge={<AnomalyBadge value={stats.precipDelta} unit="%" />}
      />
      <StatCard
        label="Rendimiento vs. pronóstico"
        value={stats.gdd.toLocaleString()}
        unit="GDD"
        caption={`Base ${crop.gddBaseC}°C · acumulado proyectado`}
        badge={<AnomalyBadge value={6} unit="%" tone="warm" />}
      />
      <StatCard
        label="Rendimiento potencial"
        value={`${stats.heatStress}`}
        unit="d"
        caption={`Días sobre ${crop.heatStressC}°C máx.`}
        badge={<AnomalyBadge value={stats.heatStress - 14} unit="d" />}
      />
    </div>
  );
}

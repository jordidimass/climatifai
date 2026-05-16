"use client";

import { AnomalyBadge } from "@/components/data/anomaly-badge";
import { StatCard } from "@/components/data/stat-card";
import { useSelectionStore } from "@/stores/selection-store";

function deriveStats(regionId: string, cropId: string) {
  const seed = (regionId + cropId)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const wave = (n: number) => ((seed * 9301 + n * 49297) % 233280) / 233280;

  const tempDelta = +(0.8 + wave(1) * 1.6).toFixed(1);
  const precipDelta = +(-20 + wave(2) * 14).toFixed(0);
  const gdd = Math.round(1100 + wave(3) * 320);
  const heatStress = Math.round(14 + wave(4) * 22);

  return { tempDelta, precipDelta, gdd, heatStress };
}

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

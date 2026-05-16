"use client";

import { AnomalyBadge } from "@/components/data/anomaly-badge";
import { StatCard } from "@/components/data/stat-card";
import { useSelectionStore } from "@/stores/selection-store";

/**
 * Placeholder analytics — deterministic values derived from the selected
 * region + crop so the dashboard reacts to changes without a real data
 * source wired yet.
 */
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

export function DashboardStats() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const stats = deriveStats(region.id, crop.id);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Temp anomaly"
        value={`+${stats.tempDelta}`}
        unit="°C"
        caption={`Δ vs. 1991–2020 baseline · ${crop.name}`}
        badge={<AnomalyBadge value={stats.tempDelta} unit="°C" />}
      />
      <StatCard
        label="Precipitation Δ"
        value={`${stats.precipDelta}`}
        unit="%"
        caption="Annual total vs. baseline"
        badge={<AnomalyBadge value={stats.precipDelta} unit="%" />}
      />
      <StatCard
        label="Growing-degree-days"
        value={stats.gdd.toLocaleString()}
        unit="GDD"
        caption={`Base ${crop.gddBaseC}°C · season cumulative`}
        badge={<AnomalyBadge value={6} unit="%" tone="warm" />}
      />
      <StatCard
        label="Heat-stress days"
        value={`${stats.heatStress}`}
        unit="d"
        caption={`Days above ${crop.heatStressC}°C max`}
        badge={<AnomalyBadge value={stats.heatStress - 14} unit="d" />}
      />
    </div>
  );
}

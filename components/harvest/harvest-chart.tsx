"use client";

import * as React from "react";

import { ChartShell } from "@/components/data/chart-shell";
import { useSelectionStore } from "@/stores/selection-store";
import type { ClimateSeries, TimeRange } from "@/types/climate";

const HISTORICAL_RANGE: TimeRange = { from: "1991-01", to: "2020-12" };
const PROJECTED_RANGE: TimeRange = { from: "2031-01", to: "2050-12" };
const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

interface ChartPoint {
  month: string;
  historical: number;
  projected: number;
}

function climatology(series: ClimateSeries | undefined): number[] {
  const sums = new Array<number>(12).fill(0);
  const counts = new Array<number>(12).fill(0);
  for (const p of series?.points ?? []) {
    const idx = Number(p.month.slice(5, 7)) - 1;
    if (idx < 0 || idx > 11) continue;
    sums[idx] += p.tempMeanC;
    counts[idx] += 1;
  }
  return sums.map((s, i) =>
    counts[i] ? +(s / counts[i]).toFixed(2) : 0,
  );
}

export function HarvestChart({ className }: { className?: string }) {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const [data, setData] = React.useState<ChartPoint[]>([]);

  React.useEffect(() => {
    const controller = new AbortController();

    const params = (range: TimeRange) =>
      new URLSearchParams({
        regionId: region.id,
        cropId: crop.id,
        from: range.from,
        to: range.to,
      });

    async function load() {
      try {
        const [historical, projected] = await Promise.all([
          fetch(`/api/climate/historical?${params(HISTORICAL_RANGE)}`, {
            signal: controller.signal,
          }).then((r) => r.json() as Promise<ClimateSeries>),
          fetch(
            `/api/climate/projected?${params(PROJECTED_RANGE)}&scenario=ssp3-7.0`,
            { signal: controller.signal },
          ).then((r) => r.json() as Promise<ClimateSeries>),
        ]);
        const hist = climatology(historical);
        const proj = climatology(projected);
        setData(
          MONTH_LABELS.map((month, i) => ({
            month,
            historical: hist[i],
            projected: proj[i],
          })),
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") setData([]);
      }
    }

    load();
    return () => controller.abort();
  }, [region.id, crop.id]);

  return (
    <ChartShell
      title="Temperatura media · mensual"
      subtitle="Línea base histórica (1991–2020) vs. proyección SSP3-7.0 (2031–2050)"
      data={data}
      kind="area"
      className={className}
    />
  );
}

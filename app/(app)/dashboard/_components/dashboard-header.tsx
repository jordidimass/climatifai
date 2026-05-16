"use client";

import { useSelectionStore } from "@/stores/selection-store";

export function DashboardHeader() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">Resumen</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
          {region.name}{" "}
          <span className="text-muted-foreground/80">·</span>{" "}
          <span className="italic text-foreground/85">{crop.name}</span>
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          {region.summary}
        </p>
      </div>
      <p className="numeric text-xs text-muted-foreground">
        Línea base 1991–2020 · Proyección SSP3-7.0 · 2031–2050
      </p>
    </div>
  );
}

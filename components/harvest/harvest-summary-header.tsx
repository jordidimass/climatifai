"use client";

import { getSowingPreset } from "@/lib/constants/sowing-presets";
import { useSelectionStore } from "@/stores/selection-store";

function formatDate(iso: string) {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Intl.DateTimeFormat("es-419", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(y, m - 1, d));
  } catch {
    return iso;
  }
}

export function HarvestSummaryHeader() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const sowingPresetId = useSelectionStore((s) => s.sowingPresetId);
  const sowingDate = useSelectionStore((s) => s.sowingDate);
  const preset = getSowingPreset(sowingPresetId);

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">Resultado de análisis</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
          {region.name}{" "}
          <span className="text-muted-foreground/80">·</span>{" "}
          <span className="italic text-foreground/85">{crop.name}</span>
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          {region.summary}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Siembra:{" "}
          <span className="numeric font-medium text-foreground">
            {formatDate(sowingDate)}
          </span>
          {preset && (
            <>
              {" "}
              ·{" "}
              <span className="font-medium text-foreground">{preset.label}</span>
            </>
          )}
        </p>
      </div>
      <p className="numeric text-xs text-muted-foreground">
        Línea base 1991–2020 · Proyección SSP3-7.0 · 2031–2050
      </p>
    </div>
  );
}

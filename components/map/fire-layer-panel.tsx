"use client";

import { AlertTriangle, Loader2, Satellite } from "lucide-react";

import { useFireStore } from "@/stores/fire-store";
import type { FirmsSource, HotspotFC } from "@/types/fires";
import { cn } from "@/lib/utils";

const SOURCE_OPTIONS: { id: FirmsSource; label: string; hint: string }[] = [
  { id: "VIIRS_SNPP_NRT", label: "VIIRS · Suomi NPP", hint: "375 m" },
  { id: "VIIRS_NOAA20_NRT", label: "VIIRS · NOAA-20", hint: "375 m" },
  { id: "VIIRS_NOAA21_NRT", label: "VIIRS · NOAA-21", hint: "375 m" },
  { id: "MODIS_NRT", label: "MODIS · Terra/Aqua", hint: "1 km" },
];

interface FireLayerPanelProps {
  currentFC: HotspotFC | null;
  className?: string;
}

export function FireLayerPanel({ currentFC, className }: FireLayerPanelProps) {
  const sources = useFireStore((s) => s.sources);
  const toggleSource = useFireStore((s) => s.toggleSource);
  const opacity = useFireStore((s) => s.opacity);
  const setOpacity = useFireStore((s) => s.setOpacity);
  const error = useFireStore((s) => s.error);
  const loading = useFireStore((s) => s.loading);

  const features = currentFC?.features ?? [];
  const count = features.length;
  const totalFrp = features.reduce(
    (acc, f) => acc + (f.properties?.frp ?? 0),
    0,
  );

  return (
    <div
      className={cn(
        "glass pointer-events-auto flex w-full min-w-0 flex-col gap-3 rounded-xl px-3 py-3 text-xs shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow inline-flex items-center gap-1.5 text-foreground/80">
          <Satellite className="size-3.5" aria-hidden /> Capas
        </span>
        <span className="numeric inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          {loading ? <Loader2 className="size-3 animate-spin" aria-hidden /> : null}
          {count} focos · {totalFrp.toFixed(0)} MW
        </span>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-md border border-risk-bad/40 bg-risk-bad/10 px-2 py-1.5 text-[11px] text-risk-bad">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <div className="space-y-0.5">
            <p className="font-medium">{error.message}</p>
            {error.hint ? (
              <p className="text-[10px] leading-snug text-risk-bad/85">
                {error.hint}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        {SOURCE_OPTIONS.map((opt) => {
          const checked = sources.includes(opt.id);
          const lonely = sources.length === 1 && checked;
          return (
            <label
              key={opt.id}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted/60",
                lonely && "cursor-not-allowed opacity-70",
              )}
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-3.5 accent-[var(--risk-bad)]"
                  checked={checked}
                  disabled={lonely}
                  onChange={() => toggleSource(opt.id)}
                />
                <span className="text-foreground">{opt.label}</span>
              </span>
              <span className="numeric text-[10px] text-muted-foreground">
                {opt.hint}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <span className="eyebrow text-foreground/80">Opacidad</span>
          <span className="numeric text-[10px] text-muted-foreground">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-[var(--risk-bad)]"
          aria-label="Opacidad de capa"
        />
      </div>
    </div>
  );
}

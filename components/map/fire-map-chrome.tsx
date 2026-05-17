"use client";

import * as React from "react";
import Link from "next/link";
import { FileWarning, History, MapPinned, Search, X } from "lucide-react";

import { FireDetailPopover } from "@/components/map/fire-detail-popover";
import { FireHotspotsLayer } from "@/components/map/layers/fire-hotspots-layer";
import { FireLayerPanel } from "@/components/map/fire-layer-panel";
import { FireLegend } from "@/components/map/fire-legend";
import { FireTimeline } from "@/components/map/fire-timeline";
import { RegionMapPanel } from "@/components/map/region-map-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFireStore } from "@/stores/fire-store";
import { useSelectionStore } from "@/stores/selection-store";
import type { HotspotFC } from "@/types/fires";
import { cn } from "@/lib/utils";

type FireMapChromeProps = {
  phase: "browse" | "select";
  className?: string;
};

export function FireMapChrome({ phase, className }: FireMapChromeProps) {
  const [currentFC, setCurrentFC] = React.useState<HotspotFC | null>(null);
  const viewMode = useFireStore((s) => s.viewMode);
  const setViewMode = useFireStore((s) => s.setViewMode);
  const reportOpen = useFireStore((s) => s.reportOpen);
  const setReportOpen = useFireStore((s) => s.setReportOpen);

  // Stable callback so the layer effect that calls `onData(filtered)` doesn't
  // re-run every render.
  const handleData = React.useCallback((fc: HotspotFC) => setCurrentFC(fc), []);

  return (
    <div className={cn("relative flex flex-1 flex-col", className)}>
      <div className="relative min-h-[calc(100svh-3.5rem)] flex-1">
        <RegionMapPanel variant="full">
          <FireHotspotsLayer onData={handleData} />
          <FireDetailPopover />
        </RegionMapPanel>

        <div className="pointer-events-none absolute inset-0 flex flex-col gap-4 p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-end gap-3">
            <div className="pointer-events-auto relative w-full max-w-xs shadow-sm">
              <label className="sr-only" htmlFor="fire-map-search">
                Buscar en el mapa
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="fire-map-search"
                placeholder="Buscar zona…"
                className="h-10 rounded-full bg-card/90 pl-10 shadow-sm backdrop-blur-sm"
                disabled
              />
            </div>
          </div>

          <div className="flex flex-1 items-start justify-end">
            <FireLayerPanel currentFC={currentFC} />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="pointer-events-auto flex flex-col gap-2">
              <FirePrimaryButtons
                phase={phase}
                viewMode={viewMode}
                onReport={() => setReportOpen(true)}
                onToggleHistory={() =>
                  setViewMode(viewMode === "history" ? "live" : "history")
                }
              />
              {phase === "browse" ? (
                <Button
                  type="button"
                  variant="default"
                  className="mt-1 rounded-full shadow-md"
                  asChild
                >
                  <Link href="/mapa-incendios/seleccion">Selector en mapa</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-1 rounded-full bg-card/80 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/mapa-incendios">Vista amplia</Link>
                </Button>
              )}
            </div>

            <div className="pointer-events-auto self-end">
              <FireLegend />
            </div>
          </div>

          {viewMode === "history" ? (
            <div className="pointer-events-none flex justify-center">
              <FireTimeline className="pointer-events-auto w-full max-w-3xl" />
            </div>
          ) : null}
        </div>
      </div>

      <FireReportSheet
        open={reportOpen}
        onOpenChange={setReportOpen}
        currentFC={currentFC}
      />
    </div>
  );
}

function FirePrimaryButtons({
  phase,
  viewMode,
  onReport,
  onToggleHistory,
}: {
  phase: "browse" | "select";
  viewMode: "live" | "history";
  onReport: () => void;
  onToggleHistory: () => void;
}) {
  if (phase === "select") {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          className="glass justify-start gap-2 rounded-full shadow-md"
          onClick={onReport}
        >
          <MapPinned className="size-4" aria-hidden /> Descripción
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="glass justify-start gap-2 rounded-full shadow-md"
          onClick={onReport}
        >
          <FileWarning className="size-4" aria-hidden /> Informe
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="glass justify-start gap-2 rounded-full shadow-md"
        onClick={onReport}
      >
        <FileWarning className="size-4" aria-hidden /> Informe
      </Button>
      <Button
        type="button"
        variant={viewMode === "history" ? "default" : "secondary"}
        className={cn(
          "justify-start gap-2 rounded-full shadow-md",
          viewMode === "history" ? "" : "glass",
        )}
        onClick={onToggleHistory}
      >
        <History className="size-4" aria-hidden />
        {viewMode === "history" ? "Cerrar historial" : "Historial"}
      </Button>
    </>
  );
}

function FireReportSheet({
  open,
  onOpenChange,
  currentFC,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFC: HotspotFC | null;
}) {
  const region = useSelectionStore((s) => s.region);
  const dayRange = useFireStore((s) => s.dayRange);
  const sources = useFireStore((s) => s.sources);

  const features = currentFC?.features ?? [];
  const count = features.length;
  const totalFrp = features.reduce(
    (acc, f) => acc + (f.properties?.frp ?? 0),
    0,
  );
  const peak = features.reduce(
    (acc, f) => Math.max(acc, f.properties?.frp ?? 0),
    0,
  );
  const byConfidence = features.reduce(
    (acc, f) => {
      const k = f.properties?.confidence ?? "nominal";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const lastTs = features.reduce(
    (acc, f) => Math.max(acc, f.properties?.ts ?? 0),
    0,
  );
  const last = lastTs
    ? new Date(lastTs).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      })
    : "—";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between gap-2">
            Informe de incendios
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              aria-label="Cerrar"
              className="rounded-full"
            >
              <X className="size-3.5" aria-hidden />
            </Button>
          </SheetTitle>
          <SheetDescription>
            {region.name} · {region.country} · últimos{" "}
            {dayRange === 1 ? "24 h" : dayRange === 2 ? "48 h" : `${dayRange} d`}
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 px-4">
          <Stat label="Focos detectados" value={count.toString()} />
          <Stat label="FRP total" value={`${totalFrp.toFixed(0)} MW`} />
          <Stat label="Pico FRP" value={`${peak.toFixed(1)} MW`} />
          <Stat label="Último foco" value={last} />
        </div>

        <div className="px-4">
          <p className="eyebrow text-foreground/80">Confianza</p>
          <div className="mt-1 grid grid-cols-3 gap-2 text-center text-xs">
            <Stat label="Baja" value={`${byConfidence.low ?? 0}`} compact />
            <Stat
              label="Nominal"
              value={`${byConfidence.nominal ?? 0}`}
              compact
            />
            <Stat label="Alta" value={`${byConfidence.high ?? 0}`} compact />
          </div>
        </div>

        <div className="px-4">
          <p className="eyebrow text-foreground/80">Fuentes activas</p>
          <ul className="mt-1 flex flex-wrap gap-1 text-[11px]">
            {sources.map((s) => (
              <li
                key={s}
                className="numeric rounded-full border border-border bg-card/60 px-2 py-0.5 text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <p className="px-4 text-[10px] leading-relaxed text-muted-foreground">
          Datos: NASA FIRMS (VIIRS · MODIS NRT). Pase satelital con cobertura
          de hasta ~60 días.
        </p>
      </SheetContent>
    </Sheet>
  );
}

function Stat({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-card/60 px-3 py-2",
        compact && "px-2 py-1",
      )}
    >
      <p className="eyebrow text-foreground/70">{label}</p>
      <p
        className={cn(
          "numeric font-medium text-foreground",
          compact ? "text-sm" : "text-base",
        )}
      >
        {value}
      </p>
    </div>
  );
}

"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, FileWarning, History, Layers, MapPinned, X } from "lucide-react";

import { FireDetailPopover } from "@/components/map/fire-detail-popover";
import { FireMapLink } from "@/components/map/fire-map-link";
import { FireMapZoomToolbar } from "@/components/map/fire-map-zoom-toolbar";
import { FireHotspotsLayer } from "@/components/map/layers/fire-hotspots-layer";
import { FireLayerPanel } from "@/components/map/fire-layer-panel";
import { FireLegend } from "@/components/map/fire-legend";
import { FireSearch } from "@/components/map/fire-search";
import { FireTimeline } from "@/components/map/fire-timeline";
import {
  FireParamsHydrator,
  FireUrlMirror,
} from "@/components/map/fire-url-sync";
import { RegionFocusCard } from "@/components/map/region-focus-card";
import { RegionMapPanel } from "@/components/map/region-map-panel";
import { Button } from "@/components/ui/button";
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
import type mapboxgl from "mapbox-gl";

type FireMapChromeProps = {
  phase: "browse" | "select";
  className?: string;
};

export function FireMapChrome({ phase, className }: FireMapChromeProps) {
  const [currentFC, setCurrentFC] = React.useState<HotspotFC | null>(null);
  const [mapbox, setMapbox] = React.useState<mapboxgl.Map | null>(null);
  const [layerOpen, setLayerOpen] = React.useState(false);
  const viewMode = useFireStore((s) => s.viewMode);
  const setViewMode = useFireStore((s) => s.setViewMode);
  const reportOpen = useFireStore((s) => s.reportOpen);
  const setReportOpen = useFireStore((s) => s.setReportOpen);

  const handleData = React.useCallback((fc: HotspotFC) => {
    setCurrentFC((prev) => (prev === fc ? prev : fc));
  }, []);

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
      <FireParamsHydrator />
      <FireUrlMirror />
      <div className="relative min-h-0 flex-1">
        <RegionMapPanel variant="full" onMapboxReady={setMapbox}>
          <FireHotspotsLayer onData={handleData} />
          <FireDetailPopover />
        </RegionMapPanel>

        <div className="pointer-events-none absolute inset-0 flex flex-col gap-3 fire-map-chrome-overlay md:gap-4">
          <div className="flex shrink-0 justify-end">
            <div className="pointer-events-auto flex max-h-[min(420px,42svh)] w-full max-w-xs min-w-0 flex-col gap-3 overflow-y-auto overscroll-contain">
              <FireSearch className="max-w-none" />
              <button
                type="button"
                onClick={() => setLayerOpen((o) => !o)}
                className="md:hidden flex items-center justify-between gap-2 rounded-xl bg-card/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm"
              >
                <span className="eyebrow flex items-center gap-1.5 text-foreground/80">
                  <Layers className="size-3.5" aria-hidden /> Capas satelitales
                </span>
                {layerOpen ? (
                  <ChevronUp className="size-3.5 text-muted-foreground" aria-hidden />
                ) : (
                  <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
                )}
              </button>
              <div className={cn("md:block", layerOpen ? "block" : "hidden")}>
                <FireLayerPanel currentFC={currentFC} />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1" aria-hidden />

          <div className="flex w-full shrink-0 flex-col gap-4 xl:flex-row xl:items-end xl:gap-x-4">
            {viewMode === "history" ? (
              <div className="flex justify-center xl:order-2 xl:min-w-0 xl:flex-1 xl:justify-center xl:self-end xl:px-2">
                <FireTimeline className="pointer-events-auto w-full max-w-3xl" />
              </div>
            ) : (
              <div
                className="hidden min-h-0 xl:order-2 xl:block xl:min-w-0 xl:flex-1"
                aria-hidden
              />
            )}
            <div className="flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-4 xl:contents">
              <div className="pointer-events-auto flex min-w-0 max-w-[min(100%,22rem)] flex-col-reverse items-start gap-3 xl:order-1 xl:shrink-0">
                <RegionFocusCard />
                {phase === "browse" ? (
                  <Button
                    type="button"
                    variant="default"
                    className="w-fit rounded-full shadow-md"
                    asChild
                  >
                    <FireMapLink pathname="/fires/select">
                      Selector en mapa
                    </FireMapLink>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-fit rounded-full bg-card/80 backdrop-blur-sm"
                    asChild
                  >
                    <FireMapLink pathname="/fires">
                      Vista amplia
                    </FireMapLink>
                  </Button>
                )}
                <div className="flex flex-col gap-2">
                  <FirePrimaryButtons
                    phase={phase}
                    viewMode={viewMode}
                    onReport={() => setReportOpen(true)}
                    onToggleHistory={() =>
                      setViewMode(viewMode === "history" ? "live" : "history")
                    }
                  />
                </div>
              </div>

              <div className="pointer-events-auto flex shrink-0 items-end gap-3 xl:order-3 xl:shrink-0">
                <FireMapZoomToolbar map={mapbox} />
                <div className="hidden md:block">
                  <FireLegend />
                </div>
              </div>
            </div>
          </div>
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
          <MapPinned className="size-4" aria-hidden />
          <span className="hidden sm:inline">Descripción</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="glass justify-start gap-2 rounded-full shadow-md"
          onClick={onReport}
        >
          <FileWarning className="size-4" aria-hidden />
          <span className="hidden sm:inline">Informe</span>
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
        <FileWarning className="size-4" aria-hidden />
        <span className="hidden sm:inline">Informe</span>
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
        <span className="hidden sm:inline">
          {viewMode === "history" ? "Cerrar historial" : "Historial"}
        </span>
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

"use client";

import type mapboxgl from "mapbox-gl";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type FireMapZoomToolbarProps = {
  map: mapboxgl.Map | null;
  className?: string;
};

const BTN =
  "flex size-10 items-center justify-center text-foreground transition-colors hover:bg-accent/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

export function FireMapZoomToolbar({ map, className }: FireMapZoomToolbarProps) {
  return (
    <div
      className={cn(
        "glass flex flex-col overflow-hidden rounded-xl shadow-md ring-1 ring-border/55 backdrop-blur-xl",
        className,
      )}
      role="group"
      aria-label="Zoom del mapa"
    >
      <button
        type="button"
        className={BTN}
        aria-label="Acercar"
        disabled={!map}
        onClick={() => map?.zoomIn({ duration: 220 })}
      >
        <Plus className="size-4" strokeWidth={2.25} aria-hidden />
      </button>
      <div className="h-px bg-border/60" aria-hidden />
      <button
        type="button"
        className={BTN}
        aria-label="Alejar"
        disabled={!map}
        onClick={() => map?.zoomOut({ duration: 220 })}
      >
        <Minus className="size-4" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}

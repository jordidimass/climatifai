"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Map as MapIcon } from "lucide-react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { useSelectionStore } from "@/stores/selection-store";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * Climatifai basemap. We use Mapbox Standard (v3) and switch its
 * `lightPreset` via `setConfigProperty` on load so day/night follow the
 * app theme. To swap in a fully bespoke Studio style aligned with the
 * bone/indigo palette later, replace the two URLs below with
 * `mapbox://styles/<user>/<style-id>`.
 */
const STYLES = {
  light: "mapbox://styles/mapbox/standard",
  dark: "mapbox://styles/mapbox/standard",
} as const;

const LIGHT_PRESETS = {
  light: "day",
  dark: "night",
} as const;

const shellClass = {
  rounded:
    "glass relative h-full min-h-[420px] overflow-hidden rounded-xl",
  full: "relative h-full min-h-[420px] overflow-hidden rounded-none border-y border-border/40 bg-muted/15 md:border-x-0",
} as const;

interface RegionMapProps {
  variant?: keyof typeof shellClass;
  /** Mapbox <Source>/<Layer> overlays composed on top of the basemap. */
  children?: React.ReactNode;
}

export function RegionMap({ variant = "rounded", children }: RegionMapProps) {
  const region = useSelectionStore((s) => s.region);
  const { resolvedTheme } = useTheme();

  if (!TOKEN) return <MapPlaceholder variant={variant} />;

  const styleKey: keyof typeof STYLES =
    resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className={shellClass[variant]}>
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={{
          longitude: region.center.lng,
          latitude: region.center.lat,
          zoom: region.zoom,
        }}
        // Force the map to recenter when the selected region changes.
        key={`${region.id}-${styleKey}`}
        mapStyle={STYLES[styleKey]}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onLoad={(e) => {
          const map = e.target;
          try {
            map.setConfigProperty(
              "basemap",
              "lightPreset",
              LIGHT_PRESETS[styleKey],
            );
          } catch {
            /* style does not expose `basemap` config — Studio styles may differ */
          }
        }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Marker
          longitude={region.center.lng}
          latitude={region.center.lat}
          anchor="center"
        >
          <span
            className="block size-3 rounded-full ring-4 ring-primary/30"
            style={{ background: "var(--primary)" }}
            aria-hidden="true"
          />
        </Marker>
        {children}
      </Map>
      <RegionTag />
    </div>
  );
}

function RegionTag() {
  const region = useSelectionStore((s) => s.region);
  return (
    <div className="glass pointer-events-none absolute bottom-3 left-3 max-w-xs rounded-lg px-3 py-2 text-xs">
      <p className="eyebrow">Área de enfoque</p>
      <p className="mt-0.5 font-medium text-foreground">
        {region.name}
        <span className="text-muted-foreground"> · {region.country}</span>
      </p>
      <p className="numeric mt-0.5 text-[10px] text-muted-foreground">
        {region.center.lat.toFixed(2)}°, {region.center.lng.toFixed(2)}°
      </p>
    </div>
  );
}

function MapPlaceholder({
  variant = "rounded",
}: {
  variant?: keyof typeof shellClass;
}) {
  return (
    <div
      className={`relative flex h-full min-h-[420px] flex-col items-center justify-center gap-3 overflow-hidden px-8 text-center ${
        variant === "rounded"
          ? "glass rounded-xl"
          : "rounded-none border-y border-border/40 bg-muted/15 md:border-x-0"
      }`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in oklch, var(--primary) 8%, transparent) 0 1px, transparent 1px 18px), repeating-linear-gradient(-45deg, color-mix(in oklch, var(--primary) 6%, transparent) 0 1px, transparent 1px 22px)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <MapIcon className="size-5" aria-hidden="true" />
        </span>
        <p className="eyebrow">Mapa desactivado</p>
        <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight">
          Agrega un token de Mapbox para activarlo.
        </h3>
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          Configura{" "}
          <code className="numeric rounded bg-muted px-1.5 py-0.5">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{" "}
          en <code className="numeric">.env.local</code> con un token gratis de{" "}
          <span className="numeric">mapbox.com</span> y recarga: el mapa de la
          región reemplazará este marcador.
        </p>
      </div>
    </div>
  );
}

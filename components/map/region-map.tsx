"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Map as MapIcon } from "lucide-react";
import Map, {
  Marker,
  NavigationControl,
  type MapRef,
} from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import { toast } from "sonner";

import { RegionFocusCard } from "@/components/map/region-focus-card";
import { useSelectionStore } from "@/stores/selection-store";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (TOKEN && typeof window !== "undefined") {

  mapboxgl.accessToken = TOKEN;
}

const STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
} as const;

const shellClass = {
  rounded:
    "glass relative h-[480px] w-full overflow-hidden rounded-xl",
  full: "relative h-[calc(100svh-3.5rem)] w-full overflow-hidden rounded-none border-y border-border/40 bg-muted/15 md:border-x-0",
} as const;

type Phase =
  | "pending"
  | "no-webgl"
  | "init"
  | "style-loaded"
  | "rendered"
  | "error";

function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

interface RegionMapProps {
  variant?: keyof typeof shellClass;

  children?: React.ReactNode;

  onMapboxReady?: (map: mapboxgl.Map) => void;
}

export function RegionMap({
  variant = "rounded",
  children,
  onMapboxReady,
}: RegionMapProps) {
  const region = useSelectionStore((s) => s.region);
  const customLocation = useSelectionStore((s) => s.customLocation);
  const { resolvedTheme } = useTheme();
  const mapRef = React.useRef<MapRef | null>(null);
  const [phase, setPhase] = React.useState<Phase>(() => {
    if (typeof window === "undefined") return "pending";
    return hasWebGL() ? "init" : "no-webgl";
  });
  const [errMsg, setErrMsg] = React.useState<string | null>(null);

  const focus = customLocation
    ? {
        lat: customLocation.lat,
        lng: customLocation.lng,
        zoom: 9,
      }
    : {
        lat: region.center.lat,
        lng: region.center.lng,
        zoom: region.zoom,
      };

  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.flyTo({
      center: [focus.lng, focus.lat],
      zoom: focus.zoom,
      essential: true,
      duration: 800,
    });
  }, [focus.lng, focus.lat, focus.zoom]);

  if (!TOKEN) return <MapPlaceholder variant={variant} />;

  const styleKey: keyof typeof STYLES =
    resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className={shellClass[variant]}>
      <Map
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={{
          longitude: focus.lng,
          latitude: focus.lat,
          zoom: focus.zoom,
        }}
        mapStyle={STYLES[styleKey]}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onLoad={(e) => {
          const map = e.target;
          setPhase("style-loaded");
          requestAnimationFrame(() => map.resize());
          onMapboxReady?.(map);

          map.on("error", (ev) => {
            const err = (ev as { error?: { message?: string; status?: number } })
              .error;
            const msg = err?.message
              ? `${err.message}${err.status ? ` (${err.status})` : ""}`
              : "Tile error";
            console.error("[mapbox tile]", err ?? ev);
            setErrMsg(msg);
            setPhase("error");
            toast.error("Mapa · tesela", { description: msg });
          });
        }}
        onIdle={() => {
          setPhase((p) => (p === "style-loaded" ? "rendered" : p));
        }}
        onError={(e) => {
          const msg = e?.error?.message ?? "Mapbox error";
          setPhase("error");
          setErrMsg(msg);
          console.error("[mapbox]", e?.error ?? e);
          toast.error("Mapa", { description: msg });
        }}
      >
        {variant !== "full" ? (
          <NavigationControl position="top-right" showCompass={false} />
        ) : null}
        <Marker longitude={focus.lng} latitude={focus.lat} anchor="center">
          <span
            className="block size-3 rounded-full ring-4 ring-primary/30"
            style={{ background: "var(--primary)" }}
            aria-hidden="true"
          />
        </Marker>
        {children}
      </Map>
      {variant !== "full" ? (
        <RegionFocusCard className="absolute bottom-3 left-3 max-w-xs" />
      ) : null}
      <MapPhasePill phase={phase} err={errMsg} />
    </div>
  );
}

function MapPhasePill({ phase, err }: { phase: Phase; err: string | null }) {
  if (phase === "rendered") return null;

  const meta: Record<Phase, { label: string; tone: string }> = {
    pending: {
      label: "Inicializando…",
      tone: "bg-muted/80 text-muted-foreground border-border",
    },
    "no-webgl": {
      label: "WebGL no disponible en este navegador",
      tone: "bg-risk-bad/20 text-risk-bad border-risk-bad/40",
    },
    init: {
      label: "Cargando estilo…",
      tone: "bg-muted/80 text-muted-foreground border-border",
    },
    "style-loaded": {
      label: "Pintando teselas…",
      tone: "bg-muted/80 text-muted-foreground border-border",
    },
    rendered: { label: "", tone: "" },
    error: {
      label: err ? `Mapa · ${err}` : "Mapa · error",
      tone: "bg-risk-bad/20 text-risk-bad border-risk-bad/40",
    },
  };

  const { label, tone } = meta[phase];

  return (
    <div
      className={`absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full border px-2.5 py-1 text-[10px] font-medium ${tone}`}
      role="status"
    >
      {label}
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

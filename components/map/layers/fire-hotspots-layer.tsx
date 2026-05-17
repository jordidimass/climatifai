"use client";

import * as React from "react";
import { Layer, Source, useMap } from "react-map-gl/mapbox";

import { useFireStore } from "@/stores/fire-store";
import { useSelectionStore } from "@/stores/selection-store";
import type { HotspotFC, HotspotFeature } from "@/types/fires";

const EMPTY_FC: HotspotFC = { type: "FeatureCollection", features: [] };

const HEATMAP_ID = "climatifai-fires-heatmap";
const CIRCLE_ID = "climatifai-fires-circle";
const HIT_ID = "climatifai-fires-hit";

const CONFIDENCE_COLOR = {
  low: "#f3b03b",
  nominal: "#dd6b2b",
  high: "#9c2a14",
} as const;

interface FireHotspotsLayerProps {

  onData?: (fc: HotspotFC) => void;
}

export function FireHotspotsLayer({ onData }: FireHotspotsLayerProps) {
  const region = useSelectionStore((s) => s.region);
  const customLocation = useSelectionStore((s) => s.customLocation);
  const dayRange = useFireStore((s) => s.dayRange);
  const sources = useFireStore((s) => s.sources);
  const playhead = useFireStore((s) => s.playhead);
  const windowHours = useFireStore((s) => s.windowHours);
  const opacity = useFireStore((s) => s.opacity);
  const setDataSpan = useFireStore((s) => s.setDataSpan);
  const selectHotspot = useFireStore((s) => s.selectHotspot);
  const setError = useFireStore((s) => s.setError);
  const setLoading = useFireStore((s) => s.setLoading);

  const { current: map } = useMap();

  const [allFeatures, setAllFeatures] = React.useState<HotspotFeature[]>([]);

  const center = customLocation
    ? { lat: customLocation.lat, lng: customLocation.lng }
    : { lat: region.center.lat, lng: region.center.lng };
  const zoom = customLocation ? 9 : region.zoom;
  const padDeg = clampNumber(256 / 2 ** zoom, 2, 5);
  const bbox = `${(center.lng - padDeg).toFixed(4)},${(
    center.lat - padDeg
  ).toFixed(4)},${(center.lng + padDeg).toFixed(4)},${(
    center.lat + padDeg
  ).toFixed(4)}`;
  const sourcesKey = [...sources].sort().join(",");

  React.useEffect(() => {
    if (!sources.length) {
      return;
    }
    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams({
      bbox,
      dayRange: String(dayRange),
      sources: sourcesKey,
    });

    fetch(`/api/fires/hotspots?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = (await r
            .json()
            .catch(() => ({}))) as { error?: string; hint?: string };
          const err = new Error(body.error ?? `HTTP ${r.status}`) as Error & {
            hint?: string;
          };
          err.hint = body.hint;
          throw err;
        }
        return (await r.json()) as HotspotFC;
      })
      .then((fc) => {
        if (controller.signal.aborted) return;
        setError(null);
        setAllFeatures(fc.features ?? []);
        if (fc.features?.length) {
          const tss = fc.features.map((f) => f.properties.ts).filter(Boolean);
          if (tss.length) {
            setDataSpan({ from: Math.min(...tss), to: Math.max(...tss) });
          } else {
            setDataSpan(null);
          }
        } else {
          setDataSpan(null);
        }
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("[fire-hotspots-layer] fetch failed", err);
        setAllFeatures([]);
        setDataSpan(null);
        setError({
          message: err?.message ?? "Error al consultar FIRMS",
          hint: (err as { hint?: string })?.hint,
        });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [bbox, dayRange, sourcesKey, sources.length, setDataSpan, setError, setLoading]);

  const filtered: HotspotFC = React.useMemo(() => {
    if (!sources.length || !allFeatures.length) return EMPTY_FC;
    if (playhead == null) {
      return { type: "FeatureCollection", features: allFeatures };
    }
    const half = windowHours * 3600 * 1000;
    const features = allFeatures.filter(
      (f) =>
        f.properties.ts >= playhead - half &&
        f.properties.ts <= playhead + half,
    );
    return { type: "FeatureCollection", features };
  }, [allFeatures, playhead, sources.length, windowHours]);

  const onDataRef = React.useRef(onData);
  React.useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);
  const lastSentRef = React.useRef<HotspotFC | null>(null);

  React.useEffect(() => {
    const cb = onDataRef.current;
    if (!cb) return;
    const prev = lastSentRef.current;
    if (
      prev &&
      prev.type === filtered.type &&
      prev.features === filtered.features
    ) {
      return;
    }
    lastSentRef.current = filtered;
    cb(filtered);
  }, [filtered]);

  React.useEffect(() => {
    const m = map?.getMap();
    if (!m) return;
    const handler = (e: mapboxgl.MapMouseEvent & { features?: GeoJSON.Feature[] }) => {
      const f = e.features?.[0] as HotspotFeature | undefined;
      if (f) selectHotspot(f);
    };
    const enter = () => {
      m.getCanvas().style.cursor = "pointer";
    };
    const leave = () => {
      m.getCanvas().style.cursor = "";
    };
    m.on("click", HIT_ID, handler);
    m.on("mouseenter", HIT_ID, enter);
    m.on("mouseleave", HIT_ID, leave);
    return () => {
      m.off("click", HIT_ID, handler);
      m.off("mouseenter", HIT_ID, enter);
      m.off("mouseleave", HIT_ID, leave);
    };
  }, [map, selectHotspot]);

  return (
    <Source id="climatifai-fires-src" type="geojson" data={filtered}>
      <Layer
        id={HEATMAP_ID}
        type="heatmap"
        maxzoom={9}
        paint={{
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "frp"],
            0,
            0.1,
            5,
            0.4,
            30,
            0.8,
            120,
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0.5,
            9,
            2.4,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.2,
            "rgba(243,176,59,0.55)",
            0.45,
            "rgba(221,107,43,0.75)",
            0.7,
            "rgba(198,74,44,0.85)",
            1,
            "rgba(120,20,8,0.95)",
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            4,
            5,
            12,
            9,
            22,
          ],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            opacity,
            9,
            0,
          ],
        }}
      />
      <Layer
        id={CIRCLE_ID}
        type="circle"
        minzoom={7}
        paint={{
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "frp"],
            0,
            3,
            10,
            5,
            50,
            9,
            200,
            16,
          ],
          "circle-color": [
            "match",
            ["get", "confidence"],
            "low",
            CONFIDENCE_COLOR.low,
            "high",
            CONFIDENCE_COLOR.high,
            CONFIDENCE_COLOR.nominal,
          ],
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            0,
            9,
            opacity,
          ],
          "circle-stroke-color": "#1a0a06",
          "circle-stroke-width": 0.6,
          "circle-stroke-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            0,
            9,
            0.5,
          ],
        }}
      />
      <Layer
        id={HIT_ID}
        type="circle"
        paint={{
          "circle-radius": 14,
          "circle-color": "#000",
          "circle-opacity": 0,
        }}
      />
    </Source>
  );
}

function clampNumber(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

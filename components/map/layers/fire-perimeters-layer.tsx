"use client";

import { Layer, Source } from "react-map-gl/mapbox";

/**
 * Renders fire perimeter polygons as a fill + outline pair. Default data
 * is an empty FeatureCollection so the layer is safe to mount before a
 * provider is wired (NASA FIRMS / EFFIS / SENTINEL). Pass `data` once a
 * provider is available.
 */

type PolygonFC = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

const EMPTY_FC: PolygonFC = {
  type: "FeatureCollection",
  features: [],
};

interface FirePerimetersLayerProps {
  data?: PolygonFC;
}

export function FirePerimetersLayer({ data = EMPTY_FC }: FirePerimetersLayerProps) {
  return (
    <Source id="climatifai-fires" type="geojson" data={data}>
      <Layer
        id="climatifai-fires-fill"
        type="fill"
        paint={{
          "fill-color": "#c64a2c",
          "fill-opacity": 0.22,
        }}
      />
      <Layer
        id="climatifai-fires-line"
        type="line"
        paint={{
          "line-color": "#9c3a23",
          "line-width": 1.5,
          "line-opacity": 0.85,
        }}
      />
    </Source>
  );
}

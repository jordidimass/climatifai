"use client";

import * as React from "react";
import { Layer, Source } from "react-map-gl/mapbox";

import { REGIONS } from "@/lib/api/regions";
import { useSelectionStore } from "@/stores/selection-store";
import type {
  CropSuitabilityResponse,
  CropSuitabilityStatus,
} from "@/types/agri";

type PointFeature<P extends GeoJSON.GeoJsonProperties> = GeoJSON.Feature<GeoJSON.Point, P>;
type PointFC<P extends GeoJSON.GeoJsonProperties> = GeoJSON.FeatureCollection<GeoJSON.Point, P>;

const STATUS_COLOR: Record<CropSuitabilityStatus, string> = {
  suitable: "#3a9d5b",
  moderate: "#d0a13c",
  risky: "#c64a2c",
  not_recommended: "#9c3a23",
  unknown: "#94918a",
};

interface RegionFeatureProps {
  regionId: string;
  status: CropSuitabilityStatus;
}

const EMPTY_FC: PointFC<RegionFeatureProps> = {
  type: "FeatureCollection",
  features: [],
};

export function RiskCirclesLayer() {
  const cropId = useSelectionStore((s) => s.crop.id);
  const [statuses, setStatuses] = React.useState<Record<string, CropSuitabilityStatus>>({});

  React.useEffect(() => {
    const controller = new AbortController();
    const next: Record<string, CropSuitabilityStatus> = {};

    Promise.all(
      REGIONS.map((region) =>
        fetch("/api/agri/suitability", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            location: {
              lat: region.center.lat,
              lng: region.center.lng,
              label: `${region.name}, ${region.country}`,
              regionId: region.id,
            },
            cropIds: [cropId],
          }),
          signal: controller.signal,
        })
          .then((r) => (r.ok ? (r.json() as Promise<CropSuitabilityResponse>) : null))
          .then((json) => {
            const status = json?.crops?.[0]?.status ?? "unknown";
            next[region.id] = status;
          })
          .catch(() => {
            next[region.id] = "unknown";
          }),
      ),
    ).then(() => {
      if (!controller.signal.aborted) setStatuses(next);
    });

    return () => controller.abort();
  }, [cropId]);

  const data: PointFC<RegionFeatureProps> = React.useMemo(() => {
    if (!Object.keys(statuses).length) return EMPTY_FC;
    const features: PointFeature<RegionFeatureProps>[] = REGIONS.map((region) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [region.center.lng, region.center.lat],
      },
      properties: {
        regionId: region.id,
        status: statuses[region.id] ?? "unknown",
      },
    }));
    return { type: "FeatureCollection", features };
  }, [statuses]);

  return (
    <Source id="climatifai-risk" type="geojson" data={data}>
      <Layer
        id="climatifai-risk-halo"
        type="circle"
        paint={{
          "circle-radius": 22,
          "circle-color": [
            "match",
            ["get", "status"],
            "suitable",
            STATUS_COLOR.suitable,
            "moderate",
            STATUS_COLOR.moderate,
            "risky",
            STATUS_COLOR.risky,
            "not_recommended",
            STATUS_COLOR.not_recommended,
            STATUS_COLOR.unknown,
          ],
          "circle-opacity": 0.18,
          "circle-blur": 0.6,
        }}
      />
      <Layer
        id="climatifai-risk-core"
        type="circle"
        paint={{
          "circle-radius": 7,
          "circle-color": [
            "match",
            ["get", "status"],
            "suitable",
            STATUS_COLOR.suitable,
            "moderate",
            STATUS_COLOR.moderate,
            "risky",
            STATUS_COLOR.risky,
            "not_recommended",
            STATUS_COLOR.not_recommended,
            STATUS_COLOR.unknown,
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.5,
          "circle-opacity": 0.95,
        }}
      />
    </Source>
  );
}

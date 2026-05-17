"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type mapboxgl from "mapbox-gl";

const RegionMap = dynamic(
  () => import("@/components/map/region-map").then((m) => m.RegionMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

interface RegionMapPanelProps {
  variant?: "rounded" | "full";

  children?: React.ReactNode;
  onMapboxReady?: (map: mapboxgl.Map) => void;
}

export function RegionMapPanel({
  variant = "rounded",
  children,
  onMapboxReady,
}: RegionMapPanelProps) {
  return (
    <RegionMap variant={variant} onMapboxReady={onMapboxReady}>
      {children}
    </RegionMap>
  );
}

function MapSkeleton() {
  return (
    <div className="glass relative h-full min-h-[420px] animate-pulse rounded-xl" />
  );
}

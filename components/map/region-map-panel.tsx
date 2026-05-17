"use client";

import * as React from "react";
import dynamic from "next/dynamic";

/**
 * The map ships Mapbox GL JS (DOM-only) so we render it client-only.
 */
const RegionMap = dynamic(
  () => import("@/components/map/region-map").then((m) => m.RegionMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

interface RegionMapPanelProps {
  variant?: "rounded" | "full";
  /** Mapbox layer overlays composed on top of the basemap. */
  children?: React.ReactNode;
}

export function RegionMapPanel({
  variant = "rounded",
  children,
}: RegionMapPanelProps) {
  return <RegionMap variant={variant}>{children}</RegionMap>;
}

function MapSkeleton() {
  return (
    <div className="glass relative h-full min-h-[420px] animate-pulse rounded-xl" />
  );
}

"use client";

import dynamic from "next/dynamic";

/**
 * The map ships Mapbox GL JS (DOM-only) so we render it client-only.
 */
const RegionMap = dynamic(
  () => import("@/components/map/region-map").then((m) => m.RegionMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

export function RegionMapPanel({
  variant = "rounded",
}: {
  variant?: "rounded" | "full";
}) {
  return <RegionMap variant={variant} />;
}

function MapSkeleton() {
  return (
    <div className="glass relative h-full min-h-[420px] animate-pulse rounded-xl" />
  );
}

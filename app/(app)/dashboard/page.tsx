import dynamic from "next/dynamic";

import { ChartShell } from "@/components/data/chart-shell";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardStats } from "./_components/dashboard-stats";

/**
 * The map ships Mapbox GL JS (DOM-only) so we render it client-only.
 */
const RegionMap = dynamic(
  () => import("@/components/map/region-map").then((m) => m.RegionMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

const SAMPLE_SERIES = [
  { month: "Jan", historical: 6.4, projected: 7.1 },
  { month: "Feb", historical: 7.8, projected: 8.6 },
  { month: "Mar", historical: 10.5, projected: 11.4 },
  { month: "Apr", historical: 13.2, projected: 14.6 },
  { month: "May", historical: 17.1, projected: 18.9 },
  { month: "Jun", historical: 21.6, projected: 23.8 },
  { month: "Jul", historical: 24.4, projected: 27.0 },
  { month: "Aug", historical: 24.1, projected: 26.7 },
  { month: "Sep", historical: 20.7, projected: 22.5 },
  { month: "Oct", historical: 16.3, projected: 17.4 },
  { month: "Nov", historical: 10.8, projected: 11.7 },
  { month: "Dec", historical: 7.2, projected: 8.0 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <DashboardStats />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RegionMap />
        <ChartShell
          title="Mean temperature · monthly"
          subtitle="Historical baseline (1991–2020) vs. SSP3-7.0 projection (2031–2050)"
          data={SAMPLE_SERIES}
          kind="area"
          className="h-full"
        />
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="glass relative h-full min-h-[420px] animate-pulse rounded-xl" />
  );
}

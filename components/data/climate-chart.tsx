"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ClimateComparisonMonthRow } from "@/types/climate";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CMIP6_NOTE =
  "Proyección: ensemble EC_Earth3P_HR + MPI_ESM1_2_XR + CMCC_CM2_VHR4 (CMIP6). Resolución regional ~50 km.";

const COL = {
  historical: "#22c55e",
  actual: "#3b82f6",
  projected: "#ea580c",
} as const;

type TabId = "temp" | "precip" | "soil";

export interface ClimateChartProps {
  /** Contrato cercano al futuro `/agri/climate` (`ClimateComparison`). */
  data: ClimateComparisonMonthRow[];
  cropName: string;
  compact?: boolean;
}

type FlatRow = {
  month: string;
  historical: number;
  actual: number | null;
  projected: number;
};

function flattenRows(rows: ClimateComparisonMonthRow[], tab: TabId): FlatRow[] {
  return rows.map((r) => ({
    month: r.monthLabel,
    historical:
      tab === "temp"
        ? r.temperature.historical
        : tab === "precip"
          ? r.precipitation.historical
          : r.soilMoisture.historical,
    actual:
      tab === "temp"
        ? r.temperature.actual
        : tab === "precip"
          ? r.precipitation.actual
          : r.soilMoisture.actual,
    projected:
      tab === "temp"
        ? r.temperature.projected
        : tab === "precip"
          ? r.precipitation.projected
          : r.soilMoisture.projected,
  }));
}

function optimalBandForTab(rows: ClimateComparisonMonthRow[], tab: TabId): [
  number,
  number,
] {
  const r = rows[0]!;
  if (tab === "temp") return [r.optimalTemp.min, r.optimalTemp.max];
  if (tab === "precip")
    return [r.optimalPrecipMmMonthly.min, r.optimalPrecipMmMonthly.max];
  return [r.optimalSoilMoisture.min, r.optimalSoilMoisture.max];
}

function numericDomain(series: FlatRow[], yOpt1: number, yOpt2: number): [number, number] {
  const vals: number[] = [];
  for (const p of series) {
    vals.push(p.historical, p.projected);
    if (p.actual !== null && Number.isFinite(p.actual)) vals.push(p.actual);
  }
  vals.push(yOpt1, yOpt2);
  const finite = vals.filter((v) => Number.isFinite(v));
  const lo = Math.min(...finite);
  const hi = Math.max(...finite);
  const pad = (hi - lo) * 0.08 || Math.abs(lo) * 0.05 || 0.05;
  return [lo - pad, hi + pad];
}

function formatVal(tab: TabId, v: number): string {
  if (tab === "temp") return `${v.toFixed(1)} °C`;
  if (tab === "precip") return `${Math.round(v)} mm`;
  return `${v.toFixed(4)} m³/m³`;
}

function deviationPct(actual: number | null, hist: number): string | null {
  if (actual === null || !Number.isFinite(hist) || hist === 0) return null;
  const p = ((actual - hist) / Math.abs(hist)) * 100;
  return `${p >= 0 ? "+" : ""}${p.toFixed(1)} %`;
}

function ChartLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="size-2.5 shrink-0 rounded-sm"
          style={{ backgroundColor: COL.historical, opacity: 0.85 }}
          aria-hidden
        />
        Histórico
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-0.5 w-4 shrink-0 rounded-full" style={{ backgroundColor: COL.actual }} aria-hidden />
        Actual
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width={16} height={6} aria-hidden className="shrink-0">
          <line
            x1={0}
            y1={3}
            x2={16}
            y2={3}
            stroke={COL.projected}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        </svg>
        Proyectado CMIP6
      </span>
    </div>
  );
}

function ChartTooltip(props: {
  active?: boolean;
  payload?: readonly { payload?: FlatRow }[];
  tab: TabId;
}) {
  const { active, payload, tab } = props;
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const dh = deviationPct(d.actual, d.historical);
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg">
      <p className="mb-2 font-semibold text-foreground">{d.month}</p>
      <ul className="space-y-1.5 tabular-nums">
        <li className="flex justify-between gap-6">
          <span style={{ color: COL.historical }}>Histórico</span>
          <span>{formatVal(tab, d.historical)}</span>
        </li>
        <li className="flex flex-wrap justify-between gap-x-6 gap-y-1">
          <span style={{ color: COL.actual }}>Actual</span>
          <span className="text-right">
            {d.actual !== null ? formatVal(tab, d.actual) : "—"}
            {" · "}
            <span className="text-muted-foreground">
              Δ vs hist.: {dh ?? (d.actual === null ? "mes futuro" : "n/d")}
            </span>
          </span>
        </li>
        <li className="flex justify-between gap-6">
          <span style={{ color: COL.projected }}>CMIP6</span>
          <span>{formatVal(tab, d.projected)}</span>
        </li>
      </ul>
    </div>
  );
}

function SeriesChart({
  series,
  optimal,
  tab,
  compact,
}: {
  series: FlatRow[];
  optimal: [number, number];
  tab: TabId;
  compact?: boolean;
}) {
  const subscribe = React.useCallback(() => () => {}, []);
  const mounted = React.useSyncExternalStore(subscribe, () => true, () => false);
  const [yOptMin, yOptMax] =
    optimal[0] <= optimal[1] ? optimal : [optimal[1], optimal[0]];
  const yDomain = React.useMemo(
    () => numericDomain(series, yOptMin, yOptMax),
    [series, yOptMin, yOptMax],
  );
  const hPx = compact ? 220 : 280;
  const gradId = React.useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "w-full",
        !mounted && "min-h-[200px] animate-pulse rounded-lg bg-muted/30",
      )}
    >
      {mounted ? (
        <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0">
          <div className="sm:min-w-0" style={{ minHeight: hPx, minWidth: 560 }}>
            <ResponsiveContainer width="100%" height={hPx}>
                <AreaChart
                  data={series}
                  margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
                >
                  <defs>
                    <linearGradient id={`cl-h-${gradId}`} x1={0} y1={0} x2={0} y2={1}>
                      <stop
                        offset="0%"
                        stopColor={COL.historical}
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="100%"
                        stopColor={COL.historical}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <ReferenceArea
                    y1={yOptMin}
                    y2={yOptMax}
                    fill={COL.historical}
                    fillOpacity={0.085}
                    strokeOpacity={0}
                    ifOverflow="extendDomain"
                  />
                  <CartesianGrid
                    stroke="var(--border)"
                    strokeDasharray="4 6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={yDomain}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    width={46}
                    tickFormatter={(v) =>
                      tab === "soil"
                        ? v.toFixed(2)
                        : tab === "precip"
                          ? String(Math.round(v))
                          : v.toFixed(0)
                    }
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--ring)", strokeOpacity: 0.45 }}
                    content={(tooltipProps) => (
                      <ChartTooltip
                        active={tooltipProps.active}
                        payload={tooltipProps.payload as readonly { payload?: FlatRow }[]}
                        tab={tab}
                      />
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="historical"
                    name="Histórico"
                    stroke={COL.historical}
                    strokeWidth={2}
                    fill={`url(#cl-h-${gradId})`}
                    fillOpacity={1}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke={COL.actual}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    name="CMIP6"
                    stroke={COL.projected}
                    strokeWidth={2}
                    strokeDasharray="6 5"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ClimateChart({ data, cropName, compact }: ClimateChartProps) {
  const temp = React.useMemo(() => flattenRows(data, "temp"), [data]);
  const precip = React.useMemo(() => flattenRows(data, "precip"), [data]);
  const soil = React.useMemo(() => flattenRows(data, "soil"), [data]);
  const oTemp = optimalBandForTab(data, "temp");
  const oPrecip = optimalBandForTab(data, "precip");
  const oSoil = optimalBandForTab(data, "soil");

  return (
    <section className="glass flex flex-col gap-3 rounded-xl p-5 md:gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Serie mensual climática · {cropName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pasá el cursor sobre cada mes: tooltips muestran las tres trayectorias más la
            desviación porcentual del actual frente al histórico.
          </p>
        </div>
        <ChartLegend />
      </header>

      <Tabs defaultValue="temp" className="w-full">
        <TabsList variant="line" className="w-full justify-start gap-1 overflow-x-auto">
          <TabsTrigger value="temp">Temperatura (°C)</TabsTrigger>
          <TabsTrigger value="precip">Precipitación (mm)</TabsTrigger>
          <TabsTrigger value="soil">Humedad suelo (m³/m³)</TabsTrigger>
        </TabsList>
        <TabsContent value="temp" className="pt-4">
          <SeriesChart series={temp} optimal={oTemp} tab="temp" compact={compact} />
        </TabsContent>
        <TabsContent value="precip" className="pt-4">
          <SeriesChart series={precip} optimal={oPrecip} tab="precip" compact={compact} />
        </TabsContent>
        <TabsContent value="soil" className="pt-4">
          <SeriesChart series={soil} optimal={oSoil} tab="soil" compact={compact} />
        </TabsContent>
      </Tabs>

      <p className="text-[0.68rem] leading-relaxed text-muted-foreground">{CMIP6_NOTE}</p>
    </section>
  );
}

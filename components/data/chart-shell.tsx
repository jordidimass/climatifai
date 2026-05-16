"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

interface ChartShellProps {
  title: string;
  subtitle?: string;
  data: { month: string; historical: number; projected: number }[];
  kind?: "line" | "area";
  className?: string;
}

/**
 * Themed Recharts wrapper. Reads `--chart-*` CSS variables so the chart
 * re-paints automatically when the theme toggles light/dark.
 */
export function ChartShell({
  title,
  subtitle,
  data,
  kind = "area",
  className,
}: ChartShellProps) {
  const stroke1 = "var(--chart-1)";
  const stroke2 = "var(--chart-2)";

  return (
    <section className={cn("glass flex flex-col gap-4 rounded-xl p-5", className)}>
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{title}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <Legend />
      </header>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {kind === "area" ? (
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="cl-hist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke1} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={stroke1} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cl-proj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke2} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={stroke2} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
                cursor={{ stroke: "var(--ring)", strokeOpacity: 0.4 }}
              />
              <Area
                type="monotone"
                dataKey="historical"
                stroke={stroke1}
                strokeWidth={2}
                fill="url(#cl-hist)"
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke={stroke2}
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#cl-proj)"
              />
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="historical"
                stroke={stroke1}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke={stroke2}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ background: "var(--chart-1)" }} />
        Historical
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-px w-3"
          style={{
            background:
              "repeating-linear-gradient(90deg, var(--chart-2) 0 4px, transparent 4px 8px)",
          }}
        />
        Projected
      </span>
    </div>
  );
}

import type { Crop } from "@/types/crop";

import type {
  ClimateComparisonMonthRow,
  ClimateMetricTriple,
  ClimatePoint,
} from "@/types/climate";

import {
  cropOptimalMonthlyPrecipMm,
  cropOptimalSoilMoisture,
  cropOptimalTempRange,
} from "@/lib/climate/crop-optimal-bands";

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

type MetricKind = "temp" | "precip" | "soil";

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function jitter(
  regionId: string,
  cropId: string,
  metric: MetricKind,
  monthIndex: number,
): number {
  const seed = [...`${regionId}:${cropId}:${metric}:${monthIndex}`].reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  return ((seed * 7919 + monthIndex * 997) % 1000) / 1000 - 0.5;
}

/** Contenido volumétrico de humedad (m³/m³) derivado hasta haber campo real. */
export function syntheticSoilMoisture(
  tempMeanC: number,
  precipMm: number,
): number {
  const precipFactor = clamp(precipMm / 260, 0, 1);
  const coolFactor = clamp((34 - tempMeanC) / 28, 0, 1);
  const raw =
    0.08 + 0.22 * precipFactor * 0.62 + 0.16 * coolFactor * 0.55;
  return +clamp(raw, 0.04, 0.48).toFixed(4);
}

function pickMetric(p: ClimatePoint, metric: MetricKind): number {
  switch (metric) {
    case "temp":
      return p.tempMeanC;
    case "precip":
      return p.precipMm;
    case "soil":
      return syntheticSoilMoisture(p.tempMeanC, p.precipMm);
    default: {
      const _never: never = metric;
      return _never;
    }
  }
}

function finalizeValue(value: number, metric: MetricKind): number {
  if (metric === "precip") return Math.max(0, Math.round(value));
  if (metric === "soil") return +clamp(value, 0.02, 0.55).toFixed(4);
  return +value.toFixed(2);
}

function buildTriple(opts: {
  hp: ClimatePoint | undefined;
  pp: ClimatePoint | undefined;
  monthIndex: number;
  currentMonthInclusive: number;
  regionId: string;
  cropId: string;
  metric: MetricKind;
}): ClimateMetricTriple {
  const {
    hp,
    pp,
    monthIndex,
    currentMonthInclusive,
    regionId,
    cropId,
    metric,
  } = opts;
  const base = hp ?? pp;
  if (!base)
    return { historical: 0, actual: null, projected: 0 };

  const historical = finalizeValue(
    hp != null ? pickMetric(hp, metric) : pickMetric(pp!, metric),
    metric,
  );

  const projected = finalizeValue(
    pp != null ? pickMetric(pp, metric) : pickMetric(base, metric),
    metric,
  );

  let actual: number | null;
  if (monthIndex > currentMonthInclusive) actual = null;
  else {
    const pointForHist =
      hp != null ? pickMetric(hp, metric) : pickMetric(pp!, metric);
    const pointForProj =
      pp != null ? pickMetric(pp, metric) : pickMetric(hp!, metric);
    let blended =
      pointForHist +
      (pointForProj - pointForHist) * 0.32 +
      jitter(regionId, cropId, metric, monthIndex) *
        (metric === "precip" ? 6 : metric === "soil" ? 0.02 : 0.35);
    blended +=
      jitter(regionId, `${cropId}:a`, metric, monthIndex) *
      (metric === "precip" ? 4 : metric === "soil" ? 0.015 : 0.2);
    actual = finalizeValue(blended, metric);
  }

  return { historical, actual, projected };
}

export interface BuildComparisonOpts {
  historical: ClimatePoint[] | undefined;
  projected: ClimatePoint[] | undefined;
  regionId: string;
  cropId: string;
  crop: Crop | undefined;
  now?: Date;
}

export function buildComparisonChartRows(
  opts: BuildComparisonOpts,
): ClimateComparisonMonthRow[] {
  const hist = opts.historical ?? [];
  const proj = opts.projected ?? [];
  if (hist.length === 0 && proj.length === 0) return [];

  const pointAt = (pts: ClimatePoint[], i: number) =>
    pts[i] ?? pts[pts.length - 1];

  const n = 12;
  const { regionId, cropId } = opts;

  const now = opts.now ?? new Date();
  const currentMonthInclusive = now.getMonth();

  const idealPrecip = cropOptimalMonthlyPrecipMm(
    opts.crop?.idealPrecipMm ?? { min: 400, max: 900 },
  );
  const optimalTemp = cropOptimalTempRange(cropId);
  const optimalSoil = cropOptimalSoilMoisture();

  const rows: ClimateComparisonMonthRow[] = [];
  for (let i = 0; i < n; i++) {
    const hp =
      hist.length === 0 ? undefined : pointAt(hist, i);
    const pp =
      proj.length === 0 ? undefined : pointAt(proj, i);
    const monthLabel = MONTH_LABELS[i] ?? `M${i + 1}`;

    rows.push({
      monthIndex: i,
      monthLabel,
      temperature: buildTriple({
        hp,
        pp,
        monthIndex: i,
        currentMonthInclusive,
        regionId,
        cropId,
        metric: "temp",
      }),
      precipitation: buildTriple({
        hp,
        pp,
        monthIndex: i,
        currentMonthInclusive,
        regionId,
        cropId,
        metric: "precip",
      }),
      soilMoisture: buildTriple({
        hp,
        pp,
        monthIndex: i,
        currentMonthInclusive,
        regionId,
        cropId,
        metric: "soil",
      }),
      optimalTemp,
      optimalPrecipMmMonthly: idealPrecip,
      optimalSoilMoisture: optimalSoil,
    });
  }

  return rows;
}

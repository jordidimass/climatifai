"use client";

import type { ClimatePoint, ClimateSeries } from "@/types/climate";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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

export type ClimateChartRow = {
  month: string;
  historical: number;
  projected: number;
};

async function fetchSeries(
  regionId: string,
  cropId: string,
  kind: "historical" | "projected",
): Promise<ClimateSeries> {
  const params =
    kind === "historical"
      ? new URLSearchParams({
          regionId,
          cropId,
          from: "2015-01",
          to: "2024-12",
        })
      : new URLSearchParams({
          regionId,
          cropId,
          from: "2031-01",
          to: "2040-12",
          scenario: "ssp3-7.0",
        });
  const path =
    kind === "historical"
      ? "/api/climate/historical"
      : "/api/climate/projected";
  const res = await fetch(`${path}?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      typeof body.error === "string" ? body.error : `HTTP ${res.status}`,
    );
  }
  return res.json();
}

function zipPartial(
  historical: ClimatePoint[] | undefined,
  projected: ClimatePoint[] | undefined,
): ClimateChartRow[] {
  const hist = historical?.slice(0, 12) ?? [];
  const proj = projected?.slice(0, 12) ?? [];
  const len = Math.max(hist.length, proj.length);

  const rows: ClimateChartRow[] = [];
  for (let i = 0; i < len; i++) {
    const hp = hist[i];
    const pp = proj[i];
    const month =
      MONTH_LABELS[i] ?? hp?.month.slice(5) ?? pp?.month.slice(5) ?? `M${i + 1}`;
    const histVal = hp?.tempMeanC ?? pp?.tempMeanC ?? 0;
    const projVal = pp?.tempMeanC ?? hp?.tempMeanC ?? histVal;
    rows.push({
      month,
      historical: histVal,
      projected: projVal,
    });
  }
  return rows;
}

export function useClimateChartData(regionId: string, cropId: string) {
  const [data, setData] = useState<ClimateChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partial, setPartial] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPartial(false);

    let historical: ClimatePoint[] | undefined;
    let projected: ClimatePoint[] | undefined;
    let errHist: Error | undefined;
    let errProj: Error | undefined;

    try {
      const h = await fetchSeries(regionId, cropId, "historical");
      historical = h.points;
    } catch (e) {
      errHist = e instanceof Error ? e : new Error("Historical fetch failed.");
    }

    try {
      const p = await fetchSeries(regionId, cropId, "projected");
      projected = p.points;
    } catch (e) {
      errProj = e instanceof Error ? e : new Error("Projection fetch failed.");
    }

    const rows = zipPartial(historical, projected);

    if (rows.length === 0) {
      const msg =
        errHist?.message && errProj?.message
          ? "No se pudieron cargar las series históricas ni proyectadas."
          : errHist?.message ??
            errProj?.message ??
            "No hay datos de temperatura para mostrar.";
      setError(msg);
      setData([]);
      setLoading(false);
      return;
    }

    if (errHist || errProj) {
      setPartial(true);
      toast.warning("Datos parciales", {
        description:
          errHist && !projected?.length
            ? "Sin histórico: se muestra solo lo disponible de la proyección."
            : errProj && !historical?.length
              ? "Sin proyección: se muestra la línea base disponible."
              : "Recuperamos parte de las series climáticas. Revisa con datos oficiales en producción.",
      });
    }

    setData(rows);
    setLoading(false);
  }, [regionId, cropId]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return { data, loading, error, reload: load, partial };
}

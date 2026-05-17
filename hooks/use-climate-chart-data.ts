"use client";

import type { ClimateComparisonMonthRow, ClimatePoint } from "@/types/climate";
import { buildComparisonChartRows } from "@/lib/climate/build-comparison-chart-rows";
import { getCrop } from "@/lib/api/crops";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

async function fetchSeriesPoints(
  regionId: string,
  cropId: string,
  kind: "historical" | "projected",
): Promise<ClimatePoint[]> {
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
  const json = (await res.json()) as { points: ClimatePoint[] };
  return json.points ?? [];
}

export function useClimateChartData(regionId: string, cropId: string) {
  const [comparisonRows, setComparisonRows] = useState<
    ClimateComparisonMonthRow[]
  >([]);
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
      historical = await fetchSeriesPoints(regionId, cropId, "historical");
    } catch (e) {
      errHist = e instanceof Error ? e : new Error("Historical fetch failed.");
    }

    try {
      projected = await fetchSeriesPoints(regionId, cropId, "projected");
    } catch (e) {
      errProj = e instanceof Error ? e : new Error("Projection fetch failed.");
    }

    const hSlice = historical?.slice(0, 12);
    const pSlice = projected?.slice(0, 12);
    const crop = getCrop(cropId);

    const rows = buildComparisonChartRows({
      historical: hSlice,
      projected: pSlice,
      regionId,
      cropId,
      crop,
    });

    if (rows.length === 0) {
      const msg =
        errHist?.message && errProj?.message
          ? "No se pudieron cargar las series históricas ni proyectadas."
          : errHist?.message ??
            errProj?.message ??
            "No hay datos climáticos para mostrar.";
      setError(msg);
      setComparisonRows([]);
      setLoading(false);
      return;
    }

    if (errHist || errProj) {
      setPartial(true);
      toast.warning("Datos parciales", {
        description:
          errHist && !historical?.length
            ? "Sin histórico: se muestra solo lo disponible de la proyección."
            : errProj && !projected?.length
              ? "Sin proyección: se muestra la línea base disponible."
              : "Parte de las series climáticas no cargó por completo. Reintentá cuando la API responda.",
      });
    }

    setComparisonRows(rows);
    setLoading(false);
  }, [regionId, cropId]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return {
    comparisonRows,
    loading,
    error,
    reload: load,
    partial,
  };
}

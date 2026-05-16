"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { ChartShell } from "@/components/data/chart-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClimateChartData } from "@/hooks/use-climate-chart-data";
import { cn } from "@/lib/utils";

export function ClimateChartPanel({
  regionId,
  cropId,
  compact,
}: {
  regionId: string;
  cropId: string;
  compact?: boolean;
}) {
  const { data, loading, error, reload, partial } = useClimateChartData(
    regionId,
    cropId,
  );
  const toastedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      toastedRef.current = null;
      return;
    }
    if (toastedRef.current === error) return;
    toastedRef.current = error;
    toast.error("Datos climáticos", {
      description:
        "No pudimos cargar la serie de temperatura. Puedes reintentar desde el panel.",
    });
  }, [error]);

  const chartH = compact ? "h-44" : "h-56";

  if (loading) {
    return (
      <section className="glass flex flex-col gap-4 rounded-xl p-5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton
          className={cn("mt-2 w-full rounded-lg", chartH)}
        />
      </section>
    );
  }

  if (error || data.length === 0) {
    return (
      <section className="glass flex flex-col items-center gap-4 rounded-xl p-8 text-center">
        <AlertCircle className="size-10 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
          <p className="font-medium text-foreground">No hay datos para mostrar</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            No recibimos una serie válida. Comprueba la región y el cultivo; si
            el problema continúa, reintenta más tarde.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void reload()}>
          Reintentar
        </Button>
      </section>
    );
  }

  return (
    <ChartShell
      title="Temperatura media · mensual"
      subtitle={`Línea base histórica (stub API) vs. proyección SSP3-7.0${
        partial ? " · parte de la serie vino incompleta" : ""
      }`}
      data={data}
      kind="area"
      className="h-full"
      chartHeightClass={chartH}
    />
  );
}

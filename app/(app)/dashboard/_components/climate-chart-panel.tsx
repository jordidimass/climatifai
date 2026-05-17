"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { ClimateChart } from "@/components/data/climate-chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClimateChartData } from "@/hooks/use-climate-chart-data";
import { getCrop } from "@/lib/api/crops";
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
  const {
    comparisonRows,
    loading,
    error,
    reload,
    partial,
  } = useClimateChartData(regionId, cropId);
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
        "No pudimos montar los gráficos. Comprobá red o reintentá desde el panel.",
    });
  }, [error]);

  const chartSkeletonH = compact ? "h-[220px]" : "min-h-[280px]";

  if (loading) {
    return (
      <section className="glass flex flex-col gap-4 rounded-xl p-5">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className={cn("mt-1 w-full rounded-lg", chartSkeletonH)} />
      </section>
    );
  }

  if (error || comparisonRows.length === 0) {
    return (
      <section className="glass flex flex-col items-center gap-4 rounded-xl p-8 text-center">
        <AlertCircle className="size-10 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
          <p className="font-medium text-foreground">No hay datos para mostrar</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            No pudimos armar las tres series mensuales. Comprobá región y cultivo o
            reintentá más tarde.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void reload()}>
          Reintentar
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-2">
      {partial ? (
        <p className="rounded-md border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-foreground">
          Una de las llamadas llegó incompleta: igual mostramos hasta doce puntos donde
          haya valores.
        </p>
      ) : null}
      <ClimateChart
        data={comparisonRows}
        cropName={getCrop(cropId)?.name ?? cropId}
        compact={compact}
      />
    </div>
  );
}

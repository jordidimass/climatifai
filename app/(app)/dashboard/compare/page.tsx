"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Crop } from "@/types/crop";
import type { Region } from "@/types/region";

import { ClimateChartPanel } from "@/app/(app)/dashboard/_components/climate-chart-panel";
import { AnomalyBadge } from "@/components/data/anomaly-badge";
import { CropTimeline } from "@/components/data/crop-timeline";
import { StatCard } from "@/components/data/stat-card";
import { CompareCropPicker } from "@/components/selection/compare-crop-picker";
import { Button } from "@/components/ui/button";
import type { AgriCompareResult } from "@/lib/agri/compare-stub";
import { deriveStats, riskStressLabel } from "@/lib/dashboard-stats";
import { ArrowLeftFromLine, Sparkles } from "lucide-react";
import { useSelectionStore } from "@/stores/selection-store";

function CropCompareColumn({
  crop,
  region,
  regionLabel,
}: {
  crop: Crop;
  region: Region;
  regionLabel: string;
}) {
  const stats = deriveStats(region.id, crop.id);
  const stress = riskStressLabel(stats.riskScore);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="eyebrow text-muted-foreground">{regionLabel}</p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          {crop.name}
        </h2>
        <p className="text-xs text-muted-foreground">{crop.tagline}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label="Riesgo climático (stub)"
          value={`${stats.riskScore}`}
          unit="/100"
          caption={`Étiqueta estrés (${stress.label}); menor score es mejor en este demo`}
          badge={<AnomalyBadge value={stats.riskScore - 50} unit="pts" />}
        />
        <StatCard
          label="Δ precipitación"
          value={`${stats.precipDelta}`}
          unit="%"
          caption="Vs. línea base sintética"
          badge={<AnomalyBadge value={stats.precipDelta} unit="%" />}
        />
      </div>
      <ClimateChartPanel regionId={region.id} cropId={crop.id} compact />
      <CropTimeline crop={crop} variant="compact" />
    </div>
  );
}

export default function CompareDashboardPage() {
  const router = useRouter();
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const compareCrop = useSelectionStore((s) => s.compareCrop);
  const enterComparisonMode = useSelectionStore((s) => s.enterComparisonMode);
  const leaveComparisonMode = useSelectionStore((s) => s.leaveComparisonMode);

  const [comparePayload, setComparePayload] = useState<AgriCompareResult | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    enterComparisonMode();
  }, [enterComparisonMode]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/agri/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crops: [crop.id, compareCrop.id],
            regionId: region.id,
          }),
        });
        const raw: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            typeof raw === "object" &&
            raw !== null &&
            "error" in raw &&
            typeof (raw as { error: unknown }).error === "string"
              ? (raw as { error: string }).error
              : "No se pudo calcular la comparación.";
          throw new Error(msg);
        }
        if (
          cancelled ||
          typeof raw !== "object" ||
          raw === null ||
          !("preferred_crop" in raw && "preferred_crop_name" in raw && "reason" in raw)
        )
          return;
        setComparePayload(raw as AgriCompareResult);
      } catch (e) {
        if (!cancelled) {
          setComparePayload(null);
          setError(e instanceof Error ? e.message : "Error de red.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [crop.id, compareCrop.id, region.id]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <p className="eyebrow">Comparar cultivos</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
            {region.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Misma referencia climática demo; paralelás riesgos, series y calendarios
            para decidir combinaciones dentro de esta región antes de llevar datos
            reales desde Open-Meteo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-2 rounded-full"
            onClick={() => {
              leaveComparisonMode();
              router.push("/analizar-siembra/resultado");
            }}
          >
            <ArrowLeftFromLine className="size-4" aria-hidden />
            Salir del modo comparación
          </Button>
          <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full gap-2">
            <Link href="/insights">
              <Sparkles className="size-4" aria-hidden />
              Hallazgos con IA sobre ambos
            </Link>
          </Button>
        </div>
      </header>

      <section className="glass grid gap-4 rounded-xl border border-border/70 p-4 lg:grid-cols-[220px,minmax(0,1fr)] lg:items-start">
        <CompareCropPicker />
        <section className="border-t border-border/50 pt-4 lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0">
          <p className="eyebrow mb-2 text-muted-foreground">Resumen ejecutivo · API</p>
          {loading ? (
            <p className="text-sm text-muted-foreground">Calculando recomendación…</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : comparePayload ? (
            <>
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-semibold text-primary">
                  {comparePayload.preferred_crop_name}
                </span>
                {" "}
                queda mejor posicionado con los scores actuales:{" "}
                {crop.name} ({comparePayload.scores[crop.id] ?? "—"})
                {" · "}
                {compareCrop.name} ({comparePayload.scores[compareCrop.id] ?? "—"})
                {" "}
                (menor demo = menos estrés compuesto sintético).
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {comparePayload.reason}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sin datos de comparación. Elegí dos cultivos distintos del catálogo.
            </p>
          )}
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            <li>
              Elegí{" "}
              <strong className="font-medium text-foreground">Hallazgos</strong>{" "}
              para que el modelo contraste ambos cultivos con preguntas abiertas.
            </li>
            <li>
              Los valores se actualizan al cambiar la región o el segundo cultivo en el panel.
            </li>
          </ul>
        </section>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <CropCompareColumn
          crop={crop}
          region={region}
          regionLabel="Cultivo principal (sidebar)"
        />
        <CropCompareColumn crop={compareCrop} region={region} regionLabel="Cultivo comparado" />
      </div>
    </div>
  );
}

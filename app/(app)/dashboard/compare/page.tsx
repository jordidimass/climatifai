"use client";

import Link from "next/link";
import type { Crop } from "@/types/crop";
import type { Region } from "@/types/region";
import { ClimateChartPanel } from "@/app/(app)/dashboard/_components/climate-chart-panel";
import { AnomalyBadge } from "@/components/data/anomaly-badge";
import { StatCard } from "@/components/data/stat-card";
import { CompareCropPicker } from "@/components/selection/compare-crop-picker";
import { deriveStats } from "@/lib/dashboard-stats";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelectionStore } from "@/stores/selection-store";

function MiniCropTimeline({ crop }: { crop: Crop }) {
  const labels = ["Siembra", "Crecimiento", "Cosecha"];
  const offset =
    [...crop.id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 4;

  function phaseClass(i: number): string {
    const m = (i + offset) % 12;
    if (m <= 2) return "bg-chart-1/45";
    if (m <= 8) return "bg-chart-2/45";
    return "bg-chart-5/55";
  }

  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-3">
      <p className="eyebrow text-[0.55rem] text-muted-foreground">
        Calendario tipo · {crop.name}
      </p>
      <div className="flex gap-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            title={`Mes ${i + 1}`}
            className={cn("h-8 min-w-0 flex-1 rounded-sm", phaseClass(i))}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[0.65rem] text-muted-foreground">
        {labels.map((l, idx) => (
          <span key={l} className="inline-flex items-center gap-1">
            <span
              className={cn(
                "size-2 rounded-sm",
                idx === 0
                  ? "bg-chart-1/45"
                  : idx === 1
                    ? "bg-chart-2/45"
                    : "bg-chart-5/55",
              )}
            />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

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
          caption="Score deterministico demo · menor es mejor"
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
      <MiniCropTimeline crop={crop} />
    </div>
  );
}

export default function CompareDashboardPage() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const compareCrop = useSelectionStore((s) => s.compareCrop);

  const statsA = deriveStats(region.id, crop.id);
  const statsB = deriveStats(region.id, compareCrop.id);
  const lowerRisk =
    statsA.riskScore <= statsB.riskScore ? crop : compareCrop;
  const higherRisk = lowerRisk.id === crop.id ? compareCrop : crop;
  const minR = Math.min(statsA.riskScore, statsB.riskScore);
  const maxR = Math.max(statsA.riskScore, statsB.riskScore);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <p className="eyebrow">Comparar cultivos</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
            {region.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Misma referencia climática demo; paralelás riesgos, series y timelines
            para decidir combinaciones dentro de esta región antes de llevar datos
            reales desde Open-Meteo.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full gap-2">
          <Link href="/insights">
            <Sparkles className="size-4" aria-hidden />
            Hallazgos con IA sobre ambos
          </Link>
        </Button>
      </header>

      <section className="glass grid gap-4 rounded-xl border border-border/70 p-4 lg:grid-cols-[220px,minmax(0,1fr)] lg:items-start">
        <CompareCropPicker />
        <section className="border-t border-border/50 pt-4 lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0">
          <p className="eyebrow mb-2 text-muted-foreground">Resumen ejecutivo</p>
          <p className="text-sm leading-relaxed text-foreground">
            Para los datos sintéticos de hoy,{" "}
            <span className="font-semibold text-primary">{lowerRisk.name}</span>{" "}
            acumula un score menor de estrés combinado ({minR}/100) que{" "}
            <span className="font-medium">{higherRisk.name}</span> ({maxR}/100).
            Validá contra rendimiento económico, suelo y prácticas antes de ajustar
            la planificación de temporada.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            <li>
              Elegí <strong className="font-medium text-foreground">Hallazgos</strong> para
              que el modelo contraste ambos cultivos con preguntas abiertas.
            </li>
            <li>
              Los valores se recalculan al cambiar región o segundo cultivo en el
              panel lateral.
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

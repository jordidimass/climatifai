import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { CropTimeline } from "@/components/data/crop-timeline";
import { HarvestChart } from "@/components/harvest/harvest-chart";
import { HarvestExtras } from "@/components/harvest/harvest-extras";
import { HarvestStats } from "@/components/harvest/harvest-stats";
import { HarvestSummaryHeader } from "@/components/harvest/harvest-summary-header";
import { FlowHeader } from "@/components/layout/flow-header";
import { RiskCirclesLayer } from "@/components/map/layers/risk-circles-layer";
import { RegionMapPanel } from "@/components/map/region-map-panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Resultado del análisis",
};

export default function AnalizarSiembraResultadoPage() {
  return (
    <>
      <FlowHeader title="Resultado" backHref="/analizar-siembra" />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8">
        <nav aria-label="Ruta" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="hover:text-foreground">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href="/analizar-siembra"
                className="hover:text-foreground"
              >
                Analizar siembra
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">Resultado</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-foreground">
            <span className="font-medium">¿Interpretación agrícola?</span> Abre{" "}
            <span className="whitespace-nowrap">Hallazgos con IA</span> con tu
            región y cultivo ya en contexto.
          </p>
          <Button size="sm" className="shrink-0 rounded-full shadow-none" asChild>
            <Link href="/insights" className="gap-2">
              <Sparkles className="size-4 shrink-0" aria-hidden />
              Ir a Hallazgos
            </Link>
          </Button>
        </div>

        <HarvestSummaryHeader />

        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] lg:items-start">
          <div className="flex min-w-0 flex-col gap-4">
            <p className="eyebrow">Indicadores</p>
            <HarvestStats />
            <HarvestExtras />
            <CropTimeline />
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <RegionMapPanel>
              <RiskCirclesLayer />
            </RegionMapPanel>
            <HarvestChart className="h-full" />
          </div>
        </div>
      </div>
    </>
  );
}

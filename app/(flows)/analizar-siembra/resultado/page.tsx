import Link from "next/link";
import type { Metadata } from "next";

import { ChartShell } from "@/components/data/chart-shell";
import { HarvestExtras } from "@/components/harvest/harvest-extras";
import { HarvestStats } from "@/components/harvest/harvest-stats";
import { HarvestSummaryHeader } from "@/components/harvest/harvest-summary-header";
import { SAMPLE_CLIMATE_SERIES } from "@/components/harvest/sample-climate-series";
import { FlowHeader } from "@/components/layout/flow-header";
import { RegionMapPanel } from "@/components/map/region-map-panel";

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

        <HarvestSummaryHeader />

        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] lg:items-start">
          <div className="flex min-w-0 flex-col gap-4">
            <p className="eyebrow">Indicadores</p>
            <HarvestStats />
            <HarvestExtras />
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <RegionMapPanel />
            <ChartShell
              title="Temperatura media · mensual"
              subtitle="Línea base histórica (1991–2020) vs. proyección SSP3-7.0 (2031–2050)"
              data={SAMPLE_CLIMATE_SERIES}
              kind="area"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { Flame, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="por-que"
      className="relative isolate mx-auto max-w-7xl px-6 pt-16 pb-14 md:pt-24 md:pb-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent-foreground" />
          Inteligencia climática agrícola · v0.1
        </p>

        <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl">
          Lee el clima.
          <span className="block italic text-foreground/85">
            Siembra mejor.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          Compara cien años de clima con lo que viene para los cultivos y
          regiones que trabajas. Hecho para productores, agrónomos y
          cooperativas de Latinoamérica.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:gap-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="h-auto rounded-2xl py-6">
            <Link href="/analizar-siembra" className="flex flex-col gap-1 px-6">
              <span className="inline-flex items-center gap-2 text-base font-semibold">
                <Sprout className="size-5" aria-hidden />
                Analiza tu siembra
              </span>
              <span className="text-xs font-normal text-primary-foreground/85">
                Lecturas por región, tipo de siembra y fecha
              </span>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-auto rounded-2xl border-border/80 bg-card/40 py-6 backdrop-blur-sm"
          >
            <Link href="/mapa-incendios" className="flex flex-col gap-1 px-6">
              <span className="inline-flex items-center gap-2 text-base font-semibold">
                <Flame className="size-5 text-anomaly-warm" aria-hidden />
                Mapa de incendios
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                Beta · capas satelitales próximamente
              </span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full text-muted-foreground"
          >
            <Link href="#capacidades">Ver capacidades</Link>
          </Button>
        </div>
      </div>

      <HeroReadout />
    </section>
  );
}

function HeroReadout() {
  const stats = [
    { label: "Anomalía térmica", value: "+1.8", unit: "°C", sigma: "1.4σ" },
    { label: "Δ precip. vs. 1991–2020", value: "−12", unit: "%", sigma: "0.9σ" },
    { label: "Grados-día", value: "1,284", unit: "GDD", sigma: "+6%" },
    { label: "Días de calor", value: "27", unit: "d", sigma: "+8" },
  ];
  return (
    <div className="glass mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-2 bg-card/40 p-5 backdrop-blur-sm"
        >
          <span className="eyebrow">{s.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="numeric text-3xl font-medium tracking-tight text-foreground">
              {s.value}
            </span>
            <span className="numeric text-sm text-muted-foreground">
              {s.unit}
            </span>
          </div>
          <span className="numeric text-xs text-anomaly-warm">{s.sigma}</span>
        </div>
      ))}
    </div>
  );
}

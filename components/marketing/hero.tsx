import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
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

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href="/dashboard">
              Abrir panel
              <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full px-6"
          >
            <Link href="#science">
              <Play className="mr-1 size-4" aria-hidden="true" />
              Cómo funciona
            </Link>
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
    <div className="glass mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
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

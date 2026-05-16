import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="empresas" className="mx-auto max-w-7xl px-6 py-20">
      <div className="glass relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="eyebrow">Para cooperativas y empresas</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
            Un modelo climático.{" "}
            <span className="italic text-foreground/80">Cada parcela.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-balance text-muted-foreground">
            Lleva Climatifai a todo tu portafolio: regiones por lote, catálogos
            de cultivos a medida y una API que se integra con tus herramientas.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/analizar-siembra">
                Analiza tu siembra
                <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-background/60 px-6 backdrop-blur"
            >
              <Link href="#contact">Hablemos</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

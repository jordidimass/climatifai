"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Flame, Sparkles, Sprout } from "lucide-react";

import { LandingStatsStrip } from "@/components/marketing/landing-stats-strip";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { m } = useMarketingCopy();
  const h = m.hero;

  return (
    <section
      id="por-que"
      className="relative isolate mx-auto max-w-7xl px-6 pt-16 pb-14 md:pt-24 md:pb-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent-foreground" />
          {h.eyebrow}
        </p>

        <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl">
          {h.line1}
          <span className="block italic text-foreground/85">{h.line2}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          {h.body}
        </p>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-base shadow-sm"
          >
            <Link href="/dashboard" className="gap-2">
              <span>{h.primaryCta}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <LandingStatsStrip />

      <div className="mx-auto mt-12 max-w-3xl space-y-4 md:space-y-5">
          <Link
            href="/habla-ai"
            className="glass group relative flex flex-col gap-3 rounded-2xl p-8 text-left transition-transform hover:-translate-y-0.5 md:flex-row md:items-center md:justify-between md:p-10"
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-6" aria-hidden />
              </span>
              <div>
                <p className="eyebrow">{h.cardEyebrow}</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-tight md:text-3xl">
                  {h.cardTitle}
                </p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {h.cardBody}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary md:flex-col md:items-end">
              {h.cardOpen}
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </Link>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild size="lg" className="h-auto rounded-2xl py-6">
              <Link href="/analizar-siembra" className="flex flex-col gap-1 px-6">
                <span className="inline-flex items-center gap-2 text-base font-semibold">
                  <Sprout className="size-5" aria-hidden />
                  {h.sowingTitle}
                </span>
                <span className="text-xs font-normal text-primary-foreground/85">
                  {h.sowingSub}
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
                  {h.firesTitle}
                </span>
                <span className="text-xs font-normal text-muted-foreground">{h.firesSub}</span>
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
              <Link href="#capacidades">{h.seeFeatures}</Link>
            </Button>
          </div>
        </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Flame, Sprout } from "lucide-react";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { Button } from "@/components/ui/button";
import { CLIMATIFAI_API_DOCS_URL } from "@/lib/site-urls";

export function Hero() {
  const { m } = useMarketingCopy();
  const h = m.hero;

  return (
    <section className="relative isolate mx-auto max-w-7xl px-6 pt-16 pb-14 md:pt-24 md:pb-20">
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
          {h.bodyPrefix}
          <Link
            href={CLIMATIFAI_API_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {h.apiLinkLabel}
          </Link>
          {h.bodySuffix}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-4 md:space-y-5">
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <Button
            asChild
            size="lg"
            variant="default"
            className="flex h-auto min-h-[5rem] min-w-0 w-full shrink flex-col items-stretch justify-start gap-0 whitespace-normal rounded-2xl py-5"
          >
            <Link
              href="/advisor"
              className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 px-5 py-3 text-left no-underline sm:px-6 sm:py-4"
            >
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold leading-snug tracking-tight">
                <Sprout className="size-5 shrink-0" aria-hidden />
                <span className="min-w-0 shrink break-words text-pretty">{h.sowingTitle}</span>
              </span>
              <span className="min-w-0 text-sm font-normal leading-snug break-words text-pretty text-primary-foreground/90">
                {h.sowingSub}
              </span>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="flex h-auto min-h-[5rem] min-w-0 w-full shrink flex-col items-stretch justify-start gap-0 whitespace-normal rounded-2xl border-border/80 bg-card/40 py-5 backdrop-blur-sm"
          >
            <Link
              href="/fires"
              className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 px-5 py-3 text-left no-underline sm:px-6 sm:py-4"
            >
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold leading-snug tracking-tight">
                <Flame className="size-5 shrink-0 text-anomaly-warm" aria-hidden />
                <span className="min-w-0 shrink break-words text-pretty">{h.firesTitle}</span>
              </span>
              <span className="min-w-0 text-sm font-normal leading-snug break-words text-pretty text-muted-foreground">
                {h.firesSub}
              </span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-muted-foreground">
            <Link href="/capabilities">{h.seeFeatures}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

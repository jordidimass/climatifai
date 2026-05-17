"use client";

import { Fragment } from "react";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";

export function LandingStatsStrip() {
  const { m } = useMarketingCopy();
  const segments = m.hero.statsStrip;

  return (
    <section className="mx-auto mt-10 max-w-5xl" aria-label={segments.join(" · ")}>
      <div className="glass flex flex-col items-center justify-center gap-y-4 rounded-2xl px-5 py-6 ring-1 ring-border/55 sm:flex-row sm:flex-wrap sm:gap-x-1 sm:gap-y-3 sm:px-8 md:py-7">
        {segments.map((label, index) => (
          <Fragment key={label}>
            {index > 0 ? (
              <span
                className="hidden h-8 w-px shrink-0 bg-border/80 sm:inline-block"
                aria-hidden
              />
            ) : null}
            <span className="mx-3 text-center text-sm font-semibold leading-snug text-foreground md:text-[0.9375rem]">
              {label}
            </span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

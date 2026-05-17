"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type InsightHeroProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
};

export function InsightsAnimatedHero({
  eyebrow,
  title,
  description,
}: InsightHeroProps) {
  /** Activa entrada suave; si el usuario pide menos movimiento, se salta aquí */
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) setRevealed(true);
      else window.requestAnimationFrame(() => setRevealed(true));
    });
  }, []);

  const rise = (delayCls: string, extraCls?: string) =>
    cn(
      delayCls,
      extraCls,
      "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-200",
      "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0",
      revealed ? "translate-y-0 opacity-100 blur-0" : "translate-y-[14px] opacity-0 blur-[2px]",
    );

  return (
    <header className="space-y-4">
      <div className="relative overflow-visible">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -top-16 bottom-0 rounded-[2.5rem] opacity-95 cf-insights-hero-orbit-bg motion-reduce:hidden"
        />

        <p className={rise("delay-0")}>{eyebrow}</p>

        <h1 className={rise("delay-75", "mt-2 font-heading text-3xl font-medium tracking-tight text-foreground leading-tight")}>
          {title}
        </h1>

        <p className={rise("delay-150", "mt-4 max-w-2xl text-sm text-muted-foreground")}>
          {description}
        </p>
      </div>

      <span
        aria-hidden
        className={rise(
          "delay-200 mx-auto mt-8",
          "cf-insights-hero-line block bg-gradient-to-r from-transparent via-primary/55 to-transparent",
        )}
      />
    </header>
  );
}

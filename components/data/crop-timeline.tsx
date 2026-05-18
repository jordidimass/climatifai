"use client";

import { useMemo } from "react";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import {
  getCropTimelineAnchors,
  phaseForCalendarMonth,
  stressMonthIndices,
  type CropPhaseKey,
} from "@/lib/agri/crop-timeline-location";
import { useSelectionStore } from "@/stores/selection-store";
import type { Crop } from "@/types/crop";
import { cn } from "@/lib/utils";

export type CropTimelineProps = {

  crop?: Crop;

  variant?: "full" | "compact";
};

type Phase = CropPhaseKey;

const PHASE_ORDER = ["planting", "growing", "harvest", "off"] as const satisfies readonly Phase[];

const PHASE_STYLES: Record<Phase, string> = {
  planting:
    "bg-gradient-to-t from-chart-3/15 via-chart-3/55 to-chart-3/85",
  growing:
    "bg-gradient-to-t from-chart-2/15 via-chart-2/50 to-chart-2/80",
  harvest:
    "bg-gradient-to-t from-chart-5/15 via-chart-5/50 to-chart-5/85",
  off: "bg-muted/60",
};

export function CropTimeline({ crop: cropProp, variant = "full" }: CropTimelineProps) {
  const { m } = useMarketingCopy();
  const p = m.product;

  const storeCrop = useSelectionStore((s) => s.crop);
  const region = useSelectionStore((s) => s.region);
  const customLocation = useSelectionStore((s) => s.customLocation);
  const crop = cropProp ?? storeCrop;
  const dense = variant === "compact";

  const monthLabels = p.cropTimelineMonths;
  const phaseLabel: Record<Phase, string> = {
    planting: p.timelinePhasePlanting,
    growing: p.timelinePhaseGrowing,
    harvest: p.timelinePhaseHarvest,
    off: p.timelinePhaseOff,
  };

  const refLat = customLocation?.lat ?? region.center.lat;
  const refLng = customLocation?.lng ?? region.center.lng;

  const anchors = useMemo(
    () => getCropTimelineAnchors(refLat, refLng, crop.id),
    [refLat, refLng, crop.id],
  );
  const stressSet = useMemo(
    () => stressMonthIndices(anchors.stressRotation),
    [anchors.stressRotation],
  );

  const today = new Date();
  const todayMonthIdx = Math.min(Math.max(today.getMonth(), 0), 11);

  function monthRiskFn(i: number): boolean {
    return stressSet.has(i);
  }

  return (
    <section
      className={cn(
        "glass cf-crop-timeline-wrap motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 space-y-3 rounded-xl border border-border/70",
        dense ? "p-3" : "p-4",
      )}
      aria-label={`${p.cropTimelineAria} · ${crop.name}`}
    >
      <div
        className="cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 space-y-2"
        style={{ animationDelay: "60ms" }}
      >
        <div>
          <p className="eyebrow text-muted-foreground">{p.cropTimelineEyebrow}</p>
          <p className="font-medium text-foreground">{crop.name}</p>
          <p className="mt-1 text-[0.65rem] leading-snug text-muted-foreground">
            {p.cropTimelineExampleLead}{" "}
            <span className="font-medium text-foreground">
              {customLocation?.label ?? region.name}
            </span>
            <span className="numeric">{` (${refLat.toFixed(2)}°, ${refLng.toFixed(2)}°)`}</span>
          </p>
        </div>
        {!dense ? (
          <div className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5 text-xs leading-snug text-muted-foreground">
            <p id="crop-timeline-howto-heading" className="mb-2 font-semibold text-foreground">
              {p.cropTimelineHowtoHeading}
            </p>
            <ol className="mb-2 list-none space-y-2 pl-0">
              <li className="flex gap-2.5">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[0.65rem] font-bold text-primary ring-1 ring-primary/20">
                  1
                </span>
                <span>{p.cropTimelineHowtoBulletMonths}</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[0.65rem] font-bold text-primary ring-1 ring-primary/20">
                  2
                </span>
                <span>
                  {p.cropTimelineHowtoBulletStagesIntro}{" "}
                  <span className="font-semibold text-foreground">
                    {phaseLabel.planting}, {phaseLabel.growing}, {phaseLabel.harvest},{" "}
                    {phaseLabel.off}
                  </span>
                  .
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-[0.65rem] font-bold text-destructive ring-1 ring-destructive/25">
                  3
                </span>
                <span>{p.cropTimelineHowtoBulletStress}</span>
              </li>
            </ol>
            <p className="border-t border-border/60 pt-2 text-[0.65rem] text-muted-foreground">
              {p.cropTimelineHowtoFooter}
            </p>
          </div>
        ) : (
          <p className="text-[0.65rem] leading-snug text-muted-foreground">{p.cropTimelineStripeCompactHint}</p>
        )}
      </div>

      <p
        className="cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 text-[0.65rem] font-medium text-muted-foreground"
        style={{ animationDelay: "100ms" }}
      >
        {p.cropTimelineTemporalOrderHint}
      </p>

      <div className="-mx-1 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:overflow-visible md:px-0">
        <div className="relative min-w-[min(100%,440px)]">
          <div
            className="relative isolate flex h-14 min-w-[320px] gap-px overflow-hidden rounded-lg bg-border/70 ring-1 ring-border/50 motion-safe:transition-shadow motion-safe:duration-700 motion-safe:hover:ring-primary/30"
            role="group"
            aria-label={p.cropTimelineRowGroupAria}
          >
            <div
              aria-hidden
              className="cf-crop-track-gleam pointer-events-none absolute inset-0 z-0 rounded-lg motion-reduce:hidden"
            />
            {monthLabels.map((label, i) => {
              const phase = phaseForCalendarMonth(i, anchors.cycleRotation);
              const risky = monthRiskFn(i);
              const delayMs = 120 + i * 42;
              return (
                <div
                  key={`m-${label}-${i}`}
                  className="cf-crop-segment-cell group relative z-[1] min-w-[18px] flex-1 px-px"
                  title={
                    risky
                      ? `${monthLabels[i]} · ${phaseLabel[phase]} — ${p.cropTimelineTooltipStressExtra}`
                      : `${monthLabels[i]} · ${phaseLabel[phase]}`
                  }
                >
                  <div
                    className={cn(
                      "motion-safe:transition-[filter,transform] motion-safe:duration-200 motion-safe:ease-out",
                      "relative h-full w-full overflow-hidden rounded-sm",
                      PHASE_STYLES[phase],
                      "cf-crop-segment-fill motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:scale-y-100",
                    )}
                    style={{ animationDelay: `${delayMs}ms` }}
                  >
                    {risky ? (
                      <>
                        <span
                          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-3 rounded-b-[3px] bg-destructive bg-gradient-to-r from-destructive via-destructive to-destructive/85 shadow-[0_-3px_10px_-2px_rgb(239_68_68_/_0.55)]"
                          aria-hidden
                        />
                        <span className="sr-only">
                          {`${p.cropTimelineRiskySrPrefix} ${monthLabels[i]}`}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}

            <div
              className={cn(
                "cf-crop-today-line pointer-events-none absolute bottom-[-2px] -top-0.5 z-[4] motion-reduce:opacity-100",
                "-translate-x-1/2",
              )}
              style={{
                left: `${((todayMonthIdx + 0.5) / 12) * 100}%`,
              }}
              aria-hidden
            />
          </div>

          <div className="mt-1 grid min-w-[320px] grid-cols-12 gap-0.5 text-center tabular-nums md:gap-px">
            {monthLabels.map((mon, i) => {
              const risky = monthRiskFn(i);
              return (
                <div
                  key={mon}
                  className={cn(
                    "cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 flex min-h-[38px] flex-col items-center justify-start gap-0.5 pb-px",
                  )}
                  style={{ animationDelay: `${380 + i * 24}ms` }}
                >
                  <span className="text-[0.6rem] font-medium uppercase tracking-tight text-muted-foreground">
                    {`${mon.slice(0, 3)}.`}
                  </span>
                  {risky ? (
                    <span
                      className="flex h-[0.6875rem] shrink-0 items-center justify-center"
                      title={p.cropTimelineRiskyDotTitle}
                    >
                      <span
                        aria-hidden
                        className="size-2 rounded-full bg-destructive shadow-[0_0_6px_-1px_rgb(239_68_68_/_0.7)] ring-1 ring-destructive/35"
                      />
                    </span>
                  ) : (
                    <span aria-hidden className="h-[0.6875rem] shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-border/60 pt-3">
        <div className="space-y-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
            {p.cropTimelineLegendEyebrow}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[0.65rem] text-muted-foreground">
            {PHASE_ORDER.map((phaseKey, i) => (
              <li
                key={phaseKey}
                className="cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 flex items-center gap-1.5"
                style={{ animationDelay: `${700 + i * 55}ms` }}
              >
                <span
                  className={cn(
                    "size-2.5 shrink-0 rounded-sm ring-1 ring-border/70",
                    "motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-125",
                    phaseKey === "planting" && "bg-chart-3/80",
                    phaseKey === "growing" && "bg-chart-2/80",
                    phaseKey === "harvest" && "bg-chart-5/80",
                    phaseKey === "off" && "bg-muted",
                  )}
                />
                <span className="text-foreground/90">{phaseLabel[phaseKey]}</span>
              </li>
            ))}
          </ul>
        </div>

        {!dense ? (
          <div className="space-y-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
              {p.cropTimelineOtherSignalsEyebrow}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[0.65rem]">
              <li
                className="cf-crop-mini-rise flex items-start gap-2 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 sm:items-center sm:gap-3"
                style={{ animationDelay: "900ms" }}
              >
                <span
                  className="relative mt-0.5 h-[22px] w-14 shrink-0 overflow-hidden rounded-sm bg-chart-2/35 ring-1 ring-border/60 sm:mt-0"
                  aria-hidden
                >
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[9px] bg-destructive" />
                </span>
                <span className="max-w-[17rem] leading-snug text-muted-foreground">
                  {p.cropTimelineSignalRedStripe}
                </span>
              </li>
              <li
                className="cf-crop-mini-rise flex items-start gap-2 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 sm:items-center sm:gap-3"
                style={{ animationDelay: "935ms" }}
              >
                <span className="mt-1 inline-flex shrink-0 items-center justify-center" aria-hidden>
                  <span className="size-2 rounded-full bg-destructive shadow-sm ring-1 ring-destructive/35" />
                </span>
                <span className="leading-snug text-muted-foreground">{p.cropTimelineSignalRedDot}</span>
              </li>
              <li
                className="cf-crop-mini-rise flex items-center gap-2 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
                style={{ animationDelay: "975ms" }}
              >
                <span
                  className="h-5 w-0 shrink-0 border-l-2 border-dashed border-foreground/50 motion-reduce:opacity-90"
                  aria-hidden
                />
                <span className="leading-snug text-muted-foreground">{p.cropTimelineSignalTodayLine}</span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

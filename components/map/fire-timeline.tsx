"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";

import { useFireStore } from "@/stores/fire-store";
import type { FireDayRange } from "@/types/fires";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RANGE_CHIPS: { value: FireDayRange; label: string }[] = [
  { value: 1, label: "24 h" },
  { value: 2, label: "48 h" },
  { value: 7, label: "7 d" },
  { value: 30, label: "30 d" },
];

const PLAY_TICK_MS = 60; // ~16 fps; smooth enough, easy on the eyes.
const PLAY_STEPS = 480; // playhead crosses span in this many ticks.

interface FireTimelineProps {
  className?: string;
}

export function FireTimeline({ className }: FireTimelineProps) {
  const dayRange = useFireStore((s) => s.dayRange);
  const setDayRange = useFireStore((s) => s.setDayRange);
  const playhead = useFireStore((s) => s.playhead);
  const setPlayhead = useFireStore((s) => s.setPlayhead);
  const playing = useFireStore((s) => s.playing);
  const setPlaying = useFireStore((s) => s.setPlaying);
  const windowHours = useFireStore((s) => s.windowHours);
  const setWindowHours = useFireStore((s) => s.setWindowHours);
  const dataSpan = useFireStore((s) => s.dataSpan);

  // Stable "now" pinned at mount so the fallback span does not jitter while
  // the user drags the slider before data arrives.
  const [mountedAt] = React.useState(() => Date.now());

  const span = React.useMemo(() => {
    if (dataSpan) return dataSpan;
    const to = mountedAt;
    const from = to - dayRange * 24 * 3600 * 1000;
    return { from, to };
  }, [dataSpan, dayRange, mountedAt]);

  const effectivePlayhead = playhead ?? span.to;

  // Play loop — advance playhead, wrap at the end.
  React.useEffect(() => {
    if (!playing) return;
    const step = Math.max(1, (span.to - span.from) / PLAY_STEPS);
    const id = window.setInterval(() => {
      const cur = useFireStore.getState().playhead ?? span.from;
      const next = cur + step;
      if (next > span.to) {
        setPlayhead(span.from);
      } else {
        setPlayhead(next);
      }
    }, PLAY_TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, span.from, span.to, setPlayhead]);

  const sliderPct = ((effectivePlayhead - span.from) / Math.max(1, span.to - span.from)) * 100;
  const label = new Date(effectivePlayhead).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

  return (
    <div
      className={cn(
        "glass pointer-events-auto flex flex-col gap-2 rounded-xl px-4 py-3 shadow-md",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {RANGE_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => setDayRange(chip.value)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition",
                dayRange === chip.value
                  ? "border-foreground/40 bg-foreground/10 text-foreground"
                  : "border-border bg-card/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="eyebrow text-foreground/80">Ventana</span>
          <select
            value={windowHours}
            onChange={(e) => setWindowHours(Number(e.target.value))}
            className="numeric rounded-md border border-border bg-card/80 px-1.5 py-0.5 text-[10px]"
            aria-label="Ventana en horas"
          >
            {[1, 3, 6, 12, 24].map((h) => (
              <option key={h} value={h}>
                ±{h} h
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          className="rounded-full"
          onClick={() => {
            if (playhead == null) setPlayhead(span.from);
            setPlaying(!playing);
          }}
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {playing ? (
            <Pause className="size-3.5" aria-hidden />
          ) : (
            <Play className="size-3.5" aria-hidden />
          )}
        </Button>
        <input
          type="range"
          min={span.from}
          max={span.to}
          step={Math.max(1, Math.round((span.to - span.from) / 600))}
          value={effectivePlayhead}
          onChange={(e) => {
            setPlaying(false);
            setPlayhead(Number(e.target.value));
          }}
          className="flex-1 accent-[var(--risk-bad)]"
          aria-label="Línea temporal"
        />
        <div className="numeric min-w-[120px] text-right text-[10px] text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="numeric flex justify-between text-[10px] text-muted-foreground">
        <span>{new Date(span.from).toLocaleDateString("es-ES")}</span>
        <span>{sliderPct.toFixed(0)}%</span>
        <span>{new Date(span.to).toLocaleDateString("es-ES")}</span>
      </div>
    </div>
  );
}

import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "warm" | "cool" | "neutral";

interface AnomalyBadgeProps {

  value: number;
  unit?: string;

  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  warm: "bg-anomaly-warm/15 text-anomaly-warm border-anomaly-warm/30",
  cool: "bg-anomaly-cool/15 text-anomaly-cool border-anomaly-cool/30",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function AnomalyBadge({
  value,
  unit = "",
  tone,
  className,
}: AnomalyBadgeProps) {
  const effectiveTone: Tone =
    tone ?? (value > 0 ? "warm" : value < 0 ? "cool" : "neutral");
  const Icon = value > 0 ? ArrowUp : value < 0 ? ArrowDown : Minus;
  const sign = value > 0 ? "+" : "";
  return (
    <span
      className={cn(
        "numeric inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
        toneClasses[effectiveTone],
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {sign}
      {value}
      {unit}
    </span>
  );
}

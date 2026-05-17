import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CropSuitabilityStatus } from "@/types/agri";

type RiskTone = "ok" | "warn" | "bad" | "neutral";

interface RiskBadgeProps {
  status: CropSuitabilityStatus;
  className?: string;
  /** When true, only renders the dot — use inside dense tables. */
  compact?: boolean;
}

interface ToneMeta {
  tone: RiskTone;
  label: string;
  Icon: typeof CheckCircle2;
}

const STATUS_META: Record<CropSuitabilityStatus, ToneMeta> = {
  suitable: { tone: "ok", label: "Apto", Icon: CheckCircle2 },
  moderate: { tone: "warn", label: "Moderado", Icon: AlertTriangle },
  risky: { tone: "bad", label: "Riesgo", Icon: ShieldAlert },
  not_recommended: { tone: "bad", label: "No recomendado", Icon: ShieldAlert },
  unknown: { tone: "neutral", label: "Sin datos", Icon: HelpCircle },
};

const TONE_CLASSES: Record<RiskTone, string> = {
  ok: "bg-risk-ok/15 text-risk-ok border-risk-ok/30",
  warn: "bg-risk-warn/20 text-risk-warn border-risk-warn/35",
  bad: "bg-risk-bad/15 text-risk-bad border-risk-bad/35",
  neutral: "bg-muted text-muted-foreground border-border",
};

const DOT_CLASSES: Record<RiskTone, string> = {
  ok: "bg-risk-ok",
  warn: "bg-risk-warn",
  bad: "bg-risk-bad",
  neutral: "bg-muted-foreground",
};

export function RiskBadge({ status, className, compact = false }: RiskBadgeProps) {
  const meta = STATUS_META[status];

  if (compact) {
    return (
      <span
        className={cn("inline-flex size-2.5 rounded-full", DOT_CLASSES[meta.tone], className)}
        aria-label={meta.label}
        role="img"
      />
    );
  }

  const { Icon } = meta;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[meta.tone],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

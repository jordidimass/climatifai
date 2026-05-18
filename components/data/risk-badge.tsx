"use client";

import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert } from "lucide-react";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { cn } from "@/lib/utils";
import type { CropSuitabilityStatus } from "@/types/agri";

type RiskTone = "ok" | "warn" | "bad" | "neutral";

interface RiskBadgeProps {
  status: CropSuitabilityStatus;
  className?: string;

  compact?: boolean;
}

const STATUS_ICONS = {
  suitable: CheckCircle2,
  moderate: AlertTriangle,
  risky: ShieldAlert,
  not_recommended: ShieldAlert,
  unknown: HelpCircle,
};

const STATUS_TONE: Record<CropSuitabilityStatus, RiskTone> = {
  suitable: "ok",
  moderate: "warn",
  risky: "bad",
  not_recommended: "bad",
  unknown: "neutral",
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
  const { m } = useMarketingCopy();
  const product = m.product;

  function label(): string {
    switch (status) {
      case "suitable":
        return product.riskSuitable;
      case "moderate":
        return product.riskModerate;
      case "risky":
        return product.riskRisky;
      case "not_recommended":
        return product.riskNotRecommended;
      default:
        return product.riskUnknown;
    }
  }

  const tone = STATUS_TONE[status];
  const text = label();

  if (compact) {
    return (
      <span
        className={cn("inline-flex size-2.5 rounded-full", DOT_CLASSES[tone], className)}
        aria-label={text}
        role="img"
      />
    );
  }

  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {text}
    </span>
  );
}

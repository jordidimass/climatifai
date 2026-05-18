"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { CROPS, getCrop } from "@/lib/api/crops";
import { cn } from "@/lib/utils";
import { useCropPickerStore } from "@/stores/crop-picker-store";
import { useSelectionStore } from "@/stores/selection-store";
import type { CropSuitability, CropSuitabilityResponse } from "@/types/agri";
import type { Crop, CropId } from "@/types/crop";
import type { MarketingCopy } from "@/lib/marketing-copy";
import { Button } from "@/components/ui/button";

type ProductCopy = MarketingCopy["product"];

function scoreTxt(score?: number | null) {
  return typeof score === "number" ? String(Math.round(score)) : "—";
}

function suitabilityBadgeLabel(suitability: CropSuitability | undefined, p: ProductCopy) {
  if (!suitability) return null;
  const s = scoreTxt(suitability.score);
  switch (suitability.status) {
    case "suitable":
      return {
        label: p.cropGridBadgeSuitable.replace("{{score}}", s),
        className: "bg-primary/15 text-primary",
      };
    case "moderate":
      return {
        label: p.cropGridBadgeModerate.replace("{{score}}", s),
        className: "bg-accent text-accent-foreground",
      };
    case "risky":
      return {
        label: p.cropGridBadgeRisky.replace("{{score}}", s),
        className: "bg-anomaly-warm/15 text-anomaly-warm",
      };
    default:
      return null;
  }
}

export function CropGridPicker() {
  const { m } = useMarketingCopy();
  const p = m.product;

  const region = useSelectionStore((s) => s.region);
  const setCrop = useSelectionStore((s) => s.setCrop);
  const mode = useCropPickerStore((s) => s.mode);
  const setMode = useCropPickerStore((s) => s.setMode);
  const selectedAdvisorCropId = useCropPickerStore((s) => s.selectedAdvisorCropId);
  const selectAdvisorCrop = useCropPickerStore((s) => s.selectAdvisorCrop);
  const compareSelection = useCropPickerStore((s) => s.compareSelection);
  const toggleCompareCrop = useCropPickerStore((s) => s.toggleCompareCrop);
  const fetchAdvisor = useCropPickerStore((s) => s.fetchAdvisor);
  const fetchCompare = useCropPickerStore((s) => s.fetchCompare);
  const loading = useCropPickerStore((s) => s.loading);
  const error = useCropPickerStore((s) => s.error);
  const advisorResponse = useCropPickerStore((s) => s.advisorResponse);
  const compareResponse = useCropPickerStore((s) => s.compareResponse);
  const [suitability, setSuitability] = React.useState<CropSuitabilityResponse | null>(null);
  const [suitabilityError, setSuitabilityError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    fetch("/api/agri/suitability", {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        location: {
          lat: region.center.lat,
          lng: region.center.lng,
          label: `${region.name}, ${region.country}`,
          regionId: region.id,
        },
        cropIds: CROPS.map((crop) => crop.id),
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(p.cropGridFetchSuitabilityFailed);
        return response.json() as Promise<CropSuitabilityResponse>;
      })
      .then((data) => {
        setSuitability(data);
        setSuitabilityError(null);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSuitabilityError(error instanceof Error ? error.message : p.cropGridUnexpected);
      });

    return () => controller.abort();
  }, [
    region.center.lat,
    region.center.lng,
    region.country,
    region.id,
    region.name,
    p.cropGridFetchSuitabilityFailed,
    p.cropGridUnexpected,
  ]);

  const suitabilityByCrop = React.useMemo(() => {
    return new Map(suitability?.crops.map((item) => [item.cropId, item]));
  }, [suitability]);

  React.useEffect(() => {
    if (mode !== "advisor" || !selectedAdvisorCropId) return;
    if (isCropBlocked(suitabilityByCrop.get(selectedAdvisorCropId))) return;

    const timer = window.setTimeout(() => {
      void fetchAdvisor(region.id, selectedAdvisorCropId);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchAdvisor, mode, region.id, selectedAdvisorCropId, suitabilityByCrop]);

  function handleAdvisorSelect(crop: Crop) {
    if (isCropBlocked(suitabilityByCrop.get(crop.id))) return showUnavailableToast();
    selectAdvisorCrop(crop.id);
    setCrop(crop);
  }

  function handleCompareToggle(crop: Crop) {
    if (isCropBlocked(suitabilityByCrop.get(crop.id))) return showUnavailableToast();
    toggleCompareCrop(crop.id);

    if (compareSelection.length === 0) setCrop(crop);
  }

  function showUnavailableToast() {
    toast.warning(p.cropGridToastUnavailable);
  }

  const canCompare = compareSelection.length === 2;

  return (
    <div className="space-y-3">
      <div className="flex rounded-full border border-border bg-muted/40 p-1">
        <ModeButton active={mode === "advisor"} onClick={() => setMode("advisor")}>
          {p.cropGridAdvisor}
        </ModeButton>
        <ModeButton active={mode === "compare"} onClick={() => setMode("compare")}>
          {p.cropGridCompare}
        </ModeButton>
      </div>

      <div
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        role={mode === "advisor" ? "radiogroup" : "group"}
        aria-label={p.cropGridAria}
      >
        {CROPS.map((crop) => {
          const cropSuitability = suitabilityByCrop.get(crop.id);
          const blocked = isCropBlocked(cropSuitability);
          const selected =
            mode === "advisor"
              ? selectedAdvisorCropId === crop.id
              : compareSelection.includes(crop.id);

          return (
            <CropCard
              key={crop.id}
              crop={crop}
              mode={mode}
              selected={selected}
              disabled={blocked}
              suitability={cropSuitability}
              copy={p}
              onClick={() =>
                mode === "advisor" ? handleAdvisorSelect(crop) : handleCompareToggle(crop)
              }
            />
          );
        })}
      </div>

      {mode === "compare" && canCompare && (
        <Button
          type="button"
          className="w-full rounded-full"
          disabled={loading}
          onClick={() => void fetchCompare(region.id)}
        >
          {loading ? p.cropGridCompareRunning : p.cropGridCompareRun}
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        {`${p.cropGridSourcePrefix}: ${suitability?.sourceLabel ?? p.cropGridSourcePending}`}
        {suitabilityError ? ` · ${suitabilityError}` : null}
      </p>

      <StatusLine
        copy={p}
        loading={loading}
        error={error}
        mode={mode}
        advisorTitle={advisorResponse?.advisories?.[0]?.title}
        compareSummary={compareResponse?.summary}
        compareSelection={compareSelection}
      />
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function CropCard({
  crop,
  mode,
  selected,
  disabled,
  suitability,
  copy: p,
  onClick,
}: {
  crop: Crop;
  mode: "advisor" | "compare";
  selected: boolean;
  disabled: boolean;
  suitability?: CropSuitability;
  copy: ProductCopy;
  onClick: () => void;
}) {
  const badge = suitabilityBadgeLabel(suitability, p);
  return (
    <button
      type="button"
      role={mode === "advisor" ? "radio" : "checkbox"}
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      onClick={onClick}
      className={cn(
        "relative flex min-h-24 flex-col items-start justify-between rounded-xl border bg-card/50 p-3 text-left transition-all",
        "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card/80",
        selected && "border-primary ring-2 ring-primary/35",
        suitability?.status === "suitable" && !selected && "border-primary/40",
        suitability?.status === "risky" && !selected && "border-anomaly-warm/50",
        disabled &&
          "cursor-not-allowed border-border/70 bg-muted/35 opacity-45 hover:translate-y-0 hover:border-border/70 hover:bg-muted/35",
      )}
    >
      <span className="text-[32px] leading-none" aria-hidden="true">
        {crop.iconEmoji}
      </span>
      <span className="mt-2 text-sm font-medium leading-tight">{crop.name}</span>
      {selected && (
        <span className="absolute right-2 top-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" aria-hidden="true" />
        </span>
      )}
      {disabled && (
        <span className="numeric mt-1 text-[10px] text-muted-foreground">
          {suitability?.status === "not_recommended"
            ? p.cropGridDisabledNotRecommended
            : p.cropGridDisabledNoData}
        </span>
      )}
      {!disabled && badge && (
        <span className={cn("numeric mt-1 rounded-full px-1.5 py-0.5 text-[10px]", badge.className)}>
          {badge.label}
        </span>
      )}
    </button>
  );
}

function isCropBlocked(suitability?: CropSuitability) {
  return suitability?.status === "unknown" || suitability?.status === "not_recommended";
}

function StatusLine({
  copy: p,
  loading,
  error,
  mode,
  advisorTitle,
  compareSummary,
  compareSelection,
}: {
  copy: ProductCopy;
  loading: boolean;
  error: string | null;
  mode: "advisor" | "compare";
  advisorTitle?: string;
  compareSummary?: string;
  compareSelection: CropId[];
}) {
  if (loading) {
    return <p className="text-xs text-muted-foreground">{p.cropGridStatusConsulting}</p>;
  }
  if (error) {
    return <p className="text-xs text-destructive">{error}</p>;
  }
  if (mode === "advisor" && advisorTitle) {
    return (
      <p className="text-xs text-muted-foreground">
        {`${p.cropGridPanelReadyPrefix} ${advisorTitle}`}
      </p>
    );
  }
  if (mode === "compare" && compareSummary) {
    return <p className="text-xs text-muted-foreground">{compareSummary}</p>;
  }
  if (mode === "compare" && compareSelection.length === 1) {
    const crop = getCrop(compareSelection[0]);
    const tmpl = crop
      ? p.cropGridCompareSelectAnother.replace("{{crop}}", crop.name)
      : p.cropGridCompareSelectAnother.replace("{{crop}}", "").trim();
    return <p className="text-xs text-muted-foreground">{tmpl}</p>;
  }
  return null;
}

export { CropGridPicker as CropPicker };

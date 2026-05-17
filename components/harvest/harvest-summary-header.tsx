"use client";

import * as React from "react";

import { RiskBadge } from "@/components/data/risk-badge";
import { getSowingPreset } from "@/lib/constants/sowing-presets";
import { useSelectionStore } from "@/stores/selection-store";
import type { CropSuitability, CropSuitabilityStatus } from "@/types/agri";

function formatDate(iso: string) {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Intl.DateTimeFormat("es-419", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(y, m - 1, d));
  } catch {
    return iso;
  }
}

interface AdvisorResponse {
  suitability?: CropSuitability;
  sourceLabel?: string;
}

function useSuitabilityStatus(
  regionId: string,
  cropId: string,
): CropSuitabilityStatus {
  const [cache, setCache] = React.useState<{
    key: string;
    status: CropSuitabilityStatus;
  } | null>(null);
  const key = `${regionId}:${cropId}`;

  React.useEffect(() => {
    const controller = new AbortController();

    fetch("/api/agri/advisor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ regionId, cropId }),
      signal: controller.signal,
    })
      .then((r) => (r.ok ? (r.json() as Promise<AdvisorResponse>) : null))
      .then((json) => {
        if (json?.suitability?.status) {
          setCache({ key, status: json.suitability.status });
        }
      })
      .catch(() => {
        /* aborted or network error — fall back to "unknown" via key mismatch */
      });

    return () => controller.abort();
  }, [regionId, cropId, key]);

  return cache?.key === key ? cache.status : "unknown";
}

export function HarvestSummaryHeader() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const sowingPresetId = useSelectionStore((s) => s.sowingPresetId);
  const sowingDate = useSelectionStore((s) => s.sowingDate);
  const preset = getSowingPreset(sowingPresetId);
  const matchingPreset = preset?.cropId === crop.id ? preset : undefined;
  const status = useSuitabilityStatus(region.id, crop.id);

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">Resultado de análisis</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
            {region.name}{" "}
            <span className="text-muted-foreground/80">·</span>{" "}
            <span className="italic text-foreground/85">{crop.name}</span>
          </h1>
          <RiskBadge status={status} />
        </div>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          {region.summary}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Siembra:{" "}
          <span className="numeric font-medium text-foreground">
            {formatDate(sowingDate)}
          </span>
          {matchingPreset && (
            <>
              {" "}
              ·{" "}
              <span className="font-medium text-foreground">{matchingPreset.label}</span>
            </>
          )}
        </p>
      </div>
      <p className="numeric text-xs text-muted-foreground">
        Línea base 1991–2020 · Proyección SSP3-7.0 · 2031–2050
      </p>
    </div>
  );
}

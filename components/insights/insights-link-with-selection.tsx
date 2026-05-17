"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { buildSelectionSearchParams } from "@/components/selection/selection-from-search-params";
import { useSelectionStore } from "@/stores/selection-store";

/**
 * Builds `/insights?regionId=&cropId=&date=&lat=&…` from the selection store so
 * Hallazgos reusa la ubicación definida en Analizar siembra · Resultado.
 */
export function InsightsLinkWithSelection(
  props: Omit<ComponentProps<typeof Link>, "href">,
) {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const sowingDate = useSelectionStore((s) => s.sowingDate);
  const customLocation = useSelectionStore((s) => s.customLocation);

  const qs = buildSelectionSearchParams({
    region,
    crop,
    sowingDate,
    customLocation,
  }).toString();

  return <Link {...props} href={`/insights?${qs}`} />;
}

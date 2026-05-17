"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  buildFireMapSearchParams,
  parseFireUrlParams,
} from "@/components/map/fire-url-state";
import { useFireStore } from "@/stores/fire-store";
import { useSelectionStore } from "@/stores/selection-store";

const URL_DEBOUNCE_MS = 150;

export function FireParamsHydrator() {
  const params = useSearchParams();
  const paramsKey = params.toString();

  const setDayRange = useFireStore((s) => s.setDayRange);
  const setSources = useFireStore((s) => s.setSources);
  const setViewMode = useFireStore((s) => s.setViewMode);
  const setOpacity = useFireStore((s) => s.setOpacity);
  const setWindowHours = useFireStore((s) => s.setWindowHours);
  const setPlayhead = useFireStore((s) => s.setPlayhead);

  React.useEffect(() => {
    const parsed = parseFireUrlParams(new URLSearchParams(paramsKey));
    if (parsed.dayRange != null) setDayRange(parsed.dayRange);
    if (parsed.sources) setSources(parsed.sources);
    if (parsed.viewMode) setViewMode(parsed.viewMode);
    if (parsed.opacity != null) setOpacity(parsed.opacity);
    if (parsed.windowHours != null) setWindowHours(parsed.windowHours);
    if (parsed.playhead != null) setPlayhead(parsed.playhead);
  }, [
    paramsKey,
    setDayRange,
    setSources,
    setViewMode,
    setOpacity,
    setWindowHours,
    setPlayhead,
  ]);

  return null;
}

export function FireUrlMirror() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.toString();

  const region = useSelectionStore((s) => s.region);
  const customLocation = useSelectionStore((s) => s.customLocation);

  const dayRange = useFireStore((s) => s.dayRange);
  const sources = useFireStore((s) => s.sources);
  const viewMode = useFireStore((s) => s.viewMode);
  const opacity = useFireStore((s) => s.opacity);
  const windowHours = useFireStore((s) => s.windowHours);
  const playhead = useFireStore((s) => s.playhead);

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = buildFireMapSearchParams(
        { region, customLocation },
        {
          dayRange,
          sources,
          viewMode,
          opacity,
          windowHours,
          playhead,
        },
      ).toString();

      if (next === currentSearch) return;

      const url = next.length > 0 ? `${pathname}?${next}` : pathname;
      router.replace(url, { scroll: false });
    }, URL_DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [
    pathname,
    currentSearch,
    region,
    customLocation,
    dayRange,
    sources,
    viewMode,
    opacity,
    windowHours,
    playhead,
    router,
  ]);

  return null;
}

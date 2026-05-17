"use client";

import { useSelectionStore } from "@/stores/selection-store";
import { cn } from "@/lib/utils";

export function RegionFocusCard({ className }: { className?: string }) {
  const region = useSelectionStore((s) => s.region);
  const customLocation = useSelectionStore((s) => s.customLocation);

  const title = customLocation?.label ?? `${region.name} · ${region.country}`;
  const lat = customLocation?.lat ?? region.center.lat;
  const lng = customLocation?.lng ?? region.center.lng;
  const elevation = customLocation?.elevation;

  return (
    <div
      className={cn(
        "glass pointer-events-none rounded-lg px-3 py-2 text-xs shadow-sm",
        className,
      )}
    >
      <p className="eyebrow">Área de enfoque</p>
      <p className="mt-0.5 font-medium text-foreground">{title}</p>
      <p className="numeric mt-0.5 text-[10px] text-muted-foreground">
        {lat.toFixed(2)}°, {lng.toFixed(2)}°
        {typeof elevation === "number" ? ` · ${Math.round(elevation)} m` : ""}
      </p>
      {customLocation ? (
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Región registrada:{" "}
          <span className="font-medium text-foreground">{region.name}</span>
        </p>
      ) : null}
    </div>
  );
}

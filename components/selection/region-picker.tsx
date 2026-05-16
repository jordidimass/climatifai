"use client";

import { getRegion, REGIONS } from "@/lib/api/regions";
import { useSelectionStore } from "@/stores/selection-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegionPicker() {
  const region = useSelectionStore((s) => s.region);
  const setRegion = useSelectionStore((s) => s.setRegion);

  return (
    <div className="space-y-1.5">
      <label htmlFor="region-select" className="eyebrow">
        Region
      </label>
      <Select
        value={region.id}
        onValueChange={(value) => {
          const next = getRegion(value);
          if (next) setRegion(next);
        }}
      >
        <SelectTrigger id="region-select" className="w-full">
          <SelectValue placeholder="Select a region" />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {r.name}{" "}
                  <span className="text-muted-foreground numeric">
                    · {r.country}
                  </span>
                </span>
                {r.subdivision && (
                  <span className="text-xs text-muted-foreground">
                    {r.subdivision}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
        {region.summary}
      </p>
    </div>
  );
}

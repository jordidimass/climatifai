"use client";

import { CROPS, getCrop } from "@/lib/api/crops";
import { useSelectionStore } from "@/stores/selection-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CropPicker() {
  const crop = useSelectionStore((s) => s.crop);
  const setCrop = useSelectionStore((s) => s.setCrop);

  return (
    <div className="space-y-1.5">
      <label htmlFor="crop-select" className="eyebrow">
        Cultivo
      </label>
      <Select
        value={crop.id}
        onValueChange={(value) => {
          const next = getCrop(value);
          if (next) setCrop(next);
        }}
      >
        <SelectTrigger id="crop-select" className="w-full">
          <SelectValue placeholder="Selecciona un cultivo" />
        </SelectTrigger>
        <SelectContent>
          {CROPS.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <div className="flex flex-col">
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-muted-foreground">
                  {c.scientificName}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
        {crop.tagline}
      </p>
    </div>
  );
}

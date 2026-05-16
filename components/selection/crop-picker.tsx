"use client";

import { useRouter } from "next/navigation";

import { CROPS, getCrop } from "@/lib/api/crops";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectionStore } from "@/stores/selection-store";
import { GitCompare } from "lucide-react";

export function CropPicker() {
  const router = useRouter();
  const crop = useSelectionStore((s) => s.crop);
  const setCrop = useSelectionStore((s) => s.setCrop);
  const comparisonMode = useSelectionStore((s) => s.comparisonMode);
  const enterComparisonMode = useSelectionStore((s) => s.enterComparisonMode);
  const leaveComparisonMode = useSelectionStore((s) => s.leaveComparisonMode);

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
      <div className="flex flex-wrap gap-2 pt-2">
        {comparisonMode ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => {
              leaveComparisonMode();
              router.push("/analizar-siembra/resultado");
            }}
          >
            Salir del modo comparación
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-xs"
            onClick={() => {
              enterComparisonMode();
              router.push("/dashboard/compare");
            }}
          >
            <GitCompare className="size-3.5 shrink-0" aria-hidden />
            Comparar cultivos…
          </Button>
        )}
      </div>
      <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
        {crop.tagline}
      </p>
    </div>
  );
}

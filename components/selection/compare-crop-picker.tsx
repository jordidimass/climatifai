"use client";

import { useEffect, useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CROPS } from "@/lib/api/crops";
import { useSelectionStore } from "@/stores/selection-store";

export function CompareCropPicker() {
  const crop = useSelectionStore((s) => s.crop);
  const compareCrop = useSelectionStore((s) => s.compareCrop);
  const setCompareCrop = useSelectionStore((s) => s.setCompareCrop);

  const options = useMemo(() => CROPS.filter((c) => c.id !== crop.id), [crop.id]);

  useEffect(() => {
    if (options.length === 0) return;
    const valid = options.some((o) => o.id === compareCrop.id);
    const conflictsWithPrimary = compareCrop.id === crop.id;
    if (!valid || conflictsWithPrimary) {
      setCompareCrop(options[0]!);
    }
  }, [options, compareCrop.id, crop.id, setCompareCrop]);

  const value =
    options.find((o) => o.id === compareCrop.id)?.id ?? options[0]?.id ?? "";

  return (
    <div className="space-y-2">
      <label htmlFor="compare-crop" className="eyebrow">
        Cultivo a comparar
      </label>
      <Select
        value={value}
        onValueChange={(id) => {
          const next = CROPS.find((c) => c.id === id);
          if (next && next.id !== crop.id) setCompareCrop(next);
        }}
        disabled={options.length === 0}
      >
        <SelectTrigger id="compare-crop" className="w-full">
          <SelectValue placeholder="Elegí un segundo cultivo" />
        </SelectTrigger>
        <SelectContent>
          {options.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <div className="flex flex-col py-px">
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-muted-foreground">
                  lado a lado vs. {crop.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Misma región del sidebar: ambos paneles muestran riesgos, series climáticas
        y líneas temporales tipo basados en datos de referencia hasta conectar feeds
        en vivo.
      </p>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { RegionPicker } from "@/components/selection/region-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOWING_PRESETS } from "@/lib/constants/sowing-presets";
import { useSelectionStore } from "@/stores/selection-store";
import type { SowingPresetId } from "@/lib/constants/sowing-presets";

export function AnalizarSiembraForm() {
  const router = useRouter();
  const sowingPresetId = useSelectionStore((s) => s.sowingPresetId);
  const sowingDate = useSelectionStore((s) => s.sowingDate);
  const setSowingDate = useSelectionStore((s) => s.setSowingDate);
  const applySowingPreset = useSelectionStore((s) => s.applySowingPreset);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/analizar-siembra/resultado");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass mx-auto flex max-w-lg flex-col gap-6 rounded-2xl p-8"
    >
      <div className="space-y-4">
        <RegionPicker />
        <div className="space-y-1.5">
          <label htmlFor="sowing-preset" className="eyebrow">
            Tipo de siembra
          </label>
          <Select
            value={sowingPresetId}
            onValueChange={(v) => applySowingPreset(v as SowingPresetId)}
          >
            <SelectTrigger id="sowing-preset" className="w-full">
              <SelectValue placeholder="Selecciona una combinación" />
            </SelectTrigger>
            <SelectContent>
              {SOWING_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="sowing-date" className="eyebrow">
            Fecha de siembra
          </label>
          <Input
            id="sowing-date"
            type="date"
            value={sowingDate}
            onChange={(e) => setSowingDate(e.target.value)}
            required
            className="h-10 w-full"
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full rounded-full">
        Buscar
      </Button>
    </form>
  );
}

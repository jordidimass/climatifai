"use client";

import { useRouter } from "next/navigation";

import { CropGridPicker } from "@/components/selection/crop-grid-picker";
import { LocationPicker } from "@/components/selection/location-picker";
import { buildSelectionSearchParams } from "@/components/selection/selection-from-search-params";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelectionStore } from "@/stores/selection-store";

export function AnalizarSiembraForm() {
  const router = useRouter();
  const sowingDate = useSelectionStore((s) => s.sowingDate);
  const setSowingDate = useSelectionStore((s) => s.setSowingDate);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = buildSelectionSearchParams(useSelectionStore.getState());
    router.push(`/analizar-siembra/resultado?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass mx-auto flex max-w-5xl flex-col gap-6 rounded-2xl p-6 md:p-8"
    >
      <div className="space-y-4">
        <LocationPicker />
        <div className="space-y-2">
          <div>
            <p className="eyebrow">Cultivo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Elige un cultivo para recibir asesoría o cambia a comparación para seleccionar dos.
            </p>
          </div>
          <CropGridPicker />
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

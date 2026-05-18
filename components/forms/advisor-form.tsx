"use client";

import { useRouter } from "next/navigation";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { CropGridPicker } from "@/components/selection/crop-grid-picker";
import { LocationPicker } from "@/components/selection/location-picker";
import { buildSelectionSearchParams } from "@/components/selection/selection-from-search-params";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelectionStore } from "@/stores/selection-store";

export function AdvisorForm() {
  const router = useRouter();
  const { m } = useMarketingCopy();
  const p = m.product;
  const sowingDate = useSelectionStore((s) => s.sowingDate);
  const setSowingDate = useSelectionStore((s) => s.setSowingDate);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = buildSelectionSearchParams(useSelectionStore.getState());
    router.push(`/advisor/results?${params.toString()}`);
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
            <p className="eyebrow">{p.advisorFormCropEyebrow}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.advisorFormCropHint}</p>
          </div>
          <CropGridPicker />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="sowing-date" className="eyebrow">
            {p.advisorFormSowingLabel}
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
        {p.advisorFormSubmit}
      </Button>
    </form>
  );
}

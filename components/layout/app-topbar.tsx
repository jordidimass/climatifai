"use client";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSelectionStore } from "@/stores/selection-store";

export function AppTopbar() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="min-w-0 flex-1">
          <p className="eyebrow truncate">
            {region.name} · {region.country}
            <span className="mx-2 text-foreground/30">/</span>
            {crop.name}
          </p>
        </div>

        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar regiones, cultivos..."
            className="w-72 pl-9"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificaciones"
          className="rounded-full"
        >
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

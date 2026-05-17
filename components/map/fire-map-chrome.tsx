"use client";

import Link from "next/link";
import { FileWarning, History, MapPinned, Search } from "lucide-react";
import { toast } from "sonner";

import { FirePerimetersLayer } from "@/components/map/layers/fire-perimeters-layer";
import { RegionMapPanel } from "@/components/map/region-map-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FireMapChromeProps = {
  phase: "browse" | "select";
  className?: string;
};

export function FireMapChrome({ phase, className }: FireMapChromeProps) {
  const primaryLeft =
    phase === "browse"
      ? [
          { key: "report", label: "Informe", icon: FileWarning },
          { key: "history", label: "Historial", icon: History },
        ]
      : [
          { key: "desc", label: "Descripción", icon: MapPinned },
          { key: "report", label: "Informe", icon: FileWarning },
        ];

  return (
    <div className={cn("relative flex flex-1 flex-col", className)}>
      <div className="relative min-h-[calc(100svh-3.5rem)] flex-1">
        <RegionMapPanel variant="full">
          <FirePerimetersLayer />
        </RegionMapPanel>

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 md:p-6">
          <div className="pointer-events-auto flex justify-end">
            <label className="sr-only" htmlFor="fire-map-search">
              Buscar en el mapa
            </label>
            <div className="relative w-full max-w-xs shadow-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="fire-map-search"
                placeholder="Buscar zona…"
                className="h-10 rounded-full bg-card/90 pl-10 shadow-sm backdrop-blur-sm"
                disabled
              />
            </div>
          </div>

          <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              {primaryLeft.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  type="button"
                  variant="secondary"
                  className="glass justify-start gap-2 rounded-full shadow-md"
                  onClick={() =>
                    toast.message("Pronto", {
                      description:
                        "Informes e historial de incendios se conectarán a datos satelitales.",
                    })
                  }
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Button>
              ))}
              {phase === "browse" ? (
                <Button
                  type="button"
                  variant="default"
                  className="mt-1 rounded-full shadow-md"
                  asChild
                >
                  <Link href="/mapa-incendios/seleccion">Selector en mapa</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-1 rounded-full bg-card/80 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/mapa-incendios">Vista amplia</Link>
                </Button>
              )}
            </div>

            <p className="glass max-w-sm rounded-xl px-4 py-3 text-xs leading-relaxed text-muted-foreground shadow-sm">
              <span className="eyebrow text-foreground/90">Beta · capas próximamente</span>
              <span className="mt-1 block">
                Visualización base de tu región; puntos calientes FIRMS y alertas
                irán aquí cuando conectemos la fuente.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

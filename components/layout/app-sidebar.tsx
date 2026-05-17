import Link from "next/link";
import { BarChart3, LineChart, Map, Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { RegionPicker } from "@/components/selection/region-picker";
import { Separator } from "@/components/ui/separator";

const NAV = [
  {
    href: "/analizar-siembra/resultado",
    label: "Resumen",
    icon: BarChart3,
  },
  {
    href: "/mapa-incendios",
    label: "Mapa",
    icon: Map,
    description: "Incendios · beta",
  },
  {
    href: "#",
    label: "Comparar",
    icon: LineChart,
    description: "Histórico vs. proyectado",
    disabled: true,
  },
  {
    href: "#",
    label: "Hallazgos",
    icon: Sparkles,
    description: "Agronomía con IA",
    disabled: true,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar/60 px-4 py-5 lg:flex lg:flex-col">
      <div className="px-2 pb-4">
        <Logo />
      </div>

      <div className="space-y-4 px-2 pb-6">
        <RegionPicker />
      </div>

      <Separator className="bg-sidebar-border/80" />

      <nav aria-label="Espacio de trabajo" className="mt-4 flex-1 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              aria-disabled={item.disabled || undefined}
              className={
                "group flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                (item.disabled
                  ? "pointer-events-none text-muted-foreground/70"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")
              }
            >
              <Icon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground"
                aria-hidden="true"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-medium">
                  {item.label}
                  {item.disabled && (
                    <span className="eyebrow ml-2 !text-[0.55rem] text-muted-foreground/70">
                      pronto
                    </span>
                  )}
                </span>
                {item.description && (
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="glass mt-4 rounded-lg px-3 py-3 text-xs leading-relaxed text-muted-foreground">
        <p className="eyebrow mb-1 text-foreground/80">Escenarios guardados</p>
        <p>
          Fija aquí combinaciones de región y cultivo cuando tengas varias que
          consultes seguido.
        </p>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { BarChart3, Map } from "lucide-react";

import { CompareSidebarLink } from "@/components/layout/compare-sidebar-link";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { CropPicker } from "@/components/selection/crop-picker";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  const { m } = useMarketingCopy();
  const p = m.product;

  const NAV = [
    {
      href: "/advisor/results",
      label: p.sidebarSummary,
      icon: BarChart3,
    },
    {
      href: "/fires",
      label: p.sidebarFiresLink,
      icon: Map,
      description: p.sidebarFiresBeta,
    },
  ] as const;

  return (
    <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar/60 px-4 py-5 lg:flex lg:flex-col">
      <div className="space-y-4 px-2 pb-6">
        <CropPicker />
      </div>

      <Separator className="bg-sidebar-border/80" />

      <nav aria-label={p.sidebarAria} className="mt-4 flex-1 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                "group flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }
            >
              <Icon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground"
                aria-hidden="true"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-medium">{item.label}</span>
                {"description" in item && item.description ? (
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
        <CompareSidebarLink />
      </nav>

      <div className="glass mt-4 rounded-lg px-3 py-3 text-xs leading-relaxed text-muted-foreground">
        <p className="eyebrow mb-1 text-foreground/80">{p.sidebarScenariosEyebrow}</p>
        <p>{p.sidebarScenariosBody}</p>
      </div>
    </aside>
  );
}

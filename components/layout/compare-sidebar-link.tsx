"use client";

import Link from "next/link";
import { LineChart } from "lucide-react";

import { useSelectionStore } from "@/stores/selection-store";

export function CompareSidebarLink() {
  const enterComparisonMode = useSelectionStore((s) => s.enterComparisonMode);

  return (
    <Link
      href="/dashboard/compare"
      onClick={() => enterComparisonMode()}
      className="group flex items-start gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
    >
      <LineChart
        className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground"
        aria-hidden="true"
      />
      <span className="flex flex-col leading-tight">
        <span className="font-medium">Comparar</span>
        <span className="text-xs text-muted-foreground">
          Dos cultivos · misma región
        </span>
      </span>
    </Link>
  );
}

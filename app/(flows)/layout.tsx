import { Suspense } from "react";

import { AlertsToaster } from "@/components/data/alerts-toaster";
import { SelectionFromSearchParams } from "@/components/selection/selection-from-search-params";

export default function FlowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Suspense fallback={null}>
        <SelectionFromSearchParams />
      </Suspense>
      {children}
      <AlertsToaster />
    </div>
  );
}

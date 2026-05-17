import { Suspense } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SiteHeader } from "@/components/layout/site-header";
import { SelectionFromSearchParams } from "@/components/selection/selection-from-search-params";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-1 flex-col">
      <Suspense fallback={null}>
        <SelectionFromSearchParams />
      </Suspense>
      <SiteHeader />
      <div className="flex min-h-0 min-w-0 flex-1">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

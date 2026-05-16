import { Skeleton } from "@/components/ui/skeleton";

export default function CompareDashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-[min(100%,420px)]" />
          <Skeleton className="h-16 w-[min(100%,520px)]" />
        </div>
        <Skeleton className="h-10 w-44 shrink-0 rounded-full" />
      </div>
      <div className="glass grid gap-4 rounded-xl border border-border/70 p-4 lg:grid-cols-[minmax(160px,220px)_1fr]">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="min-h-[420px] w-full rounded-xl" />
        <Skeleton className="min-h-[420px] w-full rounded-xl" />
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function SiembraResultadoLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 animate-pulse flex-col gap-6 px-6 py-8">
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-[4.75rem] w-full rounded-xl" />
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <Skeleton className="h-28 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="min-h-[420px] rounded-xl" />
          <Skeleton className="min-h-[320px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function InsightsLoading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 pb-10">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-[min(100%,460px)]" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="min-h-[28rem] w-full rounded-xl" />
    </div>
  );
}

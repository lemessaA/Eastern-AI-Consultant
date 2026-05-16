import { Skeleton } from "@/components/ui/skeleton";

/** Fast shell while App Router resolves protected routes → improves perceived latency. */
export default function AppLoading() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-72 max-w-full" />
        </div>
        <Skeleton className="h-12 w-40 shrink-0" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl md:h-80" />
    </div>
  );
}

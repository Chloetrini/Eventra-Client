import { Skeleton } from "@/components/ui/skeleton";

export function EventsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col min-[480px]:flex-row items-start justify-between gap-4">
        <div className="space-y-2 w-full min-[480px]:w-auto">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-12 w-full min-[480px]:w-40 rounded-[7px]" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <Skeleton className="h-11 w-full lg:w-[520px] rounded-[10px]" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-[20px]" />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="hidden sm:flex items-center gap-4 px-4 py-3 border-b border-border">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16 ml-auto" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="size-10 rounded-md shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-2/3 max-w-[220px]" />
              <Skeleton className="h-3 w-1/3 max-w-[140px]" />
            </div>
            <Skeleton className="hidden sm:block h-6 w-16 rounded-full shrink-0" />
            <Skeleton className="hidden sm:block h-6 w-20 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

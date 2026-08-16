import { Skeleton } from "@/components/ui/skeleton";

export function OrganizerEventDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner */}
      <Skeleton className="h-24 w-full rounded-xl" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2 shrink-0">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Hero */}
      <Skeleton className="h-56 w-full rounded-xl" />

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-6 space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="border border-border rounded-xl p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
          <div className="border border-border rounded-xl p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

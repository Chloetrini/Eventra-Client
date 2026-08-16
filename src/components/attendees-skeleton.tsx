import { Skeleton } from "@/components/ui/skeleton";

export function AttendeesSkeleton() {
  return (
    <div className="max-w-[1147px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      {/* Event picker + stats */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-11 w-48 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Search + filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <Skeleton className="h-10 w-full lg:w-72 rounded-[7px]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16 rounded-[7px]" />
          <Skeleton className="h-9 w-24 rounded-[7px]" />
          <Skeleton className="h-9 w-20 rounded-[7px]" />
        </div>
      </div>

      {/* Attendee table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="size-[50px] rounded-full shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-1/3 max-w-[180px]" />
              <Skeleton className="h-3 w-1/2 max-w-[220px]" />
            </div>
            <Skeleton className="hidden sm:block h-4 w-16 shrink-0" />
            <Skeleton className="hidden sm:block h-4 w-20 shrink-0" />
            <Skeleton className="h-9 w-[122px] rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

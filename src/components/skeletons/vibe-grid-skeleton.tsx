import { Skeleton } from "@/components/ui/skeleton";

/** Matches VibeGrid's "Browse by vibe" category tiles — mobile horizontal
 * scroll row + desktop 4-col grid — while categories are loading. */
export function VibeGridSkeleton() {
  return (
    <section className="mb-5 md:mb-10">
      <div className="flex flex-row justify-between items-end mb-2 md:mb-8.25 mt-4 lg:mt-6.75">
        <div className="space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="hidden sm:block h-8 w-28 rounded-2xl" />
      </div>

      {/* mobile */}
      <div className="md:hidden -mx-4 sm:-mx-6">
        <div className="flex gap-3.5 overflow-x-auto px-4 sm:px-6 pb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="flex-none w-[75vw] max-w-75 h-42.5 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* desktop */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-50 rounded-2xl" />
        ))}
      </div>
    </section>
  );
}

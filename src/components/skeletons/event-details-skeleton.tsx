import { Skeleton } from "@/components/ui/skeleton";
import PageWrapper from "../page-wrapper";

/** Matches the event details page's real layout — breadcrumb, hero image,
 * two-column info/ticket sidebar — instead of one generic gray block, so
 * the page doesn't visibly jump around once the real content lands. */
export function EventDetailsSkeleton() {
  return (
    <PageWrapper className="p-[20px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 pb-4 mt-3">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Hero image */}
      <Skeleton className="h-74 md:h-131.75 w-full rounded-2xl" />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        {/* Left column */}
        <div className="flex-1 space-y-8">
          {/* Info strip */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-2 border p-2 rounded-xl">
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Map */}
          <Skeleton className="h-64 w-full rounded-2xl" />

          {/* Organizer */}
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Right column — ticket sidebar */}
        <div className="w-full lg:sticky lg:top-6 lg:w-85 lg:self-start space-y-3">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </PageWrapper>
  );
}

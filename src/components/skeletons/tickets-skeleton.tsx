import { Skeleton } from "@/components/ui/skeleton";

/** Matches TicketCard's shape (green ticket block + QR panel) while
 * My Tickets is loading — was previously just "Loading your tickets…" text. */
function TicketCardSkeleton() {
  return (
    <div className="w-full mb-8 flex flex-col lg:flex-row items-stretch gap-0">
      <div className="flex flex-col justify-between w-full lg:w-[811px] xl:w-full h-auto lg:h-[404px] bg-muted p-4 min-[400px]:p-5 lg:p-8 rounded-[20px] space-y-6">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-8 w-24 rounded-[10px]" />
          <Skeleton className="h-8 w-20 rounded-[10px]" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
      <div className="bg-muted flex flex-col items-center lg:w-[397px] lg:h-[390px] rounded-lg justify-center gap-4 p-3 min-[400px]:p-4">
        <Skeleton className="h-[120px] w-[120px] rounded-xl" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function TicketsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </div>
  );
}

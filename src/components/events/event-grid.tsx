import { EventCard } from "./event-card";
import { EventCardSkeleton } from "./event-card-skeleton";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event-types";

type EventGridProps = {
  events: Event[];
  isLoading?: boolean;
  skeletonCount?: number;
  savedIds?: string[];
  className?: string;
  onToggleSave?: (id: string) => void;
  emptyMessage?: string;
};

export function EventGrid({
  events,
  isLoading = false,
  skeletonCount = 9,
  savedIds = [],
  onToggleSave,
  className,
  emptyMessage = "No events match your filters. Try clearing a few.",
}: EventGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full xl:w-[946px]", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-[32px] sm:grid-cols-2 lg:grid-cols-3 w-full xl:w-[946px]", className)}>
      {events.map((event) => (
        <EventCard
          key={event.slug}
          event={event}
          isSaved={savedIds.includes(event.slug)}
          onToggleSave={onToggleSave}
          variant="explore"
        />
      ))}
    </div>
  );
}
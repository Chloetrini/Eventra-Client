import { EventCard } from "./event-card";
import { EventCardSkeleton } from "./event-card-skeleton";
import type { Event } from "@/types/event-types";

type EventGridProps = {
  events: Event[];
  isLoading?: boolean;
  skeletonCount?: number;
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  emptyMessage?: string;
};

export function EventGrid({
  events,
  isLoading = false,
  skeletonCount = 9,
  savedIds = [],
  onToggleSave,
  emptyMessage = "No events match your filters. Try clearing a few.",
}: EventGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="grid gap-[32px] sm:grid-cols-2 lg:grid-cols-3 w-full xl:w-[946px]">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isSaved={savedIds.includes(event.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
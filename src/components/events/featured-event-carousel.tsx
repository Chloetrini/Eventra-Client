import { useEffect, useState } from "react";
import type { Event } from "@/types/event-types";
import { FeaturedEventCard } from "@/components/events/featured-event-class";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface FeaturedEventsCarouselProps {
  events: Event[];
  onGetTickets?: (slug: string) => void;
}

/**
 * Explore's featured spot used to be a single static <FeaturedEventCard />
 * fed by `events.find(e => e.isPromoted)` — whichever promoted event
 * happened to sort first "won" the spot, and every OTHER promoted event
 * was filtered out of the page entirely (see the old `rest` filter in
 * explore/index.tsx). With multiple promoted events (e.g. several
 * featured parties in the same city), only one was ever visible anywhere.
 *
 * This shows all promoted events, one at a time, auto-advancing every 6s
 * (still swipeable/arrow-navigable, and it pauses advancing — not
 * rendering — once there's only one left) instead of pinning a single
 * event in that spot.
 */
export function FeaturedEventsCarousel({ events, onGetTickets }: FeaturedEventsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || events.length <= 1) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api, events.length]);

  if (events.length === 0) return null;

  // No need for carousel chrome (arrows) when there's only one to show.
  if (events.length === 1) {
    return <FeaturedEventCard event={events[0]} onGetTickets={onGetTickets} />;
  }

  return (
    <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem key={event.slug} className="basis-full">
            <FeaturedEventCard event={event} onGetTickets={onGetTickets} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4" />
      <CarouselNext className="-right-4" />
    </Carousel>
  );
}

import { useEffect, useState } from "react";
import type { Event } from "@/types/event-types";
import { FeaturedEventCard } from "@/components/events/featured-event-class";
import { cn } from "@/lib/utils";
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
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || events.length <= 1) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api, events.length]);

  // Tracks which slide is showing so the dots below can highlight it — the
  // arrows were positioned just off the edge of the card (`-left-4`/
  // `-right-4`), which on a narrow phone screen sits right at the edge of
  // the viewport and is easy to miss or clip, so on mobile it could look
  // like this never moves even though the 6s autoplay is still running.
  // Dots sit fully inside the card, always visible, and are directly
  // tappable — the same "this is a carousel, here's how to move it" cue
  // the desktop arrows give, just one that actually works at phone widths.
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (events.length === 0) return null;

  // No need for carousel chrome (arrows/dots) when there's only one to show.
  if (events.length === 1) {
    return <FeaturedEventCard event={events[0]} onGetTickets={onGetTickets} />;
  }

  return (
    <div className="w-full">
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem key={event.slug} className="basis-full">
              <FeaturedEventCard event={event} onGetTickets={onGetTickets} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 sm:-left-4" />
        <CarouselNext className="right-2 sm:-right-4" />
      </Carousel>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {events.map((event, index) => (
          <button
            key={event.slug}
            type="button"
            aria-label={`Show featured event ${index + 1} of ${events.length}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === current ? "w-5 bg-[#0F6E56] dark:bg-[#4ADE80]" : "w-1.5 bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}

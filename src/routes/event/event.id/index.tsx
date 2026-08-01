import { useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Event } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { EventHero } from "@/routes/event/event.id/EventHero";
import { EventInfo } from "@/routes/event/event.id/EventInfo";
import { AboutEvent } from "@/routes/event/event.id/AboutEvent";
import { EventLineUp } from "@/routes/event/event.id/EventLineUp";
import { EventMap } from "@/routes/event/event.id/EventMap";
import { EventOrganizer } from "@/routes/event/event.id/EventOrganizer";
import { GoodToKnow } from "@/routes/event/event.id/GoodToKnow";
import { RelatedEvents } from "@/routes/event/event.id/RelatedEvents";
import { FreeEventTicket } from "./FreeEventTicket";
import { PaidEventTicket } from "./PaidEventTicket";


const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  const { data, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await fetch("/data/events.json");
      const json: { events: Event[] } = await res.json();
      const found = json.events.find((e) => e.id === eventId && e.published);
      const related = found
        ? json.events.filter((e) => found.relatedEventIds.includes(e.id))
        : [];
      return { event: found ?? null, relatedEvents: related };
    },
  });

  const event = data?.event ?? null;
  const relatedEvents = data?.relatedEvents ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="h-96 w-full animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto container px-4 md:px-10 lg:px-12">
      <nav className="flex items-center gap-1 pb-4 text-xs text-muted-foreground">
        <a href="/explore" className="hover:text-foreground">
          Explore
        </a>
        <ChevronRight className="h-3 w-3" />
        <a href="/explore" className="hover:text-foreground capitalize">
          {event.category.toLowerCase()}
        </a>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{event.name}</span>
      </nav>
      <EventHero event={event} />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex-1 space-y-8">
          <EventInfo event={event} />
          <AboutEvent event={event} />
          <Separator />
          <EventLineUp lineup={event.lineup} />
          {event.lineup.length > 0 && <Separator />}
          <EventMap location={event.location} />
          <Separator />
          <EventOrganizer organizer={event.organizer} />
          <GoodToKnow items={event.goodToKnow} />
        </div>
        <div className="w-full lg:w-85 lg:sticky lg:top-6 lg:self-start">
          {event.priceType === "free" ? (
            <FreeEventTicket event={event} />
          ) : (
            <PaidEventTicket event={event} />
          )}
        </div>
      </div>
      <RelatedEvents events={relatedEvents} />
    </div>
  );
};

export default EventDetailPage;

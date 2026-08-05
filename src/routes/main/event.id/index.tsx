import { useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Separator } from "@/components/ui/separator";
import { fetchEventBySlug } from "@/lib/events-api";
import { fetchEventTickets } from "@/lib/tickets-api";
import { MOCK_EVENTS } from "@/lib/constants";
import { EventHero } from "@/components/event.details/EventHero";
import { EventInfo } from "@/components/event.details/EventInfo";
import { AboutEvent } from "@/components/event.details/AboutEvent";
import { EventLineUp } from "@/components/event.details/EventLineUp";
import { EventMap } from "@/components/event.details/EventMap";
import { EventOrganizer } from "@/components/event.details/EventOrganizer";
import { GoodToKnow } from "@/components/event.details/GoodToKnow";
import { RelatedEvents } from "@/components/event.details/RelatedEvents";
import { FreeEventTicket } from "../../../components/event.details/FreeEventTicket";
import { PaidEventTicket } from "../../../components/event.details/PaidEventTicket";
import { useSavedEvents } from "@/hooks/use-saved-events";

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { savedIds, toggleSave } = useSavedEvents();
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });

  // Ticket tiers come from their own endpoint (separate backend collection), keyed by slug
  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["event-tickets", slug],
    queryFn: () => fetchEventTickets(slug ?? ""),
    enabled: Boolean(slug),
  });

  // Resolve related events from the relatedEventSlugs array
  const relatedEvents = MOCK_EVENTS.filter((e) =>
    event?.relatedEventSlugs?.includes(e.slug)
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="h-96 w-full animate-pulse rounded-2xl bg-muted" />
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

  const isFree = event.minPrice === 0;

  return (
    <div className="container mx-auto px-4 md:px-10 lg:px-12  ">
      <nav className="flex items-center gap-1 pb-4 text-xs text-muted-foreground mt-3">
        <a href="/explore" className="hover:text-foreground">
          Explore
        </a>
        <ChevronRight className="h-3 w-3" />
        <a href="/explore" className="capitalize hover:text-foreground">
          {event.category.toLowerCase()}
        </a>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{event.title}</span>
      </nav>

      <EventHero event={event} 
      isSaved={savedIds.has(event.slug)}      // Set → array, because EventGrid wants string[]
  onToggleSave={toggleSave}
       
      />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex-1 space-y-8">
          <EventInfo event={event} />
          <AboutEvent event={event} />
          <Separator />
          
          {event.lineup && event.lineup.length > 0 && (
            <>
              <EventLineUp event={event} />
              <Separator />
            </>
          )}

          <EventMap location={event.venue} />
          
          {event.organizer && (
            <>
              <Separator />
              <EventOrganizer event={event} />
            </>
          )}

          {event.goodToKnow && event.goodToKnow.length > 0 && (
            <GoodToKnow items={event.goodToKnow} />
          )}
        </div>

        <div className="w-full lg:sticky lg:top-6 lg:w-85 lg:self-start">
          {ticketsLoading ? (
            <div className="h-96 w-full animate-pulse rounded-2xl bg-muted" />
          ) : isFree ? (
            <FreeEventTicket
              event={event}
              tiers={tickets?.tiers ?? []}
            />
          ) : (
            <PaidEventTicket
              event={event}
              tiers={tickets?.tiers ?? []}
              serviceFeePercent={tickets?.serviceFeePercent ?? 0}
            />
          )}
        </div>
      </div>

      {relatedEvents.length > 0 && <RelatedEvents events={relatedEvents} />}
    </div>
  );
};

export default EventDetailPage;
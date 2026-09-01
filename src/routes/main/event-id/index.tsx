import { useParams } from "react-router";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Separator } from "@/components/ui/separator";
import { fetchEvents } from "@/lib/events-api";
import { DEFAULT_FILTERS } from "@/types/event-types";
import { EventHero } from "@/components/event-details/EventHero";
import { EventInfo } from "@/components/event-details/EventInfo";
import { AboutEvent } from "@/components/event-details/AboutEvent";
import { EventLineUp } from "@/components/event-details/EventLineUp";
import { EventMap } from "@/components/event-details/EventMap";
import { EventOrganizer } from "@/components/event-details/EventOrganizer";
import { GoodToKnow } from "@/components/event-details/GoodToKnow";
import { RelatedEvents } from "@/components/event-details/RelatedEvents";
import { FreeEventTicket } from "@/components/event-details/FreeEventTicket";
import { PaidEventTicket } from "@/components/event-details/PaidEventTicket";
import { useSavedEvents } from "@/hooks/use-saved-events";

import PageWrapper from "@/components/page-wrapper";
import { useAuth } from "@/context/auth.context";
import { getExploreUrl } from "@/lib/explore-history";
import { useEvent, useEventTickets } from "@/hooks/use-event";
import { EventDetailsSkeleton } from "@/components/skeletons/event-details-skeleton";

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { savedIds, toggleSave } = useSavedEvents();
  const { data: event, isLoading } = useEvent(slug);

  const { data: allEventsData } = useQuery({
    queryKey: ["all-events"],
    queryFn: () => fetchEvents(DEFAULT_FILTERS),
    enabled: Boolean(event?.relatedEventSlugs?.length),
  });

  const relatedEvents = (allEventsData?.events ?? []).filter((e) =>
    event?.relatedEventSlugs?.includes(e.slug)
  );

  if (isLoading) {
    return <EventDetailsSkeleton />;
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
    <PageWrapper className="p-[20px] md:p-[40px] lg:p-[60px] xl:p-[80px] 2xl:p-[100px]">
      <nav className="flex items-center gap-1 pb-4 text-xs text-muted-foreground mt-3">
        <Link to={getExploreUrl()} className="hover:text-foreground">
          Explore
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={`/explore?categories=${event.categoryId ?? ""}`}
          className="capitalize hover:text-foreground"
        >
          {event.category.toLowerCase()}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{event.title}</span>
      </nav>

      <EventHero event={event}
        isSaved={user ? savedIds.has(event.slug) : false}
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
          {isLoading ? (
            <div className="h-96 w-full animate-pulse rounded-2xl bg-muted" />
          ) : isFree ? (
            <FreeEventTicket
              event={event}
              slug={slug}
            />
          ) : (
            <PaidEventTicket
              event={event}
              tiers={(event.ticketTypes ?? []).map((tt) => {
                const remaining = tt.quantity - tt.quantitySold;
                return {
                  id: tt._id,
                  type: tt.name,
                  description: tt.description,
                  unitPrice: tt.price,
                  quantityLeft: remaining,
                  availability: remaining <= 0 ? "sold out" as const
                    : remaining <= 10 ? "scarce" as const
                      : "available" as const,
                  purchaseLimitPerPerson: tt.purchaseLimitPerPerson,
                };
              })}
              serviceFeePercent={0}
              slug={slug}
            />
          )}
        </div>
      </div>

      {relatedEvents.length > 0 && <RelatedEvents events={relatedEvents} />}
    </PageWrapper>
  );
};

export default EventDetailPage;

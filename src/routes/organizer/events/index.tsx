import { useQuery } from "@tanstack/react-query";
import { data, useSearchParams } from "react-router";
import { getEvents } from "@/lib/api/event";
import type { Event } from "@/types/event";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { EventsHeader } from "@/components/events-header";
import { EventsFilterBar } from "@/components/events-filter-bar";
import { EventsTable } from "@/components/events-table";
import { useEffect, useState } from "react";
import { DeleteEventDialog } from "@/components/delete-event-dialog";

const STATUS_MAP: Record<string, Event["status"]> = {
  live: "Live",
  draft: "Draft",
  "sold-out": "Sold out",
  past: "Past",
  rejected: "Rejected",
};

export default function Events() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });
  console.log(
    "events data:",
    "isLoading:",
    isLoading,
    "isError:",
    isError,
  );

  const [events, setEvents] = useState<Event[]> ([])

  useEffect(() => {
    if (data) setEvents (data)
  }, [data])


  const [searchParams] = useSearchParams();
  const activeStatus = searchParams.get("status") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const [deletingEvent, setDeletingEvent] =  useState<Event | null>(null)

  const handleDelete = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e._id !== eventId))
  }

  const handleDuplicate = (event: Event) => {
    const duplicated: Event = {
        ...event,
        _id: crypto.randomUUID(),   //crypto.randomUUID() is a built-in browser function that generates a random unique string,
        eventTitle:`${event.eventTitle} (copy)`,
        status: "Draft"
    };
    setEvents((prev) => [duplicated, ...prev])
  }



  const filteredEvents = events?.filter((event) => {
    const matchesStatus =
      activeStatus === "all" || event.status === STATUS_MAP[activeStatus];

    const matchesSearch = event.eventTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <p className="text-center py-12 text-sm text-muted-foreground">
        Loading Events...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-12 text-sm text-red-500">
        Something went wrong loading events.
      </p>
    );
  }

  return (
    <div className="max-w-[1145px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AccountReviewBanner />
      <EventsHeader />
      <EventsFilterBar />
      <EventsTable events={filteredEvents}
      onDuplicate={handleDuplicate}
      onDeleteRequest={setDeletingEvent} />

      <DeleteEventDialog event={deletingEvent} 
      open={deletingEvent !== null}
      onOpenChange={(open) => !open && setDeletingEvent(null)}
      onConfirm={handleDelete}/>
       
      
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { data, useSearchParams } from "react-router";
import { fetchMyEvents } from "@/services/events-api";
import type { Event } from "@/types/event";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { EventsHeader } from "@/components/events-header";
import { EventsFilterBar } from "@/components/events-filter-bar";
import { EventsTable } from "@/components/events-table";
import { EventsSkeleton } from "@/components/skeletons/events-skeleton";
import { useEffect, useState } from "react";
import { useOrganizerStatus } from "@/services/organizer-api";

const STATUS_MAP: Record<string, Event["status"]> = {
  live: "Live",
  draft: "Draft",
  pending: "Pending",
  "sold-out": "Sold out",
  past: "Past",
  rejected: "Rejected",
  cancelled: "Cancelled",
  postponed: "Postponed",
};

export default function Events() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchMyEvents,
  });
  const { status } = useOrganizerStatus();
  const [events, setEvents] = useState<Event[]> ([])

  useEffect(() => {
    if (data) setEvents (data)
  }, [data])


  const [searchParams] = useSearchParams();
  const activeStatus = searchParams.get("status") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";

  // EventActionsMenu already deletes the event and invalidates the query
  // cache itself — this just drops the row immediately instead of
  // waiting on the next refetch.
  const handleEventDeleted = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e._id !== eventId));
  };

  const filteredEvents = events?.filter((event) => {
    const matchesStatus =
      activeStatus === "all" || event.status === STATUS_MAP[activeStatus];

    const matchesSearch = event.eventTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <EventsSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-center py-12 text-sm text-destructive">
        Something went wrong loading events.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <AccountReviewBanner status={status} />
      <EventsHeader />
      <EventsFilterBar />
      <EventsTable events={filteredEvents} onEventDeleted={handleEventDeleted} />
    </div>
  );
}

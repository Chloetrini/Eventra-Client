import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminEventsHeader from "@/components/admin/events/AdminEventsHeader";
import AdminEventsFilterBar, {
  type StatusFilterOption,
} from "@/components/admin/events/AdminEventsFilterBar";
import AdminEventsTable from "@/components/admin/events/AdminEventsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminEvents } from "@/hooks/use-admin-events";
import type { AdminEvent } from "@/types/admin-event";
import PageWrapper from "@/components/page-wrapper";

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilterOption>("all");

  // Debounced so typing a search term doesn't fire a request per
  // keystroke — the filtering itself now happens server-side (the `q`
  // param on GET /admin/events), unlike the old in-memory mock filter.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const { data: events, isLoading } = useAdminEvents(activeFilter, debouncedQuery);

  const handleEventClick = (event: AdminEvent) => {
    navigate(`/admin/events/${event._id}`);
  };

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      <AdminEventsHeader events={events ?? []} totalEvents={events?.length ?? 0} />

      <AdminEventsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <AdminEventsTable events={events ?? []} onEventClick={handleEventClick} />
      )}
    </PageWrapper>
  );
}

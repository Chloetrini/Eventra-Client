import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import AdminEventsHeader from "@/components/admin/events/AdminEventsHeader";
import AdminEventsFilterBar, {
  type StatusFilterOption,
} from "@/components/admin/events/AdminEventsFilterBar";
import AdminEventsTable from "@/components/admin/events/AdminEventsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAdminEvents } from "@/hooks/use-admin-events";
import type { AdminEvent } from "@/types/admin-event";
import PageWrapper from "@/components/page-wrapper";

const PAGE_SIZE = 20;

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const activeFilter =
    (searchParams.get("status") as StatusFilterOption) ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Live debounced search sync
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchInput.trim()) {
        params.set("q", searchInput.trim());
      } else {
        params.delete("q");
      }
      setSearchParams(params, { replace: true });
      setLimit(PAGE_SIZE);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useAdminEvents({
    page: 1,
    limit,
    q: searchQuery || undefined,
    status: activeFilter,
  });

  const eventsList = Array.isArray(data) ? data : data?.events ?? [];
  const meta = !Array.isArray(data) ? data?.meta : undefined;

  const handleFilterChange = (status: StatusFilterOption) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    setSearchParams(params);
    setLimit(PAGE_SIZE);
  };

  const handleEventClick = (event: AdminEvent) => {
    navigate(`/admin/events/${event._id}`);
  };

  const hasMore = meta
    ? meta.hasMore ?? (meta.page * meta.limit < meta.totalCount)
    : false;

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      <AdminEventsHeader
        events={eventsList}
        totalEvents={meta?.totalCount ?? eventsList.length}
      />

      <AdminEventsFilterBar
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center py-12 text-sm text-destructive">
          Something went wrong loading events
        </p>
      ) : (
        <>
          <AdminEventsTable
            events={eventsList}
            onEventClick={handleEventClick}
          />

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
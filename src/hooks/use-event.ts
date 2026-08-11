import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchEvents, fetchEventBySlug, fetchCategories } from "@/lib/events-api";
import type { EventFilters } from "@/types/event-types";
import { fetchEventTickets, fetchMyTickets } from "@/lib/tickets-api";

export const eventKeys = {
  all: ["events"] as const,
  list: (filters: Omit<EventFilters, "page">) => [...eventKeys.all, "list", filters] as const,
};

export function useEvents(filters: EventFilters) {
  // page is handled internally by useInfiniteQuery — strip it from the cache key
  // so changing OTHER filters (search, state, etc.) doesn't collide with pagination
  const { page, ...filtersWithoutPage } = filters;

  const query = useInfiniteQuery({
    queryKey: eventKeys.list(filtersWithoutPage),
    queryFn: ({ pageParam = 1 }) => fetchEvents({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  // Flatten all loaded pages into one events array, matching the shape
  // components already expect (data.events, data.total, data.hasMore)
  const events = query.data?.pages.flatMap((p) => p.events) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  const hasMore = query.hasNextPage ?? false;

  return {
    data: { events, total, hasMore },
    isLoading: query.isLoading,
    isFetching: query.isFetchingNextPage || query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    loadMore: query.fetchNextPage,
  };
}

export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
  return { categories: data ?? [], isLoading, isError };
}

export function useEvent(slug?: string) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });
}

// Ticket types for one event, by the event's real _id (only relevant for paid events)
export function useEventTickets(eventId?: string) {
  return useQuery({
    queryKey: ["event-tickets", eventId],
    queryFn: () => fetchEventTickets(eventId ?? ""),
    enabled: Boolean(eventId),
  });
}
export function useMyTickets() {
  return useQuery({
    queryKey: ["my-tickets"],
    queryFn: fetchMyTickets,
  });
}

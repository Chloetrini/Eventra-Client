import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchEvents, fetchEventBySlug, fetchCategories } from "@/lib/events-api";
import { fetchEventTickets, fetchMyTickets } from "@/lib/tickets-api";
import type { EventFilters } from "@/types/event-types";

export const eventKeys = {
  all: ["events"] as const,
  list: (filters: EventFilters) => [...eventKeys.all, "list", filters] as const,
};

export function useEvents(filters: EventFilters) {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => fetchEvents(filters),
    placeholderData: keepPreviousData,
  });
  return { data, isLoading, isFetching, isError, refetch };
}

export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
  return { categories: data ?? [], isLoading, isError };
}

// One event, by slug — used on the event detail page
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

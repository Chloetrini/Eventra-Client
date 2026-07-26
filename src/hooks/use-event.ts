import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/events-api";
import type { EventFilters } from "@/lib/schema";

// The whole filters object is the query key. Change any filter → new key →
// TanStack refetches and caches that exact combination.
export const eventKeys = {
  all: ["events"] as const,
  list: (filters: EventFilters) => [...eventKeys.all, "list", filters] as const,
};

export function useEvents(filters: EventFilters) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => fetchEvents(filters),
    // keeps old results on screen while new ones load — no empty flash
    placeholderData: keepPreviousData,
  });
}
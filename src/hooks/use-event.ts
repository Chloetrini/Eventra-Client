import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchEvents, fetchCategories } from "@/lib/events-api";
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
    staleTime: Infinity, // categories rarely change — no need to refetch often
  });
  return { categories: data ?? [], isLoading, isError };
}
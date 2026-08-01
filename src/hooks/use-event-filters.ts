import { useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";
import type {  EventFilters } from "@/types/event-types";
import type { Category } from "@/types/event-types";
export function useEventFilters() {
  const [searchParams, setSearchParams] = useSearchParams();


  const filters: EventFilters = useMemo(
    () => ({
      // read from "search" to match what setFilter("search", ...) writes
      search: searchParams.get("search") ?? "",
      state: (searchParams.get("state") ?? "") as EventFilters["state"],
      categories: (searchParams.get("categories")?.split(",").filter(Boolean) ??
        []) as Category[],
      when: (searchParams.get("when") ?? "any") as EventFilters["when"],
      price: (searchParams.get("price") ?? "any") as EventFilters["price"],
      access: (searchParams.get("access") ?? "all") as EventFilters["access"],
      sort: (searchParams.get("sort") ?? "trending") as EventFilters["sort"],
      page: Number(searchParams.get("page") ?? 1),
    }),
    [searchParams]
  );

  // Write: one generic setter. Adding a new filter later needs no new code here.
  const setFilter = useCallback(
    <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const isEmpty =
            value === "" ||
            value === "any" ||
            value === "all" ||
            (Array.isArray(value) && value.length === 0);

          if (isEmpty) next.delete(key);
          else
            next.set(key, Array.isArray(value) ? value.join(",") : String(value));

          // any filter change resets paging — except changing the page itself
          if (key !== "page") next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const toggleCategory = useCallback(
    (category: Category) => {
      const next = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];
      setFilter("categories", next);
    },
    [filters.categories, setFilter]
  );

  const clearAll = useCallback(
    () => setSearchParams(new URLSearchParams(), { replace: true }),
    [setSearchParams]
  );

  const loadMore = useCallback(
    () => setFilter("page", filters.page + 1),
    [filters.page, setFilter]
  );

  return { filters, setFilter, toggleCategory, clearAll, loadMore };
}
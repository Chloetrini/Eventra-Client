import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventSuggestions } from "@/lib/events-api";

// Same 300ms debounce convention as TopBarFilter's search input
// (filter-topbar.tsx) — mirrored here rather than shared, since that
// hook is wired to a parent-controlled filter value and this one just
// needs its own local debounced copy of whatever the caller passes in.
const DEBOUNCE_MS = 300;
// Below this, "suggestions" would mostly just be noise (a single letter
// matches almost everything) — also means the dropdown doesn't flash open
// the instant someone starts typing.
const MIN_QUERY_LENGTH = 2;

export function useEventSearchSuggestions(query: string) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const trimmed = debounced.trim();
  const enabled = trimmed.length >= MIN_QUERY_LENGTH;

  const { data, isFetching } = useQuery({
    queryKey: ["event-search-suggestions", trimmed],
    queryFn: () => fetchEventSuggestions(trimmed, 6),
    enabled,
    // Suggestions go stale fast (new events, sold-out status) but there's
    // no need to refetch the same term twice within a short window if the
    // user backspaces and retypes it.
    staleTime: 30_000,
  });

  return {
    suggestions: enabled ? data ?? [] : [],
    isLoading: enabled && isFetching,
  };
}

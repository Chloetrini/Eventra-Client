import { Search } from "lucide-react";
import { Format } from "@/lib/utils";
import type { Event } from "@/types/event-types";

interface EventSearchSuggestionsProps {
  query: string;
  suggestions: Event[];
  isLoading: boolean;
  onSelectEvent: (slug: string) => void;
  onSeeAll: () => void;
}

// Dropdown panel rendered under a search input — caller is responsible
// for the `relative` positioning context and for only mounting this while
// the input is focused/has a query (see the home page's `showMobile-
// Suggestions`/`showDesktopSuggestions` state). Kept presentation-only and
// input-agnostic on purpose so the same component can be reused for the
// organizer and admin search bars later, per Chloe's "do home first, then
// the others" — those just need their own useEventSearchSuggestions call
// and this same dropdown underneath.
export function EventSearchSuggestions({
  query,
  suggestions,
  isLoading,
  onSelectEvent,
  onSeeAll,
}: EventSearchSuggestionsProps) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden text-left">
      {isLoading && suggestions.length === 0 ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/3 rounded bg-muted" />
                <div className="h-2.5 w-1/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          No events found for "{trimmed}"
        </p>
      ) : (
        <ul>
          {suggestions.map((event) => (
            <li key={event._id}>
              {/* onMouseDown (not onClick) fires before the input's onBlur
                  closes this dropdown, so the navigation actually goes
                  through instead of the panel unmounting first. */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelectEvent(event.slug)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  {event.coverImage && (
                    <img
                      src={event.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate font-geist">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate font-geist">
                    {event.category} · {event.venue.name}
                  </p>
                </div>
                <span className="text-xs font-bold text-foreground shrink-0 font-space">
                  {event.minPrice === 0 ? "Free" : Format.amount(event.minPrice, event.currency)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onSeeAll}
        className="w-full flex items-center gap-2 px-4 py-3 border-t border-border text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80] hover:bg-muted/60 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        See all results for "{trimmed}"
      </button>
    </div>
  );
}

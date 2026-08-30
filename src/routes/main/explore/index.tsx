import PageWrapper from "@/components/page-wrapper";
import { useEventFilters } from "@/hooks/use-event-filters";
import { useEvents, useCategories, useSpotlightEvents } from "@/hooks/use-event";
import { EventGrid } from "@/components/events/event-grid";
import { FeaturedEventsCarousel } from "@/components/events/featured-event-carousel";
import { FilterSidebar } from "@/components/events/filters/filter-sidebar";
import { DEFAULT_FILTERS, type EventFilters } from "@/types/event-types";
import { Button } from "@/components/ui/button";
import { TopBarFilter } from "@/components/events/filters/filter-topbar";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useSavedEvents } from "@/hooks/use-saved-events";
import { useNavigate, useLocation } from "react-router";
import { saveExploreUrl } from "@/lib/explore-history";

export default function ExplorePage() {
  const navigate = useNavigate();
  const { filters, setFilter, toggleCategory, clearAll } =
    useEventFilters();

  const { data, isLoading, isFetching, isError, refetch ,loadMore} = useEvents(filters);
  const { categories } = useCategories();
  const events = data?.events ?? [];
  // Was `events.filter(e => e.isPromoted)` — that only ever showed whatever
  // promoted events happened to be on the CURRENT filtered/paginated page,
  // so the carousel emptied out the moment a search or filter excluded
  // them, and it had no concept of Explore's own "spotlight" placement
  // tier vs. the home page's hero/featured tiers. Now it's a real,
  // independent fetch of the events promoted specifically to Explore
  // (spotlight package — also includes anything promoted to hero, since
  // hero implies broader visibility), unaffected by the grid's filters.
  const { events: featured } = useSpotlightEvents("spotlight", 8);
  // The grid always shows every event that matches the current filters,
  // promoted or not; the carousel above is just an extra highlight on top,
  // not the only place a promoted event appears.
  const rest = events;
  const { savedIds, toggleSave } = useSavedEvents();

  // Spotlight is a "browse normally" thing, not a search/filter result —
  // it should only show when the visitor is just browsing with nothing
  // narrowed down. The moment ANY filter is active — a typed search, a
  // category checkbox, a price/date/access pick, or a state other than
  // "All Nigeria" — the carousel above the grid hides so it doesn't show
  // an unrelated promoted event (e.g. a Tech & Startups spotlight event
  // while "Arts & Theatre" is checked) sitting above filtered results
  // that don't match it. Previously this only checked filters.search, so
  // picking a category left the carousel showing regardless of category
  // match.
  const isFiltering =
    Boolean(filters.search) ||
    filters.categories.length > 0 ||
    filters.when !== DEFAULT_FILTERS.when ||
    filters.price !== DEFAULT_FILTERS.price ||
    filters.access !== DEFAULT_FILTERS.access ||
    Boolean(filters.state);

  const stateLabel = filters.state || "All Nigeria";
  const monthLabel = new Date().toLocaleString("en-NG", {
    month: "short",
    year: "numeric",
  });

  const location = useLocation();
  useEffect(() => {
    saveExploreUrl(location.pathname + location.search);
  }, [location.pathname, location.search]);

  if (isError) {
    return (
      <PageWrapper className="py-20 text-center">
        <p className="mb-4 text-muted-foreground">
          Couldn't load events. Check your connection and try again.
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-[20px] " >
      <header className="space mb-4">
        <p className=" flex items-center  text-[12px] font-[400] font-sans uppercase tracking-widest  text-[#0A4F41] dark:text-[#4ADE80] gap-2">
          <span className="inline-block h-px  w-[12px] bg-[#F5A524] " />
          {stateLabel} · {monthLabel}
        </p>
        <h1 className="text-[32px] md:text-[54px] font-[800] tracking-tight font-grotesk text-foreground">Explore events</h1>
        <p className="text-[13px] md:text-[15px] font-[400] font-mono uppercase tracking-wide text-muted-foreground mt-1">
          Showing <span className="text-foreground">{data?.total ?? 0}</span> events·Updated just now
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-3  max-w-[1240px]">
        <TopBarFilter
          searchValue={filters.search}
          dateValue={filters.when}
          sortValue={filters.sort}
          accessValue={filters.access}
          stateValue={filters.state}
          searchOnChange={(s) => setFilter("search", s)}
          stateOnChange={(v) => setFilter("state", v as EventFilters["state"])}
          dateOnChange={(d) => setFilter("when", d as EventFilters["when"])}
          sortOnChange={(v) => setFilter("sort", v as EventFilters["sort"])}
          accessOnClick={(a) => setFilter("access", a as EventFilters["access"])}
        />
      </div>

      <div className="grid gap-15 grid-cols-1 xl:grid-cols-[220px_1fr]">
        <div className="hidden xl:block">
          <FilterSidebar
            filters={filters}
            categories={categories}
            onToggleCategory={toggleCategory}
            onSelectWhen={(w) => setFilter("when", w)}
            onSelectPrice={(p) => setFilter("price", p)}
            onClearAll={clearAll}
          />
        </div>

        <main className="min-w-0 space-y-6">
          {featured.length > 0 && !isFiltering && (
            <FeaturedEventsCarousel
              events={featured}
              onGetTickets={(slug) => navigate(`/events/${slug}`)}
            />
          )}

          <EventGrid
            events={rest}
            isLoading={isLoading}
            className="grid-cols-[repeat(auto-fill,294px)]"
            savedIds={[...savedIds]}
            onToggleSave={toggleSave}
          />

          {data?.hasMore && (
            <div className="mt-10 flex justify-center mx-auto">
              <Button variant="outline" onClick={() => loadMore()}disabled={isFetching} className="text-[15px] font-[700] font-sans max-w-[177px] min-h-[42px]">
                {isFetching ? "Loading…" : "Load more events"}
                <ArrowRight />
              </Button>
            </div>
          )}
        </main>
      </div>
    </PageWrapper>
  );
}

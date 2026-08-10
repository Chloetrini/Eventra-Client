import PageWrapper from "@/components/pageWrapper";
import { useEventFilters } from "@/hooks/use-event-filters";
import { useEvents, useCategories } from "@/hooks/use-event";
import { EventGrid } from "@/components/events/event-grid";
import { FeaturedEventCard } from "@/components/events/featured-event-class";
import { FilterSidebar } from "@/components/events/filters/filter-sidebar";
import { type EventFilters } from "@/types/event-types";
import { Button } from "@/components/ui/button";
import { TopBarFilter } from "@/components/events/filters/filter-topbar";
import { useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useSavedEvents } from "@/hooks/use-saved-events";
import { useNavigate, useLocation } from "react-router";
import { saveExploreUrl } from "@/lib/explore.history";

export default function ExplorePage() {
  const navigate = useNavigate();
  const { filters, setFilter, toggleCategory, clearAll, loadMore } =
    useEventFilters();

  const { data, isLoading, isFetching, isError, refetch } = useEvents(filters);
const { categories } = useCategories();
  const events = data?.events ?? [];
  const featured = events.find((e) => e.isPromoted);
  const rest = events.filter((e) => !e.isPromoted);
  const { savedIds, toggleSave } = useSavedEvents();



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
        <p className=" flex items-center  text-[12px] font-[400] font-sans uppercase tracking-widest  text-[#0A4F41] gap-2">
          <span className="inline-block h-px  w-[12px] bg-[#F5A524] " />
          {stateLabel} · {monthLabel}
        </p>
        <h1 className="text-[32px] md:text-[54px] font-[800] tracking-tight font-grotesk text-[#1A1523]">Explore events</h1>
        <p className="text-[13px] md:text-[15px] font-[400] font-mono uppercase tracking-wide text-[#6E6577] mt-1">
          Showing <span className="text-[#4A4451]">{data?.total ?? 0}</span> events·Updated just now
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
            categoryCounts={data?.categoryCounts ?? {}}
            onToggleCategory={toggleCategory}
            onSelectWhen={(w) => setFilter("when", w)}
            onSelectPrice={(p) => setFilter("price", p)}
            onClearAll={clearAll}
          />
        </div>

        <main className="min-w-0 space-y-6">
          {featured && (
            <FeaturedEventCard
              event={featured}
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
              <Button variant="outline" onClick={loadMore} disabled={isFetching} className="text-[15px] font-[700] font-sans max-w-[177px] min-h-[42px]">
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
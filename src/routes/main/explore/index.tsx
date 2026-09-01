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
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useSavedEvents } from "@/hooks/use-saved-events";
import { useNavigate, useLocation } from "react-router";
import { saveExploreUrl } from "@/lib/explore-history";

export default function ExplorePage() {
  const navigate = useNavigate();
  const { filters, setFilter, toggleCategory, clearAll } =
    useEventFilters();

  const { data, isLoading, isFetching, isError, error, refetch ,loadMore} = useEvents(filters);  const { categories } = useCategories();
  
  const events = data?.events ?? [];

  const { events: featured } = useSpotlightEvents("spotlight", 8);
 
  const rest = events;
  const { savedIds, toggleSave } = useSavedEvents();

 
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
    const isMaintenanceMode = error instanceof Error && error.message.toLowerCase().includes("maintenance");
    return (
      <PageWrapper className="py-20 text-center">
        <p className="mb-4 text-muted-foreground">
          {isMaintenanceMode
            ? error.message
            : "Couldn't load events. Check your connection and try again."}
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-5 md:p-7">
      <header className="space mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[12px] md:text-[16px] font-geist font-semibold uppercase mb-5 lg:mb-15 tracking-widest text-[#f5a524] hover:text-[#b77812] transition duration-300 hover:-translate-y-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className=" flex items-center  text-[12px] font-normal font-space uppercase tracking-widest  text-[#0A4F41] dark:text-[#4ADE80] gap-2">
          
          <span className="inline-block h-px  w-[12px] bg-[#F5A524] " />
          {stateLabel} · {monthLabel}
        </p>
        <h1 className="text-[32px] md:text-[54px] font-extrabold tracking-tight font-grotesk text-foreground">Explore events</h1>
        <p className="text-[13px] md:text-[15px] font-normal font-mono uppercase tracking-wide text-muted-foreground mt-1">
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

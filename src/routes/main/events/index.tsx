import PageWrapper from "@/components/pageWrapper";
import { useEventFilters } from "@/hooks/use-event-filters";
import { useEvents } from "@/hooks/use-event";
import { EventGrid } from "@/components/events/event-grid";
import { FeaturedEventCard } from "@/components/events/featured-event-class";
import { SearchInput } from "@/components/filters/search-input";
import { StateSelect } from "@/components/filters/state-select";
import { DateSelect } from "@/components/filters/date";
import { SortSelect } from "@/components/filters/sort";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { ACCESS_OPTIONS } from "@/lib/schema";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const { filters, setFilter, toggleCategory, clearAll, loadMore } =
    useEventFilters();
  const { data, isLoading, isFetching, isError, refetch } = useEvents(filters);

  // Split the featured event out from the rest so it shows big on top
  // and the grid below never duplicates it.
  const events = data?.events ?? [];
  const featured = events.find((e) => e.featured);
  const rest = events.filter((e) => !e.featured);

  // Dynamic eyebrow: state from the filter, month from today.
  const stateLabel = filters.state || "All Nigeria";
  const monthLabel = new Date().toLocaleString("en-NG", {
    month: "short",
    year: "numeric",
  });

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
    <PageWrapper className="py-8">
      <header className="mb-6">
        <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="inline-block h-px w-6 bg-orange-500" />
          {stateLabel} · {monthLabel}
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Explore events</h1>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          Showing {data?.total ?? 0} events · Updated just now
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="min-w-[240px] flex-1">
          <SearchInput value={filters.q} onChange={(q) => setFilter("q", q)} />
        </div>

        <StateSelect
          value={filters.state}
          onChange={(s) => setFilter("state", s)}
        />

        <DateSelect value={filters.when} onChange={(w) => setFilter("when", w)} />

        <div className="flex gap-1 rounded-md border p-1">
          {ACCESS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter("access", option)}
              className={
                filters.access === option
                  ? "rounded bg-slate-900 px-3 py-1 text-sm capitalize text-white"
                  : "rounded px-3 py-1 text-sm capitalize text-muted-foreground"
              }
            >
              {option}
            </button>
          ))}
        </div>

        <SortSelect value={filters.sort} onChange={(s) => setFilter("sort", s)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <FilterSidebar
          filters={filters}
          categoryCounts={data?.categoryCounts ?? {}}
          onToggleCategory={toggleCategory}
          onSelectWhen={(w) => setFilter("when", w)}
          onSelectPrice={(p) => setFilter("price", p)}
          onClearAll={clearAll}
        />

        <main className="space-y-6">
          {featured && (
            <FeaturedEventCard
              event={featured}
              onGetTickets={(id) => console.log("tickets", id)}
            />
          )}

          <EventGrid
            events={rest}
            isLoading={isLoading}
            onToggleSave={(id) => console.log("save", id)}
          />

          {data?.hasMore && (
            <div className="mt-10 flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={isFetching}>
                {isFetching ? "Loading…" : "Load more events"}
              </Button>
            </div>
          )}
        </main>
      </div>
    </PageWrapper>
  );
}
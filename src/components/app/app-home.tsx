import { Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { AppEventCard, AppEventCardSkeleton } from "@/components/app/app-event-card";
import { useAuth } from "@/context/auth-context";
import { useCategories, useEvents, useSpotlightEvents } from "@/hooks/events/use-event";
import { useSavedEvents } from "@/hooks/events/use-saved-events";
import { cn } from "@/lib/utils";
import { DEFAULT_FILTERS } from "@/types/event-types";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors active:scale-95",
        active
          ? "border-[#0F6E56] bg-[#0F6E56] text-white dark:border-[#3CCB9C] dark:bg-[#3CCB9C] dark:text-[#04140E]"
          : "border-[#E2E9E6] bg-white text-[#0B1F1A] dark:border-[#22302A] dark:bg-[#111A16] dark:text-[#EEF5F2]",
      )}
    >
      {children}
    </button>
  );
}

// The Discover screen of the installed app: the same layout as the native Eventra app.
export default function AppHome() {
  const { user } = useAuth();
  const { savedIds, toggleSave } = useSavedEvents();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>();
  const [freeOnly, setFreeOnly] = useState(false);
  const browsing = !search && !category && !freeOnly;

  const { categories } = useCategories();
  const featured = useSpotlightEvents("featured", 6);
  const { data, isLoading, isError, isFetching, loadMore, refetch } = useEvents({
    ...DEFAULT_FILTERS,
    search,
    categories: category ? [category] : [],
    access: freeOnly ? "free" : "all",
  });
  const firstName = user?.fullname?.split(" ")[0];

  return (
    <div className="mx-auto max-w-xl pb-6">
      <header className="flex items-center gap-3 px-5 pb-3.5 pt-[calc(env(safe-area-inset-top)+14px)]">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-[#5F7068] dark:text-[#9BAAA3]">{firstName ? `Hi ${firstName} 👋` : "Welcome to Eventra"}</p>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1F1A] dark:text-[#EEF5F2]">Find your next event</h1>
        </div>
        <Link to="/profile" aria-label="Profile" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3F2EC] text-base font-bold text-[#0F6E56] dark:bg-[#12332A] dark:text-[#3CCB9C]">
          {user ? user.fullname.slice(0, 1).toUpperCase() : "·"}
        </Link>
      </header>

      <form
        className="mx-5 flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-[#E2E9E6] bg-white px-3.5 dark:border-[#22302A] dark:bg-[#111A16]"
        onSubmit={(e) => { e.preventDefault(); setSearch(text.trim()); }}
      >
        <Search className="h-[18px] w-[18px] text-[#93A19B]" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search events, artists, venues"
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent py-3.5 text-[15px] text-[#0B1F1A] outline-none placeholder:text-[#93A19B] dark:text-[#EEF5F2]"
        />
        {text ? (
          <button type="button" aria-label="Clear" onClick={() => { setText(""); setSearch(""); }}>
            <X className="h-[18px] w-[18px] text-[#93A19B]" />
          </button>
        ) : null}
      </form>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3.5">
        <Chip active={!category && !freeOnly} onClick={() => { setCategory(undefined); setFreeOnly(false); }}>All</Chip>
        <Chip active={freeOnly} onClick={() => setFreeOnly((f) => !f)}>Free</Chip>
        {categories.map((c) => (
          <Chip key={c._id} active={category === c._id} onClick={() => setCategory(category === c._id ? undefined : c._id)}>{c.name}</Chip>
        ))}
      </div>

      {browsing && (featured.isLoading || featured.events.length > 0) ? (
        <section className="mt-1">
          <h2 className="px-5 pb-3 text-lg font-bold text-[#0B1F1A] dark:text-[#EEF5F2]">Featured</h2>
          {featured.isLoading ? (
            <div className="mx-5 h-[350px] w-[270px] animate-pulse rounded-[28px] bg-[#EEF3F1] dark:bg-[#1A2621]" />
          ) : (
            <div className="no-scrollbar flex snap-x gap-3.5 overflow-x-auto px-5">
              {featured.events.map((e) => (
                <AppEventCard key={e._id} event={e} variant="feature" isSaved={savedIds.has(e.slug) && !!user} onToggleSave={toggleSave} />
              ))}
            </div>
          )}
        </section>
      ) : null}

      <h2 className="px-5 pb-3 pt-6 text-lg font-bold text-[#0B1F1A] dark:text-[#EEF5F2]">{search ? `Results for “${search}”` : "Upcoming events"}</h2>
      <div className="space-y-[18px] px-5">
        {isLoading ? (
          <><AppEventCardSkeleton /><AppEventCardSkeleton /></>
        ) : isError ? (
          <div className="rounded-2xl bg-white p-6 text-center dark:bg-[#111A16]">
            <p className="font-semibold text-[#0B1F1A] dark:text-[#EEF5F2]">Couldn't load events</p>
            <button type="button" onClick={() => refetch()} className="mt-3 rounded-xl bg-[#0F6E56] px-5 py-2.5 font-semibold text-white">Try again</button>
          </div>
        ) : data.events.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-[#111A16]">
            <p className="font-semibold text-[#0B1F1A] dark:text-[#EEF5F2]">No events found</p>
            <p className="mt-1 text-sm text-[#5F7068] dark:text-[#9BAAA3]">Try a different search or category.</p>
          </div>
        ) : (
          data.events.map((e) => (
            <AppEventCard key={e._id} event={e} isSaved={savedIds.has(e.slug) && !!user} onToggleSave={toggleSave} />
          ))
        )}
        {data.hasMore ? (
          <button type="button" disabled={isFetching} onClick={() => loadMore()} className="w-full rounded-xl border border-[#E2E9E6] bg-white py-3 font-semibold text-[#0F6E56] disabled:opacity-60 dark:border-[#22302A] dark:bg-[#111A16] dark:text-[#3CCB9C]">
            {isFetching ? "Loading…" : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

import { z } from "zod";
import { api } from "@/lib/api";
import { MOCK_EVENTS } from "@/lib/constants"
import {
  eventSchema,
} from "@/lib/schema";
import type { EventFilters , Event} from "@/types/event-types";
import { PRICE_TIERS, DATE_WINDOWS } from "@/types/event-types";
const PAGE_SIZE = 9;

// The shape the "server" returns. This is the contract every layer above
// depends on — mock and real backend both produce exactly this.

export type EventsResponse = {
  events: Event[];
  total: number;
  hasMore: boolean;
  categoryCounts: Record<string, number>;
};

// A zod version of that shape, so we can validate the REAL backend's reply
// at runtime. res.body comes back as `unknown` from the shared client —
// .parse() both checks it and hands back a correctly typed EventsResponse.
const eventsResponseSchema = z.object({
  events: z.array(eventSchema),
  total: z.number(),
  hasMore: z.boolean(),
  categoryCounts: z.record(z.string(), z.number()),
});

// ---------------------------------------------------------------------
// One small predicate per filter. Each returns TRUE when its own filter
// is switched off — that's what lets them compose with && independently.
// ---------------------------------------------------------------------
function matchesSearch(e: Event, search: string) {
  if (!search.trim()) return true;
  const n = search.toLowerCase();
  return (
    e.title.toLowerCase().includes(n) ||
    e.venue.toLowerCase().includes(n) ||
    e.city.toLowerCase().includes(n) ||
    e.category.toLowerCase().includes(n)
  );
}
function matchesState(e: Event, state: EventFilters["state"]) {
  return state === "" ? true : e.state === state;
}
function matchesCategories(e: Event, cats: EventFilters["categories"]) {
  return cats.length === 0 ? true : cats.includes(e.category);
}
function matchesWhen(e: Event, when: EventFilters["when"]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return DATE_WINDOWS[when].test(new Date(e.startsAt), startOfToday);
}
function matchesPrice(e: Event, price: EventFilters["price"]) {
  return PRICE_TIERS[price].test(e.price);
}
function matchesAccess(e: Event, access: EventFilters["access"]) {
  if (access === "all") return true;
  if (access === "free") return e.price === 0;
  return e.price > 0; // "paid"
}


// MOCK implementation — used while there's no backend.

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchEventsMock(filters: EventFilters): Promise<EventsResponse> {
  await delay(400); // lets your loading skeletons actually show up in dev

  const results = MOCK_EVENTS.filter(
    (e) =>
      matchesSearch(e, filters.search) &&
      matchesState(e, filters.state) &&
      matchesCategories(e, filters.categories) &&
      matchesWhen(e, filters.when) &&
      matchesPrice(e, filters.price) &&
      matchesAccess(e, filters.access)
  );

  // Sidebar counts ignore the category filter itself, so ticking one
  // category doesn't zero out every other row.
  const forCounts = MOCK_EVENTS.filter(
    (e) =>
      matchesSearch(e, filters.search) &&
      matchesState(e, filters.state) &&
      matchesWhen(e, filters.when) &&
      matchesPrice(e, filters.price) &&
      matchesAccess(e, filters.access)
  );
  const categoryCounts = forCounts.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {});

  // Copy before sorting — sort() mutates, and MOCK_EVENTS is shared.
  const sorted = [...results].sort((a, b) => {
    if (filters.sort === "date")
      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
    if (filters.sort === "price") return a.price - b.price;
    return b.trendingScore - a.trendingScore; // "trending" default
  });

  const end = filters.page * PAGE_SIZE; // "load more": page 2 = items 1–18
  return {
    events: sorted.slice(0, end),
    total: sorted.length,
    hasMore: end < sorted.length,
    categoryCounts,
  };
}

// REAL implementation — talks to the backend through your Axios client.

function buildParams(filters: EventFilters): string {
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.state) p.set("state", filters.state);
  if (filters.categories.length) p.set("categories", filters.categories.join(","));
  if (filters.when !== "any") p.set("when", filters.when);
  if (filters.price !== "any") p.set("price", filters.price);
  if (filters.access !== "all") p.set("access", filters.access);
  p.set("sort", filters.sort);
  p.set("page", String(filters.page));
  return p.toString();
}

async function fetchEventsReal(filters: EventFilters): Promise<EventsResponse> {
  // No <EventsResponse> here — the shared api.get isn't generic, so body is
  // `unknown`. We validate it with zod instead, which also types it for us.
  const res = await api.get(`/events?${buildParams(filters)}`);
  return eventsResponseSchema.parse(res.body);
}

// The seam. Everything above the app calls THIS. Flip one env var to
// switch between mock and real — no component, hook, or page changes.
export function fetchEvents(filters: EventFilters): Promise<EventsResponse> {
  console.log("USE_MOCKS is:", import.meta.env.VITE_USE_MOCKS);
  if (import.meta.env.VITE_USE_MOCKS === "true") return fetchEventsMock(filters);
  return fetchEventsReal(filters);
}
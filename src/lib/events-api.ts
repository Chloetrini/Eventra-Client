import { z } from "zod";
import { api } from "@/lib/api";
import { MOCK_EVENTS } from "@/lib/constants";
import {
  eventSchema,
} from "@/lib/schema";
import {DATE_WINDOWS, PRICE_TIERS, type Event, type EventFilters } from "@/types/event-types";

const PAGE_SIZE = 9;

// ---------------------------------------------------------------------
// The shape the "server" returns. This is the contract every layer above
// depends on — mock and real backend both produce exactly this.
// ---------------------------------------------------------------------
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
function matchesSearch(e: Event, q: string) {
  if (!q.trim()) return true;
  const n = q.toLowerCase();
  return (
    e.title.toLowerCase().includes(n) ||
    e.venue.name.toLowerCase().includes(n) ||
    e.venue.city.toLowerCase().includes(n) ||
    e.category.toLowerCase().includes(n)
  );
}
function matchesState(e: Event, state: EventFilters["state"]) {
  return state === "" ? true : e.venue.state === state;
}
function matchesCategories(e: Event, cats: EventFilters["categories"]) {
  return cats.length === 0 ? true : cats.includes(e.category);
}
function matchesWhen(e: Event, when: EventFilters["when"]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return DATE_WINDOWS[when].test(new Date(e.createdAt), startOfToday);
}
function matchesPrice(e: Event, price: EventFilters["price"]) {
  return PRICE_TIERS[price].test(e.minPrice);
}
function matchesAccess(e: Event, access: EventFilters["access"]) {
  if (access === "all") return true;
  if (access === "free") return e.minPrice === 0;
  return e.minPrice > 0; // "paid"
}

// ---------------------------------------------------------------------
// MOCK implementation — used while there's no backend.
// ---------------------------------------------------------------------
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
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (filters.sort === "price") return a.minPrice - b.minPrice;
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

function buildParams(filters: EventFilters): string {
  const p = new URLSearchParams();
  if (filters.search) p.set("q", filters.search);
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


export function fetchEvents(filters: EventFilters): Promise<EventsResponse> {
  if (import.meta.env.VITE_USE_MOCKS === "true") return fetchEventsMock(filters);
  return fetchEventsReal(filters);
}

async function fetchEventBySlugMock(slug: string): Promise<Event | null> {
  await delay(200); // Simulate network latency
  const found = MOCK_EVENTS.find((e) => e.slug === slug);
  return found ?? null;
}

async function fetchEventBySlugReal(slug: string): Promise<Event | null> {
  try {
    const res = await api.get(`/events/${slug}`);
    // Validate single event payload with zod
    return eventSchema.parse(res.body);
  } catch (error) {
    return null;
  }
}

export function fetchEventBySlug(slug: string): Promise<Event | null> {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return fetchEventBySlugMock(slug);
  }
  return fetchEventBySlugReal(slug);
}
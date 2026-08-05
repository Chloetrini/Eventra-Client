import { z } from "zod";
import { api } from "@/lib/api";
import { MOCK_EVENTS } from "@/lib/constants";
import { eventSchema } from "@/lib/schema";
import { DATE_WINDOWS, PRICE_TIERS, type Event, type EventFilters } from "@/types/event-types";

// ---------------------------------------------------------------------
// HeroData interface – extended with avatars (already done)
// ---------------------------------------------------------------------
export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink?: string;
  avatars?: { id: string; image: string }[];
}

const PAGE_SIZE = 9;

// ---------------------------------------------------------------------
// Server response shape (both mock and real)
// ---------------------------------------------------------------------
export type EventsResponse = {
  events: Event[];
  total: number;
  hasMore: boolean;
  categoryCounts: Record<string, number>;
};

// Zod schema for the real backend response
const eventsResponseSchema = z.object({
  events: z.array(eventSchema),
  total: z.number(),
  hasMore: z.boolean(),
  categoryCounts: z.record(z.string(), z.number()),
});

// ---------------------------------------------------------------------
// Filter predicates (composable with &&)
// ---------------------------------------------------------------------
function matchesSearch(e: Event, q: string) {
  if (!q.trim()) return true;
  const n = q.toLowerCase();
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
  // Ensure DATE_WINDOWS[when] has a .test method
  return DATE_WINDOWS[when]?.test(new Date(e.createdAt), startOfToday) ?? true;
}

function matchesPrice(e: Event, price: EventFilters["price"]) {
  // Ensure PRICE_TIERS[price] has a .test method
  return PRICE_TIERS[price]?.test(e.minPrice) ?? true;
}

function matchesAccess(e: Event, access: EventFilters["access"]) {
  if (access === "all") return true;
  if (access === "free") return e.minPrice === 0;
  return e.minPrice > 0; // "paid"
}

// ---------------------------------------------------------------------
// MOCK implementation
// ---------------------------------------------------------------------
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchEventsMock(filters: EventFilters): Promise<EventsResponse> {
  await delay(400);

  // Ensure MOCK_EVENTS exists
  const events = Array.isArray(MOCK_EVENTS) ? MOCK_EVENTS : [];

  const results = events.filter(
    (e) =>
      matchesSearch(e, filters.search) &&
      matchesState(e, filters.state) &&
      matchesCategories(e, filters.categories) &&
      matchesWhen(e, filters.when) &&
      matchesPrice(e, filters.price) &&
      matchesAccess(e, filters.access)
  );

  // Category counts (ignore category filter itself)
  const forCounts = events.filter(
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

  // Sort
  const sorted = [...results].sort((a, b) => {
    if (filters.sort === "date")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (filters.sort === "price") return a.minPrice - b.minPrice;
    return b.trendingScore - a.trendingScore; // "trending" default
  });

  const end = filters.page * PAGE_SIZE;
  return {
    events: sorted.slice(0, end),
    total: sorted.length,
    hasMore: end < sorted.length,
    categoryCounts,
  };
}

// ---------------------------------------------------------------------
// Real API helpers
// ---------------------------------------------------------------------
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
  try {
    const res = await api.get(`/events?${buildParams(filters)}`);
    return eventsResponseSchema.parse(res.body);
  } catch (error) {
    console.error("Real API fetch failed:", error);
    // Fallback to empty response so UI doesn't crash
    return {
      events: [],
      total: 0,
      hasMore: false,
      categoryCounts: {},
    };
  }
}

// ---------------------------------------------------------------------
// Public fetch function – switches between mock and real
// ---------------------------------------------------------------------
export function fetchEvents(filters: EventFilters): Promise<EventsResponse> {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return fetchEventsMock(filters);
  }
  return fetchEventsReal(filters);
}
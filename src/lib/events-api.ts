import { z } from "zod";
import { api } from "@/lib/api";


import {
  eventSchema,
} from "@/lib/schema";
import { DATE_WINDOWS, PRICE_TIERS, type Event, type EventFilters } from "@/types/event-types";

const PAGE_SIZE = 9;

export type EventsResponse = {
  events: Event[];
  total: number;
  hasMore: boolean;
  categoryCounts: Record<string, number>;
};

// Matches the backend's actual shape: { events: [...], meta: { total, hasMore, ... } }
const eventsResponseSchema = z.object({
  events: z.array(eventSchema),
  meta: z.object({
    currentPage: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasMore: z.boolean(),
  }),
});
const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export type EventCategory = z.infer<typeof categorySchema>;

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


// ---------------------------------------------------------------------
// MOCK implementation — used while there's no backend.
// ---------------------------------------------------------------------
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));



// ---------------------------------------------------------------------
// Maps our EventFilters to the EXACT query params the backend expects.
// See listPublicEvents in the backend's event.controller.ts.
// ---------------------------------------------------------------------
function buildParams(filters: EventFilters): string {
  const p = new URLSearchParams();

  if (filters.search) p.set("q", filters.search);

  // frontend "state" → backend "city" (backend filters on venue.city)
  if (filters.state) p.set("city", filters.state);

  // frontend "categories" (array) → backend "category" (comma-separated IDs)
  if (filters.categories.length) p.set("category", filters.categories.join(","));

  // frontend "access" (all/free/paid) → backend "type" (free/paid, omit for all)
  if (filters.access !== "all") p.set("type", filters.access);

  // frontend "price" tier → backend minPrice/maxPrice as real numbers
  if (filters.price === "free") {
    p.set("maxPrice", "0");
  } else if (filters.price === "under15k") {
    p.set("maxPrice", "14999");
  } else if (filters.price === "over15k") {
    p.set("minPrice", "15000");
  }

  // frontend "when" → backend's exact value strings
  const whenMap: Record<string, string> = {
    today: "today",
    weekend: "this-weekend",
    week: "this-week",
    month: "this-month",
  };
  if (filters.when !== "any" && whenMap[filters.when]) {
    p.set("when", whenMap[filters.when]);
  }

  // frontend "sort" → backend's exact value strings.
  // "trending" is the backend's default order, so we send nothing for it.
  if (filters.sort === "date") {
    p.set("sort", "date");
  } else if (filters.sort === "price") {
    p.set("sort", "price-asc");
  }

  p.set("page", String(filters.page));

  return p.toString();
}

export async function fetchEventsReal(filters: EventFilters): Promise<EventsResponse> {
  const res = await api.get(`/events?${buildParams(filters)}`);
  const parsed = eventsResponseSchema.parse(res.body);

  // Normalize backend's nested `meta` into the flat shape the rest of the app expects.
  // categoryCounts isn't provided by the backend yet — derive it from what we got back.
  const categoryCounts = parsed.events.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {});

  return {
    events: parsed.events,
    total: parsed.meta.total,
    hasMore: parsed.meta.hasMore,
    categoryCounts,
  };
}


async function fetchEventBySlugReal(slug: string): Promise<Event | null> {
  try {
    const res = await api.get(`/events/${slug}`);
    return eventSchema.parse(res.body);
  } catch (error) {
    return null;
  }
}

// ---------------------------------------------------------------------
// ONE-LINE SWITCH: flip these when you need mock data instead of live
// ---------------------------------------------------------------------
export async function fetchEvents(filters: EventFilters) {
  return await fetchEventsReal(filters);
  // return await fetchEventsMock(filters);
}

export function fetchEventBySlug(slug: string): Promise<Event | null> {
  return fetchEventBySlugReal(slug);
  // return fetchEventBySlugMock(slug);
}

export async function fetchCategories(): Promise<EventCategory[]> {
  const res = await api.get("/categories");
  console.log("CATEGORIES RESPONSE:", res.body); // temporary — tells us the real shape
  const raw = Array.isArray(res.body) ? res.body : (res.body as { categories: unknown[] }).categories;
  return z.array(categorySchema).parse(raw);
}
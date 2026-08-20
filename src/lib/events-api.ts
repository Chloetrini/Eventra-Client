import { z } from "zod";
import { api } from "@/lib/api";
import { eventSchema } from "@/lib/schema";
import {
  DATE_WINDOWS,
  PRICE_TIERS,
} from "@/types/event-types";

// import type { EventTickets } from "@/types/ticket-tiers";


import { type Event, type EventFilters } from "@/types/event-types";
import type { Attendee } from "@/types/attendees";
export type EventsResponse = {
  events: Event[];
  total: number;
  hasMore: boolean;
};

// Matches the backend's actual shape: { events: [...], meta: { total, hasMore, ... } }
const PAGE_SIZE = 9;
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
  isActive: z.boolean().optional(),
  eventCount: z.number().optional().default(0),
});

export type EventCategory = z.infer<typeof categorySchema>;
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
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
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
// Maps our EventFilters to the EXACT query params the backend expects.
// See listPublicEvents in the backend's event.controller.ts.
// ---------------------------------------------------------------------


function buildParams(filters: EventFilters): string {
  const p = new URLSearchParams();

  if (filters.search) p.set("q", filters.search);
  if (filters.state) p.set("state", filters.state);
  if (filters.categories.length)
    p.set("categories", filters.categories.join(","));
  if (filters.when !== "any") p.set("when", filters.when);
  if (filters.price !== "any") p.set("price", filters.price);
  if (filters.access !== "all") p.set("access", filters.access);
  p.set("sort", filters.sort);
  p.set("page", String(filters.page));

  return p.toString();
}

export async function fetchEventsReal(filters: EventFilters): Promise<EventsResponse> {
  const res = await api.get(`/events?${buildParams(filters)}`);
  const parsed = eventsResponseSchema.parse(res.body);

  return {
    events: parsed.events,
    total: parsed.meta.total,
    hasMore: parsed.meta.hasMore,
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
export async function fetchEvents(filters: EventFilters) {
  return await fetchEventsReal(filters);
}

export function fetchEventBySlug(slug: string): Promise<Event | null> {
  return fetchEventBySlugReal(slug);
}

export async function fetchCategories(): Promise<EventCategory[]> {
  const res = await api.get("/categories");
  const raw = Array.isArray(res.body) ? res.body : (res.body as { categories: unknown[] }).categories;
  return z.array(categorySchema).parse(raw);
}

// ---------------------------------------------------------------------
// Organizer's own events (their event management list)
// GET /events/mine
// ---------------------------------------------------------------------
type RealMyEvent = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  category?: { name: string } | string | null;
  type: "free" | "paid";
  status: string;
  startDate?: string;
  capacity?: number | null;
  ticketsSoldCount?: number;
  reservationsCount?: number;
  revenueTotal?: number;
};

function mapMyEventStatus(status: string): "Live" | "Draft" | "Sold out" | "Past" | "Rejected" {
  const s = status.toLowerCase();
  if (s === "live") return "Live";
  if (s === "draft") return "Draft";
  if (s === "sold_out" || s === "sold out") return "Sold out";
  if (s === "rejected") return "Rejected";
  return "Past";
}

function getMyEventCategoryName(category: RealMyEvent["category"]): string {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name ?? "Uncategorized";
}

export async function fetchMyEvents() {
  const res = await api.get("/events/mine");
  const body = res.body as { events: RealMyEvent[]; meta: unknown };
  return body.events.map((e, index) => ({
    _id: e._id,
    eventTitle: e.title ?? "Untitled Event",
    eventNumber: `№ ${String(index + 1).padStart(4, "0")}`,
    category: getMyEventCategoryName(e.category),
    coverImage: e.coverImage ?? "",
    date: e.startDate ?? null,
    EventType: (e.type === "free" ? "Free" : "Paid") as "Free" | "Paid",
    sold: e.type === "free" ? e.reservationsCount ?? 0 : e.ticketsSoldCount ?? 0,
    capacity: e.capacity ?? null,
    revenue: e.revenueTotal ?? null,
    status: mapMyEventStatus(e.status),
  }));
}


// Attendees for a specific event (organizer only)
// GET /events/:eventId/attendees

type RealTicket = {
  _id: string;
  code: string;
  type: "free" | "paid";
  price: number;
  attendeeName: string;
  attendeeEmail: string;
  status: "valid" | "checked_in" | "cancelled" | "refunded";
  checkedInAt?: string;
  issuedAt: string;
  ticketType?: { name: string } | null;
};

export async function fetchEventAttendees(eventId: string): Promise<Attendee[]> {
  const res = await api.get(`/events/${eventId}/attendees`);
  const body = res.body as { tickets: RealTicket[]; meta: unknown };
  return body.tickets.map((t) => ({
    _id: t._id,
    eventId,
    name: t.attendeeName,
    email: t.attendeeEmail,
    referenceCode: t.code,
    checkedIn: t.status === "checked_in",
    ticketType: (t.ticketType?.name as "VIP" | "Regular" | "Table") ?? "Regular",
    tableSize: null,
    purchasedDate: t.issuedAt,
  }));
}

export async function deleteEvent(eventId: string) {
  await api.delete(`/events/${eventId}`);
}

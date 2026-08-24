import { z } from "zod";
import { api } from "@/lib/api";
import {
  eventSchema,
} from "@/lib/schema";
import { type Event, type EventFilters } from "@/types/event-types";
import type { Attendee } from "@/types/attendees";
import type { OrganizerEventDetails } from "@/types/organizer-event";
import { formatDate } from "@/lib/utils";
import { isLiveEditableEvent, LIVE_EDIT_CUTOFF_DAYS } from "@/lib/create-event-api";
export type EventsResponse = {
  events: Event[];
  total: number;
  hasMore: boolean;
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
  isActive: z.boolean().optional(),
  eventCount: z.number().optional().default(0),
});

export type EventCategory = z.infer<typeof categorySchema>;

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

// ---------------------------------------------------------------------
// Spotlight/promotion placement — GET /events/spotlight?placement=X
// Backend filters on { status: 'approved', isPromoted: true,
// 'promotion.package': $in PLACEMENT_PACKAGES[placement] } — see
// getSpotlightEvents in event.controller.ts. Placement is one of:
//   "hero"     -> homepage hero carousel only
//   "featured" -> home page "Featured this week" section (also includes
//                 anything promoted to hero, since hero implies broader visibility)
//   "spotlight"-> Explore page featured carousel (also includes hero-tier)
// Unlike fetchEvents this has no pagination — it's a small, capped list.
export async function fetchSpotlightEvents(
  placement: "hero" | "featured" | "spotlight",
  limit = 8
): Promise<Event[]> {
  const res = await api.get(`/events/spotlight?placement=${placement}&limit=${limit}`);
  const body = res.body as { events: unknown[] };
  return z.array(eventSchema).parse(body.events ?? []);
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
  endDate?: string;
  capacity?: number | null;
  ticketsSoldCount?: number;
  reservationsCount?: number;
  revenueTotal?: number;
};

// GET /events/mine returns the event's raw moderation status ("draft",
// "pending_approval", "approved", "rejected", "cancelled", "postponed") —
// unlike the dashboard-overview endpoint, it does NOT already resolve
// "approved" down to a display status (live/sold_out/past). That
// resolution is mirrored here so an approved, on-sale event actually
// shows as "Live" instead of silently falling through to "Past".
function mapMyEventStatus(e: RealMyEvent): "Live" | "Draft" | "Pending" | "Sold out" | "Past" | "Rejected" | "Cancelled" | "Postponed" {
  const s = e.status.toLowerCase();
  if (s === "draft") return "Draft";
  if (s === "pending_approval" || s === "pending") return "Pending";
  if (s === "rejected") return "Rejected";
  if (s === "cancelled") return "Cancelled";
  if (s === "postponed") return "Postponed";
  if (s !== "approved") return "Past";

  const sold = e.type === "free" ? e.reservationsCount ?? 0 : e.ticketsSoldCount ?? 0;
  if (e.capacity != null && sold >= e.capacity) return "Sold out";
  // Use endDate when the event has one (a multi-day event that started
  // in the past but hasn't finished yet is still "Live", not "Past") —
  // falls back to startDate for single-day events. Mirrors the backend's
  // own deriveEventDisplayStatus (eventStatus.ts).
  const endsAt = e.endDate ?? e.startDate;
  if (endsAt && new Date(endsAt).getTime() < Date.now()) return "Past";
  return "Live";
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
    status: mapMyEventStatus(e),
  }));
}

// ---------------------------------------------------------------------
// Attendees for a specific event (organizer only)
// GET /events/:eventId/attendees
// ---------------------------------------------------------------------
type RealTicket = {
  _id: string;
  code: string;
  ticketId: string;
  type: "free" | "paid";
  price: number;
  attendeeName: string;
  attendeeEmail: string;
  status: "valid" | "checked_in" | "cancelled" | "refunded";
  checkedInAt?: string;
  issuedAt: string;
  ticketType?: { name: string } | null;
};

// Display-only — the real ticketId from the backend looks like
// "TKT-A1B2C3D4" (8 hex chars). Organizers just need something short and
// scannable in the Attendees table, not the full generated ID, so this
// re-prefixes it as "EVT-XXXX" and truncates to 4 chars. Purely cosmetic:
// no backend field changes, the full ticketId still exists underneath.
function shortenTicketRef(ticketId: string): string {
  const [, rest] = ticketId.split("-");
  if (!rest) return ticketId;
  return `EVT-${rest.slice(0, 4)}`;
}

export async function fetchEventAttendees(eventId: string): Promise<Attendee[]> {
  const res = await api.get(`/events/${eventId}/attendees`);
  const body = res.body as { tickets: RealTicket[]; meta: unknown };
  return body.tickets.map((t) => ({
    _id: t._id,
    eventId,
    name: t.attendeeName,
    email: t.attendeeEmail,
    referenceCode: shortenTicketRef(t.ticketId),
    checkedIn: t.status === "checked_in",
    ticketType: (t.ticketType?.name as "VIP" | "Regular" | "Table") ?? "Regular",
    tableSize: null,
    purchasedDate: t.issuedAt,
  }));
}

export async function deleteEvent(eventId: string) {
  await api.delete(`/events/${eventId}`);
}

// POST /events/:id/duplicate — server clones the event (and its ticket
// types) as a brand-new draft. Dates, status, and sales counters are
// deliberately not carried over.
export async function duplicateEvent(eventId: string): Promise<{ _id: string }> {
  const res = await api.post(`/events/${eventId}/duplicate`, {});
  return res.body as { _id: string };
}

// ---------------------------------------------------------------------
// Organizer event dashboard — powers the event-details page
// GET /events/:id/dashboard
// ---------------------------------------------------------------------
type RealDashboard = {
  event: {
    _id: string;
    title: string;
    slug: string;
    status: string;
    type: "free" | "paid";
    category?: string | null;
    coverImage?: string;
    startDate: string;
    isOnline?: boolean;
    venue?: { name: string; city: string } | null;
    isPromoted: boolean;
    promotionStatus?: string;
  };
  reservationsCount: number;
  capacity: number | null;
  capacityRemaining: number | null;
  ticketsSoldCount: number;
  revenueTotal: number;
  checkedInCount: number;
  recentAttendees: Array<{
    _id: string;
    attendeeName: string;
    code: string;
    ticketId: string;
    status: "valid" | "checked_in" | "cancelled" | "refunded";
    ticketTypeName: string;
  }>;
  ticketTypes: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    quantitySold: number;
    quantityRemaining: number;
    isActive: boolean;
  }>;
  payout: { amountDue: number };
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

function mapDashboardStatus(
  status: string,
  capacityRemaining: number | null
): OrganizerEventDetails["status"] {
  if (status === "rejected" || status === "cancelled") return "REJECTED";
  if (status === "approved") return capacityRemaining === 0 ? "SOLD OUT" : "LIVE";
  return "UPCOMING"; // draft, pending_approval, postponed
}

export async function fetchEventDashboard(eventId: string): Promise<OrganizerEventDetails> {
  const res = await api.get(`/events/${eventId}/dashboard`);
  const d = res.body as RealDashboard;
  const isFree = d.event.type === "free";

  const ticketTypes = isFree
    ? [
        {
          id: "rsvp",
          slug: "rsvp",
          name: "General admission (RSVP)",
          price: 0,
          sold: d.reservationsCount,
          left: d.capacity !== null ? Math.max(d.capacity - d.reservationsCount, 0) : null,
        },
      ]
    : d.ticketTypes
        .filter((t) => t.isActive)
        .map((t) => ({
          id: t._id,
          slug: t._id,
          name: t.name,
          price: t.price,
          sold: t.quantitySold,
          left: t.quantityRemaining,
        }));

  const totalTickets = isFree
    ? d.capacity
    : d.ticketTypes.reduce((sum, t) => sum + t.quantity, 0) || null;
  const remainingTickets = isFree
    ? d.capacityRemaining
    : d.ticketTypes.reduce((sum, t) => sum + t.quantityRemaining, 0);

  return {
    id: d.event._id,
    slug: d.event.slug,
    title: d.event.title,
    eventNumber: `EVT-${d.event._id.slice(-6).toUpperCase()}`,
    category: d.event.category ?? "Uncategorized",
    status: mapDashboardStatus(d.event.status, d.capacityRemaining),
    paymentType: isFree ? "FREE" : "PAID",
    coverImage: d.event.coverImage ?? "",
    dateText: formatDate(d.event.startDate),
    venueText: d.event.isOnline
      ? "Online event"
      : d.event.venue
        ? `${d.event.venue.name}, ${d.event.venue.city}`
        : "Venue TBA",
    // Driven separately on the page by useOrganizerStatus (real approval status).
    isAccountUnderReview: false,
    metrics: {
      ticketsSold: isFree ? d.reservationsCount : d.ticketsSoldCount,
      totalTickets,
      revenue: isFree ? 0 : d.revenueTotal,
      remainingTickets,
      checkedInCount: d.checkedInCount,
    },
    ticketTypes,
    recentAttendees: d.recentAttendees.map((a) => ({
      id: a._id,
      slug: a._id,
      name: a.attendeeName,
      avatarInitials: getInitials(a.attendeeName),
      tier: a.ticketTypeName,
      referenceCode: shortenTicketRef(a.ticketId),
      status: a.status === "checked_in" ? "IN" : "GOING",
    })),
    isPromoted: d.event.isPromoted,
    promotionMessage:
      d.event.promotionStatus === "pending"
        ? "Your promotion request is pending admin approval."
        : "This event is not promoted yet. Boost it for a featured spot on homepage and explore",
    canCancel: d.event.status === "approved" || d.event.status === "postponed",
    canPostpone: d.event.status === "approved",
    ...buildEditability(d.event.status, d.event.startDate),
  };
}

// A draft/rejected event is always editable. A live (approved/postponed)
// event is editable too, but only up to LIVE_EDIT_CUTOFF_DAYS before it
// starts — past that, canEdit flips false and editBlockedReason explains
// why, so the Edit button can be disabled with a real reason instead of
// only failing once the organizer reaches the end of the wizard.
function buildEditability(
  status: string,
  startDate: string
): Pick<OrganizerEventDetails, "canEdit" | "isLiveEdit" | "editBlockedReason"> {
  const isDraftEditable = status === "draft" || status === "rejected";
  const isLiveStatus = status === "approved" || status === "postponed";
  const isLiveEditable = isLiveStatus && isLiveEditableEvent(status, startDate);

  return {
    canEdit: isDraftEditable || isLiveEditable,
    isLiveEdit: isLiveEditable,
    editBlockedReason:
      isLiveStatus && !isLiveEditable
        ? `This event starts in less than ${LIVE_EDIT_CUTOFF_DAYS} days and can no longer be edited`
        : undefined,
  };
}

// ---------------------------------------------------------------------
// Cancel / postpone — organizer-initiated lifecycle changes. The backend
// emails every attendee holding a live ticket automatically (and refunds
// paid orders on cancel) — nothing extra to trigger from the frontend.
// PATCH /events/:id/cancel, PATCH /events/:id/postpone
// ---------------------------------------------------------------------
export async function cancelEvent(eventId: string, reason: string) {
  const res = await api.patch(`/events/${eventId}/cancel`, { reason });
  return res.body;
}

export async function postponeEvent(eventId: string, newStartDate: string, reason?: string) {
  const res = await api.patch(`/events/${eventId}/postpone`, { newStartDate, reason });
  return res.body;
}

// ---------------------------------------------------------------------
// Check-in — scan/enter a ticket code at the door
// POST /events/:eventId/check-in
// ---------------------------------------------------------------------
export type CheckInResult = {
  result: "valid" | "already_used" | "invalid";
  checkedInAt?: string | null;
  ticket?: {
    _id: string;
    code: string;
    attendeeName: string;
    attendeeEmail: string;
    type: "free" | "paid";
    status: string;
  };
};

export async function checkInTicket(eventId: string, code: string): Promise<CheckInResult> {
  const res = await api.post(`/events/${eventId}/check-in`, { code });
  return res.body as CheckInResult;
}

import { z } from "zod";
import { api } from "@/lib/api";

const CREATED_EVENT_ID_KEY = "eventra-create-event-id";

export function getCreatedEventId(): string | null {
  return localStorage.getItem(CREATED_EVENT_ID_KEY);
}

export function setCreatedEventId(id: string) {
  localStorage.setItem(CREATED_EVENT_ID_KEY, id);
}

export function clearCreatedEventId() {
  localStorage.removeItem(CREATED_EVENT_ID_KEY);
}

// Mirrors the backend's LIVE_EDITABLE_STATUSES / LIVE_EDIT_CUTOFF_DAYS /
// isPastLiveEditCutoff (event.controller.ts) — lets the event-details page
// and the wizard gate/label a live-event edit the same way the backend will
// actually enforce it, instead of only finding out from a 400 at save time.
export const LIVE_EDITABLE_STATUSES = ["approved", "postponed"] as const;
export const LIVE_EDIT_CUTOFF_DAYS = 3;

export function isPastLiveEditCutoff(startDate?: string | Date | null): boolean {
  if (!startDate) return false;
  const start = new Date(startDate).getTime();
  if (Number.isNaN(start)) return false;
  const cutoff = start - LIVE_EDIT_CUTOFF_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() >= cutoff;
}

// True for an approved/postponed event that hasn't crossed the cutoff yet
// — i.e. one that can still be edited because it's LIVE, as opposed to
// one that's editable because it's still a draft/rejected.
export function isLiveEditableEvent(status?: string | null, startDate?: string | Date | null): boolean {
  return Boolean(
    status && (LIVE_EDITABLE_STATUSES as readonly string[]).includes(status) && !isPastLiveEditCutoff(startDate)
  );
}

// --- Step 1: creates the draft event, returns its real _id ---
export async function createEvent(payload: { type: "free" | "paid" }) {
  const res = await api.post("/events", payload);
  const event = res.body as { _id: string };
  setCreatedEventId(event._id);
  return event;
}

// --- Steps 2-6: patches the draft event with each step's fields ---
export async function updateEvent(eventId: string, payload: Record<string, unknown>) {
  const res = await api.patch(`/events/${eventId}`, payload);
  return res.body;
}

// --- Review step: submits the draft for admin approval ---
export async function submitEventForApproval(eventId: string) {
  const res = await api.post(`/events/${eventId}/submit`, {});
  return res.body as { message: string };
}

// --- Review step: creates ticket types for a paid event, once it has a
// real _id. Only valid for paid events — matches getOwnedPaidEvent's guard
// on the backend, which rejects ticket types on free events.
export async function createTicketType(
  eventId: string,
  payload: {
    name: string
    description?: string
    price: number
    quantity: number
    purchaseLimitPerPerson?: number
  }
) {
  const res = await api.post(`/events/${eventId}/ticket-types`, payload);
  return res.body as { _id: string };
}

export async function updateTicketType(
  eventId: string,
  ticketTypeId: string,
  payload: {
    name?: string
    description?: string
    price?: number
    quantity?: number
    purchaseLimitPerPerson?: number
  }
) {
  const res = await api.patch(`/events/${eventId}/ticket-types/${ticketTypeId}`, payload);
  return res.body as { _id: string };
}

// Used to roll back a partially-created batch of ticket types when one of
// them fails — see Review.tsx. Safe to call right after creation since
// deleteTicketType's only guard on the backend is quantitySold > 0, which
// can't be true yet on a ticket type that's seconds old.
export async function deleteTicketType(eventId: string, ticketTypeId: string) {
  const res = await api.delete(`/events/${eventId}/ticket-types/${ticketTypeId}`);
  return res.body;
}

// Used on edit: pulls the existing ticket types for a paid event so the
// Tickets step can be pre-populated, matching the {name, price, quantity,
// purchaseLimitPerPerson} shape the tickets field array actually uses —
// distinct from fetchEventTickets in the attendee-facing ticket-api file,
// which returns a display-oriented tier shape instead.
const ticketTypeListItemSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  purchaseLimitPerPerson: z.number().optional(),
});

export type EventTicketType = z.infer<typeof ticketTypeListItemSchema>;

export async function fetchTicketTypesForEvent(eventId: string): Promise<EventTicketType[]> {
  const res = await api.get(`/events/${eventId}/ticket-types`);
  const raw = Array.isArray(res.body) ? res.body : (res.body as any)?.ticketTypes ?? [];
  return z.array(ticketTypeListItemSchema).parse(raw);
}

export async function getEvent(eventId: string) {
  const res = await api.get(`/events/mine/${eventId}`); // organizer-specific fetch-by-id, matches getMyEventById
  return res.body;
}

// --- Categories: the organizer-facing list to populate the CATEGORY
// select. Categories are backend-managed (created/retired by admins), not
// something an organizer edits — this is a read-only lookup list. Mounted
// at GET /api/v1/categories -> listPublicCategories, which only returns
// active categories (retired ones stay referenced on old events per the
// isActive flag, but shouldn't be selectable for new ones).
const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
});

export type EventCategory = z.infer<typeof categorySchema>;

export async function fetchCategories(): Promise<EventCategory[]> {
  const res = await api.get("/categories");
  return z.array(categorySchema).parse(res.body);
}

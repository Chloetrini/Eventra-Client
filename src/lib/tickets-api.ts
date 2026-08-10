import { MOCK_TICKETS } from "@/lib/mock-tickets";
import { dummyTicket } from "@/lib/dummy-ticket";
import { eventTicketsSchema } from "@/lib/schema";
import type { EventTickets } from "@/types/ticket-tiers";
import type { Ticket } from "@/types/ticket";
import { api } from "@/lib/api";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------
// Ticket tiers — the "menu" of buyable tiers for one event, by slug.
// GET /events/:slug/tickets
// ---------------------------------------------------------------------
async function fetchEventTicketsMock(slug: string): Promise<EventTickets | null> {
  await delay(200);
  const found = MOCK_TICKETS.find((t) => t.eventSlug === slug);
  return found ?? null;
}

async function fetchEventTicketsReal(slug: string): Promise<EventTickets | null> {
  try {
    const res = await api.get(`/events/${slug}/tickets`);
    return eventTicketsSchema.parse(res.body);
  } catch (error) {
    return null;
  }
}

export function fetchEventTickets(slug: string): Promise<EventTickets | null> {
  return fetchEventTicketsMock(slug);
  // When the backend is ready: return fetchEventTicketsReal(slug);
}

// ---------------------------------------------------------------------
// The user's ISSUED tickets — what they've already purchased (QR, order id…).
// GET /tickets
// ---------------------------------------------------------------------
async function fetchMyTicketsMock(): Promise<Ticket[]> {
  await delay(300);
  return dummyTicket;
}

async function fetchMyTicketsReal(): Promise<Ticket[]> {
  try {
    const res = await api.get("/tickets");
    return res.body as Ticket[]; // validate with zod once the shape is confirmed
  } catch (error) {
    return [];
  }
}

export function fetchMyTickets(): Promise<Ticket[]> {
  return fetchMyTicketsReal();
  // When the backend is ready: return fetchMyTicketsReal();
}
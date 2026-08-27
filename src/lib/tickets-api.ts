
import {  ticketTypeSchema } from "@/lib/schema";
import type { EventTickets } from "@/types/ticket-tiers";
import type { RefundRequestPopulated } from "@/types/refunds";
import type { Ticket } from "@/types/ticket";
import { api } from "@/lib/api";
import z from "zod";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));



async function fetchEventTicketsReal(eventId: string): Promise<EventTickets | null> {
  try {
    const res = await api.get(`/events/${eventId}/ticket-types`);
    const rawTypes = Array.isArray(res.body) ? res.body : (res.body as any)?.ticketTypes ?? [];
    const parsed = z.array(ticketTypeSchema).parse(rawTypes);

    const tiers = parsed.map((tt) => {
      const remaining = tt.quantity - tt.quantitySold;
      return {
        id: tt._id,               // real MongoDB _id, used directly in checkout
        type: tt.name,
        unitPrice: tt.price,
        quantityLeft: remaining,
        availability: remaining <= 0 ? "sold out" as const
          : remaining <= 10 ? "scarce" as const
          : "available" as const,
      };
    });

    return {
      eventSlug: eventId, // not used for display, just satisfies the type
      serviceFeePercent: 0, // backend doesn't send this yet — flag to backend team if you want a real fee
      tiers,
    };
  } catch (error) {
    return null;
  }
}

export function fetchEventTickets(eventIdOrSlug: string): Promise<EventTickets | null> {
  return fetchEventTicketsReal(eventIdOrSlug);
  // When testing with mock data instead: return fetchEventTicketsMock(eventIdOrSlug);
}

// ---------------------------------------------------------------------
// The user's ISSUED tickets — what they've already purchased (QR, order id…).
// GET /tickets/my-tickets
// ---------------------------------------------------------------------


async function fetchMyTicketsReal(): Promise<Ticket[]> {
  try {
    const res = await api.get("/tickets/my-tickets");
    return res.body as Ticket[]; // validate with zod once the shape is confirmed
  } catch (error) {
    return [];
  }
}

export function fetchMyTickets(): Promise<Ticket[]> {
  return fetchMyTicketsReal();
  // When testing with mock data instead: return fetchMyTicketsMock();
}

// ---------------------------------------------------------------------
// Free event RSVP — POST /tickets/rsvp/:eventId
// ---------------------------------------------------------------------
export async function rsvpFreeEvent(eventId: string, payload: {
  guests?: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}) {
  const res = await api.post(`/tickets/rsvp/${eventId}`, payload);
  return res.body;
}

// ---------------------------------------------------------------------
// Paid event checkout — POST /tickets/checkout/:eventId
// ---------------------------------------------------------------------
export async function initializeCheckout(eventId: string, payload: {
  items: { ticketTypeId: string; quantity: number }[];
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}) {
  const res = await api.post(`/tickets/checkout/${eventId}`, payload);
  return res.body as { orderId: string; reference: string; authorizationUrl: string; total: number };
}

// ---------------------------------------------------------------------
// Poll order status after Paystack redirect — GET /tickets/orders/:reference
// ---------------------------------------------------------------------
export async function getOrderByReference(reference: string) {
  const res = await api.get(`/tickets/orders/${reference}`);
  return res.body;
}

export async function createRefundRequest(ticketId: string, reason: string, description: string, requestedResolution: string, evidence: { url: string | null }[], additionalInformation: string): Promise<RefundRequestPopulated> {
  const res = await api.post(`tickets/${ticketId}/refund-request`, {
    ticketId,
    reason,
    description,
    requestedResolution,
    evidence,
    additionalInformation
  })
  return res.body as RefundRequestPopulated
}


export async function cancelReservation(ticketId: string) {
  const res = await api.delete(`/tickets/${ticketId}/reservation`);
  return res.body;
}


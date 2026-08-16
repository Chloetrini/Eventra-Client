import type { Attendee, CheckInResponse, EventCheckInData } from '@/types/check-in';
import { api } from '@/lib/api';
import { fetchMyEvents } from '@/lib/events-api';

// ─── Real backend shapes ────────────────────────────────────────
// GET /events/:eventId/attendees, POST /events/:eventId/check-in
// (ticket.controller.ts's listEventAttendees / checkInTicket)

type RealTicket = {
  _id: string;
  code: string;
  type: 'free' | 'paid';
  price: number;
  attendeeName: string;
  attendeeEmail: string;
  status: 'valid' | 'checked_in' | 'cancelled' | 'refunded';
  checkedInAt?: string | null;
  ticketType?: { name: string } | null;
};

function mapTicketToAttendee(t: RealTicket, eventId: string, eventName: string): Attendee {
  return {
    id: t._id,
    name: t.attendeeName,
    email: t.attendeeEmail,
    ticketType: t.type === 'free' ? 'RSVP' : (t.ticketType?.name ?? 'General'),
    ticketReference: t.code,
    checkedIn: t.status === 'checked_in',
    checkedInAt: t.checkedInAt ?? null,
    eventId,
    eventName,
    isScanned: t.status === 'checked_in',
  };
}

// ─── API Endpoints ──────────────────────────────────────────────

/**
 * Fetch all attendees for a specific event, plus the counts that drive
 * the "X of Y checked in" progress bar.
 * GET /events/:eventId/attendees
 */
export const fetchEventAttendees = async (eventId: string): Promise<EventCheckInData> => {
  const [attendeesRes, myEvents] = await Promise.all([
    api.get(`/events/${eventId}/attendees?limit=500`),
    // Attendees endpoint doesn't include the event's title/cover image —
    // both already live in the organizer's own event list, which
    // react-query dedupes against every other page that fetches it.
    fetchMyEvents(),
  ]);

  const body = attendeesRes.body as {
    tickets: RealTicket[];
    stats: { total: number; checkedIn: number; notIn: number };
  };
  const event = myEvents.find((e) => e._id === eventId);
  const eventName = event?.eventTitle ?? 'Event';

  return {
    eventId,
    eventName,
    eventImage: event?.coverImage ?? null,
    attendees: body.tickets.map((t) => mapTicketToAttendee(t, eventId, eventName)),
    stats: {
      totalAttendees: body.stats.total,
      checkedIn: body.stats.checkedIn,
      remaining: body.stats.notIn,
      checkInRate: body.stats.total > 0 ? (body.stats.checkedIn / body.stats.total) * 100 : 0,
    },
  };
};

/**
 * Check in an attendee by their ticket code — this is what both the QR
 * scanner (decoded text) and manual lookup (ticket reference) actually
 * submit; the backend has one check-in route, not two.
 * POST /events/:eventId/check-in
 */
export const checkInAttendee = async (
  eventId: string,
  ticketReference: string
): Promise<CheckInResponse> => {
  const res = await api.post(`/events/${eventId}/check-in`, { code: ticketReference });
  const body = res.body as {
    result: 'valid' | 'already_used' | 'invalid';
    checkedInAt?: string | null;
    ticket?: RealTicket;
  };

  if (body.result === 'invalid') {
    throw new Error('Not a valid ticket for this event');
  }
  if (body.result === 'already_used') {
    throw new Error('This ticket has already been checked in');
  }

  return {
    success: true,
    message: body.ticket?.attendeeName ? `${body.ticket.attendeeName} checked in` : 'Checked in',
    attendee: body.ticket ? mapTicketToAttendee(body.ticket, eventId, '') : undefined,
  };
};

/**
 * Manual lookup check-in — the backend has no separate "check in by
 * attendee id" route, only check-in-by-ticket-code, so this reuses the
 * same endpoint as the QR scanner. ticketReference is the attendee's
 * ticket code (Attendee.ticketReference), not their database id.
 */
export const manualCheckIn = async (
  eventId: string,
  ticketReference: string
): Promise<CheckInResponse> => {
  return checkInAttendee(eventId, ticketReference);
};

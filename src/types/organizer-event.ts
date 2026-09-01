export type EventStatus = 'LIVE' | 'SOLD OUT' | 'REJECTED' | 'UPCOMING';
export type PaymentType = 'FREE' | 'PAID';
export type AttendeeStatus = 'IN' | 'GOING';

export interface TicketTypeDetail {
  id: string;
  slug: string;
  name: string; // e.g. "GENERAL ADMISSION (RSVP)", "REGULAR", "VIP"
  price: number; // 0 for free
  sold: number | null; // null renders '--'
  left: number | null; // null renders '--'
}

export interface RecentAttendee {
  id: string;
  slug: string;
  name: string;
  avatarInitials: string;
  tier: string;
  referenceCode: string;
  status: AttendeeStatus;
}

export interface EventMetrics {
  ticketsSold: number | null;
  totalTickets: number | null;
  revenue: number | null;
  remainingTickets: number | null;
  checkedInCount: number;
}

export interface OrganizerEventDetails {
  id: string;
  slug: string;
  title: string;
  eventNumber: string; // e.g., "No 0001"
  category: string;
  status: EventStatus;
  paymentType: PaymentType;
  coverImage: string;
  dateText: string;
  venueText: string;
  isAccountUnderReview: boolean;
  metrics: EventMetrics;
  ticketTypes: TicketTypeDetail[];
  recentAttendees: RecentAttendee[];
  isPromoted: boolean;
  promotionMessage?: string;
  /** Only an approved or already-postponed event can be cancelled;
   * only an approved event can be postponed — mirrors the backend's own
   * cancelEvent/postponeEvent guards. */
  canCancel: boolean;
  canPostpone: boolean;
  /** The organizer's own viewer currency — metrics.revenue and every
   * ticketTypes[].price are already converted into it server-side (see
   * fetchEventDashboard, events-api.ts). */
  currency?: string;
  /** Whether the Edit button should be enabled at all. True for a draft or
   * rejected event (always), and also true for a live approved/postponed
   * event that hasn't yet crossed the 3-day-before-start cutoff — mirrors
   * the backend's EDITABLE_STATUSES / LIVE_EDITABLE_STATUSES +
   * isPastLiveEditCutoff guards on PATCH /events/:id. A pending-approval or
   * cancelled event (or a live one past its cutoff) fails that save with a
   * 400, so the UI should stop the organizer before they enter the wizard,
   * not after. */
  canEdit: boolean;
  /** True when canEdit is true because the event is currently LIVE
   * (approved/postponed) rather than a draft/rejected one — lets the UI
   * show "you're editing a live event, attendees will be notified"
   * messaging and swap "Submit for review" for "Save changes". */
  isLiveEdit: boolean;
  /** Set only when the event is live (approved/postponed) but past the
   * 3-day cutoff — the specific reason the Edit button is disabled, to
   * show instead of a generic message. */
  editBlockedReason?: string;
}

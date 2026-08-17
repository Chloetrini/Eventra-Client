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
}

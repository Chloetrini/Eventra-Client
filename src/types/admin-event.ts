export type AdminEventStatus =
  | 'LIVE'
  | 'PENDING'
  | 'APPROVED'
  | 'SUSPENDED'
  | 'FLAGGED'
  | 'PAST'
  | 'REJECTED'
  | 'DRAFT'
  | 'CANCELLED';

export type AdminPaymentType = 'PAID' | 'FREE';

export interface AdminEventTicketType {
  id: string;
  name: string; // e.g. "Regular", "VIP"
  price: number;
  quantity: number;
}

export interface AdminEventOrganizer {
  id: string;
  name: string;
  initials: string;
  verified: boolean;
  avatarUrl?: string;
}

export interface AdminEventDetailsData {
  description: string;
  category: string;
  formattedDate: string;
  venue: string;
  capacity: number;
  agePolicy: string;
  refundPolicy: string;
  ticketTypes: AdminEventTicketType[];
  organizer: AdminEventOrganizer;
  bannerImage?: string;
  // Admin's own viewer currency (from the backend's `currency` field on
  // this response) — every ticketType price above is already converted
  // into it. Was being fetched but silently dropped before reaching this
  // type, so the ticket price table had no way to show which currency
  // symbol applied.
  currency?: string;
}

export interface AdminEvent {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
  organizerName: string;
  organizerInitials: string;
  type: AdminPaymentType;
  soldText: string;
  soldCount?: number;
  totalCapacity?: number;
  status: AdminEventStatus;
  totalCheckedIn?: number;
  totalNotIn?: number;
  details?: AdminEventDetailsData;
}

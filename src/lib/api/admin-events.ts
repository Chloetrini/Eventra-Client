import { api } from "@/lib/api";
import type { AdminEvent, AdminEventStatus, AdminEventDetailsData } from "@/types/admin-event";
import type { StatusFilterOption } from "@/components/admin/events/AdminEventsFilterBar";
import { formatDate, formatTime } from "@/lib/utils";

interface RawAdminEventOrganizer {
  _id: string;
  fullname: string;
  email?: string;
  organizerProfile?: { businessName?: string; approvalStatus?: string };
}

// Raw shape of one row from GET /admin/events
interface RawAdminEventListItem {
  _id: string;
  title?: string;
  slug: string;
  type: "free" | "paid";
  status: string;
  flagged?: boolean;
  ticketsSoldCount?: number;
  capacity?: number;
  startDate?: string;
  createdAt: string;
  organizer?: RawAdminEventOrganizer;
}

interface RawAdminEventDetail extends RawAdminEventListItem {
  description?: string;
  coverImage?: string;
  venue?: { name: string; address: string; city: string; state?: string };
  isOnline: boolean;
  endDate?: string;
  agePolicy?: string;
  refundPolicy?: { type: "no-refunds" | "refund-until-days-before"; daysBefore?: number };
  flagReason?: string;
  category?: { _id: string; name: string };
  ticketTypes: { _id: string; name: string; price: number; quantity: number }[];
  // getEventDetailForAdmin already converts every price on this response
  // (event.minPrice, each ticketType.price) into the admin's own viewer
  // currency and returns it here — was never read on this side.
  currency?: string;
}

export interface FetchAdminEventsParams {
  status?: StatusFilterOption;
  tab?: StatusFilterOption;
  q?: string;
  page?: number;
  limit?: number;
}

export interface AdminEventsResponse {
  events: AdminEvent[];
  meta?: {
    totalCount: number;
    page: number;
    limit: number;
    hasMore?: boolean;
  };
}

function initialsFrom(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function organizerDisplayName(organizer?: RawAdminEventOrganizer): string {
  return organizer?.organizerProfile?.businessName ?? organizer?.fullname ?? "Unknown organizer";
}

function deriveStatus(raw: RawAdminEventListItem): AdminEventStatus {
  if (raw.flagged) return "FLAGGED";
  switch (raw.status) {
    case "pending_approval":
      return "PENDING";
    case "rejected":
      return "REJECTED";
    case "draft":
      return "DRAFT";
    case "cancelled":
      return "CANCELLED";
    case "approved":
    case "postponed":
      return raw.startDate && new Date(raw.startDate) < new Date() ? "PAST" : "LIVE";
    default:
      return raw.status.toUpperCase() as AdminEventStatus;
  }
}

function mapListItem(raw: RawAdminEventListItem): AdminEvent {
  const organizerName = organizerDisplayName(raw.organizer);
  return {
    _id: raw._id,
    title: raw.title ?? "Untitled event",
    slug: raw.slug,
    organizerName,
    organizerInitials: initialsFrom(organizerName),
    type: raw.type === "paid" ? "PAID" : "FREE",
    soldText: raw.capacity
      ? `${raw.ticketsSoldCount ?? 0}/${raw.capacity}`
      : raw.ticketsSoldCount
        ? String(raw.ticketsSoldCount)
        : "-",
    soldCount: raw.ticketsSoldCount,
    totalCapacity: raw.capacity,
    status: deriveStatus(raw),
    createdAt: raw.createdAt,
  };
}

function formatVenue(raw: RawAdminEventDetail): string {
  if (raw.isOnline) return "Online event";
  if (!raw.venue) return "Venue TBA";
  return raw.venue.city ? `${raw.venue.name}, ${raw.venue.city}` : raw.venue.name;
}

function formatRefundPolicy(policy?: RawAdminEventDetail["refundPolicy"]): string {
  if (!policy || policy.type === "no-refunds") return "No refunds";
  if (!policy.daysBefore) return "Refunds available before the event";
  return `Refunds until ${policy.daysBefore} day${policy.daysBefore === 1 ? "" : "s"} before`;
}

function mapDetail(raw: RawAdminEventDetail): AdminEvent {
  const base = mapListItem(raw);
  const organizerName = organizerDisplayName(raw.organizer);

  const details: AdminEventDetailsData = {
    description: raw.description ?? "No description provided yet.",
    category: raw.category?.name?.toUpperCase() ?? "UNCATEGORIZED",
    formattedDate: raw.startDate ? `${formatDate(raw.startDate)} - ${formatTime(raw.startDate)}` : "Date TBA",
    venue: formatVenue(raw),
    capacity: raw.capacity ?? 0,
    agePolicy: raw.agePolicy ?? "All ages",
    refundPolicy: formatRefundPolicy(raw.refundPolicy),
    bannerImage: raw.coverImage,
    organizer: {
      id: raw.organizer?._id ?? "",
      name: organizerName,
      initials: initialsFrom(organizerName),
      verified: raw.organizer?.organizerProfile?.approvalStatus === "approved",
    },
    ticketTypes: raw.ticketTypes.map(t => ({ id: t._id, name: t.name, price: t.price, quantity: t.quantity })),
    currency: raw.currency,
  };

  return { ...base, details };
}

export async function fetchAdminEvents(
  params: FetchAdminEventsParams = {}
): Promise<AdminEventsResponse> {
  const activeStatus = params.status ?? params.tab;
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (activeStatus && activeStatus !== "all") {
    query.set("tab", activeStatus);
  }
  if (params.q) {
    query.set("q", params.q);
  }

  const res = await api.get(`/admin/events?${query.toString()}`);
  const body = res.body as {
    events: RawAdminEventListItem[];
    totalCount?: number;
    meta?: {
      totalCount: number;
      page: number;
      limit: number;
      hasMore?: boolean;
    };
  };

  const events = body.events.map(mapListItem);

  const meta = body.meta ?? (body.totalCount !== undefined
    ? {
        totalCount: body.totalCount,
        page,
        limit,
        hasMore: page * limit < body.totalCount,
      }
    : undefined);

  return { events, meta };
}

export async function fetchPendingAdminEvents(): Promise<AdminEvent[]> {
  const res = await api.get("/admin/events/pending");
  const body = res.body as { events: RawAdminEventListItem[] };
  return body.events.map(mapListItem);
}

export async function fetchAdminEventDetail(id: string): Promise<AdminEvent> {
  const res = await api.get(`/admin/events/${id}`);
  return mapDetail(res.body as RawAdminEventDetail);
}

export async function flagAdminEvent(id: string, reason?: string): Promise<void> {
  await api.patch(`/admin/events/${id}/flag`, { reason });
}

export async function unflagAdminEvent(id: string): Promise<void> {
  await api.patch(`/admin/events/${id}/unflag`, {});
}

export async function removeAdminEvent(id: string, reason?: string): Promise<void> {
  await api.patch(`/admin/events/${id}/remove`, { reason });
}

export async function approveEvent(id: string): Promise<void> {
  await api.patch(`/admin/events/${id}/approve`, {});
}

export async function rejectEvent(id: string, reason?: string): Promise<void> {
  await api.patch(`/admin/events/${id}/reject`, { reason });
}

export async function suspendEvent(id: string, reason?: string): Promise<void> {
  await api.patch(`/admin/events/${id}/suspend`, { reason });
}

export async function unsuspendEvent(id: string): Promise<void> {
  await api.patch(`/admin/events/${id}/unsuspend`, {});
}

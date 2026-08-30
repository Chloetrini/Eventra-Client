import { api } from "@/lib/api";
import type { AdminPromotionListItem, AdminPromotionDetail, AdminPromotionStatus } from "@/types/admin-promotion";

interface RawAdminPromotionListItem {
  eventId: string;
  eventTitle: string;
  eventCoverImage?: string;
  organizerId?: string;
  organizerName: string;
  packageId: string;
  packageLabel: string;
  placementLabel?: string;
  priceNaira: number | null;
  durationDays?: number;
  paidAt?: string;
  paystackReference?: string;
}

interface RawAdminPromotionDetail {
  eventId: string;
  eventTitle: string;
  eventSlug?: string;
  eventCoverImage?: string;
  eventCategory?: string;
  eventStartDate?: string;
  organizer: { id?: string; name: string; email?: string; verified: boolean };
  packageId: string;
  packageLabel: string;
  packageDescription?: string;
  placementLabel?: string;
  priceNaira: number | null;
  durationDays?: number;
  status: AdminPromotionStatus;
  startsAt?: string;
  endsAt?: string;
  paidAt?: string;
  paystackReference?: string;
  currency: string;
}

function mapListItem(raw: RawAdminPromotionListItem): AdminPromotionListItem {
  return {
    eventId: raw.eventId,
    eventTitle: raw.eventTitle,
    eventCoverImage: raw.eventCoverImage,
    organizerId: raw.organizerId,
    organizerName: raw.organizerName,
    packageId: raw.packageId,
    packageLabel: raw.packageLabel,
    placementLabel: raw.placementLabel,
    // Backend field is named priceNaira for historical reasons (it's the
    // real settled amount), but by the time it reaches here it's already
    // been display-converted to the viewer's chosen currency — see
    // listPendingPromotions's ledgerRate conversion. Renamed on this side
    // so nothing here implies it's still specifically Naira.
    price: raw.priceNaira,
    durationDays: raw.durationDays,
    paidAt: raw.paidAt,
    paystackReference: raw.paystackReference,
  };
}

function mapDetail(raw: RawAdminPromotionDetail): AdminPromotionDetail {
  return {
    eventId: raw.eventId,
    eventTitle: raw.eventTitle,
    eventSlug: raw.eventSlug,
    eventCoverImage: raw.eventCoverImage,
    eventCategory: raw.eventCategory,
    eventStartDate: raw.eventStartDate,
    organizer: raw.organizer,
    packageId: raw.packageId,
    packageLabel: raw.packageLabel,
    packageDescription: raw.packageDescription,
    placementLabel: raw.placementLabel,
    price: raw.priceNaira,
    durationDays: raw.durationDays,
    status: raw.status,
    startsAt: raw.startsAt,
    endsAt: raw.endsAt,
    paidAt: raw.paidAt,
    paystackReference: raw.paystackReference,
    currency: raw.currency,
  };
}

// Matches: GET /admin/promotions/pending
export async function fetchPendingAdminPromotions(): Promise<{
  promotions: AdminPromotionListItem[];
  currency: string;
}> {
  const res = await api.get("/admin/promotions/pending");
  const body = res.body as { promotions: RawAdminPromotionListItem[]; currency: string };
  return { promotions: body.promotions.map(mapListItem), currency: body.currency };
}

// Matches: GET /admin/promotions/:eventId
export async function fetchAdminPromotionDetail(eventId: string): Promise<AdminPromotionDetail> {
  const res = await api.get(`/admin/promotions/${eventId}`);
  return mapDetail(res.body as RawAdminPromotionDetail);
}

// Matches: PATCH /admin/events/:id/promotion/approve — same endpoint the
// event-detail page's promotion actions already call; kept under the
// events path on the backend since a promotion always belongs to one event.
export async function approveEventPromotion(eventId: string): Promise<void> {
  await api.patch(`/admin/events/${eventId}/promotion/approve`, {});
}

// Matches: PATCH /admin/events/:id/promotion/reject
export async function rejectEventPromotion(eventId: string): Promise<void> {
  await api.patch(`/admin/events/${eventId}/promotion/reject`, {});
}

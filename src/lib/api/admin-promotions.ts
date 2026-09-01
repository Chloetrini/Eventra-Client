import { api } from "@/lib/api";
import type { AdminPromotion, AdminPromotionListItem, AdminPromotionDetail, AdminPromotionStatus } from "@/types/admin-promotion";
import type { PromotionStatusFilterOption } from "@/components/admin/promotions/AdminPromotionsFilterBar";

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

// Raw shape of one row from GET /admin/promotions, as returned by
// listPromotionsForAdmin (admin.controller.ts).
interface RawAdminPromotion {
  eventId: string;
  eventTitle: string;
  eventCoverImage?: string;
  organizerId?: string;
  organizerName: string;
  packageId: string;
  packageLabel: string;
  placementLabel?: string;
  priceNaira: number | null;
  status: AdminPromotionStatus;
  startsAt?: string | null;
  endsAt?: string | null;
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

function mapPromotion(raw: RawAdminPromotion): AdminPromotion {
  return {
    eventId: raw.eventId,
    eventTitle: raw.eventTitle,
    eventCoverImage: raw.eventCoverImage,
    organizerId: raw.organizerId,
    organizerName: raw.organizerName,
    packageId: raw.packageId,
    packageLabel: raw.packageLabel,
    placementLabel: raw.placementLabel,
    price: raw.priceNaira,
    status: raw.status,
    startsAt: raw.startsAt ?? undefined,
    endsAt: raw.endsAt ?? undefined,
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

// Matches: GET /admin/promotions — the standalone Promotions page under
// Manage. limit=100 flat fetch, same convention fetchAdminEvents already
// uses (no pagination controls on that page's table either), rather than
// building out a second, separate paging UI just for this one.
export async function fetchAdminPromotions(
  params: { tab?: PromotionStatusFilterOption; q?: string } = {}
): Promise<{ promotions: AdminPromotion[]; currency: string }> {
  const query = new URLSearchParams({ limit: "100" });
  if (params.tab && params.tab !== "all") query.set("tab", params.tab);
  if (params.q) query.set("q", params.q);

  const res = await api.get(`/admin/promotions?${query.toString()}`);
  const body = res.body as { promotions: RawAdminPromotion[]; currency: string };
  return { promotions: body.promotions.map(mapPromotion), currency: body.currency };
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

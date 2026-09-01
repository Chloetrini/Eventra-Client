import { api } from "@/lib/api";

export type PromotionPackageId = "spotlight" | "featured" | "homepage-hero";

export type PromotionPackage = {
  id: PromotionPackageId;
  label: string;
  priceNaira: number;
  durationDays: number;
  description: string;
  placementLabel: string;
  popular?: boolean;
  // The viewer's own currency — priceNaira above is already converted
  // into it server-side (see listPromotionPackages, promotion.controller.ts).
  currency?: string;
};

export async function fetchPromotionPackages(): Promise<PromotionPackage[]> {
  // Backend mounts this router at /api/v1/promotions (plural) — see
  // index.ts's app.use('/api/v1/promotions', promotionRoutes).
  const res = await api.get("/promotions/packages");
  const body = res.body as { packages: Omit<PromotionPackage, "currency">[]; currency?: string };
  return body.packages.map(pkg => ({ ...pkg, currency: body.currency }));
}

export type PromotionStatus = "pending" | "approved" | "rejected" | "expired";

export type MyPromotion = {
  eventId: string;
  eventTitle: string;
  packageId: PromotionPackageId;
  packageLabel: string;
  placementLabel: string | null;
  priceNaira: number | null;
  startsAt: string | null;
  endsAt: string | null;
  status: PromotionStatus;
  statusLabel: string;
  paystackReference: string;
  paid: boolean;
  // The viewer's own currency — priceNaira above is already converted
  // into it server-side (see listMyPromotions, promotion.controller.ts).
  currency?: string;
};

export async function fetchMyPromotions(): Promise<MyPromotion[]> {
  const res = await api.get("/promotions/mine");
  const body = res.body as { promotions: Omit<MyPromotion, "currency">[]; currency?: string };
  return body.promotions.map(promo => ({ ...promo, currency: body.currency }));
}

export async function requestPromotion(
  eventId: string,
  packageId: PromotionPackageId
): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await api.post(`/events/${eventId}/promote`, { packageId });
  return res.body as { authorizationUrl: string; reference: string };
}

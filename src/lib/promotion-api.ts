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
};

export async function fetchPromotionPackages(): Promise<PromotionPackage[]> {
  const res = await api.get("/promotion/packages");
  return res.body as PromotionPackage[];
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
};

export async function fetchMyPromotions(): Promise<MyPromotion[]> {
  const res = await api.get("/promotion/mine");
  return res.body as MyPromotion[];
}

export async function requestPromotion(
  eventId: string,
  packageId: PromotionPackageId
): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await api.post(`/events/${eventId}/promote`, { packageId });
  return res.body as { authorizationUrl: string; reference: string };
}

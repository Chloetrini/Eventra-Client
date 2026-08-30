import { api } from "@/lib/api"

export interface AdminPayoutOverview {
  heldInEscrow: number
  heldInEscrowEventsCount: number
  readyToRelease: number
  paidOutAllTime: number
  commissionCollected: number
  // The admin's resolved display currency — every amount above is already
  // converted into this. See resolveViewerCurrency, lib/viewerCurrency.ts
  // on the backend.
  currency?: string
}

export interface AwaitingPayoutItem {
  organizerId: string
  organizerName: string
  eventId: string
  eventTitle: string
  amount: number
  releaseDate: string | null
  status: "processing" | "ready" | "held"
}

// listAwaitingPayouts (admin.controller.ts) returns { payouts, currency },
// not a bare array — matches the shape every other admin money endpoint
// uses to carry the viewer's currency alongside its data.
export interface AwaitingPayoutsResponse {
  payouts: AwaitingPayoutItem[]
  currency?: string
}

export interface PayoutHistoryItem {
  organizerName: string
  eventTitle: string
  amount: number
  paidAt: string
}

export interface PayoutHistoryResponse {
  payouts: PayoutHistoryItem[]
  currency?: string
  meta?: {
    page: number
    limit: number
    total: number
  }
}

export async function fetchAdminPayoutsOverview(): Promise<AdminPayoutOverview> {
  const res = await api.get("/admin/payouts/overview")
  return res.body as AdminPayoutOverview
}

export async function fetchAwaitingPayouts(): Promise<AwaitingPayoutsResponse> {
  const res = await api.get("/admin/payouts/awaiting")
  return res.body as AwaitingPayoutsResponse
}

export async function fetchPayoutHistory(): Promise<PayoutHistoryResponse> {
  const res = await api.get("/admin/payouts/history")
  return res.body as PayoutHistoryResponse
}

export async function releaseEventPayout(params: { organizerId: string; eventId: string }): Promise<void> {
  await api.post(`/admin/payouts/release/${params.organizerId}/${params.eventId}`, {})
}

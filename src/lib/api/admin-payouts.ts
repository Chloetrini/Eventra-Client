import { api } from "@/lib/api"

export interface AdminPayoutOverview {
  heldInEscrow: number
  heldInEscrowEventsCount: number
  readyToRelease: number
  paidOutAllTime: number
  commissionCollected: number
  // Added alongside the admin currency-conversion wiring — the currency
  // every amount above is already expressed in (the viewer's own
  // currencyPreference, or the platform default). See viewerCurrency.ts
  // on the backend. Optional so this type doesn't break against an older
  // deployed backend that hasn't shipped the field yet.
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

// BREAKING CHANGE (backend, admin currency-conversion wiring): this
// endpoint's body used to be a bare AwaitingPayoutItem[]. It's now an
// object carrying the currency every `amount` is expressed in, same shape
// as PayoutHistoryResponse below.
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

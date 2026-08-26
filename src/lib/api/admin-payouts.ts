import { api } from "@/lib/api"

export interface AdminPayoutOverview {
  heldInEscrow: number
  heldInEscrowEventsCount: number
  readyToRelease: number
  paidOutAllTime: number
  commissionCollected: number
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

export interface PayoutHistoryItem {
  organizerName: string
  eventTitle: string
  amount: number
  paidAt: string
}

export interface PayoutHistoryResponse {
  payouts: PayoutHistoryItem[]
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

export async function fetchAwaitingPayouts(): Promise<AwaitingPayoutItem[]> {
  const res = await api.get("/admin/payouts/awaiting")
  return res.body as AwaitingPayoutItem[]
}

export async function fetchPayoutHistory(): Promise<PayoutHistoryResponse> {
  const res = await api.get("/admin/payouts/history")
  return res.body as PayoutHistoryResponse
}

export async function releaseEventPayout(params: { organizerId: string; eventId: string }): Promise<void> {
  await api.post(`/admin/payouts/release/${params.organizerId}/${params.eventId}`, {})
}
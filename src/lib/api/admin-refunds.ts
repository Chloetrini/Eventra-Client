// lib/api/admin-refunds.ts
import { api } from "@/lib/api"
import type { RefundRequestPopulated, RefundRequestSummary, DisputeSummary } from "@/types/refunds"

// listRefundRequests defaults to status=pending server-side when no query
// param is sent — this page is a "needs action" queue, not a full history.
export async function fetchAdminRefundRequests(): Promise<RefundRequestSummary[]> {
  const res = await api.get("/admin/refund-requests?limit=100")
  const body = res.body as { refundRequests: Omit<RefundRequestSummary, "currency">[]; currency?: string }
  // Denormalize the response-level currency onto each row so the table can
  // format each amount without threading the whole response through as a
  // separate prop. See the `currency` field's comment on RefundRequestSummary.
  return body.refundRequests.map(r => ({ ...r, currency: body.currency }))
}

export async function fetchAdminRefundRequestDetail(id: string): Promise<RefundRequestPopulated> {
  const res = await api.get(`/admin/refund-requests/${id}`)
  return res.body as RefundRequestPopulated
}

export async function approveAdminRefundRequest(id: string): Promise<RefundRequestPopulated> {
  const res = await api.patch(`/admin/refund-requests/${id}/approve`, {})
  return res.body as RefundRequestPopulated
}

export async function rejectAdminRefundRequest(id: string, reason?: string): Promise<RefundRequestPopulated> {
  const res = await api.patch(`/admin/refund-requests/${id}/reject`, { reason })
  return res.body as RefundRequestPopulated
}

// listDisputes defaults to status=pending server-side too, same "needs
// action" convention as refund requests.
export async function fetchAdminDisputes(): Promise<DisputeSummary[]> {
  const res = await api.get("/admin/disputes?limit=100")
  const body = res.body as { disputes: Omit<DisputeSummary, "currency">[]; currency?: string }
  // Same denormalization as fetchAdminRefundRequests above — see
  // listDisputes, admin.controller.ts (previously not currency-aware at all).
  return body.disputes.map(d => ({ ...d, currency: body.currency }))
}

export async function challengeAdminDispute(id: string, message: string): Promise<DisputeSummary> {
  const res = await api.patch(`/admin/disputes/${id}/challenge`, { message })
  return res.body as DisputeSummary
}

export async function acceptAdminDisputeLoss(id: string): Promise<DisputeSummary> {
  const res = await api.patch(`/admin/disputes/${id}/accept-loss`, {})
  return res.body as DisputeSummary
}

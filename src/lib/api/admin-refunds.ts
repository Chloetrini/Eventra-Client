import { api } from "@/lib/api";
import type { RefundRequestPopulated, RefundRequestSummary } from "@/types/refunds";

// GET /api/v1/admin/refund-requests — see listRefundRequests in
// admin.controller.ts. No `status` query param sent, so the backend uses
// its own default (status=pending) — this page is a "needs action" review
// queue (see the NEEDS ACTION eyebrow above the page title), so once a
// request is approved or rejected it's meant to fall off this list, not
// linger in it. limit=100 is generous headroom over real pagination, which
// isn't wired up here yet — fine for a queue that's meant to stay small.
export async function fetchAdminRefundRequests(): Promise<RefundRequestSummary[]> {
  const res = (await api.get("/admin/refund-requests?limit=100")) as {
    body?: { refundRequests: RefundRequestSummary[] };
  };
  return res.body?.refundRequests ?? [];
}

// GET /api/v1/admin/refund-requests/:id — see getRefundRequestDetail in
// admin.controller.ts.
export async function fetchAdminRefundRequestDetail(id: string): Promise<RefundRequestPopulated> {
  const res = (await api.get(`/admin/refund-requests/${id}`)) as { body?: RefundRequestPopulated };
  if (!res.body) throw new Error("Refund request not found");
  return res.body;
}

// PATCH /api/v1/admin/refund-requests/:id/approve — see
// approveRefundRequest in admin.controller.ts. This is the one that
// actually calls Paystack to move money, so it can fail with a real error
// (e.g. Paystack rejects the refund) — the caller should surface
// err.message rather than a generic failure toast.
export async function approveAdminRefundRequest(id: string): Promise<void> {
  await api.patch(`/admin/refund-requests/${id}/approve`, {});
}

// PATCH /api/v1/admin/refund-requests/:id/reject — see rejectRefundRequest
// in admin.controller.ts. `reason` is optional on the backend (no minimum
// length enforced), unlike cancelling/rejecting an event.
export async function rejectAdminRefundRequest(id: string, reason: string): Promise<void> {
  await api.patch(`/admin/refund-requests/${id}/reject`, { reason });
}

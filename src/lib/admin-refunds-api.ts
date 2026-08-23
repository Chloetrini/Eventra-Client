import { api } from "@/lib/api";
import type { RefundRequestPopulated } from "@/types/refunds";

export interface FetchAdminRefundRequestsResult {
  refundRequests: RefundRequestPopulated[];
  meta: { currentPage: number; limit: number; total: number; totalPages: number; hasMore: boolean };
}

// GET /api/v1/admin/refund-requests — see listRefundRequests in
// admin.controller.ts. No status param is sent: the backend defaults to
// status=pending, which is exactly what this page wants — refunds still
// waiting on an admin decision.
export async function fetchAdminRefundRequests(): Promise<FetchAdminRefundRequestsResult> {
  const res = (await api.get("/admin/refund-requests")) as { body?: FetchAdminRefundRequestsResult };
  return (
    res.body ?? { refundRequests: [], meta: { currentPage: 1, limit: 20, total: 0, totalPages: 1, hasMore: false } }
  );
}

// GET /api/v1/admin/refund-requests/:id — see getRefundRequestDetail in
// admin.controller.ts.
export async function fetchAdminRefundRequestDetail(id: string): Promise<RefundRequestPopulated> {
  const res = (await api.get(`/admin/refund-requests/${id}`)) as { body?: RefundRequestPopulated };
  if (!res.body) throw new Error("Refund request not found");
  return res.body;
}

// PATCH /api/v1/admin/refund-requests/:id/approve — see
// approveRefundRequest in admin.controller.ts. This actually calls out to
// Paystack to process the refund, so it can be slower than a typical PATCH
// and can fail if the original transaction reference is no longer valid.
export async function approveAdminRefundRequest(id: string): Promise<void> {
  await api.patch(`/admin/refund-requests/${id}/approve`, {});
}

// PATCH /api/v1/admin/refund-requests/:id/reject — see rejectRefundRequest
// in admin.controller.ts.
export async function rejectAdminRefundRequest(id: string, reason?: string): Promise<void> {
  await api.patch(`/admin/refund-requests/${id}/reject`, { reason });
}

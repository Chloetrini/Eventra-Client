import { api } from "@/lib/api";

export interface AdminNavCounts {
  pendingApprovals: number;
  pendingRefunds: number;
  flaggedReports: number;
}

// GET /api/v1/admin/nav-counts — real backlog counts (pending organizers +
// pending events + pending paid promotions for Approvals, pending
// RefundRequests for Refunds). flaggedReports always comes back 0 for now —
// there's no flagged-content/disputes data model behind "Reports" yet.
export async function fetchAdminNavCounts(): Promise<AdminNavCounts> {
  const res = (await api.get("/admin/nav-counts")) as { body?: AdminNavCounts };
  return res.body ?? { pendingApprovals: 0, pendingRefunds: 0, flaggedReports: 0 };
}

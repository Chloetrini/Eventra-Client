import { api } from "@/lib/api";
import { fetchDashboardMock } from "@/mocks/dashboardMockData";
import type { DashboardData } from "@/types/dashboard";

// ============================================================
// REAL backend calls (uncomment / swap when backend is ready)
// ============================================================
async function fetchDashboardReal(): Promise<DashboardData> {
  const res = await api.get("/organizer/dashboard");
  return res.body as DashboardData;
}

// ============================================================
// ONE-LINE SWITCH: change this to fetchDashboardReal when backend is ready
// ============================================================
export function fetchDashboard(): Promise<DashboardData> {
  return fetchDashboardMock();
  // return fetchDashboardReal();
}
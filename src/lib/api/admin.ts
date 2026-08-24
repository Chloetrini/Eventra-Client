import type {
  OverviewSummary,
  PlatformRevenueData,
  RevenueRange,
} from "@/types/overview";
import type { Flag, AuditLogEntry } from "@/types/report";

// NOTE: adjust this import to match whatever your shared HTTP client is
// actually exported as (lib/api/api.ts) — guessing `apiClient` here.
// import { apiClient } from "@/lib/api/api";

export async function getOverviewSummary(): Promise<OverviewSummary> {
  // const { data } = await apiClient.get("/admin/overview/summary");
  // return data;
  throw new Error("getOverviewSummary: backend not wired up yet — using mock data in the hook");
}

export async function getPlatformRevenue(
  // range: RevenueRange
): Promise<PlatformRevenueData> {
  // const { data } = await apiClient.get("/admin/overview/platform-revenue", {
  //   params: { range },
  // });
  // return data;
  throw new Error("getPlatformRevenue: backend not wired up yet — using mock data in the hook");
}

export async function getFlags():  Promise<Flag[]> {
  // const { data} = await apiClient.get("/admin/reports/flags")
  // return data

  throw new Error("getFlags: backend not wired up yet, currently using mock data in the hook")
}

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  // const { data } = await apiClient.get("/admin/reports/audit-log");
  // return data;

  throw new Error ("getAuditLog: backend not wired up yet, currently using mock data in the hook")
}
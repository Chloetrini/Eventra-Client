import type {
  OverviewSummary,
  PlatformRevenueData,
  RevenueRange,
} from "@/types/overview";

// NOTE: adjust this import to match whatever your shared HTTP client is
// actually exported as (lib/api/api.ts) — guessing `apiClient` here.
// import { apiClient } from "@/lib/api/api";

export async function getOverviewSummary(): Promise<OverviewSummary> {
  // const { data } = await apiClient.get("/admin/overview/summary");
  // return data;
  throw new Error("getOverviewSummary: backend not wired up yet — using mock data in the hook");
}

export async function getPlatformRevenue(
  range: RevenueRange
): Promise<PlatformRevenueData> {
  // const { data } = await apiClient.get("/admin/overview/platform-revenue", {
  //   params: { range },
  // });
  // return data;
  throw new Error("getPlatformRevenue: backend not wired up yet — using mock data in the hook");
}
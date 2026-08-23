import { useQuery } from "@tanstack/react-query";
import { getPlatformRevenue } from "@/lib/api/admin";
import type { PlatformRevenueData, RevenueRange } from "@/types/overview";

export function usePlatformRevenue(range: RevenueRange) {
  return useQuery<PlatformRevenueData>({
    // Keyed by range so each period is cached independently — switching
    // 7D → 30D → 12M won't refetch a range you've already loaded.
    queryKey: ["admin", "overview", "platform-revenue", range],
    queryFn: () => getPlatformRevenue(range),
  });
}

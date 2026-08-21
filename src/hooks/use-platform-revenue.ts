import { useQuery } from "@tanstack/react-query";
// import { getPlatformRevenue } from "@/lib/api/admin";
import { mockPlatformRevenueByRange } from "@/types/overview-mock-data";
import type { PlatformRevenueData, RevenueRange } from "@/types/overview";

export function usePlatformRevenue(range: RevenueRange) {
  return useQuery<PlatformRevenueData>({
    // Keyed by range so each period is cached independently — switching
    // 7D → 30D → 12M won't refetch a range you've already loaded.
    queryKey: ["admin", "overview", "platform-revenue", range],
    queryFn: async () => {
      // Real call, once the backend endpoint exists:
      // return getPlatformRevenue(range);

      // Mock, pending backend:
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockPlatformRevenueByRange[range];
    },
  });
}
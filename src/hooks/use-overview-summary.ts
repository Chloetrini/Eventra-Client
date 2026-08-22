import { useQuery } from "@tanstack/react-query";
// import { getOverviewSummary } from "@/lib/api/admin";
import { mockOverviewSummary } from "@/types/overview-mock-data";
import type { OverviewSummary } from "@/types/overview";

export function useOverviewSummary() {
  return useQuery<OverviewSummary>({
    queryKey: ["admin", "overview", "summary"],
    queryFn: async () => {
      // Real call, once the backend endpoint exists:
      // return getOverviewSummary();

      // Mock, pending backend:
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockOverviewSummary;
    },
  });
}
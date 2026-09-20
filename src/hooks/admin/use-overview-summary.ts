import { useQuery } from "@tanstack/react-query";
import { getOverviewSummary } from "@/api/admin";
import type { OverviewSummary } from "@/types/overview";

export function useOverviewSummary() {
  return useQuery<OverviewSummary>({
    queryKey: ["admin", "overview", "summary"],
    queryFn: getOverviewSummary,
  });
}

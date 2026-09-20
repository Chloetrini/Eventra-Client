import { useQuery } from "@tanstack/react-query";
import { getRevenue } from "@/api/admin";
import type { RevenuePageData } from "@/types/revenue";

export function useRevenue() {
    return useQuery<RevenuePageData>({
        queryKey: ["admin", "revenue"],
        queryFn: getRevenue
    })
}
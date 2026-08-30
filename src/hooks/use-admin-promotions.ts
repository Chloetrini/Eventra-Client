import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPendingAdminPromotions,
  fetchAdminPromotionDetail,
  approveEventPromotion,
  rejectEventPromotion,
} from "@/lib/api/admin-promotions";
import { adminNavKeys } from "@/hooks/useAdminNavCounts";

export const adminPromotionKeys = {
  all: ["admin", "promotions"] as const,
  pending: () => [...adminPromotionKeys.all, "pending"] as const,
  detail: (eventId: string) => [...adminPromotionKeys.all, "detail", eventId] as const,
};

export function usePendingAdminPromotions() {
  return useQuery({
    queryKey: adminPromotionKeys.pending(),
    queryFn: fetchPendingAdminPromotions,
  });
}

export function useAdminPromotionDetail(eventId: string | undefined) {
  return useQuery({
    queryKey: adminPromotionKeys.detail(eventId as string),
    queryFn: () => fetchAdminPromotionDetail(eventId as string),
    enabled: !!eventId,
  });
}

export function useApproveEventPromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => approveEventPromotion(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: adminPromotionKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: adminPromotionKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adminNavKeys.all });
    },
  });
}

export function useRejectEventPromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => rejectEventPromotion(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: adminPromotionKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: adminPromotionKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adminNavKeys.all });
    },
  });
}

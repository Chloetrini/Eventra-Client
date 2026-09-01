import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPendingAdminPromotions,
  fetchAdminPromotions,
  fetchAdminPromotionDetail,
  approveEventPromotion,
  rejectEventPromotion,
} from "@/lib/api/admin-promotions";
import type { PromotionStatusFilterOption } from "@/components/admin/promotions/AdminPromotionsFilterBar";
import { adminNavKeys } from "@/hooks/useAdminNavCounts";

export const adminPromotionKeys = {
  all: ["admin", "promotions"] as const,
  pending: () => [...adminPromotionKeys.all, "pending"] as const,
  lists: () => [...adminPromotionKeys.all, "list"] as const,
  list: (tab: PromotionStatusFilterOption, q: string) => [...adminPromotionKeys.lists(), tab, q] as const,
  detail: (eventId: string) => [...adminPromotionKeys.all, "detail", eventId] as const,
};

export function usePendingAdminPromotions() {
  return useQuery({
    queryKey: adminPromotionKeys.pending(),
    queryFn: fetchPendingAdminPromotions,
  });
}

// Powers the standalone Promotions page under Manage — every promotion,
// any status, with the same tab+search shape the Events/Organizers admin
// pages already use.
export function useAdminPromotions(tab: PromotionStatusFilterOption, q: string) {
  return useQuery({
    queryKey: adminPromotionKeys.list(tab, q),
    queryFn: () => fetchAdminPromotions({ tab, q: q || undefined }),
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
      queryClient.invalidateQueries({ queryKey: adminPromotionKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: adminPromotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminNavKeys.all });
    },
  });
}

// hooks/use-admin-refunds.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchAdminRefundRequests,
  fetchAdminRefundRequestDetail,
  approveAdminRefundRequest,
  rejectAdminRefundRequest,
  fetchAdminDisputes,
  challengeAdminDispute,
  acceptAdminDisputeLoss,
} from "@/lib/api/admin-refunds"
import { createRefundRequest } from "@/lib/tickets-api"

export const adminRefundRequestsKeys = {
  all: ["admin", "refund-requests"] as const,
  list: () => [...adminRefundRequestsKeys.all, "list"] as const,
  detail: (id: string) => [...adminRefundRequestsKeys.all, "detail", id] as const,
}

export const adminDisputesKeys = {
  all: ["admin", "disputes"] as const,
  list: () => [...adminDisputesKeys.all, "list"] as const,
}

export function useAdminRefundRequests() {
  return useQuery({
    queryKey: adminRefundRequestsKeys.list(),
    queryFn: fetchAdminRefundRequests,
  })
}

export function useAdminRefundRequest(id: string | undefined) {
  return useQuery({
    queryKey: adminRefundRequestsKeys.detail(id as string),
    queryFn: () => fetchAdminRefundRequestDetail(id as string),
    enabled: !!id,
  })
}

export function useApproveAdminRefundRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveAdminRefundRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRefundRequestsKeys.all })
    },
  })
}

export function useRejectAdminRefundRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectAdminRefundRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRefundRequestsKeys.all })
    },
  })
}

export function useAdminDisputes() {
  return useQuery({
    queryKey: adminDisputesKeys.list(),
    queryFn: fetchAdminDisputes,
  })
}

export function useChallengeAdminDispute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => challengeAdminDispute(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDisputesKeys.all })
    },
  })
}

export function useAcceptAdminDisputeLoss() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => acceptAdminDisputeLoss(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDisputesKeys.all })
    },
  })
}

export function useCreateRefundRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      ticketId,
      reason,
      description,
      requestedResolution,
      evidence,
      additionalInformation
    }: {
      ticketId: string
      reason: string
      description: string
      requestedResolution: string
      evidence: { url: string | null }[]
      additionalInformation: string
    }) => createRefundRequest(ticketId, reason, description, requestedResolution, evidence, additionalInformation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRefundRequestsKeys.all })
    },
  })
}

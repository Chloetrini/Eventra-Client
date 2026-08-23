// hooks/use-admin-refunds.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mockDisputes } from "@/lib/mock-refund-requests"
import type { DisputeSummary, RefundRequestPopulated, RefundRequestSummary } from "@/types/refunds"
import {
    approveAdminRefundRequest,
    fetchAdminRefundRequestDetail,
    fetchAdminRefundRequests,
    rejectAdminRefundRequest,
} from "@/lib/api/admin-refunds"

// Simulates network latency so loading states behave like the real thing.
// Delete this once these hooks call the real API.
const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Disputes (Paystack chargebacks) are still mock data — there's a real
// PaymentDispute collection and webhook ingestion on the backend now (see
// the admin Overview page's "Open payment disputes" stat), but no admin
// list/detail/challenge/accept-loss endpoints exist yet. Wiring the
// Disputes tab to real data is a separate, bigger piece of work than the
// Refund requests tab below.
async function fetchDisputes(): Promise<DisputeSummary[]> {
    await mockDelay()
    return mockDisputes
}

async function fetchDisputeById(id: string): Promise<DisputeSummary> {
    await mockDelay()
    const found = mockDisputes.find((dispute) => dispute.id === id)
    if (!found) {
        throw new Error("Dispute not found")
    }
    return found
}

export const adminRefundRequestsKeys = {
    all: ["admin", "refund-requests"] as const,
    list: () => [...adminRefundRequestsKeys.all, "list"] as const,
    detail: (id: string) => [...adminRefundRequestsKeys.all, "detail", id] as const,
}

export function useAdminRefundRequests() {
    return useQuery<RefundRequestSummary[]>({
        queryKey: adminRefundRequestsKeys.list(),
        queryFn: fetchAdminRefundRequests,
    })
}

export function useAdminRefundRequest(id: string | undefined) {
    return useQuery<RefundRequestPopulated>({
        queryKey: adminRefundRequestsKeys.detail(id ?? ""),
        queryFn: () => fetchAdminRefundRequestDetail(id as string),
        enabled: !!id,
    })
}

// Both mutations invalidate the whole `admin.refund-requests` branch
// (list + this request's detail) rather than hand-patching cache entries —
// same reasoning as useSuspendAdminUser/useUnsuspendAdminUser in
// use-admin-users.ts. Approving also affects the admin Overview page's
// "Recent activity" and payout figures, but those are separate query keys
// this doesn't try to keep in sync — they'll pick up the change on their
// own next refetch.
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
        mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectAdminRefundRequest(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminRefundRequestsKeys.all })
        },
    })
}

export function useAdminDisputes() {
    return useQuery({
        queryKey: ["admin", "disputes"],
        queryFn: fetchDisputes,
    })
}

export function useAdminDispute(id: string | undefined) {
    return useQuery({
        queryKey: ["admin", "disputes", id],
        queryFn: () => fetchDisputeById(id as string),
        enabled: !!id,
    })
}

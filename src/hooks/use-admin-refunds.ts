// hooks/use-admin-refunds.ts
import { useQuery } from "@tanstack/react-query"
import { mockRefundRequests, mockDisputes } from "@/lib/mock-refund-requests"
import type { RefundRequestPopulated, DisputeSummary } from "@/types/refunds"

// Simulates network latency so loading states behave like the real thing.
// Delete this once these hooks call the real API.
const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchRefundRequests(): Promise<RefundRequestPopulated[]> {
    await mockDelay()
    return mockRefundRequests
}

async function fetchRefundRequestById(id: string): Promise<RefundRequestPopulated> {
    await mockDelay()
    const found = mockRefundRequests.find((request) => request._id === id)
    if (!found) {
        throw new Error("Refund request not found")
    }
    return found
}

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

export function useAdminRefundRequests() {
    return useQuery({
        queryKey: ["admin", "refund-requests"],
        queryFn: fetchRefundRequests,
    })
}

export function useAdminRefundRequest(id: string | undefined) {
    return useQuery({
        queryKey: ["admin", "refund-requests", id],
        queryFn: () => fetchRefundRequestById(id as string),
        enabled: !!id,
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
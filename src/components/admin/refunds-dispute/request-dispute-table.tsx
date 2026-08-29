import { useState } from "react"
import ActionBtn from "@/components/ui/action-btn"
import { formatRequestedAgo } from "@/lib/utils"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import type { RefundRequestSummary, DisputeSummary } from "@/types/refunds"
import {
    useApproveAdminRefundRequest,
    useRejectAdminRefundRequest,
    useChallengeAdminDispute,
    useAcceptAdminDisputeLoss,
} from "@/hooks/use-admin-refunds"
import { DeclineRefundDialog } from "@/components/dialogs/decline-refund-dialog"
import { DisputeActionDialog, type DisputeActionMode } from "@/components/dialogs/dispute-action-dialog"

const REQUEST_GRID_COLS = "grid grid-cols-[1.5fr_2fr_1fr_1.5fr_1fr_180px] gap-4 px-6"
const DISPUTE_GRID_COLS = "grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_220px] gap-4 px-6"

interface RequestDisputeTableProps {
    activeTab: "requests" | "disputes"
    refundRequests: RefundRequestSummary[]
    disputes: DisputeSummary[]
}

// A dispute's "attendee" isn't a single ticket — it's whoever the order
// belongs to. Falls back to "Unknown" only if the order (or both its
// buyer and guest fields) genuinely isn't there, which listDisputes on
// the backend allows for (order-resolution is best-effort).
function disputeAttendeeName(dispute: DisputeSummary): string {
    return dispute.order?.buyer?.fullname ?? dispute.order?.guestName ?? "Unknown"
}

function initialsFor(name: string): string {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    return initials || "?"
}

const RequestDisputeTable = ({ activeTab, refundRequests, disputes }: RequestDisputeTableProps) => {
    const navigate = useNavigate()
    const approveMutation = useApproveAdminRefundRequest()
    const rejectMutation = useRejectAdminRefundRequest()
    const challengeMutation = useChallengeAdminDispute()
    const acceptLossMutation = useAcceptAdminDisputeLoss()

    // Which request's decline dialog is open, if any — one dialog instance
    // shared across every row rather than one per row.
    const [declineTarget, setDeclineTarget] = useState<{ id: string; attendeeName: string } | null>(null)
    const [disputeTarget, setDisputeTarget] = useState<{ id: string; attendeeName: string; amount: number } | null>(null)
    const [disputeMode, setDisputeMode] = useState<DisputeActionMode>("challenge")

    const handleApprove = (requestId: string) => {
        approveMutation.mutate(requestId, {
            onSuccess: () => toast.success("Refund approved and sent to Paystack"),
            onError: (err) => toast.error(err instanceof Error ? err.message : "Could not approve this refund"),
        })
    }

    const handleDeclineConfirm = (requestId: string, reason: string) => {
        rejectMutation.mutate(
            { id: requestId, reason },
            {
                onSuccess: () => {
                    toast.success("Refund request declined")
                    setDeclineTarget(null)
                },
                onError: (err) => toast.error(err instanceof Error ? err.message : "Could not decline this request"),
            }
        )
    }

    const openDisputeDialog = (mode: DisputeActionMode, dispute: DisputeSummary) => {
        setDisputeMode(mode)
        setDisputeTarget({ id: dispute._id, attendeeName: disputeAttendeeName(dispute), amount: dispute.amount })
    }

    const handleDisputeConfirm = (disputeId: string, message: string) => {
        if (disputeMode === "challenge") {
            challengeMutation.mutate(
                { id: disputeId, message },
                {
                    onSuccess: () => {
                        toast.success("Evidence submitted to Paystack")
                        setDisputeTarget(null)
                    },
                    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not submit this challenge"),
                }
            )
        } else {
            acceptLossMutation.mutate(disputeId, {
                onSuccess: () => {
                    toast.success("Dispute loss accepted")
                    setDisputeTarget(null)
                },
                onError: (err) => toast.error(err instanceof Error ? err.message : "Could not accept this loss"),
            })
        }
    }

    if (activeTab === "requests") {
        return (
            <>
                <div className="min-w-225 border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
                    <div className={`${REQUEST_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ATTENDEE</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide truncate">EVENT</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">AMOUNT</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">REASON</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">REQUESTED</p>
                        <div />
                    </div>

                    {refundRequests.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No refund requests need your attention right now.
                        </p>
                    )}

                    {refundRequests.map((request, index) => {
                        const isThisApproving = approveMutation.isPending && approveMutation.variables === request._id
                        const isThisDeclining =
                            rejectMutation.isPending && rejectMutation.variables?.id === request._id

                        return (
                            <div
                                key={request._id}
                                onClick={() => navigate(`/admin/refunds/${request._id}`)}
                                className={`${REQUEST_GRID_COLS} py-5 items-center rounded-b-[10px] cursor-pointer hover:bg-muted/40 transition-colors dark:border-border ${
                                    index < refundRequests.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                                        {initialsFor(request.ticket.attendeeName)}
                                    </div>
                                    <p className="font-bold">{request.ticket.attendeeName}</p>
                                </div>

                                <p>{request.event.title}</p>

                                <p className="font-space font-bold">
                                    ₦{request.amount.toLocaleString()}
                                </p>

                                <p className="text-muted-foreground">{request.reason}</p>

                                <p className="text-muted-foreground">
                                    {formatRequestedAgo(request.createdAt)}
                                </p>

                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <ActionBtn
                                        type="button"
                                        text="Refund"
                                        loading={isThisApproving}
                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                        onClick={() => handleApprove(request._id)}
                                        classname="bg-[#0F6E56] hover:bg-[#095341] text-white text-sm px-4 py-2 h-auto"
                                    />
                                    <ActionBtn
                                        type="button"
                                        text="Decline"
                                        variant="outline"
                                        loading={isThisDeclining}
                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                        onClick={() =>
                                            setDeclineTarget({ id: request._id, attendeeName: request.ticket.attendeeName })
                                        }
                                        classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-sm px-4 py-2 h-auto"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>

                <DeclineRefundDialog
                    request={declineTarget}
                    open={declineTarget !== null}
                    onOpenChange={(open) => {
                        if (!open) setDeclineTarget(null)
                    }}
                    onConfirm={handleDeclineConfirm}
                    isSubmitting={rejectMutation.isPending}
                />
            </>
        )
    }

    return (
        <>
            <div className="min-w-225 border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
                <div className={`${DISPUTE_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ATTENDEE</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide truncate">EVENT</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">AMOUNT</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">PROCESSOR</p>
                    <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">STATUS</p>
                    <div />
                </div>

                {disputes.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No open disputes right now.
                    </p>
                )}

                {disputes.map((dispute, index) => {
                    const attendeeName = disputeAttendeeName(dispute)
                    const isThisChallenging = challengeMutation.isPending && challengeMutation.variables?.id === dispute._id
                    const isThisAccepting = acceptLossMutation.isPending && acceptLossMutation.variables === dispute._id
                    // Once an admin has responded, hide the action buttons —
                    // Paystack's outcome hasn't landed yet (that only comes
                    // through the resolve webhook), but there's nothing left
                    // for this admin to do on this row.
                    const hasResponded = Boolean(dispute.merchantResponseStatus)

                    return (
                        <div
                            key={dispute._id}
                            className={`${DISPUTE_GRID_COLS} py-5 items-center rounded-b-[10px] dark:border-border ${
                                index < disputes.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                                    {initialsFor(attendeeName)}
                                </div>
                                <p className="font-bold">{attendeeName}</p>
                            </div>

                            <p>{dispute.event?.title ?? "Unknown event"}</p>

                            <p className="font-space font-bold">
                                ₦{dispute.amount.toLocaleString()}
                            </p>

                            <p className="text-muted-foreground">Paystack</p>

                            <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F4DFB6] text-[#7A4E02] capitalize">
                                    {dispute.status}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {hasResponded ? (
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {dispute.merchantResponseStatus === "challenged" ? "Challenge submitted" : "Loss accepted"}
                                    </p>
                                ) : (
                                    <>
                                        <ActionBtn
                                            type="button"
                                            text="Challenge"
                                            variant="outline"
                                            loading={isThisChallenging}
                                            disabled={challengeMutation.isPending || acceptLossMutation.isPending}
                                            onClick={() => openDisputeDialog("challenge", dispute)}
                                            classname="font-bold border-[#0F6E56] text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#0F6E56] hover:text-white text-sm px-4 py-2 h-auto"
                                        />
                                        <ActionBtn
                                            type="button"
                                            text="Accept loss"
                                            variant="outline"
                                            loading={isThisAccepting}
                                            disabled={challengeMutation.isPending || acceptLossMutation.isPending}
                                            onClick={() => openDisputeDialog("accept-loss", dispute)}
                                            classname="font-bold border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-sm px-4 py-2 h-auto"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <DisputeActionDialog
                dispute={disputeTarget}
                mode={disputeMode}
                open={disputeTarget !== null}
                onOpenChange={(open) => {
                    if (!open) setDisputeTarget(null)
                }}
                onConfirm={handleDisputeConfirm}
                isSubmitting={challengeMutation.isPending || acceptLossMutation.isPending}
            />
        </>
    )
}

export default RequestDisputeTable

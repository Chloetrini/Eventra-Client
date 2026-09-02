import { useState } from "react"
import ActionBtn from "@/components/ui/action-btn"
import { formatNaira, formatRequestedAgo } from "@/lib/utils"
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

const REQUEST_GRID_COLS = "grid grid-cols-[180px_160px_110px_160px_110px_180px] sm:grid-cols-[1.5fr_2fr_1fr_1.5fr_1fr_180px] gap-4 px-4 sm:px-6"
const DISPUTE_GRID_COLS = "grid grid-cols-[180px_160px_110px_120px_110px_200px] sm:grid-cols-[1.5fr_2fr_1fr_1fr_1fr_220px] gap-4 px-4 sm:px-6"

interface RequestDisputeTableProps {
    activeTab: "requests" | "disputes"
    refundRequests: RefundRequestSummary[]
    disputes: DisputeSummary[]
}

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
                <div className="w-full overflow-x-auto rounded-[10px] border-2 border-[#E8E6E0] dark:border-border bg-card">
                    <div className="min-w-[850px]">
                        <div className={`${REQUEST_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border bg-card/50`}>
                            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ATTENDEE</p>
                            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">EVENT</p>
                            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">AMOUNT</p>
                            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">REASON</p>
                            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">REQUESTED</p>
                            <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ACTIONS</p>
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
                                    className={`${REQUEST_GRID_COLS} py-4 items-center cursor-pointer hover:bg-muted/40 transition-colors dark:border-border ${
                                        index < refundRequests.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 shrink-0 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                                            {initialsFor(request.ticket.attendeeName)}
                                        </div>
                                        <p
                                            title={request.ticket.attendeeName}
                                            className="font-bold truncate whitespace-nowrap max-w-[130px] sm:max-w-none text-foreground"
                                        >
                                            {request.ticket.attendeeName}
                                        </p>
                                    </div>

                                    <p
                                        title={request.event.title}
                                        className="truncate whitespace-nowrap max-w-[140px] sm:max-w-none text-muted-foreground sm:text-foreground"
                                    >
                                        {request.event.title}
                                    </p>

                                    <p className="font-space font-bold whitespace-nowrap">
                                        {formatNaira(request.amount, request.currency)}
                                    </p>

                                    <p
                                        title={request.reason}
                                        className="text-muted-foreground truncate whitespace-nowrap max-w-[140px] sm:max-w-none"
                                    >
                                        {request.reason}
                                    </p>

                                    <p className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                                        {formatRequestedAgo(request.createdAt)}
                                    </p>

                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        <ActionBtn
                                            type="button"
                                            text="Refund"
                                            loading={isThisApproving}
                                            disabled={approveMutation.isPending || rejectMutation.isPending}
                                            onClick={() => handleApprove(request._id)}
                                            classname="bg-[#0F6E56] hover:bg-[#095341] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto shrink-0"
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
                                            classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto shrink-0"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
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
            <div className="w-full overflow-x-auto rounded-[10px] border-2 border-[#E8E6E0] dark:border-border bg-card">
                <div className="min-w-[850px]">
                    <div className={`${DISPUTE_GRID_COLS} py-4 border-b-2 border-[#E8E6E0] dark:border-border bg-card/50`}>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ATTENDEE</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">EVENT</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">AMOUNT</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">PROCESSOR</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">STATUS</p>
                        <p className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">ACTIONS</p>
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
                        const hasResponded = Boolean(dispute.merchantResponseStatus)

                        return (
                            <div
                                key={dispute._id}
                                className={`${DISPUTE_GRID_COLS} py-4 items-center dark:border-border ${
                                    index < disputes.length - 1 ? "border-b-2 border-[#E8E6E0]" : ""
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 shrink-0 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                                        {initialsFor(attendeeName)}
                                    </div>
                                    <p
                                        title={attendeeName}
                                        className="font-bold truncate whitespace-nowrap max-w-[130px] sm:max-w-none text-foreground"
                                    >
                                        {attendeeName}
                                    </p>
                                </div>

                                <p
                                    title={dispute.event?.title ?? "Unknown event"}
                                    className="truncate whitespace-nowrap max-w-[140px] sm:max-w-none text-muted-foreground sm:text-foreground"
                                >
                                    {dispute.event?.title ?? "Unknown event"}
                                </p>

                                <p className="font-space font-bold whitespace-nowrap">
                                    {formatNaira(dispute.amount, dispute.currency)}
                                </p>

                                <p className="text-muted-foreground whitespace-nowrap">Paystack</p>

                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-[#F4DFB6] text-[#7A4E02] capitalize whitespace-nowrap">
                                        {dispute.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    {hasResponded ? (
                                        <p className="text-xs text-muted-foreground capitalize whitespace-nowrap">
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
                                                classname="font-bold border-[#0F6E56] text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#0F6E56] hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto shrink-0"
                                            />
                                            <ActionBtn
                                                type="button"
                                                text="Accept loss"
                                                variant="outline"
                                                loading={isThisAccepting}
                                                disabled={challengeMutation.isPending || acceptLossMutation.isPending}
                                                onClick={() => openDisputeDialog("accept-loss", dispute)}
                                                classname="font-bold border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto shrink-0"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
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
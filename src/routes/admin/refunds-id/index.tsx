import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft } from "lucide-react"
import ActionBtn from "@/components/ui/action-btn"
import { formatRequestedAgo } from "@/lib/utils"
import {
    useAdminRefundRequest,
    useApproveAdminRefundRequest,
    useRejectAdminRefundRequest,
} from "@/hooks/use-admin-refunds"
import { DeclineRefundDialog } from "@/components/dialogs/decline-refund-dialog"
import { toast } from "react-toastify"
import PageWrapper from "@/components/page-wrapper"

const RefundRequestDetailPage = () => {
    const { requestId } = useParams<{ requestId: string }>()
    const navigate = useNavigate()
    const { data: request, isLoading, isError } = useAdminRefundRequest(requestId)

    const approveMutation = useApproveAdminRefundRequest()
    const rejectMutation = useRejectAdminRefundRequest()
    const [declineOpen, setDeclineOpen] = useState(false)

    if (isLoading) {
        return <div className="p-10 text-center text-muted-foreground">Loading…</div>
    }

    if (isError || !request) {
        return (
            <div className="p-10 text-center text-muted-foreground">
                Couldn't find that refund request.
            </div>
        )
    }

    // Only a still-pending request can be acted on — once it's been
    // approved/rejected/processed there's nothing left to do here.
    const isPending = request.status === "pending"

    const handleApprove = () => {
        if (!requestId) return
        approveMutation.mutate(requestId, {
            onSuccess: () => toast.success("Refund approved and sent to Paystack"),
            onError: (err) => toast.error(err instanceof Error ? err.message : "Could not approve this refund"),
        })
    }

    const handleDeclineConfirm = (id: string, reason: string) => {
        rejectMutation.mutate(
            { id, reason },
            {
                onSuccess: () => {
                    toast.success("Refund request declined")
                    setDeclineOpen(false)
                },
                onError: (err) => toast.error(err instanceof Error ? err.message : "Could not decline this request"),
            }
        )
    }

    return (
        <PageWrapper className="p-[20px]">
            <button
                type="button"
                onClick={() => navigate("/admin/refunds-dispute")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft size={16} />
                Back to Refunds & Disputes
            </button>

            <div className="border-2 border-[#E8E6E0] dark:border-border rounded-[10px] p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold font-space">Refund Request</h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F4DFB6] text-[#7A4E02] capitalize">
                        {request.status}
                    </span>
                </div>

                <dl className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
                    <div>
                        <dt className="text-sm text-muted-foreground">Attendee</dt>
                        <dd className="font-bold">{request.ticket.attendeeName}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Event</dt>
                        <dd className="font-bold">{request.event.title}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Amount</dt>
                        <dd className="font-space font-bold">₦{request.amount.toLocaleString()}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Requested</dt>
                        <dd>{formatRequestedAgo(request.createdAt)}</dd>
                    </div>
                    <div className="col-span-2">
                        <dt className="text-sm text-muted-foreground">Reason</dt>
                        <dd>{request.reason}</dd>
                    </div>
                </dl>

                {isPending && (
                    <div className="flex gap-3 pt-4 border-t-2 border-[#E8E6E0] dark:border-border">
                        <ActionBtn
                            type="button"
                            text="Approve Refund"
                            loading={approveMutation.isPending}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            onClick={handleApprove}
                            classname="bg-[#0F6E56] hover:bg-[#095341] text-white px-5 py-2 h-auto"
                        />
                        <ActionBtn
                            type="button"
                            text="Decline"
                            variant="outline"
                            loading={rejectMutation.isPending}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            onClick={() => setDeclineOpen(true)}
                            classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white px-5 py-2 h-auto"
                        />
                    </div>
                )}
            </div>

            <DeclineRefundDialog
                request={
                    requestId ? { id: requestId, attendeeName: request.ticket.attendeeName } : null
                }
                open={declineOpen}
                onOpenChange={setDeclineOpen}
                onConfirm={handleDeclineConfirm}
                isSubmitting={rejectMutation.isPending}
            />
        </PageWrapper>
    )
}

export default RefundRequestDetailPage

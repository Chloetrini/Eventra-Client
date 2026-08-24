import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Check } from "lucide-react"
import ActionBtn from "@/components/ui/action-btn"
import PaymentBtn from "@/components/ui/pay-method-btn"
import { Separator } from "@/components/ui/separator"
import {
    useAdminRefundRequest,
    useApproveAdminRefundRequest,
    useRejectAdminRefundRequest,
} from "@/hooks/use-admin-refunds"
import { DeclineRefundDialog } from "@/components/dialogs/decline-refund-dialog"
import RefundRequestDetails from "@/components/admin/refunds-dispute/refund-request-details"
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
        <PageWrapper className="min-h-screen flex flex-col justify-between p-[20px]">
            <div className="">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/refunds")}
                        className="flex items-center gap-2 font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80] mb-2 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        BACK TO REFUNDS
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[28px] font-bold font-grotesk">Refund request</h1>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F4DFB6] text-[#7A4E02] capitalize">
                            {request.status}
                        </span>
                    </div>
                    <p className="font-medium text-[14px] text-muted-foreground">
                        {request.ticket.attendeeName}. {request.event.title}
                    </p>
                </div>
                <RefundRequestDetails request={request} />
            </div>

            {isPending && (
                <div className="mt-10 md:mt-0">
                    <Separator />
                    <div className="flex flex-col-reverse gap-3 md:flex-row items-center justify-between mt-7">
                        <p className="text-sm text-muted-foreground text-center md:text-start">
                            Refunds are returned via the original payment method.
                        </p>
                        <div className="flex w-full md:w-fit justify-between md:gap-2">
                            <ActionBtn
                                type="button"
                                text="Decline"
                                variant="outline"
                                loading={rejectMutation.isPending}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                onClick={() => setDeclineOpen(true)}
                                classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white px-5 py-3 h-auto"
                            />
                            <PaymentBtn
                                icon={Check}
                                text="Approve refund"
                                loading={approveMutation.isPending}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                onClick={handleApprove}
                                classname="bg-[#0F6E56] hover:bg-[#095341] text-white px-5 py-3 h-auto font-bold hover:text-white dark:text-[#4ADE80] dark:hover:text-white"
                            />
                        </div>
                    </div>
                </div>
            )}

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

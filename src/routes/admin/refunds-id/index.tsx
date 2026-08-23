import PageWrapper from "@/components/page-wrapper"
import { useAdminRefundRequest } from "@/hooks/use-admin-refunds"
import { useParams, useNavigate } from "react-router"
import ActionBtn from "@/components/ui/action-btn"
import { ArrowLeft } from "lucide-react"
import RefundRequestDetails from "@/components/admin/refunds-dispute/refund-request-details"
import PaymentBtn from "@/components/ui/pay-method-btn"
import { Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const RefundRequestDetail = () => {
    const { requestId } = useParams()
    const navigate = useNavigate()
    const { data: request, isLoading, isError } = useAdminRefundRequest(requestId)

    if (isLoading) return <p>Loading...</p>
    if (isError || !request) return <p>Refund request not found.</p>

    return (
        <PageWrapper className="min-h-screen flex flex-col justify-between">
            <div className="">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/refunds')}
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
                            classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white px-5 py-3 h-auto"
                        />
                        <PaymentBtn
                            icon={Check}
                            text="Approve refund"
                            classname="bg-[#0F6E56] hover:bg-[#095341] text-white px-5 py-3 h-auto font-bold hover:text-white dark:text-[#4ADE80] dark:hover:text-white"
                        />
                    </div>
                </div>

            </div>
        </PageWrapper>
    )
}

export default RefundRequestDetail
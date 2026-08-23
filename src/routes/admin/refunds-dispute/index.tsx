import { useState } from "react"
import RefundDisputeSelector, { type RefundDisputeTab } from "@/components/admin/refunds-dispute/refund-dispute-selector"
import RequestDisputeTable from "@/components/admin/refunds-dispute/request-dispute-table"
import PageWrapper from "@/components/page-wrapper"
import { useAdminRefundRequests, useAdminDisputes } from "@/hooks/use-admin-refunds"

const RefundsDispute = () => {
    const [activeTab, setActiveTab] = useState<RefundDisputeTab>("requests")

    const { data: refundRequests = [], isLoading: requestsLoading } = useAdminRefundRequests()
    const { data: disputes = [], isLoading: disputesLoading } = useAdminDisputes()

    return (
        <PageWrapper className="flex flex-col gap-5">
            <div>
                <p className='font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]'>NEEDS ACTION</p>
                <h1 className='text-[28px] font-bold font-grotesk'>Refunds & dispute</h1>
                <p className='font-medium text-[14px] text-muted-foreground'>Resolve refund requests and payment disputes, tied to each event's policy.</p>
            </div>

            <RefundDisputeSelector
                activeTab={activeTab}
                onTabChange={setActiveTab}
                requestsCount={refundRequests.length}
                disputesCount={disputes.length}
            />

            {(activeTab === "requests" ? requestsLoading : disputesLoading) && (
                <p className="text-sm text-muted-foreground">Loading…</p>
            )}

            {(activeTab === "requests" ? !requestsLoading : !disputesLoading) && (
                <div className="w-full overflow-x-auto">
                    <RequestDisputeTable
                        activeTab={activeTab}
                        refundRequests={refundRequests}
                        disputes={disputes}
                    />
                </div>
            )}
        </PageWrapper>
    )
}

export default RefundsDispute

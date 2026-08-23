import { useState } from "react"
import RequestDisputeTable from "@/components/admin/refunds-dispute/request-dispute-table"
import { useAdminRefundRequests, useAdminDisputes } from "@/hooks/use-admin-refunds"
import PageWrapper from "@/components/page-wrapper"

type Tab = "requests" | "disputes"

const RefundsDisputesPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>("requests")

    const refundRequestsQuery = useAdminRefundRequests()
    const disputesQuery = useAdminDisputes()

    const isActiveTabLoading =
        activeTab === "requests" ? refundRequestsQuery.isLoading : disputesQuery.isLoading

    return (
        <PageWrapper className="p-[20px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-space">Refunds & Disputes</h1>
                    <p className="text-muted-foreground">
                        Handle attendee refund requests and Paystack chargeback disputes.
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mb-6 border-b-2 border-[#E8E6E0] dark:border-border">
                <button
                    type="button"
                    onClick={() => setActiveTab("requests")}
                    className={`px-4 py-3 text-sm font-medium font-space border-b-2 -mb-[2px] transition-colors ${
                        activeTab === "requests"
                            ? "border-[#0F6E56] text-[#0F6E56] dark:text-[#4ADE80]"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Refund Requests
                    {refundRequestsQuery.data && refundRequestsQuery.data.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#F4DFB6] text-[#7A4E02] text-xs px-2 py-0.5">
                            {refundRequestsQuery.data.length}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("disputes")}
                    className={`px-4 py-3 text-sm font-medium font-space border-b-2 -mb-[2px] transition-colors ${
                        activeTab === "disputes"
                            ? "border-[#0F6E56] text-[#0F6E56] dark:text-[#4ADE80]"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Disputes
                    {disputesQuery.data && disputesQuery.data.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#F4DFB6] text-[#7A4E02] text-xs px-2 py-0.5">
                            {disputesQuery.data.length}
                        </span>
                    )}
                </button>
            </div>

            <div className="overflow-x-auto">
                {isActiveTabLoading ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
                ) : (
                    <RequestDisputeTable
                        activeTab={activeTab}
                        refundRequests={refundRequestsQuery.data ?? []}
                        disputes={disputesQuery.data ?? []}
                    />
                )}
            </div>
        </PageWrapper>
    )
}

export default RefundsDisputesPage

import { useState } from "react"
import { useSearchParams } from "react-router"
import RefundDisputeSelector, { type RefundDisputeTab } from "@/components/admin/refunds-dispute/refund-dispute-selector"
import RequestDisputeTable from "@/components/admin/refunds-dispute/request-dispute-table"
import PageWrapper from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminRefundRequests, useAdminDisputes } from "@/hooks/use-admin-refunds"

// Mirrors REQUEST_GRID_COLS/DISPUTE_GRID_COLS in request-dispute-table.tsx —
// kept as separate constants here (rather than imported) since those two
// are not exported, and this skeleton only needs the column widths, not
// the table's row-rendering logic.
const REQUEST_GRID_COLS = "grid grid-cols-[1.5fr_2fr_1fr_1.5fr_1fr_180px] gap-4 px-6"
const DISPUTE_GRID_COLS = "grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_220px] gap-4 px-6"

function RefundsDisputeTableSkeleton({ activeTab }: { activeTab: RefundDisputeTab }) {
    const gridCols = activeTab === "requests" ? REQUEST_GRID_COLS : DISPUTE_GRID_COLS
    const headers = activeTab === "requests"
        ? ["ATTENDEE", "EVENT", "AMOUNT", "REASON", "REQUESTED"]
        : ["ATTENDEE", "EVENT", "AMOUNT", "PROCESSOR", "STATUS"]

    return (
        <div className="min-w-225 border-2 border-[#E8E6E0] dark:border-border rounded-[10px] overflow-hidden">
            <div className={`${gridCols} py-4 border-b-2 border-[#E8E6E0] dark:border-border rounded-b-[10px]`}>
                {headers.map((label) => (
                    <p key={label} className="text-sm font-medium dark:text-gray-200 text-[#6E6577] font-space tracking-wide">
                        {label}
                    </p>
                ))}
                <div />
            </div>

            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className={`${gridCols} py-5 items-center rounded-b-[10px] dark:border-border ${
                        index < 4 ? "border-b-2 border-[#E8E6E0]" : ""
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 rounded-md" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    )
}

const VALID_REFUND_TABS: RefundDisputeTab[] = ["requests", "disputes"]

const RefundsDispute = () => {
    // Same fix as the Approvals page: let a link like
    // /admin/refunds?tab=disputes (e.g. from the Overview page's "Needs
    // action" cards) land on the right tab instead of always opening on
    // "requests".
    const [searchParams] = useSearchParams()
    const requestedTab = searchParams.get("tab")
    const initialTab: RefundDisputeTab = VALID_REFUND_TABS.includes(requestedTab as RefundDisputeTab)
        ? (requestedTab as RefundDisputeTab)
        : "requests"

    const [activeTab, setActiveTab] = useState<RefundDisputeTab>(initialTab)

    const { data: refundRequests = [], isLoading: requestsLoading } = useAdminRefundRequests()
    const { data: disputes = [], isLoading: disputesLoading } = useAdminDisputes()

    const isLoading = activeTab === "requests" ? requestsLoading : disputesLoading

    return (
        <PageWrapper className="flex flex-col gap-5 p-5">
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

            <div className="w-full overflow-x-auto">
                {isLoading ? (
                    <RefundsDisputeTableSkeleton activeTab={activeTab} />
                ) : (
                    <RequestDisputeTable
                        activeTab={activeTab}
                        refundRequests={refundRequests}
                        disputes={disputes}
                    />
                )}
            </div>
        </PageWrapper>
    )
}

export default RefundsDispute

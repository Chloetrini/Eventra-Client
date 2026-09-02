import { useState } from "react"
import { useSearchParams } from "react-router"
import RefundDisputeSelector, { type RefundDisputeTab } from "@/components/admin/refunds-dispute/refund-dispute-selector"
import RequestDisputeTable from "@/components/admin/refunds-dispute/request-dispute-table"
import PageWrapper from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminRefundRequests, useAdminDisputes } from "@/hooks/use-admin-refunds"

function FullRefundsDisputeSkeleton({ activeTab }: { activeTab: RefundDisputeTab }) {
  const headers = activeTab === "requests"
    ? ["ATTENDEE", "EVENT", "AMOUNT", "REASON", "REQUESTED", "ACTIONS"]
    : ["ATTENDEE", "EVENT", "AMOUNT", "PROCESSOR", "STATUS", "ACTIONS"]

  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-24 sm:w-28" />
        <Skeleton className="h-7 sm:h-8 w-48 sm:w-56" />
        <Skeleton className="h-4 w-[360px] sm:w-[480px] max-w-full" />
      </div>

      {/* Selector Tabs Skeleton */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto w-full pb-1 no-scrollbar">
        <Skeleton className="h-10 sm:h-11 w-32 sm:w-36 rounded-[10px] shrink-0" />
        <Skeleton className="h-10 sm:h-11 w-32 sm:w-36 rounded-[10px] shrink-0" />
      </div>

      {/* Table Skeleton */}
      <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-4 py-4 px-4 sm:px-6 border-b-2 border-border bg-card/50">
            {headers.map((label, i) => (
              <p
                key={label}
                className={`text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide ${
                  i === headers.length - 1 ? "text-right" : ""
                }`}
              >
                {label}
              </p>
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`grid grid-cols-6 gap-4 py-4 px-4 sm:px-6 items-center ${
                index < 4 ? "border-b-2 border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0" />
                <Skeleton className="h-4 w-20 sm:w-24" />
              </div>
              <Skeleton className="h-4 w-24 sm:w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20 sm:w-28" />
              <Skeleton className="h-4 w-16 sm:w-20" />
              <div className="flex gap-2 justify-end">
                <Skeleton className="h-8 w-16 sm:w-20 rounded-md" />
                <Skeleton className="h-8 w-16 sm:w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

const VALID_REFUND_TABS: RefundDisputeTab[] = ["requests", "disputes"]

const RefundsDispute = () => {
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get("tab")
  const initialTab: RefundDisputeTab = VALID_REFUND_TABS.includes(requestedTab as RefundDisputeTab)
    ? (requestedTab as RefundDisputeTab)
    : "requests"

  const [activeTab, setActiveTab] = useState<RefundDisputeTab>(initialTab)

  const { data: refundRequests = [], isLoading: requestsLoading } = useAdminRefundRequests()
  const { data: disputes = [], isLoading: disputesLoading } = useAdminDisputes()

  const isLoading = activeTab === "requests" ? requestsLoading : disputesLoading

  if (isLoading) {
    return <FullRefundsDisputeSkeleton activeTab={activeTab} />
  }

  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      <div>
        <p className="font-space text-xs font-medium tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80]">
          NEEDS ACTION
        </p>
        <h1 className="text-2xl sm:text-[28px] font-bold font-grotesk text-foreground">
          Refunds & dispute
        </h1>
        <p className="font-medium text-xs sm:text-sm text-muted-foreground mt-0.5">
          Resolve refund requests and payment disputes, tied to each event's policy.
        </p>
      </div>

      <RefundDisputeSelector
        activeTab={activeTab}
        onTabChange={setActiveTab}
        requestsCount={refundRequests.length}
        disputesCount={disputes.length}
      />

      <div className="w-full min-w-0">
        <RequestDisputeTable
          activeTab={activeTab}
          refundRequests={refundRequests}
          disputes={disputes}
        />
      </div>
    </PageWrapper>
  )
}

export default RefundsDispute
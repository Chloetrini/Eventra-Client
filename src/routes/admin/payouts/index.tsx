import {
  useAdminPayoutsOverview,
  useAwaitingPayouts,
  usePayoutHistory,
} from "@/hooks/use-admin-payouts"
import { PayoutsOverviewCards } from "@/components/admin/payouts/payouts-overview-cards"
import { AwaitingPayoutsTable } from "@/components/admin/payouts/awaiting-payouts-table"
import { PayoutHistoryTable } from "@/components/admin/payouts/payouts-history-table"
import PageWrapper from "@/components/page-wrapper"

export default function AdminPayoutsPage() {
  const { data: overview, isLoading: isOverviewLoading } = useAdminPayoutsOverview()
  const { data: awaitingList, isLoading: isAwaitingLoading } = useAwaitingPayouts()
  const { data: historyData, isLoading: isHistoryLoading } = usePayoutHistory()

  return (
    <PageWrapper className="space-y-8 p-[20px] text-foreground">
      {/* Header */}
      <div>
        <span className="text-[18px] font-[500] tracking-widest text-[#0A4F41] uppercase">PLATFORM</span>
        <h1 className="text-[34px] font-[600] font-grotesk tracking-tight mt-1">Payouts</h1>
        <p className="text-muted-foreground text-[18px] font-geist mt-1 ">
          Money held in escrow and payouts due to organizers, across the whole platform.
        </p>
      </div>

      {/* Cards & Banner */}
      <PayoutsOverviewCards overview={overview} isLoading={isOverviewLoading} />

      {/* Tables */}
      <AwaitingPayoutsTable list={awaitingList?.payouts} isLoading={isAwaitingLoading} currency={awaitingList?.currency} />
      <PayoutHistoryTable history={historyData?.payouts} isLoading={isHistoryLoading} currency={historyData?.currency} />
    </PageWrapper>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { PayoutsPageData } from '@/types/OrganizerPayouts'
import { AccountStatusBanner } from '@/routes/dashboard/payouts/AccountStatusBanner'
import { PayoutSetupBanner } from '@/routes/dashboard/payouts/PayoutSetupBanner'
import { HowPayoutsWork } from '@/routes/dashboard/payouts/HowPayoutsWork'
import { EarningsByEvent } from '@/routes/dashboard/payouts/EarningsByEvent'
import { PayoutHistory } from '@/routes/dashboard/payouts/PayoutHistory'
import { StatsCards } from '@/routes/dashboard/payouts/StatCard'
import SideBar from '@/components/organizer-dashboard/SideBar'




const PayoutsPage = () => {
  const [showAccountBanner, setShowAccountBanner] = useState(true)
  const [showSetupBanner, setShowSetupBanner] = useState(true)

  const { data, isLoading } = useQuery({
    queryKey: ['payouts'],
    queryFn: async () => {
      // swap for real API when backend is ready:
      // const res = await fetch('/api/organizer/payouts')
      const res = await fetch('/data/payouts.json')
      const json: PayoutsPageData = await res.json()
      return json
    },
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return <p className="p-6 text-muted-foreground">No payout data available.</p>

  return (
    <div className='flex'>
      <SideBar organization={data.organization} />
      <div className="space-y-8 p-6">

      {showAccountBanner && data.accountStatus === 'pending' && (
        <AccountStatusBanner onDismiss={() => setShowAccountBanner(false)} />
      )}

      <div>
        <p className="text-[14px] font-medium tracking-wider text-[#0A4F41]">Money</p>
        <h1 className="mt-1 text-3xl font-semibold font-grotesk text-[#1A1523]">Payouts</h1>
        <p className="mt-1 text-[13px] font-medium text-[#6E6577]">
          Track what you've earned and when it lands in your account.
        </p>
      </div>

      {showSetupBanner && data.payoutSetupStatus !== 'complete' && (
        <PayoutSetupBanner onDismiss={() => setShowSetupBanner(false)} />
      )}

      <StatsCards data={data} />

      <HowPayoutsWork/>
      <EarningsByEvent earnings={data.earnings} commissionPercent={data.commissionPercent} />
      <PayoutHistory history={data.payoutHistory} />
    </div>
    </div>
  )
}

export default PayoutsPage

import { Ticket, Banknote, Radio, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PayoutsPageData } from '@/types/OrganizerPayouts'
import { calcGrossSales, formatMillions } from '@/lib/utils'


export const StatsCards = ({ data }: { data: PayoutsPageData }) => {
  const { stats, earnings, commissionPercent } = data

  // --- calculated from earnings ---
  const ticketsSold = earnings.reduce(
    (sum, e) => sum + e.tierSales.reduce((s, t) => s + t.quantitySold, 0),
    0
  )

  const revenue = earnings.reduce((sum, e) => sum + calcGrossSales(e), 0)

  const liveEvents = earnings.filter((e) => e.status === 'held').length

  const sellingFastCount = liveEvents

  const payoutDue = earnings
    .filter((e) => e.status === 'ready' && !e.isFree)
    .reduce((sum, e) => {
      const grossSales = calcGrossSales(e)
      const commission = Math.round(grossSales * commissionPercent / 100)
      return sum + (grossSales - commission)
    }, 0)

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="TICKETS SOLD"
        value={ticketsSold.toLocaleString()}
        // ticketsSoldChangePercent — backend only, needs last month's data
        subtext={`▲ ${stats.ticketsSoldChangePercent}% vs last month`}
        subtextColor="text-emerald-600"
        icon={<Ticket className="h-4 w-4 text-[#0F6E56]" />}
      />
      <StatCard
        label="REVENUE"
        value={`₦${formatMillions(revenue)}`}
        // revenueChangePercent — backend only, needs last month's data
        subtext={`▲ ${stats.revenueChangePercent}% vs last month`}
        subtextColor="text-emerald-600"
        icon={<Banknote className="h-4 w-4 text-emerald-600" />}
      />
      <StatCard
        label="LIVE EVENTS"
        value={String(liveEvents)}
        subtext={`${sellingFastCount} selling fast`}
        subtextColor="text-muted-foreground"
        icon={<Radio className="h-4 w-4 text-emerald-600" />}
      />
      <StatCard
        label="PAYOUT DUE"
        value={`₦${formatMillions(payoutDue)}`}
        // nextPayoutDays — backend only, driven by payout schedule
        subtext={`Next payout in ${stats.nextPayoutDays} days`}
        subtextColor="text-muted-foreground"
        icon={<Clock className="h-4 w-4 text-emerald-600" />}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  subtext,
  subtextColor,
  icon,
}: {
  label: string
  value: string
  subtext: string
  subtextColor: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border w-62.5 h-41 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className={cn('mt-1 text-xs', subtextColor)}>{subtext}</p>
    </div>
  )
}
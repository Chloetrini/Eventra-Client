import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EventEarning, EarningStatus } from '@/types/OrganizerPayouts'

export const formatMillions = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

// Calculates gross sales for one earning from its tier sales
export const calcGrossSales = (earning: EventEarning): number => {
  if (earning.isFree) return 0
  return earning.tierSales.reduce((sum, t) => sum + t.price * t.quantitySold, 0)
}



const EARNING_STATUS_STYLE: Record<EarningStatus, string> = {
  held: 'bg-[#E8E6E0] text-[#4A4451] font-space font-bold p-2',
  ready: 'bg-[#FCD98A] text-[#7A4E02] font-space font-bold p-2',
  free: 'bg-[#E8E6E0] text-[#4A4451] font-space font-bold p-2',
}

const EARNING_STATUS_LABEL: Record<EarningStatus, string> = {
  held: 'HELD',
  ready: 'READY',
  free: 'FREE · NO PAYOUT',
}

export const EarningsByEvent = ({ earnings, commissionPercent }: { earnings: EventEarning[]; commissionPercent: number }) => {
  return (
    <div>
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <h2 className="px-4 py-1 text-[20px] text-[#1A1523] font-grotesk font-bold">Earning by event</h2>
            </tr>
            <tr className="border-b">
              <th className="px-4 py-3 text-left text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Event</th>
              <th className="px-4 py-3 text-right text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Gross Sales</th>
              <th className="px-4 py-3 text-right text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Commission ({commissionPercent}%)</th>
              <th className="px-4 py-3 text-right text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Your Earnings</th>
              <th className="px-4 py-3 text-right text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Status</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((earning) => {
              // all values calculated from tierSales — nothing stored
              const grossSales = calcGrossSales(earning)
              const commission = earning.isFree ? 0 : Math.round(grossSales * commissionPercent / 100)
              const yourEarnings = earning.isFree ? 0 : grossSales - commission

              return (
                <tr key={earning.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={earning.coverImageUrl ?? undefined}
                        alt={earning.eventName}
                        className="h-10 w-10 rounded-sm object-cover"
                      />
                      <div>
                        <p className="font-semibold text-[#1A1523]">{earning.eventName}</p>
                        <p className="text-xs text-[#6E6577] font-space">
                          {earning.eventNumber} · {earning.eventCategory}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-[#000000] font-space">
                    {earning.isFree ? '–' : `₦${formatMillions(grossSales)}`}
                  </td>
                  <td className="pl-14 py-4 text-left text-[#000000] font-semibold">
                    {earning.isFree ? '–' : commission.toLocaleString()}
                  </td>
                  <td className="pl-14 py-4 text-left font-bold text-[#000000] font-space">
                    {earning.isFree ? '–' : `₦${formatMillions(yourEarnings)}`}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Badge className={cn('text-xs', EARNING_STATUS_STYLE[earning.status])}>
                      {EARNING_STATUS_LABEL[earning.status]}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
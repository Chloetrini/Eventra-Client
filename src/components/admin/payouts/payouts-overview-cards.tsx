import type { AdminPayoutOverview } from "@/lib/api/admin-payouts"
import { CURRENCY_SYMBOLS } from "@/lib/utils"

// Was hardcoded to ₦ regardless of the admin's currency preference — kept
// the same B/M/K compacting (the shared formatCompactNaira in lib/utils
// has no billions tier, and platform-wide totals here can cross into the
// billions), just parameterized the symbol.
function formatShortCurrency(amount: number, currency: string = "Naira"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "₦"
  if (amount >= 1_000_000_000) return `${symbol}${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`
  if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (amount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return `${symbol}${amount.toLocaleString()}`
}

interface Props {
  overview?: AdminPayoutOverview
  isLoading: boolean
}

export function PayoutsOverviewCards({ overview, isLoading }: Props) {
  return (
    <div className="space-y-4">
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <div className="flex flex-col border border-border rounded-xl p-5 bg-card">
          <p className="text-[16px] font-space font-[400] tracking-wider leading-snug min-h-[48px] text-muted-foreground uppercase">
            HELD IN ESCROW
          </p>
          <p className="text-[34px] font-space font-bold tracking-tight">
            {isLoading ? "..." : formatShortCurrency(overview?.heldInEscrow ?? 0, overview?.currency)}
          </p>
          <p className="text-[16px] text-muted-foreground mt-2">
            Across {overview?.heldInEscrowEventsCount ?? 0} events
          </p>
        </div>

        <div className="flex flex-col border border-border rounded-xl p-5 bg-card">
           <p className="text-[16px] font-space font-[400] tracking-wider leading-snug min-h-[48px] text-muted-foreground uppercase">
            READY TO RELEASE
          </p>
          <p className="text-[34px] font-space font-[700] tracking-tight">
            {isLoading ? "..." : formatShortCurrency(overview?.readyToRelease ?? 0, overview?.currency)}
          </p>
           <p className="text-[16px] text-muted-foreground mt-2">Events already held</p>
        </div>

        <div className="flex flex-col border border-border rounded-xl p-5 bg-card">
          <p className="text-[16px] font-space font-[400] tracking-wider leading-snug min-h-[48px] text-muted-foreground uppercase">
            PAID OUT (ALL TIME)
          </p>
          <p className="text-[34px] font-space font-[700] tracking-tight">
            {isLoading ? "..." : formatShortCurrency(overview?.paidOutAllTime ?? 0, overview?.currency)}
          </p>
           <p className="text-[16px] text-muted-foreground mt-2">Since Launch</p>
        </div>

        <div className="flex flex-col border border-border rounded-xl p-5 bg-card">
          <p className="text-[16px] font-space font-[400] tracking-wider leading-snug min-h-[48px] text-muted-foreground uppercase">
            COMMISSION COLLECTED
          </p>
          <p className="text-[34px] font-space font-[700] tracking-tight">
            {isLoading ? "..." : formatShortCurrency(overview?.commissionCollected ?? 0, overview?.currency)}
          </p>
           <p className="text-[16px] text-muted-foreground mt-2">Platform earnings</p>
        </div>
      </div>

      {/* Escrow Banner */}
      <div className="border border-border rounded-xl p-5 bg-card space-y-2">
        <h3 className="font-[600]  text-[22px] text-base font-grotesk">How platform escrow works</h3>
        <p className="text-[16px] text-muted-foreground font-geist leading-relaxed">
          Ticket money is held in escrow from purchase and released to organizer a few days after each event, minus the 5% commission. Release funds here once an event has completed and cleared checks.
        </p>
      </div>
    </div>
  )
}

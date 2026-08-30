import type { PayoutHistoryItem } from "@/lib/api/admin-payouts"
import { CURRENCY_SYMBOLS } from "@/lib/utils"

// Was hardcoded to ₦ regardless of the admin's currency preference.
function formatExactCurrency(amount: number, currency: string = "Naira"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "₦"
  return `${symbol}${amount.toLocaleString("en-NG")}`
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

interface Props {
  history?: PayoutHistoryItem[]
  isLoading: boolean
  currency?: string
}

export function PayoutHistoryTable({ history, isLoading, currency }: Props) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="p-5 border-b border-border">
        <h2 className="font-[700]  text-[20px] font-grotesk">Payout History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-[16px] font-space text-muted-foreground uppercase">
              <th className="py-4 px-6 font-[400]">DATE</th>
              <th className="py-4 px-6 font-[400]">ORGANIZERS</th>
              <th className="py-4 px-6 font-[400]">AMOUNT</th>
              <th className="py-4 px-6 font-[400]">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                  Loading payout history...
                </td>
              </tr>
            )}

            {!isLoading && history?.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[16px] text-muted-foreground">
                  No payout history recorded yet.
                </td>
              </tr>
            )}

            {history?.map((historyItem, idx) => (
              <tr key={`${historyItem.organizerName}-${idx}`} className="hover:bg-muted/30">
                <td className="py-4 px-6 text-muted-foreground text-[16px] font-geist font-[400]">{formatFullDate(historyItem.paidAt)}</td>
                <td className="py-4 px-6 text-[17px] font-geist font-[700]">{historyItem.organizerName}</td>
                <td className="py-4 px-6 font-space font-[700] text-[20px]">{formatExactCurrency(historyItem.amount, currency)}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-0.5 rounded-full text-[16px] font-[700] font-space bg-[#E4F1EB] text-[#0A4F41] dark:bg-[#16A34A]/20 dark:text-[#4ADE80]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A4F41] dark:bg-[#4ADE80]" />
                    READY
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

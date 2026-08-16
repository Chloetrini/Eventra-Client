import { Badge } from "@/components/ui/badge"
import { cn, formatDate, getLastFour } from "@/lib/utils"
import type { PayoutHistoryItem, PayoutHistoryStatus } from "@/types/OrganizerPayouts"

const HISTORY_STATUS_STYLE: Record<PayoutHistoryStatus, string> = {
  paid: 'bg-[#E4F1EB] text-[#0F6E56] font-space font-bold px-4',
  pending: 'bg-[#FCD98A] text-[#7A4E02] font-space font-bold px-4',
  failed: 'bg-red-100 text-red-700 font-space font-bold px-4',
}

export const PayoutHistory = ({ history }: { history: PayoutHistoryItem[] }) => {
  return (
    <div>
      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <h2 className="px-4 py-1 text-[20px] text-[#1A1523] font-grotesk font-bold">Payout history</h2>
            </tr>
            <tr className="border-b">
              <th className="px-4 py-3 text-left text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Date</th>
              <th className="px-4 py-3 text-left text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Amount</th>
              <th className="px-4 py-3 text-left text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">To</th>
              <th className="px-4 py-3 text-right text-[14px] font-normal font-space uppercase tracking-wide text-[#6E6577]">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4 font-normal text-[#1A1523]">{formatDate(item.date)}</td>
                <td className="px-4 py-4 font-semibold text-[#000000]">{item.amount.toLocaleString()}</td>
                <td className="px-4 py-4 text-[#000000] font-bold font-space">
                  {/* getLastFour slices last 4 digits from full account number */}
                  {item.bankName} <span className="tracking-widest">....{getLastFour(item.accountNumber)}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Badge className={cn('text-xs uppercase', HISTORY_STATUS_STYLE[item.status])}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
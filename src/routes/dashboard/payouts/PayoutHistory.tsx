import { Badge } from "@/components/ui/badge";
import { formatDate, formatNaira } from "@/services/utils";
import type { PayoutHistoryRow } from "@/services/payouts-api";

interface PayoutHistoryProps {
  history: PayoutHistoryRow[];
}

export function PayoutHistory({ history }: PayoutHistoryProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <h2 className="px-4 sm:px-6 pt-4 pb-1 text-[18px] sm:text-[20px] font-grotesk font-bold text-foreground">
        Payout history
      </h2>

      {history.length === 0 ? (
        <p className="px-4 sm:px-6 py-6 text-sm text-muted-foreground">
          No payouts have been sent yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-t border-border">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Sent to
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={`${item.date}-${i}`} className="border-t border-border">
                  <td className="px-4 sm:px-6 py-4 text-foreground">{formatDate(item.date)}</td>
                  <td className="px-4 py-4 font-bold font-space text-foreground">
                    {formatNaira(item.amount)}
                  </td>
                  <td className="px-4 py-4 font-bold font-space text-foreground">
                    {item.bankLabel ?? "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <Badge className="border-transparent bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80] text-[10px] font-space font-bold">
                      PAID
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { cn, formatNaira } from "@/lib/utils";
import type { EarningsByEventRow, PayoutEventStatus } from "@/lib/payouts-api";

const STATUS_STYLE: Record<PayoutEventStatus, string> = {
  paid: "bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]",
  ready: "bg-[#FCD98A] text-[#7A4E02] dark:bg-[#7A4E02]/25 dark:text-[#FBBF24]",
  held: "bg-muted text-muted-foreground",
  free_no_payout: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<PayoutEventStatus, string> = {
  paid: "PAID OUT",
  ready: "READY",
  held: "HELD",
  free_no_payout: "FREE · NO PAYOUT",
};

interface EarningsByEventProps {
  earnings: EarningsByEventRow[];
}

export function EarningsByEvent({ earnings }: EarningsByEventProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <h2 className="px-4 sm:px-6 pt-4 pb-1 text-[18px] sm:text-[20px] font-grotesk font-bold text-foreground">
        Earning by event
      </h2>

      {earnings.length === 0 ? (
        <p className="px-4 sm:px-6 py-6 text-sm text-muted-foreground">
          No earnings yet — they'll show up here once tickets start selling.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-t border-border">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Event
                </th>
                <th className="px-4 py-3 text-right text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Gross sales
                </th>
                <th className="px-4 py-3 text-right text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Commission
                </th>
                <th className="px-4 py-3 text-right text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Your earnings
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-normal font-space uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((row) => (
                <tr key={row.eventId} className="border-t border-border">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-semibold text-foreground">{row.eventTitle}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-bold font-space text-foreground">
                    {row.status === "free_no_payout" ? "–" : formatNaira(row.grossSales)}
                  </td>
                  <td className="px-4 py-4 text-right text-foreground">
                    {row.status === "free_no_payout" ? "–" : formatNaira(row.commission)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold font-space text-foreground">
                    {row.status === "free_no_payout" ? "–" : formatNaira(row.earnings)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <Badge
                      className={cn(
                        "border-transparent text-[10px] font-space font-bold",
                        STATUS_STYLE[row.status],
                      )}
                    >
                      {STATUS_LABEL[row.status]}
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

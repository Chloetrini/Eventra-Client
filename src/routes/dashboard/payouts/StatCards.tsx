import { Wallet, Clock3, BadgeCheck } from "lucide-react";
import type { EarningsByEventRow, PayoutHistoryRow } from "@/lib/payouts-api";
import { formatNaira } from "@/lib/utils";

interface StatCardsProps {
  earnings: EarningsByEventRow[];
  history: PayoutHistoryRow[];
  currency?: string;
}

export function StatCards({ earnings, history, currency }: StatCardsProps) {
  const totalEarnings = earnings.reduce((sum, row) => sum + row.earnings, 0);
  const heldOrReady = earnings
    .filter((row) => row.status === "held" || row.status === "ready")
    .reduce((sum, row) => sum + row.earnings, 0);
  const paidOut = history.reduce((sum, row) => sum + row.amount, 0);

  const cards = [
    { label: "TOTAL EARNINGS", value: formatNaira(totalEarnings, currency), icon: Wallet },
    { label: "HELD / PENDING PAYOUT", value: formatNaira(heldOrReady, currency), icon: Clock3 },
    { label: "PAID OUT TO DATE", value: formatNaira(paidOut, currency), icon: BadgeCheck },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-card p-5 sm:p-6 relative">
          <div className="absolute top-5 right-5 h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center text-[#0F6E56] dark:text-[#4ADE80]">
            <card.icon className="h-4 w-4" />
          </div>
          <p className="text-[11px] font-bold font-space text-muted-foreground uppercase tracking-wider max-w-[70%]">
            {card.label}
          </p>
          <p className="mt-3 text-2xl sm:text-3xl font-bold font-space text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

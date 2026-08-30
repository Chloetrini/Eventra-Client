import type { AdminPromotion, AdminPromotionStatus } from "@/types/admin-promotion";
import { formatDate, formatNaira } from "@/lib/utils";

interface AdminPromotionsTableProps {
  promotions: AdminPromotion[];
  currency: string;
  onRowClick?: (promotion: AdminPromotion) => void;
}

function initialsFor(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return initials || "?";
}

export function PromotionStatusBadge({ status }: { status: AdminPromotionStatus }) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center rounded-full bg-[#EBF8F1] dark:bg-[#0F6E56]/25 px-3 py-1 text-[11px] font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wide">
          ACTIVE
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-3 py-1 text-[11px] font-bold text-[#7A4E02] dark:text-[#FBBF24] uppercase tracking-wide">
          PENDING REVIEW
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center rounded-full bg-[#E8E6E0] px-3 py-1 text-[11px] font-bold text-[#3A3A3A] uppercase tracking-wide">
          EXPIRED
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FFC4C4] dark:bg-[#DC2626]/25 px-3 py-1 text-[11px] font-bold text-[#BE2525] dark:text-[#F87171] uppercase tracking-wider">
          REJECTED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {status}
        </span>
      );
  }
}

// Mirrors AdminEventsTable (components/admin/events) — same card/table
// shell, columns swapped for what a promotion needs: who promoted it,
// which package, and the live window instead of ticket-sales figures.
export default function AdminPromotionsTable({ promotions, currency, onRowClick }: AdminPromotionsTableProps) {
  if (promotions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No promotions match your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-card/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">EVENT</th>
              <th className="px-6 py-4">ORGANIZER</th>
              <th className="px-6 py-4">PACKAGE</th>
              <th className="px-6 py-4">PRICE</th>
              <th className="px-6 py-4">STARTS</th>
              <th className="px-6 py-4">ENDS</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promotions.map((promo) => (
              <tr
                key={promo.eventId}
                onClick={() => onRowClick?.(promo)}
                className="group cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-white shadow-xs">
                      {initialsFor(promo.eventTitle)}
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {promo.eventTitle}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-muted-foreground truncate">
                  {promo.organizerName}
                </td>

                <td className="px-6 py-4 font-space font-bold text-foreground">
                  {promo.packageLabel}
                </td>

                <td className="px-6 py-4 font-bold text-foreground">
                  {promo.price !== null ? formatNaira(promo.price, currency) : "—"}
                </td>

                {/* Was a single "DATES" column showing "start – end" as one
                    dashed string — split into their own STARTS/ENDS columns
                    so the table stops shifting/wobbling when one date is
                    longer than the other. */}
                <td className="px-6 py-4 text-muted-foreground">
                  {promo.startsAt ? formatDate(promo.startsAt) : "Once approved"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {promo.endsAt ? formatDate(promo.endsAt) : "—"}
                </td>

                <td className="px-6 py-4">
                  <PromotionStatusBadge status={promo.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

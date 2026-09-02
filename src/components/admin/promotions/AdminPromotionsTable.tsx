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
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return initials || "?";
}

export function PromotionStatusBadge({ status }: { status: AdminPromotionStatus }) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center rounded-full bg-[#EBF8F1] dark:bg-[#0F6E56]/25 px-2.5 py-1 text-xs sm:text-sm font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wide whitespace-nowrap">
          ACTIVE
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-2.5 py-1 text-xs sm:text-sm font-bold text-[#7A4E02] dark:text-[#FBBF24] uppercase tracking-wide whitespace-nowrap">
          PENDING REVIEW
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center rounded-full bg-[#E8E6E0] dark:bg-muted px-2.5 py-1 text-xs sm:text-sm font-bold text-[#3A3A3A] dark:text-muted-foreground uppercase tracking-wide whitespace-nowrap">
          EXPIRED
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FFC4C4] dark:bg-[#DC2626]/25 px-2.5 py-1 text-xs sm:text-sm font-bold text-[#BE2525] dark:text-[#F87171] uppercase tracking-wider whitespace-nowrap">
          REJECTED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
          {status}
        </span>
      );
  }
}

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
    <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
      <table className="w-full min-w-[850px] text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-border bg-card/50">
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              EVENT
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              ORGANIZER
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              PACKAGE
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              PRICE
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              STARTS
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              ENDS
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              STATUS
            </th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo, index) => (
            <tr
              key={promo.eventId}
              onClick={() => onRowClick?.(promo)}
              className={`cursor-pointer hover:bg-muted/40 transition-colors ${
                index < promotions.length - 1 ? "border-b-2 border-border" : ""
              }`}
            >
              <td className="py-4 px-4 sm:px-6 max-w-[160px] sm:max-w-none">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/20 flex items-center justify-center text-sm font-medium text-[#0F6E56] dark:text-[#4ADE80]">
                    {initialsFor(promo.eventTitle)}
                  </div>
                  <span
                    title={promo.eventTitle}
                    className="font-bold text-foreground text-xs sm:text-sm truncate block max-w-[170px]"
                  >
                    {promo.eventTitle}
                  </span>
                </div>
              </td>

              <td className="py-4 px-4 sm:px-6 max-w-[140px] sm:max-w-none">
                <span
                  title={promo.organizerName}
                  className="text-muted-foreground sm:text-foreground text-xs sm:text-sm truncate block"
                >
                  {promo.organizerName}
                </span>
              </td>

              <td className="py-4 px-4 sm:px-6 max-w-[120px] sm:max-w-none">
                <span
                  title={promo.packageLabel}
                  className="font-space font-bold text-foreground text-xs sm:text-sm truncate block"
                >
                  {promo.packageLabel}
                </span>
              </td>

              <td className="py-4 px-4 sm:px-6 font-bold text-foreground text-xs sm:text-sm whitespace-nowrap">
                {promo.price !== null ? formatNaira(promo.price, currency) : "—"}
              </td>

              <td className="py-4 px-4 sm:px-6 text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                {promo.startsAt ? formatDate(promo.startsAt) : "Once approved"}
              </td>

              <td className="py-4 px-4 sm:px-6 text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                {promo.endsAt ? formatDate(promo.endsAt) : "—"}
              </td>

              <td className="py-4 px-4 sm:px-6">
                <PromotionStatusBadge status={promo.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
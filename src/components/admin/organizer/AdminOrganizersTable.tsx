import React from "react";
import type { AdminOrganizer, AdminOrganizerStatus } from "@/types/admin-organizer";
import { useNavigate } from "react-router";
import { formatCompactNaira } from "@/lib/utils";

interface AdminOrganizersTableProps {
  organizers: AdminOrganizer[];
}

export function StatusBadge({ status }: { status: AdminOrganizerStatus }) {
  switch (status) {
    case "VERIFIED":
      return (
        <span className="inline-flex items-center rounded-full bg-[#EBF8F1] dark:bg-[#0F6E56]/25 px-3 py-1 text-[13px] font-bold text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-wide">
          VERIFIED
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-3 py-1 text-[13px] font-bold text-[#7A4E02] dark:text-[#FBBF24] uppercase tracking-wide">
          PENDING
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FFC4C4] dark:bg-[#DC2626]/25 px-3.5 py-1 text-[13px] font-bold text-[#BE2525] dark:text-[#F87171] uppercase tracking-wide">
          SUSPENDED
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FFC4C4] dark:bg-[#DC2626]/25 px-3 py-1 text-[13px] font-bold text-[#BE2525] dark:text-[#F87171] uppercase tracking-wider">
          REJECTED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
          {status}
        </span>
      );
  }
}

// Was reparsing the already-formatted, hardcoded-₦ `formattedRevenue`
// string with a regex and re-adding a hardcoded ₦ — broke both the
// M/K compacting (a value in the billions was labeled "M" too, see the
// two identical 1_000_000_000/1_000_000 branches above) and the currency
// symbol itself. Formats straight from the raw number + the row's own
// currency now, via the shared formatCompactNaira.
function formatCompactCurrency(rawRevenue: number | undefined | null, currency: string | undefined): string {
  if (!rawRevenue) return "—";
  return formatCompactNaira(rawRevenue, currency);
}

export default function AdminOrganizersTable({
  organizers,
}: AdminOrganizersTableProps) {
  const navigate = useNavigate();

  if (organizers.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No organizer match your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-card/50 text-[16px] font-space font-[400] uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">ORGANIZER</th>
              <th className="px-6 py-4">CONTACT</th>
              <th className="px-6 py-4">EVENTS</th>
              <th className="px-6 py-4">REVENUE</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {organizers.map((org) => (
              <tr
                key={org._id}
                onClick={() => navigate(`/admin/organizers/${org._id}`)}
                className="group cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-white shadow-xs">
                      {org.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {org.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {org.category}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 font-[16px] font-[400] font-geist text-muted-foreground">
                  {org.email}
                </td>

                <td className="px-6 py-4 font-[700] font-space text-[18px] text-foreground ">
                  {org.eventCount}
                </td>

                {/* REVENUE */}
                <td className="px-6 py-4 font-grotesk text-[18px] font-[500] text-foreground">
                  {formatCompactCurrency(org.rawRevenue, org.currency)}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <StatusBadge status={org.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

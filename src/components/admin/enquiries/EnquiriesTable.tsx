import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import { formatRequestedAgo } from "@/lib/utils";
import type { Enquiry } from "@/lib/enquiryService";

interface EnquiriesTableProps {
  enquiries?: Enquiry[];
  isLoading: boolean;
  // Selection is optional — a table rendered with no selection props (none
  // today, but any future read-only usage) behaves exactly as before, with
  // no checkbox column at all.
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export default function EnquiriesTable({
  enquiries,
  isLoading,
  selectedIds,
  onToggleSelect,
}: EnquiriesTableProps) {
  const navigate = useNavigate();
  const selectable = !!selectedIds && !!onToggleSelect;

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 min-[400px]:gap-4 p-3 min-[400px]:p-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-4 w-24 min-[400px]:w-40" />
            <Skeleton className="h-4 w-32 min-[400px]:w-56" />
            <Skeleton className="h-4 w-10 min-[400px]:w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    );
  }

  if (!enquiries || enquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
      <table className="w-full min-w-[750px] text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-border bg-card/50">
            {/* No "select all" checkbox up here — it lives in the toolbar
                above the table instead, next to the Delete/Cancel buttons,
                not mixed in with the column headers. This empty cell just
                keeps the header row's column count matching the per-row
                checkbox cell below it. */}
            {selectable && <th className="py-4 pl-4 sm:pl-6 pr-2 w-10" aria-hidden="true" />}
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              FROM
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              SUBJECT
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              STATUS
            </th>
            <th className="text-right font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              RECEIVED
            </th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry, index) => (
            <tr
              key={enquiry._id}
              onClick={() => navigate(`/admin/enquiries/${enquiry._id}`)}
              className={`cursor-pointer hover:bg-muted/40 transition-colors ${
                index < enquiries.length - 1 ? "border-b-2 border-border" : ""
              } ${enquiry.status === "unread" ? "font-bold" : ""}`}
            >
              {selectable && (
                // stopPropagation so clicking the checkbox doesn't also
                // trigger the row's own onClick (navigate to the detail
                // page) — the two need to be independent actions.
                <td
                  className="py-4 pl-4 sm:pl-6 pr-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    aria-label={`Select enquiry from ${enquiry.fullName}`}
                    checked={selectedIds!.has(enquiry._id)}
                    onCheckedChange={() => onToggleSelect!(enquiry._id)}
                    className="w-[17px] h-[17px]"
                  />
                </td>
              )}
              <td className="py-4 px-4 sm:px-6 max-w-[180px] sm:max-w-none">
                <span title={`${enquiry.fullName} <${enquiry.email}>`} className="text-foreground text-sm sm:text-base truncate block">
                  {enquiry.fullName}
                </span>
                <span className="text-xs text-muted-foreground font-normal truncate block">{enquiry.email}</span>
              </td>
              <td className="py-4 px-4 sm:px-6 max-w-[220px]">
                <span title={enquiry.subject} className="text-foreground text-xs sm:text-sm truncate block">
                  {enquiry.subject}
                </span>
              </td>
              <td className="py-4 px-4 sm:px-6">
                <Badge
                  className={
                    enquiry.status === "unread"
                      ? "bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-2.5 py-1 font-medium text-[#7A4E02] dark:text-[#FBBF24] hover:bg-[#F4DFB6] dark:hover:bg-[#C97A17]/25 text-xs sm:text-sm whitespace-nowrap"
                      : "bg-[#BBE0CF] dark:bg-[#0F6E56]/25 px-2.5 py-1 font-medium text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/25 text-xs sm:text-sm whitespace-nowrap"
                  }
                >
                  {enquiry.status === "unread" ? "UNREAD" : "READ"}
                </Badge>
              </td>
              <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-muted-foreground font-space font-normal whitespace-nowrap text-right">
                {formatRequestedAgo(enquiry.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

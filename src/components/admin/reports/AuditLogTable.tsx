import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogEntry } from "@/types/report";
import { formatRequestedAgo } from "@/lib/utils";

interface AuditLogTableProps {
  entries?: AuditLogEntry[];
  isLoading: boolean;
}

const MESSAGE_IN_TARGET_TYPES = new Set([
  "currency_converted",
  "admin_invited",
  "admin_removed",
]);

export default function AuditLogTable({
  entries,
  isLoading,
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 min-[400px]:gap-6 p-3 min-[400px]:p-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-4 w-24 min-[400px]:w-40" />
            <Skeleton className="h-4 w-20 min-[400px]:w-32" />
            <Skeleton className="h-4 w-12 min-[400px]:w-16" />
            <Skeleton className="h-4 w-12 min-[400px]:w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No admin activity yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
      <table className="w-full min-w-[750px] text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-border bg-card/50">
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              ACTION
            </th>
            <th className="text-left font-space max-w-[200px] py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              TARGET
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              ADMIN
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-xs sm:text-sm tracking-wide">
              WHEN
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry, index) => {
            const targetContent = MESSAGE_IN_TARGET_TYPES.has(entry.type)
              ? entry.message
              : entry.target;

            return (
              <tr
                key={entry.id}
                className={`hover:bg-muted/40 transition-colors ${
                  index < entries.length - 1 ? "border-b-2 border-border" : ""
                }`}
              >
                <td className="py-4 px-4 sm:px-6 max-w-[200px] sm:max-w-none">
                  <span
                    title={`${entry.action} ${entry.amount ?? ""}`}
                    className="font-bold text-foreground text-xs sm:text-sm truncate block"
                  >
                    {entry.action}{" "}
                    {entry.amount && (
                      <span className="font-space font-semibold">{entry.amount}</span>
                    )}
                  </span>
                </td>

                <td className="py-4 px-4 sm:px-6 max-w-[220px]">
                  <span
                    title={targetContent}
                    className="text-foreground text-xs sm:text-sm truncate block max"
                  >
                    {targetContent}
                  </span>
                </td>

                <td className="py-4 px-4 sm:px-6 max-w-[150px] sm:max-w-none">
                  <span
                    title={entry.actorName}
                    className="text-foreground text-xs sm:text-sm truncate block"
                  >
                    {entry.actorName}
                  </span>
                </td>

                <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {formatRequestedAgo(entry.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
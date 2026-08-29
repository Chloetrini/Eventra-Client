import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogEntry } from "@/types/report";
import { formatRequestedAgo } from "@/lib/utils";

interface AuditLogTableProps {
  entries?: AuditLogEntry[];
  isLoading: boolean;
}

// These action types have no real event/organizer behind them (the
// backend sends target: "—" for all three), so the TARGET column shows
// the full message instead — e.g. "Converted all platform amounts from
// Naira to Dollar (rate: 0.00074)" instead of a dash. Every other action
// type keeps showing its actual target (event/organizer name) as before.
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
    <div className="border border-border rounded-lg overflow-x-auto min-w-0">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-[2px] border-border">
            <th className="text-left py-3 px-8 font-space font-medium text-muted-foreground text-[16px]">
              ACTION
            </th>
            <th className="text-left py-3 font-space px-4 font-medium text-muted-foreground text-[16px]">
              TARGET
            </th>
            <th className="text-left py-3 px-4 font-space font-medium text-muted-foreground text-[16px]">
              ADMIN
            </th>
            <th className="text-left py-3 px-4 font-space font-medium text-muted-foreground text-[16px]">
              WHEN
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-[2px] border-border last:border-b-[2px]">
              <td className="py-4 px-8 font-semibold text-foreground text-[17px]">
                {entry.action}{" "}
                {entry.amount && <span className="font-space">{entry.amount}</span>}
              </td>
              <td className="px-4 text-foreground text-[16px]">
                {MESSAGE_IN_TARGET_TYPES.has(entry.type) ? entry.message : entry.target}
              </td>
              <td className="px-4 text-[16px] text-foreground">{entry.actorName}</td>
              <td className="px-4 text-[16px] text-muted-foreground">
                {formatRequestedAgo(entry.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogEntry } from "@/types/report";

interface AuditLogTableProps {
  entries?: AuditLogEntry[];
  isLoading: boolean;
}

export default function AuditLogTable({
  entries,
  isLoading,
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 min-[400px]:gap-6 p-3 min-[400px]:p-4 border-b last:border-b-0"
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

  return (
    <div className="border rounded-lg overflow-x-auto min-w-0">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-[2px] border-[#E8E6E0]">
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
          {entries?.map((entry) => (
            <tr key={entry.id} className="border-[2px] last:border-b-[2px]">
              <td className="py-4 px-8 font-semibold text-[#1A1523] text-[17px]">
                {entry.action}{" "}
                {entry.amount && <span className="font-space">{entry.amount}</span>}
              </td>
              <td className="px-4 text-[#1A1523] text-[16px]">{entry.target}</td>
              <td className="px-4 text-[16px] text-[#1A1523]">{entry.admin}</td>
              <td className="px-4 text-[16px] text-[#1A1523]">{entry.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
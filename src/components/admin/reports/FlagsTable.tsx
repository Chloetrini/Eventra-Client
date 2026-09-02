import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import type { Flag } from "@/types/report";

interface FlagsTableProps {
  flags?: Flag[];
  isLoading: boolean;
  onDismiss: (flag: Flag) => void;
  onSuspend: (flag: Flag) => void;
}

export default function FlagsTable({ flags, isLoading, onDismiss, onSuspend }: FlagsTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 min-[400px]:gap-4 p-3 min-[400px]:p-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-4 w-24 min-[400px]:w-40" />
            <Skeleton className="h-4 w-10 min-[400px]:w-16" />
            <Skeleton className="h-4 w-32 min-[400px]:w-56" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    );
  }

  if (!flags || flags.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">Nothing flagged right now.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
      <table className="w-full min-w-[800px] text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-border bg-card/50">
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              SUBJECT
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              TYPE
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              REASON
            </th>
            <th className="text-left font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide">
              REPORTS
            </th>
            <th className="text-right font-space py-4 px-4 sm:px-6 font-medium text-muted-foreground text-sm tracking-wide w-48">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag, index) => {
            const reason = flag.flagReason ?? flag.latestReason ?? "—";
            const key = `${flag.targetType}-${flag.targetId}`;

            return (
              <tr
                key={key}
                onClick={() => navigate(`/admin/reports/${flag.targetId}`)}
                className={`cursor-pointer hover:bg-muted/40 transition-colors ${
                  index < flags.length - 1 ? "border-b-2 border-border" : ""
                }`}
              >
                <td className="py-4 px-4 sm:px-6 max-w-[180px] sm:max-w-none">
                  <span
                    title={flag.title}
                    className="font-bold text-foreground text-sm sm:text-base truncate block"
                  >
                    {flag.title}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <Badge
                    className={
                      flag.targetType === "event"
                        ? "bg-[#BBE0CF] dark:bg-[#0F6E56]/25 px-2.5 py-1 font-medium text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/25 text-xs sm:text-sm whitespace-nowrap"
                        : "bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-3 py-1 font-medium text-[#7A4E02] dark:text-[#FBBF24] hover:bg-[#F4DFB6] dark:hover:bg-[#C97A17]/25 text-xs sm:text-sm whitespace-nowrap"
                    }
                  >
                    {flag.targetType === "event" ? "EVENT" : "ORGANIZER"}
                  </Badge>
                </td>
                <td className="py-4 px-4 sm:px-6 max-w-[160px] ">
                  <span
                    title={reason}
                    className="text-foreground text-xs sm:text-sm truncate block"
                  >
                    {reason}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-foreground font-space font-bold whitespace-nowrap">
                  {flag.hasReports ? flag.reportsCount : "—"}
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex gap-2 justify-end items-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border font-bold hover:bg-[#0F6E56] hover:text-white border-[#0F6E56] dark:border-[#4ADE80] bg-white dark:bg-transparent text-[#0F6E56] dark:text-[#4ADE80] dark:hover:bg-[#0F6E56] text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto shrink-0"
                      onClick={() => onDismiss(flag)}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      className="font-bold border hover:text-white bg-white dark:bg-transparent hover:bg-[#BE2525] dark:hover:bg-[#BE2525] border-[#FFC4C4] dark:border-[#DC2626] text-[#BE2525] dark:text-[#F87171] text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto shrink-0 whitespace-nowrap"
                      onClick={() => onSuspend(flag)}
                    >
                      {flag.targetType === "event" ? "Remove event" : "Suspend"}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
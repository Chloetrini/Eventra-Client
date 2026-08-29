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
    <div className="border-2 border-border rounded-lg overflow-x-auto min-w-0">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left font-space py-5 px-4 font-medium text-muted-foreground text-[16px]">
              SUBJECT
            </th>
            <th className="text-left py-3 font-space px-8 font-medium text-muted-foreground text-[16px]">
              TYPE
            </th>
            <th className="text-left py-3 font-space px-8 font-medium text-muted-foreground text-[16px]">
              REASON
            </th>
            <th className="text-left py-3 px-5 font-space font-medium text-muted-foreground text-[16px]">
              REPORTS
            </th>
            <th className="w-48"></th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag) => {
            const reason = flag.flagReason ?? flag.latestReason ?? "—";
            const key = `${flag.targetType}-${flag.targetId}`;

            return (
              <tr key={key} className="border-t-2 border-border last:border-b-0 cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => navigate(`/admin/reports/${flag.targetId}`)}>
                <td className="py-6 px-4">
                  <button
                    className="flex items-center gap-2 font-semibold text-foreground text-[17px] text-left"
                  >
                    {flag.title}
                  </button>
                </td>
                <td className="px-5">
                  <Badge
                    className={
                      flag.targetType === "event"
                        ? "bg-[#BBE0CF] dark:bg-[#0F6E56]/25 px-[10px] py-[12px] font-light text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/25 text-[16px]"
                        : "bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-[13px] py-[12px] font-light text-[#7A4E02] dark:text-[#FBBF24] text-[16px] hover:bg-[#F4DFB6] dark:hover:bg-[#C97A17]/25"
                    }
                  >
                    {flag.targetType === "event" ? "EVENT" : "ORGANIZER"}
                  </Badge>
                </td>
                <td className="px-4 text-foreground text-[16px]">{reason}</td>
                <td className="text-[16px] text-foreground font-space font-bold px-8">
                  {flag.hasReports ? flag.reportsCount : "—"}
                </td>
                <td className="px-4">
                  <div className="flex gap-2 justify-end " onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border px-[15px] py-[18px] font-bold hover:bg-[#0F6E56] hover:text-white border-[#0F6E56] dark:border-[#4ADE80] bg-white dark:bg-transparent text-[#0F6E56] dark:text-[#4ADE80] dark:hover:bg-[#0F6E56]"
                      onClick={() => onDismiss(flag)}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      className="hover:text-white font-bold px-[15px] py-[18px] bg-white dark:bg-transparent hover:bg-[#BE2525] dark:hover:bg-[#BE2525] border-[#FFC4C4] dark:border-[#DC2626] text-[#BE2525] dark:text-[#F87171] whitespace-nowrap"
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

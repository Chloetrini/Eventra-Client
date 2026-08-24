import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import type { Flag } from "@/types/report";
import boxicons from "@/assets/boxicons_crypto-coin-filled.png"


interface FlagsTableProps {
  flags?: Flag[];
  isLoading: boolean;
  onDismiss: (flagId: string) => void
  onSuspend: (flagId: string) => void
}

export default function FlagsTable({ flags, isLoading, onDismiss, onSuspend }: FlagsTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 min-[400px]:gap-4 p-3 min-[400px]:p-4 border-b last:border-b-0"
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

  return (
    <div className="border-[2px] rounded-lg overflow-x-auto min-w-0 ">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b-2 border-[#E8E6E0]">
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
              REPORT
            </th>
            <th className="w-48"></th>
          </tr>
        </thead>
        <tbody>
          {flags?.map((flag) => {
            const subject =
              flag.type === "EVENT" ? flag.eventTitle : flag.username;

            return (
              <tr key={flag.id} className="border-t-2 last-border-0">
                <td className="py-6 px-4">
                  <button
                    onClick={() => navigate(`/admin/reports/${flag.id}`)}
                    className="flex items-center gap-2 font-semibold text-[#1A1523] text-[17px] hover:underline text-left"
                  >
                    {flag.type === "EVENT" && flag.category === "Conference" && (
                        <div className="bg-[#E4F1EB] rounded-full p-1.5">
                            <img src={boxicons} alt="" className="size-5" />
                        </div>
                    )}
                    {subject}
                  </button>
                </td>
                <td className="px-5">
                  <Badge
                    className={
                      flag.type === "EVENT"
                        ? "bg-[#BBE0CF] px-[10px] py-[12px] font-light text-[#0F6E56] hover:bg-[#E4F1EB] text-[16px]"
                        : "bg-[#F4DFB6] px-[13px] py-[12px] font-light text-[#7A4E02] text-[16px] hover:bg-[#F4DFB6]"
                    }
                  >
                    {flag.type}
                  </Badge>
                </td>
                <td className="px-4 text-[#1A1523] text-[16px]">{flag.reason}</td>
                <td className="text-[16px] text-[#1A1523] font-space font-bold px-8">{flag.reportCount}</td>
                <td className="px-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border px-[15px] py-[18px] font-bold hover:bg-[#0F6E56] hover:text-white border-[#0F6E56] bg-white text-[#0F6E56]"
                      onClick={() => onDismiss(flag.id)}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      className="hover:text-white font-bold  px-[15px] py-[18px] bg-white hover:bg-[#BE2525] border-[#FFC4C4] text-[#BE2525] whitespace-nowrap"
                      onClick={() => onSuspend(flag.id)}
                    >
                      {flag.type === "EVENT" ? "Suspend" : "Suspend"}
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
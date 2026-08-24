import { useParams, useNavigate } from "react-router";
import { useFlags } from "@/hooks/use-reports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag as FlagIcon, ArrowLeft } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import flagIcon from "@/assets/material-symbols_flag-rounded.png"

export default function AdminReportDetailPage() {
  const { flagId } = useParams();
  const naviagte = useNavigate();
  const { data: flags, isLoading } = useFlags();

  const flag = flags?.find((f) => f.id === flagId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!flag) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Report not found.</p>
        <Button variant="link" onClick={() => naviagte("/admin/reports")}>
          Back to Reports
        </Button>
      </div>
    );
  }

  const subject = flag.type === "EVENT" ? flag.eventTitle : flag.username;
  const Subtitle =
    flag.type === "EVENT" ? `Event · ${flag.reason}` : `User · ${flag.reason}`;

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => naviagte("/admin/reports")}
        className="flex items-center gap-1.5 text-[13px] text-[#0F6E56] font-space hover:underline w-fit"
      >
        <ArrowLeft className="size-4" />
        BACK TO REPORTS
      </button>

      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-[28px] font-grotesk font-bold text-[#1A1523]">{subject}</h1>
          <Badge className="bg-[#F4DFB6] gap-2 font-bold text-[#7A4E02] hover:bg-[#F4DFB6] text-[10px]">
            {flag.reportCount} REPORTS
          </Badge>
        </div>
        <p className="text-[15px] text-[#4A4451] mt-1">{Subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-25">
        {/* what people reported */}
        <div className="border rounded-lg p-4 min-[400px]:p-6 shadow-md">
          <h2 className="text-[20px] font-bold font-grotesk text-[#1A1523] border-b pb-3 mb-4">
            What people reported ({flag.comments.length})
          </h2>
          <div className="divide-y">
            {flag.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 py-3 first:pt-0">
                <div className="bg-[#FFC4C4] rounded-[5px] p-1.5 h-[30px] w-[30px]">
                  <img src={flagIcon} alt="Flag Icon" className="size-4 text-[#890707]" />
                </div>
                <div>
                  <p className="text-[16px] text-[#4A4451]">{comment.text}</p>
                  <p className="text-[16px] text-[#6E6577] mt-0.5">
                    {comment.reporterName} · {comment.timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* side section */}

        <div className="border rounded-lg p-4 min-[400px]:p-6 h-fit shadow-md">
          <h2 className="text-[20px] font-bold font-grotesk text-[#1A1523] mb-4">
            {flag.type === "EVENT" ? "Reported event" : "Reported user"}
          </h2>

          {flag.type === "EVENT" ? (
            <div className="space-y-3 text-xs min-[400px]:text-sm">
              <div className="flex border-b justify-between gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">Event</span>
                <span className="font-semibold text-[#1A1523] text-[17px] ">{flag.eventTitle}</span>
              </div>
              <div className="flex border-b  justify-between gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">Organizer</span>
                <span className="font-semibold text-[#1A1523] text-[17px]">{flag.organizer}</span>
              </div>
              <div className="flex border-b  justify-between gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">Category</span>
                <span className="font-semibold text-[#1A1523] text-[17px]">{flag.category}</span>
              </div>
              <div className="flex border-b  justify-between gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">When</span>
                <span className="font-semibold text-[#1A1523] text-[17px]">{flag.when}</span>
              </div>
              <div className="flex border-b  justify-between gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">Venue</span>
                <span className="font-semibold text-[#1A1523] text-[17px]">{flag.venue}</span>
              </div>
              <div className="flex justify-between gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">Ticket price</span>
                <span className="font-semibold text-[#1A1523] text-[17px]">
                  {formatNaira(flag.ticketPrice)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs min-[400px]:text-sm">
              <div className="flex justify-between border-b gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">Account</span>
                <span className="font-semibold text-[17px] text-[#1A1523]">{flag.username}</span>
              </div>
              <div className="flex justify-between border-b gap-2 pb-3">
                <span className="text-[16px] text-[#4A4451]">Joined</span>
                <span className="font-semibold text-[17px] text-[#1A1523]">{flag.joined}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[16px] text-[#4A4451]">Orders</span>
                <span className="font-semibold text-[17px] text-[#1A1523]">{flag.orders}</span>
              </div>
              <p className="text-[16px] text-[#4A4451] pt-3 border-t">
                Suspending blocks this account from buying or listing on the
                platform.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer section */}
      <div className="flex flex-col min-[400px]:flex-row items-start min-[400px]:items-center justify-between border-t pt-4 gap-3">
        <p className="text-[13px] text-[#4A4451] leading-[18px]">
          Review the reports before acting
        </p>
        <div className="flex flex-wrap border-[#E8E6E0] rounded-[7px] gap-2 w-full min-[400px]:w-auto">
          {flag.type === "EVENT" && (
            <Button variant="outline" className="flex-1 text-[13px] font-bold text-[#1A1523] ">
              Open in Events
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 min-[400px]:flex-none text-[13px] font-bold text-[#1A1523] "
            onClick={() => naviagte("/admin/reports")}
          >
            Dismiss flag
          </Button>
          <Button
            className="bg-[#BE2525] hover:bg-[#BE2525] py-4 text-[13px] font-bold text-white flex-1 min-[400px]:flex-none"
            onClick={() => naviagte("/admin/reports")}
          >
            {flag.type === "EVENT" ? "Remove event" : "Suspend user"}
          </Button>
        </div>
      </div>
    </div>
  );
}
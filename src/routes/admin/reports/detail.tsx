import { useParams, useNavigate } from "react-router";
import { useEventFlagDetail, useOrganizerFlagDetail, useDismissFlag, useActionFlag } from "@/hooks/use-reports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag as FlagIcon, ArrowLeft } from "lucide-react";
import { formatRequestedAgo } from "@/lib/utils";
import PageWrapper from "@/components/page-wrapper";

// The flags list encodes each row as "<targetType>-<targetId>" (see
// FlagsTable) since a flag isn't backed by a single id on the backend —
// it's identified by which event or organizer it's on. Split back out here.
function parseFlagId(flagId: string | undefined): { targetType: "event" | "organizer"; targetId: string } | null {
  if (!flagId) return null;
  const dashIndex = flagId.indexOf("-");
  if (dashIndex === -1) return null;
  const targetType = flagId.slice(0, dashIndex);
  const targetId = flagId.slice(dashIndex + 1);
  if (targetType !== "event" && targetType !== "organizer") return null;
  if (!targetId) return null;
  return { targetType, targetId };
}

export default function AdminReportDetailPage() {
  const { flagId } = useParams();
  const navigate = useNavigate();
  const parsed = parseFlagId(flagId);

  const eventDetail = useEventFlagDetail(parsed?.targetType === "event" ? parsed.targetId : undefined);
  const organizerDetail = useOrganizerFlagDetail(parsed?.targetType === "organizer" ? parsed.targetId : undefined);
  const dismissFlag = useDismissFlag();
  const actionFlag = useActionFlag();

  const isLoading = parsed?.targetType === "event" ? eventDetail.isLoading : organizerDetail.isLoading;

  if (!parsed) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Report not found.</p>
        <Button variant="link" onClick={() => navigate("/admin/reports")}>
          Back to Reports
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-[20px]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const event = parsed.targetType === "event" ? eventDetail.data?.event : undefined;
  const organizer = parsed.targetType === "organizer" ? organizerDetail.data?.organizer : undefined;
  const reports = parsed.targetType === "event" ? eventDetail.data?.reports : organizerDetail.data?.reports;

  if ((parsed.targetType === "event" && !event) || (parsed.targetType === "organizer" && !organizer)) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Report not found.</p>
        <Button variant="link" onClick={() => navigate("/admin/reports")}>
          Back to Reports
        </Button>
      </div>
    );
  }

  const subject = event?.title ?? organizer?.organizerProfile?.businessName ?? organizer?.fullname ?? "";
  const flagReason = event?.flagReason ?? organizer?.organizerProfile?.flagReason;
  const subtitle = parsed.targetType === "event" ? `Event${flagReason ? ` · ${flagReason}` : ""}` : `Organizer${flagReason ? ` · ${flagReason}` : ""}`;
  const reportCount = reports?.length ?? 0;

  const handleDismiss = () => {
    dismissFlag.mutate({ targetType: parsed.targetType, targetId: parsed.targetId }, { onSuccess: () => navigate("/admin/reports") });
  };

  const handleAction = () => {
    const confirmMessage =
      parsed.targetType === "event"
        ? `Remove "${subject}"? It will come down site-wide immediately.`
        : `Suspend the organizer behind "${subject}"? They'll be logged out and blocked from the platform.`;
    if (!window.confirm(confirmMessage)) return;
    actionFlag.mutate({ targetType: parsed.targetType, targetId: parsed.targetId }, { onSuccess: () => navigate("/admin/reports") });
  };

  return (
    <PageWrapper className="flex flex-col gap-3 p-[20px]">
      <button
        onClick={() => navigate("/admin/reports")}
        className="flex items-center gap-1.5 text-[13px] text-[#0F6E56] dark:text-[#4ADE80] font-space hover:underline w-fit"
      >
        <ArrowLeft className="size-4" />
        BACK TO REPORTS
      </button>

      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-[28px] font-grotesk font-bold text-foreground">{subject}</h1>
          {reportCount > 0 && (
            <Badge className="bg-[#F4DFB6] dark:bg-[#C97A17]/25 gap-2 font-bold text-[#7A4E02] dark:text-[#FBBF24] hover:bg-[#F4DFB6] dark:hover:bg-[#C97A17]/25 text-[10px]">
              {reportCount} REPORT{reportCount === 1 ? "" : "S"}
            </Badge>
          )}
        </div>
        <p className="text-[15px] text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-25">
        {/* what people reported */}
        <div className="border border-border rounded-lg p-4 min-[400px]:p-6 shadow-md">
          <h2 className="text-[20px] font-bold font-grotesk text-foreground border-b border-border pb-3 mb-4">
            What people reported ({reportCount})
          </h2>
          {reportCount === 0 ? (
            <p className="text-[16px] text-muted-foreground py-3">
              No open reports — this was flagged by an admin directly.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {reports!.map((report) => (
                <div key={report._id} className="flex gap-3 py-3 first:pt-0">
                  <div className="bg-[#FFC4C4] dark:bg-[#DC2626]/25 rounded-[5px] p-1.5 h-[30px] w-[30px] flex items-center justify-center shrink-0">
                    <FlagIcon className="size-4 text-[#890707] dark:text-[#F87171]" />
                  </div>
                  <div>
                    <p className="text-[16px] text-foreground">{report.reason}</p>
                    <p className="text-[16px] text-muted-foreground mt-0.5">
                      {report.reporterName} · {formatRequestedAgo(report.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* side section */}
        <div className="border border-border rounded-lg p-4 min-[400px]:p-6 h-fit shadow-md">
          <h2 className="text-[20px] font-bold font-grotesk text-foreground mb-4">
            {parsed.targetType === "event" ? "Reported event" : "Reported organizer"}
          </h2>

          {event ? (
            <div className="space-y-3 text-xs min-[400px]:text-sm">
              <div className="flex border-b border-border justify-between gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">Event</span>
                <span className="font-semibold text-foreground text-[17px]">{event.title}</span>
              </div>
              <div className="flex border-b border-border justify-between gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">Organizer</span>
                <span className="font-semibold text-foreground text-[17px]">
                  {event.organizer?.organizerProfile?.businessName ?? event.organizer?.fullname ?? "—"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[16px] text-muted-foreground">Status</span>
                <span className="font-semibold text-foreground text-[17px] capitalize">{event.status}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs min-[400px]:text-sm">
              <div className="flex justify-between border-b border-border gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">Organizer</span>
                <span className="font-semibold text-[17px] text-foreground">
                  {organizer?.organizerProfile?.businessName ?? organizer?.fullname}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[16px] text-muted-foreground">Email</span>
                <span className="font-semibold text-[17px] text-foreground">{organizer?.email}</span>
              </div>
              <p className="text-[16px] text-muted-foreground pt-3 border-t border-border">
                Suspending blocks this account from logging in or publishing events on the platform.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer section */}
      <div className="flex flex-col min-[400px]:flex-row items-start min-[400px]:items-center justify-between border-t border-border pt-4 gap-3">
        <p className="text-[13px] text-muted-foreground leading-[18px]">
          Review the reports before acting
        </p>
        <div className="flex flex-wrap border-border rounded-[7px] gap-2 w-full min-[400px]:w-auto">
          <Button
            variant="outline"
            className="flex-1 min-[400px]:flex-none text-[13px] font-bold text-foreground"
            onClick={handleDismiss}
          >
            Dismiss flag
          </Button>
          <Button
            className="bg-[#BE2525] hover:bg-[#BE2525] py-4 text-[13px] font-bold text-white flex-1 min-[400px]:flex-none"
            onClick={handleAction}
          >
            {parsed.targetType === "event" ? "Remove event" : "Suspend organizer"}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

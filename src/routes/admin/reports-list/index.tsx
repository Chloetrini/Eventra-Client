import { useParams, useNavigate } from "react-router";
import { useEventFlagDetail, useDismissFlag, useActionFlag } from "@/hooks/use-reports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag as FlagIcon, ArrowLeft } from "lucide-react";
import { formatRequestedAgo, formatDateTime, formatNaira } from "@/lib/utils";
import PageWrapper from "@/components/page-wrapper";

// Flags are always on events — reporting an organizer means reporting one
// of their events. This page shows both the event and the organizer
// behind it, fetched together from getEventFlagDetail.
export default function AdminReportDetailPage() {
  const { flagId: eventId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useEventFlagDetail(eventId);
  const dismissFlag = useDismissFlag();
  const actionFlag = useActionFlag();

  const event = data?.event;
  const reports = data?.reports;
  const currency = data?.currency;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Report not found.</p>
        <Button variant="link" onClick={() => navigate("/admin/reports")}>
          Back to Reports
        </Button>
      </div>
    );
  }

  const organizerName = event.organizer?.organizerProfile?.businessName ?? event.organizer?.fullname ?? "—";
  const subtitle = `Event${event.flagReason ? ` · ${event.flagReason}` : ""}`;
  const reportCount = reports?.length ?? 0;

  const formattedDate = event.startDate ? formatDateTime(event.startDate, "EEE d MMM") : "—";
  const formattedPrice =
    event.type === "free" || event.minPrice === 0 ? "Free" : formatNaira(event.minPrice, currency);

  const handleDismiss = () => {
    dismissFlag.mutate({ targetType: "event", targetId: event._id }, { onSuccess: () => navigate("/admin/reports") });
  };

  const handleRemoveEvent = () => {
    if (!window.confirm(`Remove "${event.title}"? It will come down site-wide immediately.`)) return;
    actionFlag.mutate({ targetType: "event", targetId: event._id }, { onSuccess: () => navigate("/admin/reports") });
  };

  const handleSuspendOrganizer = () => {
    if (!event.organizer) return;
    if (!window.confirm(`Suspend "${organizerName}"? They'll be logged out and blocked from the platform.`)) return;
    actionFlag.mutate({ targetType: "organizer", targetId: event.organizer._id }, { onSuccess: () => navigate("/admin/reports") });
  };

  return (
    <PageWrapper className="flex flex-col h-full gap-3 p-5">
      <button
        onClick={() => navigate("/admin/reports")}
        className="flex items-center gap-1.5 text-[13px] text-[#0F6E56] dark:text-[#4ADE80] font-space hover:underline w-fit"
      >
        <ArrowLeft className="size-4" />
        BACK TO REPORTS
      </button>

      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-[28px] font-grotesk font-bold text-foreground">{event.title}</h1>
          {reportCount > 0 && (
            <Badge className="bg-[#F4DFB6] dark:bg-[#C97A17]/25 gap-2 font-bold text-[#7A4E02] dark:text-[#FBBF24] hover:bg-[#F4DFB6] dark:hover:bg-[#C97A17]/25 text-[10px]">
              {reportCount} REPORT{reportCount === 1 ? "" : "S"}
            </Badge>
          )}
        </div>
        <p className="text-[15px] text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="flex flex-col justify-between h-full">
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
                  <div
                    key={report._id}
                    className="flex gap-3 py-3 cursor-pointer hover:bg-muted/40 transition-colors p-2 rounded"
                    onClick={() => navigate(`/admin/reports/${report._id}/details`, { state: { report } })}
                  >
                    <div className="bg-[#FFC4C4] dark:bg-[#DC2626]/25 rounded-[5px] p-1.5 h-7.5 w-7.5 flex items-center justify-center shrink-0">
                      <FlagIcon className="size-4 text-[#890707] dark:text-[#F87171]" />
                    </div>
                    <div>
                      <p className="text-[16px] text-foreground truncate">{report.reason}</p>
                      <p className="text-[16px] text-muted-foreground mt-0.5">
                        {report.reporterName} · {formatRequestedAgo(report.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* reported event — carries both event and organizer info */}
          <div className="border border-border rounded-lg p-4 min-[400px]:p-6 h-fit shadow-md">
            <h2 className="text-[20px] font-bold font-grotesk text-foreground mb-4">Reported event</h2>

            <div className="space-y-3 text-xs min-[400px]:text-sm">
              <div className="flex border-b border-border justify-between gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">Event</span>
                <span className="font-semibold text-foreground text-[17px]">{event.title}</span>
              </div>
              <div className="flex border-b border-border justify-between gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">Organizer</span>
                <span className="font-semibold text-foreground text-[17px]">{organizerName}</span>
              </div>
              <div className="flex border-b border-border justify-between gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">Category</span>
                <span className="font-semibold text-foreground text-[17px] capitalize">
                  {event.category?.name ?? "—"}
                </span>
              </div>
              <div className="flex border-b border-border justify-between gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">When</span>
                <span className="font-semibold text-foreground text-[17px]">{formattedDate}</span>
              </div>
              <div className="flex border-b border-border justify-between gap-2 pb-3">
                <span className="text-[16px] text-muted-foreground">Venue</span>
                <span className="font-semibold text-foreground text-[17px]">{event.venue?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[16px] text-muted-foreground">Ticket price</span>
                <span className="font-semibold text-foreground text-[17px]">{formattedPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="flex flex-col min-[400px]:flex-row items-start min-[400px]:items-center justify-between border-t border-border pt-4 gap-3">
          <p className="text-[13px] text-muted-foreground leading-4.5">Review the reports before acting</p>
          <div className="flex flex-wrap border-border rounded-[7px] gap-2 w-full min-[400px]:w-auto">
            <Button
              variant="outline"
              className="flex-1 min-[400px]:flex-none text-[13px] font-bold text-foreground"
              onClick={() => navigate(`/admin/events/${event._id}`)}
            >
              Open in Events
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-[400px]:flex-none text-[13px] font-bold text-foreground"
              onClick={handleDismiss}
            >
              Dismiss flag
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-[400px]:flex-none text-[13px] font-bold text-foreground"
              onClick={handleSuspendOrganizer}
              disabled={!event.organizer}
            >
              Suspend organizer
            </Button>
            <Button
              className="bg-[#BE2525] hover:bg-[#BE2525] py-4 text-[13px] font-bold text-white flex-1 min-[400px]:flex-none"
              onClick={handleRemoveEvent}
            >
              Remove event
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

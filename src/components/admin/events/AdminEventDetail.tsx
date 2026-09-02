import React, { useState } from "react";
import { Flag, ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import type { AdminEvent } from "@/types/admin-event";
import { StatusBadge } from "./AdminEventsTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PageWrapper from "@/components/page-wrapper";
import ActionBtn from "@/components/ui/action-btn";
import {
  useApproveEvent,
  useRejectEvent,
  useSuspendEvent,
  useUnsuspendEvent,
  useRemoveAdminEvent,
} from "@/hooks/use-admin-events";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface AdminEventDetailProps {
  event: AdminEvent;
  onBack?: () => void;
  onFlag?: (eventId: string) => void;
}

export default function AdminEventDetail({
  event,
  onBack,
  onFlag,
}: AdminEventDetailProps) {
  const navigate = useNavigate();
  const approveEvent = useApproveEvent();
  const rejectEvent = useRejectEvent();
  const suspendEvent = useSuspendEvent();
  const unsuspendEvent = useUnsuspendEvent();
  const removeEvent = useRemoveAdminEvent();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const handleApproveEvent = (eventId: string) => {
    approveEvent.mutate(eventId, {
      onSuccess: () => toast.success("Event approved"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not approve this event"),
    });
  };

  const handleConfirmRejectEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    rejectEvent.mutate(
      { id: event._id, reason: declineReason.trim() },
      {
        onSuccess: () => {
          toast.success("Event rejected");
          setIsRejectModalOpen(false);
          setDeclineReason("");
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Could not reject this event"),
      }
    );
  };

  const handleConfirmDeleteEvent = () => {
    removeEvent.mutate(event._id, {
      onSuccess: () => {
        toast.success("Event removed successfully");
        setIsDeleteModalOpen(false);
        if (onBack) {
          onBack();
        } else {
          navigate("/admin/events");
        }
      },
     onError: (err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
  toast.error(errorMessage);
}
    });
  };

  // Status checks
// Status checks
  const statusStr = String(event.status).toUpperCase();
  const isFreeEvent = event.type === "FREE";


  const isPastEvent = statusStr === "PAST"
  const isCanceled = statusStr === "CANCELED" || statusStr === "CANCELLED";

  // A free event is only actively managed if it's currently live/approved (not past & not canceled)
  const isFreeAndLive = isFreeEvent && !isPastEvent && !isCanceled && statusStr !== "SUSPENDED" && statusStr !== "FLAGGED";

  // Active Approved / Live state
  const isApprovedOrLive =
    (statusStr === "APPROVED" || statusStr === "LIVE" || isFreeAndLive) &&
    statusStr !== "SUSPENDED" &&
    statusStr !== "FLAGGED";

  const isSuspended = statusStr === "SUSPENDED";
  const isFlagged = statusStr === "FLAGGED";
  const isPending = statusStr === "PENDING" && !isFreeEvent;
  const isRejected = statusStr === "REJECTED";

  // Suspend & Flag controls are available ONLY for active approved/live, suspended, or flagged events (Excludes past/canceled free events)
  const canFlagOrSuspend = (isApprovedOrLive || isSuspended || isFlagged) && !isPastEvent && !isCanceled;

  // Remove event: Exclusively for SUSPENDED, FLAGGED, REJECTED, or finished/canceled free events (Hidden for active LIVE/APPROVED and PENDING)
  const canRemoveEvent = isSuspended || isFlagged || isRejected || (isFreeEvent && (isPastEvent || isCanceled));
  // Action pending loaders
  const isThisApproving = approveEvent.isPending && approveEvent.variables === event._id;
  const isThisDeclining = rejectEvent.isPending && rejectEvent.variables?.id === event._id;
  const isThisSuspending = suspendEvent.isPending && suspendEvent.variables?.id === event._id;
  const isThisUnsuspending = unsuspendEvent.isPending && unsuspendEvent.variables === event._id;
  const isThisDeleting = removeEvent.isPending && removeEvent.variables === event._id;

  const handleToggleSuspend = () => {
    if (isSuspended) {
      unsuspendEvent.mutate(event._id, {
        onSuccess: () => toast.success("Event unsuspended"),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Could not unsuspend event"),
      });
    } else {
      suspendEvent.mutate(
        { id: event._id },
        {
          onSuccess: () => toast.success("Event suspended"),
          onError: (err) =>
            toast.error(err instanceof Error ? err.message : "Could not suspend event"),
        }
      );
    }
  };

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      {/* Top Back Link */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F6E56] dark:text-[#4ADE80] hover:underline cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </button>
      </div>

      {/* Header Title & Status */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1
            className={`font-grotesk text-3xl font-bold transition-colors ${
              isFlagged ? "text-[#DC2626]" : "text-foreground"
            }`}
          >
            {event.title}
          </h1>
          <StatusBadge status={isFreeEvent ? "APPROVED" : event.status} />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          By {event.organizerName}
        </p>
      </div>

      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 sm:p-10 text-white shadow-md pt-28.75">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{
            backgroundImage: `url(${event.details?.bannerImage})`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 max-w-xl mt-27.85 sm:mt-32 md:mt-34.75 lg:mt-50">
          <p className="font-geist text-xs font-semibold tracking-widest text-[#F5A524] uppercase">
            {event.details?.category}
          </p>
          <h2 className="mt-2 font-grotesk text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {event.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-200">
            {event.details?.formattedDate} - {event.details?.venue}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              About this event
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {event.details?.description}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] font-space font-medium uppercase text-[#6E6577]">
                    <th className="pb-3">TYPE</th>
                    <th className="pb-3">PRICE</th>
                    <th className="pb-3 text-right">QTY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {event.details?.ticketTypes.map((tier) => (
                    <tr key={tier.id}>
                      <td className="py-3.5 font-bold text-foreground">
                        {tier.name}
                      </td>
                      <td className="py-3.5 font-space font-bold text-foreground">
                        {tier.price === 0
                          ? "FREE"
                          : tier.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 font-space font-bold text-foreground text-right">
                        {tier.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              Organizer
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-foreground text-sm border border-border">
                {event.details?.organizer.initials}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm font-grotesk">
                  {event.details?.organizer.name}
                </p>
                <p className="text-xs text-muted-foreground font-bold font-space">
                  {event.details?.organizer.verified ? "Verified" : "Unverified"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/admin/organizers/${event.details?.organizer.id}`)}
              className="mt-5 flex w-[70%] items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer font-geist"
            >
              View organizer
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              Details
            </h3>
            <div className="mt-4 divide-y divide-border/60 text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">Date</span>
                <span className="font-semibold text-foreground text-right">
                  {event.details?.formattedDate}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">Venue</span>
                <span className="font-semibold text-foreground text-right">
                  {event.details?.venue}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">Capacity</span>
                <span className="font-space font-semibold text-foreground text-right">
                  {event.details?.capacity}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">Age policy</span>
                <span className="font-space font-semibold text-foreground text-right">
                  {event.details?.agePolicy}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">Refund policy</span>
                <span className="font-semibold text-foreground text-right">
                  {event.details?.refundPolicy}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-6">
        <p className="text-sm text-muted-foreground font-medium">
          Review the details before you decide.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Flag / Unflag Button */}
          {canFlagOrSuspend && (
            <button
              onClick={() => onFlag?.(event._id)}
              className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer shadow-md ${
                isFlagged
                  ? "border-[#DC2626] bg-[#FCE8E6] dark:bg-[#DC2626]/20 text-[#DC2626]"
                  : "border-border bg-card text-foreground hover:bg-accent"
              }`}
            >
              <Flag className={`h-4 w-4 ${isFlagged ? "text-[#DC2626]" : ""}`} />
              {isFlagged ? "Unflag" : "Flag"}
            </button>
          )}

          {/* Pending Approval / Rejection Actions */}
          {isPending && (
            <div className="flex items-center gap-2">
              <ActionBtn
                type="button"
                text="Approve"
                loading={isThisApproving}
                disabled={approveEvent.isPending || rejectEvent.isPending}
                onClick={() => handleApproveEvent(event._id)}
                classname="bg-[#0F6E56] hover:bg-[#095341] text-white text-xs sm:text-sm px-4 py-2.5 h-auto shrink-0 rounded-xl font-bold"
              />
              <ActionBtn
                type="button"
                text="Reject"
                variant="outline"
                loading={isThisDeclining}
                disabled={approveEvent.isPending || rejectEvent.isPending}
                onClick={() => setIsRejectModalOpen(true)}
                classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-xs sm:text-sm px-4 py-2.5 h-auto shrink-0 rounded-xl font-bold"
              />
            </div>
          )}

          {/* Free Event Indicator Badge */}
          {isFreeEvent && !isSuspended && (
            <button
              disabled
              className="bg-[#0F6E56]/15 text-[#0F6E56] dark:text-[#4ADE80] border border-[#0F6E56]/30 px-4 py-2.5 text-sm font-bold rounded-xl cursor-default"
            >
              Approved (Free Event)
            </button>
          )}

          {/* Suspend / Unsuspend Toggle */}
          {canFlagOrSuspend && (
            <ActionBtn
              type="button"
              text={isSuspended ? "Unsuspend event" : "Suspend event"}
              loading={isThisSuspending || isThisUnsuspending}
              disabled={suspendEvent.isPending || unsuspendEvent.isPending}
              onClick={handleToggleSuspend}
              variant="outline"
              classname={`text-xs sm:text-sm px-4 py-2.5 h-auto shrink-0 border rounded-xl font-bold transition-colors ${
                isSuspended
                  ? "border-[#0F6E56] text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#0F6E56]/10"
                  : "border-[#D97706] text-[#D97706] hover:bg-[#D97706]/10"
              }`}
            />
          )}

          {/* Remove Event Button — EXCLUSIVELY shown when SUSPENDED, FLAGGED, or REJECTED */}
          {canRemoveEvent && (
            <ActionBtn
              type="button"
              text="Remove event"
              variant="outline"
              loading={isThisDeleting}
              disabled={removeEvent.isPending}
              onClick={() => setIsDeleteModalOpen(true)}
              classname="border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] hover:text-white text-xs sm:text-sm px-4 py-2.5 h-auto shrink-0 rounded-xl font-bold transition-colors"
            />
          )}
        </div>
      </div>

      {/* Reject Event Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md p-6">
          <form onSubmit={handleConfirmRejectEvent}>
            <DialogHeader className="space-y-2">
              <DialogTitle className="font-grotesk text-lg font-bold text-foreground">
                Reject Event
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Please provide a reason for rejecting this event.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#BE2525]"
                required
              />
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <ActionBtn
                type="submit"
                text="Confirm Rejection"
                loading={rejectEvent.isPending}
                classname="bg-[#BE2525] hover:bg-[#A11D1D] text-white text-sm px-4 py-2 h-auto rounded-xl font-bold"
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove Event Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-grotesk text-lg font-bold text-foreground flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-[#BE2525]" />
              Remove Event
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to permanently remove <strong>{event.title}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <ActionBtn
              type="button"
              text="Confirm Remove"
              loading={isThisDeleting}
              onClick={handleConfirmDeleteEvent}
              classname="bg-[#BE2525] hover:bg-[#A11D1D] text-white text-sm px-4 py-2 h-auto rounded-xl font-bold"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
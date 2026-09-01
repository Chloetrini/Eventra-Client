import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import PageWrapper from "@/components/page-wrapper";
import { AccountReviewBanner } from "@/components/account-review-banner";
import OrganizerEventHeader from "@/components/organizer-dashboard/OrganizerEventHeader";
import OrganizerEventHero from "@/components/organizer-dashboard/OrganizerEventHero";
import EventMetricsGrid from "@/components/organizer-dashboard/EventMetricsGrid";
import TicketTypesTable from "@/components/organizer-dashboard/TicketTypesTable";
import RecentAttendeesCard from "@/components/organizer-dashboard/RecentAttendeesCard";
import PromotionsCard from "@/components/organizer-dashboard/PromotionsCard";
import QuickActionsCard from "@/components/organizer-dashboard/QuickActionsCard";
import { OrganizerEventDetailsSkeleton } from "@/components/skeletons/organizer-event-details-skeleton";
import { DeleteEventDialog } from "@/components/dialogs/delete-event-dialog";
import { CancelEventDialog } from "@/components/dialogs/cancel-event-dialog";
import { PostponeEventDialog } from "@/components/dialogs/postpone-event-dialog";
import { useOrganizerEventDetails } from "@/hooks/use-organizer-event-details";
import { useOrganizerBankStatus, useOrganizerProfileComplete, useOrganizerStatus } from "@/lib/organizer-api";
import { useDeleteEvent, useCancelEvent, usePostponeEvent } from "@/hooks/use-event-actions";

export default function OrganizerEventDetailsRoute() {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const { status, isLoading: statusLoading } = useOrganizerStatus();
  const { bankStatus, isLoading: bankStatusLoading } = useOrganizerBankStatus();
  const { isProfileComplete, isLoading: profileCompleteLoading } = useOrganizerProfileComplete();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [confirmingPostpone, setConfirmingPostpone] = useState(false);

  const {
    data: event,
    isLoading,
    isError,
  } = useOrganizerEventDetails(eventId);

  const deleteMutation = useDeleteEvent();
  const cancelMutation = useCancelEvent();
  const postponeMutation = usePostponeEvent();

  const handleShare = async () => {
    if (!event) return;
    const shareUrl = `${window.location.origin}/events/${event.slug}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch {
      // Fallback
    }
    toast.success("Event link copied to clipboard");
  };

  const handleDeleteConfirmed = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Event deleted");
      navigate("/dashboard/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete event. Please try again.");
    }
  };

  const handleCancelConfirmed = async (id: string, reason: string) => {
    try {
      await cancelMutation.mutateAsync({ eventId: id, reason });
      toast.success("Event cancelled. Attendees are being notified and refunded where paid.");
      setConfirmingCancel(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel event. Please try again.");
    }
  };

  const handlePostponeConfirmed = async (id: string, newStartDate: string, reason?: string) => {
    try {
      await postponeMutation.mutateAsync({ eventId: id, newStartDate, reason });
      toast.success("Event postponed. Attendees are being notified of the new date.");
      setConfirmingPostpone(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not postpone event. Please try again.");
    }
  };

  // A draft/rejected event is always editable from the wizard. A live
  // (approved/postponed) event now is too, up to a few days before it
  // starts — see event.canEdit / event.isLiveEdit / event.editBlockedReason
  // (buildEditability in lib/events-api.ts, mirrors the backend's
  // EDITABLE_STATUSES / LIVE_EDITABLE_STATUSES + isPastLiveEditCutoff
  // guards). Anything else (pending approval, cancelled, or a live event
  // past its cutoff) stops here with a clear explanation instead of letting
  // the organizer fill out the whole form and fail at the very end.
  const handleEditClick = () => {
    if (!event) return;
    if (!event.canEdit) {
      toast.error(
        event.editBlockedReason ?? "This event can't be edited in its current state."
      );
      return;
    }
    navigate(`/dashboard/create-event/type?eventId=${event.id}`);
  };

  if (!eventId) {
    return (
      <PageWrapper className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">No event selected</h2>
        <p className="text-sm text-muted-foreground">
          Pick an event from{" "}
          <Link to="/dashboard/events" className="underline">
            your events list
          </Link>{" "}
          to see its details.
        </p>
      </PageWrapper>
    );
  }

  if (isLoading) {
    return (
      <PageWrapper className="py-6 px-4 md:px-8 max-w-6xl mx-auto">
        <OrganizerEventDetailsSkeleton />
      </PageWrapper>
    );
  }

  if (isError || !event) {
    return (
      <PageWrapper className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Event Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested event could not be retrieved.
        </p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-6 px-4 md:px-8 space-y-6 max-w-6xl mx-auto">
      {/* 1. Account Review Banner (driven by the organizer's real approval status).
          These three profile queries default to "not verified yet" while
          in flight — see the doc comment on the same fix in
          dashboard/overview/index.tsx — so this waits for all three before
          rendering, instead of flashing "unverified" for an already
          verified organizer on every load. */}
      {!statusLoading && !bankStatusLoading && !profileCompleteLoading && (
        <AccountReviewBanner status={status}
          bankStatus={bankStatus}
          isProfileComplete={isProfileComplete} />
      )}

      {/* 2. Top Navigation & Action Header */}
      <OrganizerEventHeader
        event={event}
        onBack={() => navigate(-1)}
        onPreview={() => navigate(`/events/${event.slug}`)}
        onShare={handleShare}
        onEdit={handleEditClick}
      />

      <OrganizerEventHero event={event} />

      <EventMetricsGrid metrics={event.metrics} currency={event.currency} />

      {/* Main 2-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left div */}
        <div className="space-y-6">
          <TicketTypesTable
            ticketTypes={event.ticketTypes}
            onEdit={handleEditClick}
            currency={event.currency}
          />
          <PromotionsCard
            isPromoted={event.isPromoted}
            message={event.promotionMessage}
            onPromote={() => navigate(`/dashboard/promotion?event=${event.id}`)}
          />
        </div>

        {/* Right div */}
        <div className="space-y-6">
          <RecentAttendeesCard
            attendees={event.recentAttendees}
            onViewAll={() =>
              navigate(`/dashboard/attendees?event=${event.id}`)
            }
          />
          <QuickActionsCard
            onCheckIn={() => navigate(`/dashboard/check-in?event=${event.id}`)}
            onViewAttendees={() =>
              navigate(`/dashboard/attendees?event=${event.id}`)
            }
            onEdit={handleEditClick}
            onDelete={() => setConfirmingDelete(true)}
            onCancel={() => setConfirmingCancel(true)}
            onPostpone={() => setConfirmingPostpone(true)}
            canCancel={event.canCancel}
            canPostpone={event.canPostpone}
          />
        </div>
      </div>

      <DeleteEventDialog
        event={confirmingDelete ? { id: event.id, title: event.title } : null}
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        onConfirm={handleDeleteConfirmed}
      />

      <CancelEventDialog
        event={confirmingCancel ? { id: event.id, title: event.title } : null}
        open={confirmingCancel}
        onOpenChange={setConfirmingCancel}
        onConfirm={handleCancelConfirmed}
        isSubmitting={cancelMutation.isPending}
      />

      <PostponeEventDialog
        event={confirmingPostpone ? { id: event.id, title: event.title } : null}
        open={confirmingPostpone}
        onOpenChange={setConfirmingPostpone}
        onConfirm={handlePostponeConfirmed}
        isSubmitting={postponeMutation.isPending}
      />
    </PageWrapper>
  );
}

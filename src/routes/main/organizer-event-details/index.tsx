import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import PageWrapper from "@/components/page-wrapper";
import { AccountReviewBanner } from "@/components/account-review-banner";
import OrganizerEventHeader from "@/components/organizer-dashboard/OrganizerEventHeader";
import OrganizerEventHero from "@/components/organizer-dashboard/OrganizerEventHero";
import EventMetricsGrid from "@/components/organizer-dashboard/EventMetricsGrid";
import TicketTypesTable from "@/components/organizer-dashboard/TicketTypesTable";
import RecentAttendeesCard from "@/components/organizer-dashboard/RecentAttendeesCard";
import PromotionsCard from "@/components/organizer-dashboard/PromotionsCard";
import QuickActionsCard from "@/components/organizer-dashboard/QuickActionsCard";
import { OrganizerEventDetailsSkeleton } from "@/components/organizer-event-details/organizer-event-details-skeleton";
import { DeleteEventDialog } from "@/components/dialogs/delete-event-dialog";
import { CancelEventDialog } from "@/components/dialogs/cancel-event-dialog";
import { PostponeEventDialog } from "@/components/dialogs/postpone-event-dialog";
import { useOrganizerEventDetails } from "@/hooks/use-organizer-event-details";
import { useOrganizerStatus } from "@/services/organizer-api";
import { deleteEvent, cancelEvent, postponeEvent } from "@/services/events-api";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";

export default function OrganizerEventDetailsRoute() {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const { status } = useOrganizerStatus();
  const queryClient = useQueryClient();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [confirmingPostpone, setConfirmingPostpone] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPostponing, setIsPostponing] = useState(false);

  const {
    data: event,
    isLoading,
    isError,
  } = useOrganizerEventDetails(eventId);

  const invalidateEventQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["my-events"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: ["organizer-event-details", eventId] });
  };

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
      await deleteEvent(id);
      toast.success("Event deleted");
      invalidateEventQueries();
      navigate("/dashboard/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete event. Please try again.");
    }
  };

  const handleCancelConfirmed = async (id: string, reason: string) => {
    setIsCancelling(true);
    try {
      await cancelEvent(id, reason);
      toast.success("Event cancelled. Attendees are being notified and refunded where paid.");
      invalidateEventQueries();
      setConfirmingCancel(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel event. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePostponeConfirmed = async (id: string, newStartDate: string, reason?: string) => {
    setIsPostponing(true);
    try {
      await postponeEvent(id, newStartDate, reason);
      toast.success("Event postponed. Attendees are being notified of the new date.");
      invalidateEventQueries();
      setConfirmingPostpone(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not postpone event. Please try again.");
    } finally {
      setIsPostponing(false);
    }
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
      {/* 1. Account Review Banner (driven by the organizer's real approval status) */}
      <AccountReviewBanner status={status} />

      {/* 2. Top Navigation & Action Header */}
      <OrganizerEventHeader
        event={event}
        onBack={() => navigate(-1)}
        onPreview={() => navigate(`/events/${event.slug}`)}
        onShare={handleShare}
        onEdit={() => navigate(`/dashboard/create-event/type?eventId=${event.id}`)}
      />

      <OrganizerEventHero event={event} />

      <EventMetricsGrid metrics={event.metrics} />

      {/* Main 2-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left div */}
        <div className="space-y-6">
          <TicketTypesTable
            ticketTypes={event.ticketTypes}
            onEdit={() =>
              navigate(`/dashboard/create-event/type?eventId=${event.id}`)
            }
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
            onEdit={() => navigate(`/dashboard/create-event/type?eventId=${event.id}`)}
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
        isSubmitting={isCancelling}
      />

      <PostponeEventDialog
        event={confirmingPostpone ? { id: event.id, title: event.title } : null}
        open={confirmingPostpone}
        onOpenChange={setConfirmingPostpone}
        onConfirm={handlePostponeConfirmed}
        isSubmitting={isPostponing}
      />
    </PageWrapper>
  );
}

import React from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import PageWrapper from "@/components/pageWrapper";
import { AccountReviewBanner } from "@/components/account-review-banner";
import OrganizerEventHeader from "@/components/organizer-dashboard/OrganizerEventHeader";
import OrganizerEventHero from "@/components/organizer-dashboard/OrganizerEventHero";
import EventMetricsGrid from "@/components/organizer-dashboard/EventMetricsGrid";
import TicketTypesTable from "@/components/organizer-dashboard/TicketTypesTable";
import RecentAttendeesCard from "@/components/organizer-dashboard/RecentAttendeesCard";
import PromotionsCard from "@/components/organizer-dashboard/PromotionsCard";
import QuickActionsCard from "@/components/organizer-dashboard/QuickActionsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganizerEventDetails } from "@/hooks/use-organizer-event-details";
import { useOrganizerStatus } from "@/lib/organizer-api";
import { deleteEvent } from "@/lib/events-api";

export default function OrganizerEventDetailsRoute() {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const { status } = useOrganizerStatus();

  const {
    data: event,
    isLoading,
    isError,
  } = useOrganizerEventDetails(eventId);

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

  const handleDelete = async () => {
    if (!event) return;
    if (!window.confirm(`Delete "${event.title}"? This can't be undone.`)) return;
    try {
      await deleteEvent(event.id);
      toast.success("Event deleted");
      navigate("/dashboard/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete event. Please try again.");
    }
  };

  if (!eventId) {
    return (
      <PageWrapper className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-800">No event selected</h2>
        <p className="text-sm text-zinc-500">
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
      <PageWrapper className="py-12 flex justify-center items-center">
        <LoadingSpinner />
      </PageWrapper>
    );
  }

  if (isError || !event) {
    return (
      <PageWrapper className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-800">Event Not Found</h2>
        <p className="text-sm text-zinc-500">
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
            onDelete={handleDelete}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

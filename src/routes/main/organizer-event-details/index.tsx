import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import PageWrapper from "@/components/pageWrapper";
import AccountReviewBanner from "@/components/organizer-dashboard/AccountReviewBanner";
import OrganizerEventHeader from "@/components/organizer-dashboard/OrganizerEventHeader";
import OrganizerEventHero from "@/components/organizer-dashboard/OrganizerEventHero";
import EventMetricsGrid from "@/components/organizer-dashboard/EventMetricsGrid";
import TicketTypesTable from "@/components/organizer-dashboard/TicketTypesTable";
import RecentAttendeesCard from "@/components/organizer-dashboard/RecentAttendeesCard";
import PromotionsCard from "@/components/organizer-dashboard/PromotionsCard";
import QuickActionsCard from "@/components/organizer-dashboard/QuickActionsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganizerEventDetails } from "@/hooks/use-organizer-event-details";

export default function OrganizerEventDetailsRoute() {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    eventId || "1",
  );

  const {
    data: event,
    isLoading,
    isError,
  } = useOrganizerEventDetails(selectedPresetId);

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
      {/* i sha use this one to simulate the experience and toggling */}
      {/* <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800/60 px-4 py-2 rounded-xl text-xs font-mono text-zinc-600 dark:text-zinc-300">
        <span>Switch Event Preset (Testing View):</span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedPresetId("1")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedPresetId === "1"
                ? "bg-[#185e42] text-white font-bold"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            1. Lagos Meetup (Live/Free)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPresetId("2")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedPresetId === "2"
                ? "bg-[#185e42] text-white font-bold"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            2. Afrobeats Market (Sold Out/Paid)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPresetId("3")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedPresetId === "3"
                ? "bg-[#185e42] text-white font-bold"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            3. Crypto Seminar (Rejected)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPresetId("4")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedPresetId === "4"
                ? "bg-[#185e42] text-white font-bold"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            4. Tech Summit (Live/Paid)
          </button>
        </div>
      </div> */}

      {/* 1. Account Review Banner */}
      {event.isAccountUnderReview && (
        <AccountReviewBanner
          onViewStatus={() => navigate("/onboarding/review")}
        />
      )}

      {/* 2. Top Navigation & Action Header */}
      <OrganizerEventHeader
        event={event}
        onBack={() => navigate(-1)}
        onPreview={() => navigate(`/events/${event.id}`)}
        onShare={handleShare}
        onEdit={() => navigate(`/organizer/events/${event.slug}/edit`)}
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
              navigate(`/organizer/events/${event.slug}/tickets/edit`)
            }
          />
          <PromotionsCard
            isPromoted={event.isPromoted}
            message={event.promotionMessage}
            onPromote={() => navigate(`/organizer/events/${event.slug}/promote`)}
          />
        </div>

        {/* Right div */}
        <div className="space-y-6">
          <RecentAttendeesCard
            attendees={event.recentAttendees}
            onViewAll={() =>
              navigate(`/organizer/events/${event.slug}/attendees`)
            }
          />
          <QuickActionsCard
            onCheckIn={() => navigate(`/organizer/events/${event.slug}/check-in`)}
            onViewAttendees={() =>
              navigate(`/organizer/events/${event.slug}/attendees`)
            }
            onEdit={() => navigate(`/organizer/events/${event.slug}/edit`)}
            onDelete={() => navigate(`/organizer/events/${event.slug}/delete`)}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

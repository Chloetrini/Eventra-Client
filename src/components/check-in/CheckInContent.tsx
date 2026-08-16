import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchMyEvents } from '@/lib/events-api';
import { useOrganizerStatus } from '@/lib/organizer-api';
import { useCheckIn } from '@/hooks/useCheckIn';
import { AccountReviewBanner } from '@/components/account-review-banner';
import CheckInGateSection from './CheckInGateSection';
import CheckInManualLookup from './CheckInManualLookup';
import QRScannerModal from './QRScannerModal';
import CheckInSkeleton from './CheckInSkeleton';
import ScanCard from './ScanCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { QrCode, Loader2 } from 'lucide-react';

export default function CheckInContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { status } = useOrganizerStatus();

  // Every event that links here (QuickActionsCard, EventActionsMenu, the
  // single-event details page) passes ?event=<id> — this was previously
  // read from a route param that the route never actually declared, so
  // it silently always fell back to a hardcoded '1'. Falls back to the
  // organizer's first event when opened from the sidebar with no event
  // pre-selected.
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['my-events'],
    queryFn: fetchMyEvents,
  });
  const eventId = searchParams.get('event') ?? events[0]?._id ?? '';

  const handleEventChange = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('event', id);
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // ─── MODAL STATE ──────────────────────────────────────────────
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // ─── ACTIVE MODE (online/offline) STATE ─────────────────────
  const [isOnline, setIsOnline] = useState(true);

  const {
    filteredAttendees,
    stats,
    recentScan,
    isLoading,
    isError,
    isCheckingIn,
    isScanning,
    error,
    searchQuery,
    setSearchQuery,
    handleCheckIn,
    handleQRCheckIn,
    eventName,
    eventImage,
    refetch,
  } = useCheckIn(eventId);

  const onQRScan = useCallback(
    async (ticketReference: string) => {
      await handleQRCheckIn(ticketReference);
      setIsScannerOpen(false);
    },
    [handleQRCheckIn]
  );

  if (eventsLoading || (eventId && isLoading)) {
    return <CheckInSkeleton />;
  }

  if (!eventsLoading && events.length === 0) {
    return (
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AccountReviewBanner status={status} />
        <p className="text-sm text-muted-foreground text-center py-12">
          You don't have any events to check guests in for yet.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Failed to load check-in data</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please try again'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#0F6E56] text-white rounded-lg hover:bg-[#0A5240] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 max-w-7xl mx-auto px-4 sm:px-6 relative">
      {/* Status Banner */}
      <AccountReviewBanner status={status} />

      {/* TOP HEADER */}
      <div className="relative mt-8 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="space-y-1">
          <span className="font-sans text-[#0F6E56] dark:text-[#4ADE80] font-medium text-sm md:text-[17px] leading-6 tracking-normal">At the Gate</span>
          <h1 className="text-3xl font-grotesk font-bold text-foreground">Check-in</h1>
          <p className="text-muted-foreground text-sm">scan tickets at the door, fast, even offline</p>
        </div>

        {/* ACTIVE MODE TOGGLE */}
        <div className=" flex flex-col items-start sm:items-end gap-1.5 mt-4 sm:mt-0 shrink-0">
          <span className="font-sans font-normal text-xs md:text-[16px] text-foreground leading-6.5 tracking-normal">Active mode</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#0F6E56] dark:bg-[#4ADE80]' : 'bg-gray-300 dark:bg-zinc-600'
                }`}
            />
            <span className="font-sans font-light text-sm md:text-[14px] text-[#0F6E56] dark:text-[#4ADE80] leading-5.25 tracking-normal ">
              {isOnline ? 'online' : 'offline'}
            </span>
            <Switch
              checked={isOnline}
              onCheckedChange={setIsOnline}
              className="data-checked:bg-[#0F6E56]"
            />
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: DROPDOWN + PROGRESS */}
      <div className="mb-14">
        <CheckInGateSection
          events={events}
          selectedEventId={eventId}
          onEventChange={handleEventChange}
          eventsLoading={eventsLoading}
          eventName={eventName || 'Event'}
          eventImage={eventImage}
          checkedInCount={stats.checkedIn}
          totalAttendees={stats.totalAttendees}
        />
      </div>

      {/* 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* LEFT COLUMN — wrapped per Frame 1171277892 (border, padding, gap) */}
        <div className="flex flex-col gap-3 pt-5 pr-2.5 pb-5 pl-2.5 rounded-lg border border-border">

          {/* Scanner placeholder — "Scanner" component: 470x260, radius 10, bg #0E0A14 */}
          <div className="relative aspect-470/260 bg-[#0E0A14] rounded-lg overflow-hidden flex items-center justify-center">

            {/* Faint inner frame — inset 30px, 410x200, 1px border #E8E6E0 @15% opacity */}
            <div className="absolute inset-7.5 rounded-lg border border-[#E8E6E0]/15 pointer-events-none" />

            {/* Top-left corner bracket — "Rectangle 8": 36x36, 30px offset, 2px #F5A524 */}
            <div className="absolute top-7.5 left-7.5 w-9 h-9 border-t-2 border-l-2 border-[#F5A524] rounded-tl-lg pointer-events-none" />

            {/* Bottom-right corner bracket (opposite corner, mirrors Rectangle 8) */}
            <div className="absolute bottom-7.5 right-7.5 w-9 h-9 border-b-2 border-r-2 border-[#F5A524] rounded-br-lg pointer-events-none" />

            {/* Decorative scan-line glow — "Line 14": 365px wide, gradient */}
            <div
              className="absolute h-0.5 w-80 top-14 left-12 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, #0E0A14, #F5A524, #F5A524, #DC9626, #0E0A14)',
              }}
            />

            <p className="text-muted-foreground text-xs italic z-0">Tap Scan to start camera</p>
          </div>

          <Button
            onClick={() => setIsScannerOpen(true)}
            className="w-full bg-[#0F6E56] hover:bg-[#0A5240] h-12 text-base font-medium rounded-lg flex items-center justify-center gap-2"
            disabled={isScanning || !eventId}
          >
            {isScanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
            {isScanning ? 'Verifying...' : 'Scan'}
          </Button>

          {recentScan && <ScanCard attendee={recentScan} />}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <CheckInManualLookup
            attendees={filteredAttendees}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onAttendeeSelect={handleCheckIn}
            isProcessing={isCheckingIn}
          />
        </div>
      </div>

      {/* MODAL OPENS HERE */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={onQRScan}
        isScanning={isScanning}
      />
    </div>
  );
}

export { default as CheckInContent } from './CheckInContent';

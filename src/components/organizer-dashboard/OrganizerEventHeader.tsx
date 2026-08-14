import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrganizerEventDetails } from '@/types/organizer-event';

interface OrganizerEventHeaderProps {
  event: OrganizerEventDetails;
  onBack?: () => void;
  onPreview?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
}

export default function OrganizerEventHeader({
  event,
  onBack,
  onPreview,
  onShare,
  onEdit,
}: OrganizerEventHeaderProps) {
  // Render status badge style dynamically
  const renderStatusBadge = () => {
    switch (event.status) {
      case 'LIVE':
        return (
          <span className="inline-flex items-center rounded-full bg-[#E4F1EB] px-3.75 py-1.25 text-[10px] font-bold tracking-widest text-[#0F6E56] uppercase font-space">
            LIVE
          </span>
        );
      case 'SOLD OUT':
        return (
          <span className="inline-flex items-center rounded-full bg-[#18181b] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">
            SOLD OUT
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center rounded-full bg-[#fee2e2] px-3.75 py-1.25 text-[10px] font-bold tracking-widest text-[#b91c1c] uppercase">
            REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3.75 py-1.25 text-[10px] font-bold tracking-widest text-zinc-700 uppercase dark:bg-zinc-800 dark:text-zinc-300">
            {event.status}
          </span>
        );
    }
  };

  // Render payment type badge style dynamically
  const renderPaymentBadge = () => {
    if (event.paymentType === 'FREE') {
      return (
        <span className="inline-flex items-center rounded-full bg-[#F4DFB6] px-3.75 py-1.25 text-[10px] font-bold tracking-widest text-[#7A4E02] uppercase">
          FREE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-[#15803d] uppercase">
        PAID
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs sm:text-sm font-normal font-space uppercase tracking-wider text-[#0F6E56] hover:underline"
      >
        <ArrowLeft className="size-3.5" />
        EVENTS
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-grotesk font-bold text-[#1A1523] dark:text-zinc-50 tracking-tight">
          {event.title}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            className="h-8 rounded-lg px-3.5 text-sm font-bold text-[#1A1523] border-[#E4DFD9] hover:bg-[#1A1523] hover:text-white dark:border-zinc-800 dark:text-zinc-300"
          >
            Preview
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onShare}
            className="h-8 rounded-lg px-3.5 text-sm font-bold text-[#1A1523] border-[#E4DFD9] hover:bg-[#1A1523] hover:text-white dark:border-zinc-800 dark:text-zinc-300"
          >
            Share
          </Button>

          <Button
            type="button"
            onClick={onEdit}
            className="h-8 rounded-lg px-3 py-2 text-sm font-bold text-white bg-[#0F6E56] font-geist hover:bg-[#134c35] transition-colors"
          >
            Edit event
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 flex-wrap">
        {renderStatusBadge()}
        {renderPaymentBadge()}
        <span>
          {event.eventNumber} · {event.category}
        </span>
      </div>
    </div>
  );
}

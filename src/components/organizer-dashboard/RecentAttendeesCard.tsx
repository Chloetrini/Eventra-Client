import React from 'react';
import type { RecentAttendee } from '@/types/organizer-event';

interface RecentAttendeesCardProps {
  attendees: RecentAttendee[];
  onViewAll?: () => void;
}

export default function RecentAttendeesCard({
  attendees,
  onViewAll,
}: RecentAttendeesCardProps) {
  const renderAttendeeStatusBadge = (status: RecentAttendee['status']) => {
    if (status === 'IN') {
      return (
        <span className="inline-flex items-center rounded-full bg-[#E4F1EB] px-2.5 py-1.25 text-[10px] font-bold tracking-widest text-[#0F6E56] font-space uppercase dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]">
          IN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-[#E8E6E0] px-2.5 py-1.25 text-[10px] font-bold tracking-widest text-[#1A1523] font-space uppercase dark:bg-zinc-800 dark:text-zinc-300">
        GOING
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-base font-bold text-foreground">
          Recent Attendees
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-normal text-[#0F6E56] hover:underline dark:text-[#4ADE80]"
        >
          View all
        </button>
      </div>

      {/* Attendees List */}
      <div className="divide-y divide-border">
        {attendees.map((attendee) => (
          <div
            key={attendee.slug}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors"
          >
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#18181b] text-white text-md font-bold shadow-xs dark:bg-zinc-100 dark:text-zinc-900 font-space tracking-widest">
                {attendee.avatarInitials}
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">
                  {attendee.name}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                  {attendee.tier} · {attendee.referenceCode}
                </p>
              </div>
            </div>

            {/* Right: Status Pill */}
            <div>{renderAttendeeStatusBadge(attendee.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <span className="inline-flex items-center rounded-full bg-[#E4F1EB] px-2.5 py-1.25 text-[10px] font-bold tracking-widest text-[#0F6E56] font-space uppercase">
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
    <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-2xs dark:bg-zinc-900 dark:border-zinc-800">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          Recent Attendees
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-normal text-[#0F6E56] hover:underline"
        >
          View all
        </button>
      </div>

      {/* Attendees List */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {attendees.map((attendee) => (
          <div
            key={attendee.slug}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
          >
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#18181b] text-white text-md font-bold shadow-xs dark:bg-zinc-100 dark:text-zinc-900 font-space tracking-widest">
                {attendee.avatarInitials}
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {attendee.name}
                </p>
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
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

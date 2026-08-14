import React from 'react';
import type { OrganizerEventDetails } from '@/types/organizer-event';

interface OrganizerEventHeroProps {
  event: OrganizerEventDetails;
}

export default function OrganizerEventHero({ event }: OrganizerEventHeroProps) {
  return (
    <div className="relative w-full h-44 sm:h-52 md:h-56 rounded-2xl overflow-hidden shadow-xs bg-zinc-900 group">
      <img
        src={event.coverImage}
        alt={event.title}
        className="w-full h-full object-cover object-center opacity-70 group-hover:scale-102 transition-transform duration-500"
      />

      {/* Dark Overlay Gradient for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute bottom-4 left-6 right-6 space-y-1 text-white">
        <span className="text-sm font-bold font-space tracking-[0%] text-[#F5A524] drop-shadow-sm">
          {event.category}
        </span>
        <h3 className="text-base font-grotesk md:text-lg font-medium md:font-bold text-white tracking-wide drop-shadow-md">
          {event.dateText}. {event.venueText}
        </h3>
      </div>
    </div>
  );
}

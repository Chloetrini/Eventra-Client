import React from "react";
import { ChevronDown } from "lucide-react";
import type { AdminEvent } from "@/types/admin-event";

interface AdminEventsHeaderProps {
  events: AdminEvent[];
  selectedEventId?: string;
  onSelectEvent?: (eventId: string) => void;
  totalEvents?: number;
  checkedInCount?: number;
  notInCount?: number;
}

export default function AdminEventsHeader({
  events,
  selectedEventId,
  onSelectEvent,
  totalEvents = 8,
  checkedInCount = 3,
  notInCount = 5,
}: AdminEventsHeaderProps) {
  const selectedEvent =
    events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Eyebrow & Title */}
      <div>
        <p className="text-xs font-medium tracking-widest text-[#0A4F41] dark:text-[#4ADE80] font-geist  uppercase">
          MANAGE
        </p>
        <h1 className="mt-1 font-grotesk text-3xl font-bold text-foreground">
          Events
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-geist">
          Every event on the platform. Moderate or remove any of them.
        </p>
      </div>

      {/* Top Filter & Stats Bar */}
      {/* <div className="flex flex-wrap items-center gap-3"> */}
        {/* EVENT Selector */}
        {/* <span className="text-sm font-light uppercase tracking-wider text-[#6E6577] dark:text-[#A5A1AE] font-geist">
          EVENT
        </span>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
          <div className="relative inline-flex items-center">
            <select
              value={selectedEventId || selectedEvent?.id || ""}
              onChange={(e) => onSelectEvent?.(e.target.value)}
              className="appearance-none bg-transparent pr-6 font-bold text-foreground focus:outline-none cursor-pointer"
            >
              {events.map((evt) => (
                <option
                  key={evt.id}
                  value={evt.id}
                  className="bg-card text-foreground"
                >
                  {evt.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-muted-foreground" />
          </div>
        </div> */}
        {/* Total Stat Pill */}
        {/* <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm">
          <span className="text-muted-foreground font-medium">Total</span>
          <span className="font-bold text-foreground">{totalEvents}</span>
        </div> */}
        {/* Checked in Stat Pill */}
        {/* <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm">
          <span className="text-muted-foreground font-medium">Checked in</span>
          <span className="font-bold text-[#0F6E56] dark:text-[#4ADE80]">
            {checkedInCount}
          </span>
        </div> */}
        {/* Not in Stat Pill */}
        {/* <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm">
          <span className="text-muted-foreground font-medium">Not in</span>
          <span className="font-bold text-foreground">{notInCount}</span>
        </div> */}
      {/* </div> */}
    </div>
  );
}

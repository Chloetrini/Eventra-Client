import React from 'react';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Event } from '@/types/event';

interface CheckInGateSectionProps {
    events: Event[];
    selectedEventId: string;
    onEventChange: (eventId: string) => void;
    eventsLoading?: boolean;
    eventName: string;
    eventImage?: string | null;
    checkedInCount: number;
    totalAttendees: number;
}

export default function CheckInGateSection({
    events,
    selectedEventId,
    onEventChange,
    eventsLoading,
    eventName,
    eventImage,
    checkedInCount,
    totalAttendees,
}: CheckInGateSectionProps) {
    const percentage = totalAttendees > 0 ? (checkedInCount / totalAttendees) * 100 : 0;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">

            {/* Left: Event picker — this was a purely decorative div before
                (no real dropdown), so switching events wasn't actually
                possible from here. Now a real Select. */}
            <div className="w-full sm:w-auto flex items-center gap-3">
                <span className="text-[11px] md:text-[16px] font-Geist font-normal text-muted-foreground uppercase tracking-wider shrink-0">
                    EVENT
                </span>
                <Select
                    value={selectedEventId || undefined}
                    onValueChange={(id) => id && onEventChange(id)}
                    disabled={eventsLoading || events.length === 0}
                >
                    <SelectTrigger className="w-full sm:w-auto min-w-45 h-auto py-0 pr-4 pl-0 rounded-r-lg rounded-l-none border-0 bg-[#FCE6B6] dark:bg-[#7A4E02]/25 hover:bg-[#fadd9c] dark:hover:bg-[#7A4E02]/40 transition-colors">
                        <div className="flex items-center gap-2 truncate">
                            {eventImage ? (
                                <img
                                    src={eventImage}
                                    alt=""
                                    className="w-11.25 h-11.25 object-cover shrink-0 shadow-[0_0.11px_1.41px_rgba(0,0,0,0.25)]"
                                />
                            ) : (
                                <div className="w-11.25 h-11.25 bg-gray-300 dark:bg-zinc-700 shrink-0 shadow-[0_0.11px_1.41px_rgba(0,0,0,0.25)]" />
                            )}
                            <SelectValue placeholder={eventsLoading ? "Loading…" : "Select event"}>
                                <span className="truncate text-sm font-medium text-[#1A1523] dark:text-zinc-100">
                                    {eventName}
                                </span>
                            </SelectValue>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {events.map((event) => (
                            <SelectItem key={event._id} value={event._id}>
                                {event.eventTitle}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Right: Stats and Progress Bar */}
            <div className="flex-1 w-full flex flex-col items-start gap-2 sm:gap-1 ">

                <div className="flex items-baseline gap-1 shrink-0 whitespace-nowrap">
                    <span className="font-grotesk font-extrabold text-3xl sm:text-[28px] text-foreground leading-7.5 tracking-[-2%]">
                        {checkedInCount}
                    </span>
                    <span className="font-sans font-light text-foreground text-sm sm:text-[13px] leading-4.5 tracking-normal ml-1">
                        of {totalAttendees} checked in
                    </span>
                </div>

                {/* The Progress Bar  */}
                <div className="w-full sm:w-64">
                    <Progress
                        value={percentage}
                        className="h-1.8 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}

export { default as CheckInGateSection } from './CheckInGateSection';

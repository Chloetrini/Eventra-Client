import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CheckInGateSectionProps {
    eventName: string;
    eventImage?: string | null;
    checkedInCount: number;
    totalAttendees: number;
}

export default function CheckInGateSection({
    eventName,
    eventImage,
    checkedInCount,
    totalAttendees,
}: CheckInGateSectionProps) {
    const percentage = totalAttendees > 0 ? (checkedInCount / totalAttendees) * 100 : 0;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">

            {/* Left: Event Dropdown */}
            <div className="w-full sm:w-auto flex items-center gap-3">
                <span className="text-[11px] md:text-[16px] font-Geist font-normal text-muted-foreground uppercase tracking-wider shrink-0">
                    EVENT
                </span>
                <div className="bg-[#FCE6B6] pr-4 rounded-r-lg flex items-center justify-between gap-3 cursor-pointer text-sm font-medium font-sans min-w-45 hover:bg-[#fadd9c] transition-colors overflow-hidden">
                    <div className="flex items-center gap-2 truncate">
                        {eventImage ? (
                            <img
                                src={eventImage}
                                alt=""
                                className="w-11.25 h-11.25 object-cover shrink-0 shadow-[0_0.11px_1.41px_rgba(0,0,0,0.25)]"
                            />
                        ) : (
                            <div className="w-11.25 h-11.25 bg-gray-300 shrink-0 shadow-[0_0.11px_1.41px_rgba(0,0,0,0.25)]" />
                        )}
                        <span className="truncate">{eventName}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90 shrink-0" />
                </div>
            </div>

            {/* Right: Stats and Progress Bar */}
            <div className="flex-1 w-full flex flex-col items-start gap-2 sm:gap-1 ">

                <div className="flex items-baseline gap-1 shrink-0 whitespace-nowrap">
                    <span className="font-grotesk font-extrabold text-3xl sm:text-[28px] text-[#000000] leading-7.5 tracking-[-2%]">
                        {checkedInCount}
                    </span>
                    <span className="font-sans font-light text-[#000000] text-sm sm:text-[13px] leading-4.5 tracking-normal ml-1">
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
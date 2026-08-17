import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Attendee } from '@/types/check-in';

interface AttendeeListItemProps {
    attendee: Attendee;
    onSelect: (attendee: Attendee) => void;
    isProcessing?: boolean;
}

export default function AttendeeListItem({
    attendee,
    onSelect,
    isProcessing = false,
}: AttendeeListItemProps) {
    const initials = attendee.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const isCheckedIn = attendee.checkedIn;

    return (
        <div className="flex items-center gap-4 px-4 py-4 rounded-xl border border-border hover:border-input transition-colors bg-card">
            {/* Dark Avatar */}
            <div className="font-sans h-10 w-10 shrink-0 rounded-full bg-[#1A1523] dark:bg-zinc-700 text-white flex items-center justify-center text-xs font-medium">
                {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-[#4A4451] dark:text-foreground text-sm md:text-[17px] truncate">
                    {attendee.name}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans font-light text-xs md:text-[14px] text-[#4A4451] dark:text-muted-foreground">
                        {attendee.ticketType} · {attendee.ticketReference}
                    </span>
                </div>
            </div>

            <div className="shrink-0 flex items-center justify-end">
                {isCheckedIn ? (
                    /* Green Circle Check */
                    <div className="h-8 w-8 rounded-full bg-[#0F6E56] dark:bg-[#0F6E56]/80 text-white flex items-center justify-center">
                        <Check className="h-4 w-4" />
                    </div>
                ) : (
                    /* Outline Button */
                    <Button
                        onClick={() => onSelect(attendee)}
                        disabled={isProcessing}
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-[#E8E6E0] dark:border-border text-[#4A4451] dark:text-foreground hover:bg-muted text-xs font-sans font-medium px-3 h-8"
                    >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Check in'}
                    </Button>
                )}
            </div>
        </div>
    );
}

export { default as AttendeeListItem } from './AttendeeListItem';
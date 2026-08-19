import React from 'react';
import { Check } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { Attendee } from '@/types/check-in';

interface ScanCardProps {
  attendee: Attendee;
}

export default function ScanCard({ attendee }: ScanCardProps) {
  return (
    <div className="bg-[#E6F4EA] dark:bg-[#0F6E56]/15 p-4 rounded-xl flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
       {/* Large Green Circle */}
       <div className="h-10 w-10 shrink-0 rounded-full bg-[#0F6E56] text-white flex items-center justify-center">
          <Check className="h-5 w-5" />
       </div>

       <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
             <h4 className="font-bold text-foreground text-sm truncate">Valid · Admit 1</h4>
          </div>
          <div className='flex items-center gap-1'>
            <Tooltip>
              <TooltipTrigger render={<p className="text-left text-foreground text-sm truncate" />}>
                {attendee.name}
                {attendee.tableNumber && <span className="text-muted-foreground ml-1">· Table ({attendee.tableNumber})</span>}
              </TooltipTrigger>
              <TooltipContent>{attendee.name}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<p className="text-left text-muted-foreground text-sm truncate" />}>
                {attendee.ticketReference}
              </TooltipTrigger>
              <TooltipContent>{attendee.ticketReference}</TooltipContent>
            </Tooltip>
          </div>
       </div>
    </div>
  );
}

export { default as ScanCard } from './ScanCard';

import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Attendee } from '@/types/check-in';
import AttendeeListItem from './AttendeeListItem';

interface CheckInManualLookupProps {
  attendees: Attendee[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onAttendeeSelect: (attendee: Attendee) => void;
  isProcessing?: boolean;
}

export default function CheckInManualLookup({
  attendees,
  searchQuery,
  onSearch,
  onAttendeeSelect,
  isProcessing = false,
}: CheckInManualLookupProps) {
  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search" className="text-base font-semibold text-foreground">
              Manual lookup
            </Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search name or ref.."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 rounded-lg border-border focus-visible:ring-[#0F6E56]"
              />
            </div>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-2">
                Found {attendees.length} result{attendees.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Attendee List */}
          <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
            {isProcessing && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 text-[#0F6E56] animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Processing...</span>
              </div>
            )}
            {!isProcessing && attendees.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-muted-foreground text-sm">No attendees found</p>
                {searchQuery && (
                  <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
                )}
              </div>
            )}
            {!isProcessing &&
              attendees.map((attendee) => (
                <AttendeeListItem
                  key={attendee.id}
                  attendee={attendee}
                  onSelect={onAttendeeSelect}
                  isProcessing={isProcessing}
                />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { default as CheckInManualLookup } from './CheckInManualLookup';
import React from 'react';
import { Search } from 'lucide-react';

export type StatusFilterOption = 'all' | 'pending' | 'live' | 'flagged' | 'past' | 'rejected';

interface AdminEventsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: StatusFilterOption;
  onFilterChange: (filter: StatusFilterOption) => void;
}

const FILTER_TABS: { label: string; value: StatusFilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Live', value: 'live' },
  { label: 'Flagged', value: 'flagged' },
  { label: 'Past', value: 'past' },
  { label: 'Rejected', value: 'rejected' },
];

export default function AdminEventsFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: AdminEventsFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B5B5B5]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, email or reference"
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-sm placeholder:text-[#B5B5B5] focus:border-ring focus:outline-none transition-colors"
        />
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-foreground text-background shadow-xs'
                  : 'border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

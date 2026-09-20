import React from 'react';
import { Search } from 'lucide-react';

export type OrganizerStatusFilterOption = "all" | "pending" | "verified" | "suspended" | "rejected";

interface AdminOrganizerFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: OrganizerStatusFilterOption;
  onFilterChange: (filter: OrganizerStatusFilterOption) => void;

}

const FILTER_TABS: { label: string; value: OrganizerStatusFilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Verified', value: 'verified' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Rejected', value: 'rejected' },

];

export default function AdminOrganizerFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: AdminOrganizerFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 ">
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
              className={`rounded-lg px-4 py-1 text-[15px] font-geist font-[700] transition-all ${
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

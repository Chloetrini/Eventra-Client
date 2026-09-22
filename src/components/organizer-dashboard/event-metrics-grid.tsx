import React from 'react';
import type { EventMetrics } from '@/types/organizer-event';
import { formatCompactNaira } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs space-y-2">
      <p className=" text-sm md:text-[16px] font-space font-normal text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-xl sm:text-2xl lg:mt-6.25 font-bold font-space tracking-tighter text-foreground">
        {value}
      </p>
    </div>
  );
}

interface EventMetricsGridProps {
  metrics: EventMetrics;
  // The organizer's own viewer currency — metrics.revenue is already
  // converted into it server-side (see OrganizerEventDetails.currency).
  currency?: string;
}

export default function EventMetricsGrid({ metrics, currency }: EventMetricsGridProps) {
  // Format Tickets Sold
  const ticketsSoldVal =
    metrics.ticketsSold !== null && metrics.totalTickets !== null
      ? `${metrics.ticketsSold} / ${metrics.totalTickets}`
      : metrics.ticketsSold !== null
      ? `${metrics.ticketsSold}`
      : '--';

  // Format Revenue — was a hardcoded-₦ local formatter; delegates to the
  // shared currency-aware formatCompactNaira now, same M/K compacting.
  const revenueVal = metrics.revenue === null ? '--' : formatCompactNaira(metrics.revenue, currency);

  // Format Remaining
  const remainingVal =
    metrics.remainingTickets !== null ? `${metrics.remainingTickets}` : '--';

  // Format Checked In
  const checkedInVal = `${metrics.checkedInCount}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="TICKETS SOLD" value={ticketsSoldVal} />
      <StatCard label="REVENUE" value={revenueVal} />
      <StatCard label="REMAINING" value={remainingVal} />
      <StatCard label="CHECKED IN" value={checkedInVal} />
    </div>
  );
}

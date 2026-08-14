import React from 'react';
import type { EventMetrics } from '@/types/organizer-event';

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

// Helper to format currency numbers (e.g. 1000000 -> ₦ 1M, 10000000 -> ₦ 10M)
function formatRevenue(num: number | null): string {
  if (num === null) return '--';
  if (num === 0) return '₦ 0';
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toLocaleString('en-US', {
      maximumFractionDigits: 1,
    });
    return `₦ ${formatted}M`;
  }
  if (num >= 1_000) {
    const formatted = (num / 1_000).toLocaleString('en-US', {
      maximumFractionDigits: 1,
    });
    return `₦ ${formatted}K`;
  }
  return `₦ ${num.toLocaleString('en-US')}`;
}

interface EventMetricsGridProps {
  metrics: EventMetrics;
}

export default function EventMetricsGrid({ metrics }: EventMetricsGridProps) {
  // Format Tickets Sold
  const ticketsSoldVal =
    metrics.ticketsSold !== null && metrics.totalTickets !== null
      ? `${metrics.ticketsSold} / ${metrics.totalTickets}`
      : metrics.ticketsSold !== null
      ? `${metrics.ticketsSold}`
      : '--';

  // Format Revenue
  const revenueVal = formatRevenue(metrics.revenue);

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

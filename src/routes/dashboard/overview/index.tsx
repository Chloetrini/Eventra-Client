import React, { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import StatsCards from "@/components/organizer-dashboard/StatsCards";
import RecentEventsTable from "@/components/organizer-dashboard/RecentEventsTable";
import RevenueChart from "@/components/organizer-dashboard/RevenueChart";
import TicketsByTypeChart from "@/components/organizer-dashboard/TicketsByTypeChart";
import { useOrganizerStatus } from "@/lib/organizer-api";
import { AccountReviewBanner } from "@/components/account-review-banner";
import type { RevenuePeriod } from "@/types/dashboard";

import { useNavigate } from "react-router";

// ── Content‑only skeleton (unchanged) ──
const DashboardPageSkeleton: React.FC = () => (
  <div className="flex-1 overflow-y-auto px-8 py-6 animate-pulse">
    {/* Banner Skeleton */}
    <div className="h-24 bg-gray-200 dark:bg-white/10 rounded-xl mb-6 w-full" />

    {/* Header Skeleton */}
    <div className="mb-6">
      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24 mb-2" />
      <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-24" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-20 mt-4" />
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-32" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center px-6 py-4 border-b border-border gap-4">
          <div className="h-10 w-10 bg-gray-200 dark:bg-white/10 rounded-lg" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [period, setPeriod] = useState<RevenuePeriod>("30d");
  const { data, isLoading, isError } = useDashboard(period);
  const navigate = useNavigate();
  const { status } = useOrganizerStatus();

  if (isLoading) return <DashboardPageSkeleton />;
  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 dark:text-red-400 font-medium">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  // ← after this point, TypeScript knows `data` is defined

  const handleBannerAction = () => {
    if (data.accountStatus === "unverified") {
      navigate("/onboarding/organisation");
    }
    // pending: no navigation for now
  };

  return (
    <>
      <AccountReviewBanner status={status} />

      <div className="mb-6">
        <p className="text-[10px] font-bold font-space text-[#0F6E56] dark:text-[#4ADE80] uppercase tracking-widest mb-1">
          DASHBOARD
        </p>
        <h1 className="text-2xl font-grotesk font-bold text-foreground">
          Welcome back, {data.organization.name} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's how your events are performing.
        </p>
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <RevenueChart data={data.revenueSeries} period={period} onPeriodChange={setPeriod} />
        <TicketsByTypeChart data={data.ticketsByType} />
      </div>

      <RecentEventsTable events={data.recentEvents} />
    </>
  );
}
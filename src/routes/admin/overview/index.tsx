import React from 'react';
import Header from "@/components/admin/overview/Header";
import NeedsActionRow from "@/components/admin/overview/NeedsActionRow";
import StatsRow from "@/components/admin/overview/StatsRow";
import PlatformRevenueChart from "@/components/admin/overview/PlatformRevenueChart";
import TrustSafetyCard from "@/components/admin/overview/TrustSafetyCard";
import RecentActivityCard from "@/components/admin/overview/RecentActivityCard";
import TopOrganizersCard from "@/components/admin/overview/TopOrganizersCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverviewSummary } from "@/hooks/use-overview-summary";
import PageWrapper from '@/components/page-wrapper';

export default function AdminOverviewPage() {
  const { data, isLoading } = useOverviewSummary();

  // If data is loading, show the skeleton loader grid
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Header Loader */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Needs Action Loader (5 Cards) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        {/* Stats Row Loader (4 Cards) */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        {/* Bottom Grid Loader */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
             <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1 space-y-6">
             <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>

        {/* Bottom Activity Loader */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      <Header itemsCount={data?.totalAttentionItems ?? 0} />

      <NeedsActionRow items={data?.needsAction} isLoading={isLoading} />

      <StatsRow stats={data?.stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Owns its own range state + query — not tied to isLoading above */}
          <PlatformRevenueChart />
        </div>
        <TrustSafetyCard items={data?.trustSafety} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivityCard entries={data?.recentActivity} isLoading={isLoading} />
        <TopOrganizersCard organizers={data?.topOrganizers} isLoading={isLoading} />
      </div>
    </PageWrapper>
  );
}







// import { Navigate } from "react-router";

// export default function IndexRoute() {
//   return <Navigate to="/admin/overview" replace />;
// }
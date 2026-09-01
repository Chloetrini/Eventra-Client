import React from 'react';
import Header from "@/components/admin/overview/Header";
import NeedsActionRow from "@/components/admin/overview/NeedsActionRow";
import StatsRow from "@/components/admin/overview/StatsRow";
import PlatformRevenueChart from "@/components/admin/overview/PlatformRevenueChart";
import TrustSafetyCard from "@/components/admin/overview/TrustSafetyCard";
import RecentActivityCard from "@/components/admin/overview/RecentActivityCard";
import TopOrganizersCard from "@/components/admin/overview/TopOrganizersCard";
import { useOverviewSummary } from "@/hooks/use-overview-summary";
import PageWrapper from '@/components/page-wrapper';

export default function AdminOverviewPage() {
  const { data, isLoading } = useOverviewSummary();

  // No page-level early-return skeleton here on purpose — there used to be
  // one, hand-guessed and completely out of step with the real layout
  // below (missing PageWrapper, wrong grid ratios on the revenue/trust
  // row, no Header at all). Every section below already renders its own
  // accurate skeleton shaped exactly like its real content the moment
  // `isLoading`/a missing prop tells it to (see NeedsActionRow, StatsRow,
  // TrustSafetyCard, RecentActivityCard, TopOrganizersCard) — so the real
  // tree just always renders, and those take care of the loading state
  // themselves instead of being skipped in favor of a generic stand-in.
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

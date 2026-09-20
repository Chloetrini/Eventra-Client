import Header from "@/components/admin/overview/header";
import NeedsActionRow from "@/components/admin/overview/needs-action-row";
import StatsRow from "@/components/admin/overview/stats-row";
import PlatformRevenueChart from "@/components/admin/overview/platform-revenue-chart";
import TrustSafetyCard from "@/components/admin/overview/trust-safety-card";
import RecentActivityCard from "@/components/admin/overview/recent-activity-card";
import TopOrganizersCard from "@/components/admin/overview/top-organizers-card";
import { useOverviewSummary } from "@/hooks/admin/use-overview-summary";

export default function AdminOverviewPage() {
  const { data, isLoading } = useOverviewSummary();

  return (
    <div className="flex flex-col gap-6">
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
    </div>
  );
}
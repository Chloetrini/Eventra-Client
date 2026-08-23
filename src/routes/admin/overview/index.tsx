import Header from "@/components/admin/overview/Header";
import NeedsActionRow from "@/components/admin/overview/NeedsActionRow";
import StatsRow from "@/components/admin/overview/StatsRow";
import PlatformRevenueChart from "@/components/admin/overview/PlatformRevenueChart";
import TrustSafetyCard from "@/components/admin/overview/TrustSafetyCard";
import RecentActivityCard from "@/components/admin/overview/RecentActivityCard";
import TopOrganizersCard from "@/components/admin/overview/TopOrganizersCard";
import { useOverviewSummary } from "@/hooks/use-overview-summary";

// No top-level isLoading branch here on purpose — each row/card below
// already renders its own skeleton internally when isLoading is true (or
// data is still undefined). A page-level skeleton block on top of that
// would just be the same UI painted twice through two different code
// paths. Header renders fine with itemsCount defaulting to 0 while data
// is still loading, so it doesn't need a skeleton state of its own.
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

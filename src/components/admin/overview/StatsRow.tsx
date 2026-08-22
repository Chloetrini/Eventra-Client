import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "./StatCard";
import type { StatCardData } from "@/types/overview";

interface StatsRowProps {
    stats?: StatCardData[];
    isLoading?: boolean;
}

export default function StatsRow({ stats, isLoading }: StatsRowProps) {
    // Skeleton loading state for the row
    if (isLoading || !stats) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    // Responsive Grid: 1 column on mobile, 2 on tablet, 4 on desktop
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <StatCard
                    key={stat.id}
                    stat={stat}
                    // Added smooth shadow transition on hover for the row wrapper
                    className="transition-shadow duration-200 hover:shadow-lg"
                />
            ))}
        </div>
    );
}
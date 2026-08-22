import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "./StatCard";
import type { StatCardData } from "@/types/overview";

interface StatsRowProps {
  stats?: StatCardData[];
  isLoading?: boolean;
}

export default function StatsRow({ stats, isLoading }: StatsRowProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
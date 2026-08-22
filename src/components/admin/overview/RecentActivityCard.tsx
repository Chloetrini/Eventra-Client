import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityItem from "./ActivityItem";
import type { ActivityEntry } from "@/types/overview";

interface RecentActivityCardProps {
  entries?: ActivityEntry[];
  isLoading?: boolean;
}

export default function RecentActivityCard({ entries, isLoading }: RecentActivityCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Recent activity
        </h3>
        <a
          href="/admin/audit-log"
          className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-auto p-0")}
        >
          Audit log
        </a>
      </div>

      <div className="mt-4 space-y-4">
        {isLoading || !entries
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
          : entries.map((entry) => <ActivityItem key={entry.id} entry={entry} />)}
      </div>
    </div>
  );
}
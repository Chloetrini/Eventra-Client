import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import ActivityItem from "./ActivityItem";
import type { ActivityEntry } from "@/types/overview";

interface RecentActivityCardProps {
  entries?: ActivityEntry[];
  isLoading?: boolean;
}

export default function RecentActivityCard({ entries, isLoading }: RecentActivityCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Recent activity
        </h3>
        <a
          href="/admin/reports?tab=audit"
          className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-auto p-0", "text-[#10b981]")}
        >
          Audit log
        </a>
      </div>

      {/* Header Separator */}
      <Separator className="w-full" />

      {/* Activity List */}
      <div className="pt-2">
        {isLoading || !entries
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-2.5">
                <Skeleton className="h-8 w-full" />
              </div>
            ))
          : entries.map((entry, i) => (
              <div key={entry.id}>
                <div className="px-6 py-2.5">
                  <ActivityItem entry={entry} />
                </div>
                {/* Item Separator */}
                {i < entries.length - 1 && <Separator className="w-full" />}
              </div>
            ))}
      </div>
    </div>
  );
}
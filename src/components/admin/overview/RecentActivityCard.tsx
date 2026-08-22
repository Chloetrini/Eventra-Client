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
        <div className="flex flex-col rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg">

            {/* Header: Title & Audit Log Link (Inside padding) */}
            <div className="flex items-center justify-between px-4 md:px-6 pt-6 pb-4">
                <h3 className="font-heading text-base md:text-[20px] font-bold text-foreground leading-6 tracking-[-1%]">
                    Recent activity
                </h3>
                <a
                    href="/admin/audit-log"
                    className={cn(
                        buttonVariants({ variant: "link", size: "sm" }),
                        "h-auto p-0 font-geist text-[13px] font-medium text-[#0F6E56] leading-4.5"
                    )}
                >
                    Audit log
                </a>
            </div>

            {/* End-to-End Title Separator (Stretches via negative margins) */}
            <Separator className="h-[1.5px] w-full bg-border" />

            {/* List Content: end-to-end separators between each item */}
            <div className="flex-1">
                {isLoading || !entries ? (
                    <div className="p-4 md:p-6 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-9 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {entries.map((entry) => (
                            <div key={entry.id} className="px-4 md:px-6 py-4">
                                <ActivityItem entry={entry} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
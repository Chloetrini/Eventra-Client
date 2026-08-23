import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import OrganizerRow from "./OrganizerRow";
import type { TopOrganizer } from "@/types/overview";

interface TopOrganizersCardProps {
    organizers?: TopOrganizer[];
    isLoading?: boolean;
}

export default function TopOrganizersCard({ organizers, isLoading }: TopOrganizersCardProps) {
    const viewAllLinkClass = cn(
        buttonVariants({ variant: "link", size: "sm" }),
        "h-auto p-0 font-geist text-[13px] font-medium text-[#0F6E56] leading-4.5 tracking-normal"
    );

    return (
        <div className="flex flex-col rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg">

            {/* Header (Top padding only) */}
            <div className="flex items-center justify-between px-4 md:px-6 pt-6 pb-4">
                {/* Fix: Changed to text-foreground so it switches to white in dark mode */}
                <h3 className="font-heading text-xl md:text-[20px] font-bold text-foreground leading-6 tracking-[-1%]">
                    Top Organizers
                </h3>
                <a href="/admin/organizers" className={viewAllLinkClass}>View all</a>
            </div>

            {/* End-to-End Title Separator */}
            <Separator className="h-[1.5px] w-full bg-border" />

            {/* List Content: End-to-End separators between rows */}
            <div className="mt-2 flex-1">
                {isLoading || !organizers ? (
                    <div className="px-4 md:px-6 py-4 space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-5 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {organizers.map((org) => (
                            <div key={org.id} className="px-4 md:px-6 py-4">
                                <OrganizerRow organizer={org} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

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
  return (
    <div className="rounded-xl border border-border bg-card py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Top Organizers
        </h3>
        <a
          href="/admin/organizers"
          className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-auto p-0", "text-[#10b981]")}
        >
          View all
        </a>
      </div>

      {/* Header Separator */}
      <Separator className="w-full" />

      {/* Organizers List */}
      <div className="pt-2">
        {isLoading || !organizers
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-2.5">
                <Skeleton className="h-5 w-full" />
              </div>
            ))
          : organizers.map((org, i) => (
              <div key={org.id}>
                <div className="px-6 py-2.5">
                  <OrganizerRow organizer={org} />
                </div>
                {/* Item Separator */}
                {i < organizers.length - 1 && <Separator className="w-full" />}
              </div>
            ))}
      </div>
    </div>
  );
}
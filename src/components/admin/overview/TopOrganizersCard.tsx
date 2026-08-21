import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OrganizerRow from "./OrganizerRow";
import type { TopOrganizer } from "@/types/overview";

interface TopOrganizersCardProps {
  organizers?: TopOrganizer[];
  isLoading?: boolean;
}

export default function TopOrganizersCard({ organizers, isLoading }: TopOrganizersCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Top Organizers
        </h3>
        <a
          href="/admin/organizers"
          className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-auto p-0")}
        >
          View all
        </a>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading || !organizers
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
          : organizers.map((org) => <OrganizerRow key={org.id} organizer={org} />)}
      </div>
    </div>
  );
}
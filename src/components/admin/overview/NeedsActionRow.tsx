import { Skeleton } from "@/components/ui/skeleton";
import NeedsActionCard from "./NeedsActionCard";
import type { NeedsActionItem } from "@/types/overview";

interface NeedsActionRowProps {
    items?: NeedsActionItem[];
    isLoading?: boolean;
}

export default function NeedsActionRow({ items, isLoading }: NeedsActionRowProps) {
    if (isLoading || !items) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
                <NeedsActionCard
                    key={item.id}
                    item={item}
                  
                    className="transition-shadow duration-200 hover:shadow-lg"
                />
            ))}
        </div>
    );
}

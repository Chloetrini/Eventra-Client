import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import TrustSafetyRow from "./TrustSafetyRow";
import type { TrustSafetyItem } from "@/types/overview";

interface TrustSafetyCardProps {
  items?: TrustSafetyItem[];
  isLoading?: boolean;
}

export default function TrustSafetyCard({ items, isLoading }: TrustSafetyCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card py-6">
      {/* Header with horizontal padding */}
      <h3 className="font-heading text-base font-semibold text-foreground px-6">
        Trust & Safety
      </h3>

      <div className="mt-4">
        {isLoading || !items
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6">
                <Skeleton className="mb-3 h-5 w-full last:mb-0" />
              </div>
            ))
          : items.map((item, i) => (
              <div key={item.id}>
                {/* Row with horizontal padding */}
                <div className="px-6">
                  <TrustSafetyRow item={item} />
                </div>
                {/* Edge-to-edge separator */}
                {i < items.length - 1 && <Separator className="my-3 w-full" />}
              </div>
            ))}
      </div>
    </div>
  );
}
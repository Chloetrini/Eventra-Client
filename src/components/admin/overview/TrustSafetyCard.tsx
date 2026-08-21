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
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-heading text-base font-semibold text-foreground">Trust & Safety</h3>

      <div className="mt-4">
        {isLoading || !items
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="mb-3 h-5 w-full last:mb-0" />
            ))
          : items.map((item, i) => (
              <div key={item.id}>
                <TrustSafetyRow item={item} />
                {i < items.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
      </div>
    </div>
  );
}
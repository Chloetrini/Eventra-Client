import { cn } from "@/lib/utils";
import type { TrustSafetyItem } from "@/types/overview";

export default function TrustSafetyRow({ item }: { item: TrustSafetyItem }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{item.label}</span>
      <span
        className={cn(
          "font-medium text-foreground",
          item.tone === "danger" && "text-destructive"
        )}
      >
        {item.value}
      </span>
    </div>
  );
}
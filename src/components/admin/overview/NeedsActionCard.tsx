import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { NeedsActionItem } from "@/types/overview";

export default function NeedsActionCard({ item }: { item: NeedsActionItem }) {
  const urgent = item.variant === "urgent";

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4",
        urgent ? "border-destructive/40" : "border-border"
      )}
    >
      <p
        className={cn(
          "text-2xl font-bold",
          urgent ? "text-destructive" : "text-foreground"
        )}
      >
        {item.count}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
      <a
        href={item.href}
        className={cn(
          buttonVariants({ variant: "link", size: "sm" }),
          "mt-2 h-auto gap-1 p-0",
          urgent ? "text-destructive" : "text-amber-500 hover:text-amber-500"
        )}
      >
        {item.ctaLabel}
        <ArrowRight className="size-3.5" />
      </a>
    </div>
  );
}
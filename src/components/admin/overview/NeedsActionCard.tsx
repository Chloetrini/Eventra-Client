import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { NeedsActionItem } from "@/types/overview";

export default function NeedsActionCard({ item }: { item: NeedsActionItem }) {
  const urgent = item.variant === "urgent";

  return (
    <div
      className={cn(
        "rounded-xl border border-t-4 bg-card p-4",
        urgent ? "border-destructive/40 " : "border-border border-t-[#F5A524] "
      )}
    >
      <p
        className={cn(
          "text-[20px] md:text-[34px] font-space font-bold",
          urgent ? "text-destructive" : "text-foreground"
        )}
      >
        {item.count}
      </p>
      <p className="mt-1 md:text-[16px] text-[13px]  font-[400] text-muted-foreground font-geist">{item.label}</p>
      <a
        href={item.href}
        className={cn(
          buttonVariants({ variant: "link", size: "sm" }),
          "mt-2 h-auto gap-1 p-0 text md:text-[16px] font-geist",
          urgent ? "text-destructive" : "text-[#0F6E56] hover:text-[#47776b]"
        )}
      >
        {item.ctaLabel}
        <ArrowRight className="size-3.5" />
      </a>
    </div>
  );
}
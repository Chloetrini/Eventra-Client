import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { NeedsActionItem } from "@/types/overview";

export default function NeedsActionCard({ item, className }: { item: NeedsActionItem; className?: string }) {
    const urgent = item.variant === "urgent";

    return (
        <div
            className={cn(
                "flex flex-col rounded-xl border border-border bg-card p-4 md:p-5 overflow-hidden",
                // Thick top border to match Figma
                urgent
                    ? "border-t-4 border-t-[#DC2626]"
                    : "border-t-4 border-t-[#F5A524]",
                className
            )}
        >
            {/* The Number */}
            <p
                className={cn(
                    "font-space text-2xl md:text-[34px] font-bold leading-none",
                    urgent ? "text-[#DC2626]" : "text-foreground"
                )}
            >
                {item.count}
            </p>

            {/* The Label - Flexed to prevent line breaking */}
            <p className="mt-2 flex flex-wrap items-center font-geist text-sm md:text-[16px] lg:text-[13px] font-normal text-muted-foreground leading-6.5 tracking-normal">
                {item.label}
            </p>

            {/* The CTA Link - Green by default, Red on hover for urgent */}
            <a
                href={item.href}
                className={cn(
                    buttonVariants({ variant: "link", size: "sm" }),
                    "mt-2 h-auto gap-1 p-0 font-geist font-normal md:text-[16px] whitespace-nowrap w-fit transition-colors",
                    urgent
                        ? "text-[#0F6E56] hover:text-[#DC2626]"
                        : "text-[#0F6E56] hover:text-[#F5A524]"
                )}
            >
                {item.ctaLabel}
                <ArrowRight className="size-3.5" />
            </a>
        </div>
    );
}
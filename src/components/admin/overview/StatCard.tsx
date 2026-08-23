import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/lib/icon-map";
import type { StatCardData } from "@/types/overview";

export default function StatCard({ stat, className }: { stat: StatCardData; className?: string }) {
    const Icon = ICON_MAP[stat.icon];

    return (
        <div className={cn("flex flex-col rounded-xl border border-border bg-card p-4 md:p-5", className)}>

            {/* Label + Icon Row */}
            <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] md:text-xs font-space font-semibold tracking-wider text-muted-foreground uppercase">
                    {stat.label}
                </p>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[5px] bg-[#E4F1EB] text-[#0F6E56]">
                    <Icon className="size-4" />
                </span>
            </div>

            {/* 
        Main Value: 
        - Added `flex items-baseline` so the Naira symbol and the numbers line up perfectly.
        - Both elements share `text-2xl md:text-[34px]` to make them the exact same size.
        - Added `leading-tight` to keep them on one line without breaking.
      */}
            <p className="my-4 flex items-center gap-0.5 font-space text-2xl md:text-[34px] font-bold text-foreground leading-tight tracking-[-1%]">
                <span aria-hidden="true" className="text-2xl md:text-[40px] font-normal">₦</span>
                <span>{stat.value.replace("₦", "")}</span>
            </p>

            {/* Trend or Caption */}
            {stat.trend ? (
                <div className="flex items-center gap-1.5">
                    {/* Trending Icon */}
                    {stat.trend.direction === "up" ? (
                        <TrendingUp className="size-5 shrink-0 text-emerald-500" />
                    ) : (
                        <TrendingDown className="size-5 shrink-0 text-[#DC2626]" />
                    )}

                    {/* Trend Value + Caption (kept on one line to prevent breaking) */}
                    <div className="flex items-baseline gap-1 whitespace-nowrap">
                        <span
                            className={cn(
                                "font-space text-[16px] font-bold leading-5 tracking-normal",
                                stat.trend.direction === "up" ? "text-emerald-500" : "text-destructive"
                            )}
                        >
                            {stat.trend.value}
                        </span>
                        <span className="text-muted-foreground font-geist text-[15px] font-normal leading-5 tracking-normal">
                            {stat.trend.caption}
                        </span>
                    </div>
                </div>
            ) : stat.caption ? (
                /* Standard caption when no trend exists */
                <p className="text-muted-foreground font-geist text-[15px] font-normal leading-5 tracking-normal">
                    {stat.caption}
                </p>
            ) : null}
        </div>
    );
}

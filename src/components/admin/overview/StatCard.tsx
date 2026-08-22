import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/lib/icon-map";
import type { StatCardData } from "@/types/overview";

export default function StatCard({ stat }: { stat: StatCardData }) {
  const Icon = ICON_MAP[stat.icon];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {stat.label}
        </p>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-3.5" />
        </span>
      </div>

      <p className="mt-2 text-xl font-bold text-foreground">{stat.value}</p>

      {stat.trend ? (
        <div className="mt-1 flex items-center gap-1 text-xs">
          {stat.trend.direction === "up" ? (
            <TrendingUp className="size-3 text-emerald-500" />
          ) : (
            <TrendingDown className="size-3 text-destructive" />
          )}
          <span
            className={cn(
              "font-medium",
              stat.trend.direction === "up" ? "text-emerald-500" : "text-destructive"
            )}
          >
            {stat.trend.value}
          </span>
          <span className="text-muted-foreground">{stat.trend.caption}</span>
        </div>
      ) : stat.caption ? (
        <p className="mt-1 text-xs text-muted-foreground">{stat.caption}</p>
      ) : null}
    </div>
  );
}
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Dot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCompactNaira } from "@/lib/utils";
import { usePlatformRevenue } from "@/hooks/use-platform-revenue";
import RevenueRangeToggle from "./RevenueRangeToggle";
import type { RevenueRange } from "@/types/overview";

// Same brand green as RevenueChart.tsx / TicketsByTypeChart.tsx — single
// series, so no categorical palette needed, just the CSS var so it swaps
// to the lighter dark-mode step automatically.
const LINE_COLOR = "var(--chart-line)";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
  currency?: string;
}

function ChartTooltip({ active, payload, label, currency }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const amount = Number(payload[0]?.value ?? 0);
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{formatCompactNaira(amount, currency)}</p>
    </div>
  );
}

export default function PlatformRevenueChart() {
  // Range is local to this card — the rest of the Overview page (Needs
  // Action, Stats, Trust & Safety, etc.) doesn't react to it. Confirmed
  // against the Figma states: only this card's value/delta/x-axis change
  // between the 7D/30D/12M artboards.
  const [range, setRange] = useState<RevenueRange>("30d");
  const { data, isLoading } = usePlatformRevenue(range);

  const positive = (data?.deltaPercent ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Platform Revenue
        </h3>
        <RevenueRangeToggle value={range} onChange={setRange} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {isLoading || !data ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <>
            <span className="text-2xl font-bold text-foreground">{data.value}</span>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-transparent",
                positive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {positive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {Math.abs(data.deltaPercent)}% {data.deltaCaption}
            </Badge>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {/* Was a hardcoded "Commission (5%)" regardless of the actual
            rate in Settings — now reads the live commissionRatePct from
            the same overview fetch this card already makes, so it stays
            correct the moment an admin changes the commission rate. */}
        Commission ({isLoading || !data ? "…" : data.commissionRatePct}%) + promotion fees
      </p>

      <div
        className="mt-4 h-55"
        role="img"
        aria-label="Area chart of platform revenue over time"
      >
        {isLoading || !data ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="platformRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(v) => formatCompactNaira(v, data?.currency)}
                width={56}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={(props) => (
                  <ChartTooltip
                    active={props.active}
                    payload={props.payload as unknown as ChartTooltipProps["payload"]}
                    label={props.label as string}
                    currency={data?.currency}
                  />
                )}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={LINE_COLOR}
                strokeWidth={2}
                fill="url(#platformRevenueFill)"
                activeDot={(props: any) => (
                  <Dot
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={LINE_COLOR}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                )}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

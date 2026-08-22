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
}

// Custom tooltip to format revenue amounts with the Naira symbol.
function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
    if (!active || !payload || payload.length === 0) return null;
    const amount = Number(payload[0]?.value ?? 0);
    return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="text-sm font-bold text-foreground">{formatCompactNaira(amount)}</p>
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

    // Determines if the trend badge should be green (up) or red (down).
    const positive = (data?.deltaPercent ?? 0) >= 0;

    return (
        <div className="flex flex-col rounded-xl border border-border bg-card p-4 md:p-6 transition-shadow duration-200 hover:shadow-lg">
            {/* Header: Title and Range Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <h3 className="font-heading text-base md:text-[20px] font-bold text-foreground leading-6 tracking-[-1%]">
                    Platform Revenue
                </h3>
                <RevenueRangeToggle value={range} onChange={setRange} />
            </div>

            {/* Revenue Value and Trend Badge */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                {isLoading || !data ? (
                    <Skeleton className="h-8 w-32" />
                ) : (
                    <>
                        {/* Split the value to apply normal weight to Naira symbol only */}
                        <span className="flex items-center gap-0.5 font-space text-2xl md:text-[34px] text-foreground leading-9.5">
                            <span className="font-normal text-[40px]">₦</span>
                            <span className="font-bold">{data.value.replace("₦", "")}</span>
                        </span>


                        <Badge
                            variant="outline"
                            className={cn(
                                "gap-1 border-transparent text-[12px] leading-4.5 tracking-[14%]",
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
            <p className="mt-1 text-xs md:text-[15px] text-muted-foreground leading-5 tracking-normal">Commission (5%) + promotion fees</p>

            {/* Chart Area: Renders Skeleton while loading, otherwise renders Recharts AreaChart */}
            <div
                className="mt-4 h-55 w-full"
                role="img"
                aria-label="Area chart of platform revenue over time"
            >
                {isLoading || !data ? (
                    <Skeleton className="h-full w-full" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            {/* Defines the vertical gradient fill for the area under the line */}
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
                                tick={{ fill: "#6E6577", fontSize: 12, fontFamily: "var(--font-space)", lineHeight: 16, letterSpacing: "7%" }}
                                interval="preserveStartEnd"
                            />

                            {/* Y-Axis: Formats values as compact Naira (e.g., ₦800K) */}
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#6E6577", fontSize: 12, fontFamily: "var(--font-space)", lineHeight: 16, letterSpacing: "7%" }}
                                tickFormatter={(v) => formatCompactNaira(v)}
                                width={56}
                            />

                            <Tooltip
                                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                                content={(props) => (
                                    <ChartTooltip
                                        active={props.active}
                                        payload={props.payload as unknown as ChartTooltipProps["payload"]}
                                        label={props.label as string}
                                    />
                                )}
                            />

                            {/* The main Area data series */}
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
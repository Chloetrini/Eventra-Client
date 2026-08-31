import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCompactNaira } from "@/lib/utils";
import type { RevenueBySource } from "@/types/revenue";

interface RevenueBySourceChartProps {
    data: RevenueBySource[];
    total: number;
    // Every amount on this page is already converted server-side into the
    // viewer's currency (see RevenuePageData.currency) — this just tells
    // formatCompactNaira which symbol/rounding to use. Optional so an
    // older cached response without it still falls back to Naira.
    currency?: string;
}

const COLORS = ["#F5A524", "#0F6E56"]

export default function RevenueBySourceChart({data, total, currency}: RevenueBySourceChartProps) {
    return (
        <div className="border border-border rounded-lg p-3 min-[400px]:p-4 h-full min-w-0">
            <h2 className="text-base min-[400px]:text-[18px] font-bold text-foreground mb-4">
             Revenue by source
            </h2>

            <div className="flex flex-col min-[400px]:flex-row items-center pt-6 min-[400px]:pt-10 gap-6 border-t border-border">
                <div className="relative size-32 min-[400px]:size-40 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data}
                            dataKey="percent"
                            nameKey="label"
                            innerRadius="72%"
                            outerRadius="105%"
                            >
                    {data.map((entry, index) => (
                        <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                    ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-lg min-[400px]:text-[24px] font-bold text-foreground font-space">
                          {formatCompactNaira(total, currency)}
                        </p>
                        <p className="text-xs min-[400px]:text-[15px] text-foreground font-space uppercase">
                         Revenue
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {data.map((entry, index) => (
                        <div key={entry.label} className="flex items-center gap-2 text-sm">
                            <span
                            className="size-3.5 shrink-0"
                            style={{
                                backgroundColor: COLORS[index % COLORS.length]
                            }}/>
                            <span className="text-foreground text-xs min-[400px]:text-[16px] font-medium">{entry.label}</span>
                            <span className="font-bold text-foreground ml-auto text-xs min-[400px]:text-sm">
                                {entry.percent}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

import React from "react";
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
import { formatCompactNaira } from "@/lib/utils";
import type { RevenuePeriod, RevenueSeriesPoint } from "@/types/dashboard";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
  period: RevenuePeriod;
}

// Brand green — the same hue StatsCards uses for positive trends and the
// "Live" status pill. A single-series chart needs no categorical
// validation (there's nothing to confuse it with), so the app's own
// brand color is used directly. Referenced via CSS var (see --chart-line
// in index.css) so it swaps to a lighter step in dark mode — a dark green
// fill at 10% opacity is invisible against the dark card surface otherwise.
const LINE_COLOR = "var(--chart-line)";

const PERIODS: { value: RevenuePeriod; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "1m", label: "This month" },
];

function formatLabel(label: string, period: RevenuePeriod): string {
  if (period === "1m") return label; // "W1", "W2", ...
  const d = new Date(label);
  if (Number.isNaN(d.getTime())) return label;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function CustomTooltip({ active, payload, label, period }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const amount = Number(payload[0]?.value ?? 0);
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-muted-foreground">{formatLabel(String(label), period)}</p>
      <p className="text-sm font-bold text-foreground">{formatCompactNaira(amount)}</p>
    </div>
  );
}

interface RevenueChartProps {
  data: RevenueSeriesPoint[];
  period: RevenuePeriod;
  onPeriodChange: (period: RevenuePeriod) => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, period, onPeriodChange }) => {
  const hasData = data.length > 0 && data.some((d) => d.amount > 0);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-grotesk font-semibold text-foreground">Revenue</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your earnings over time</p>
        </div>
        <div className="flex items-center gap-1 bg-muted border border-border rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onPeriodChange(p.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                period === p.value
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={period === p.value}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
          No revenue yet for this period.
        </div>
      ) : (
        <div className="h-[260px] mt-4" role="img" aria-label="Area chart of revenue over time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                {/* Area fill at ~10% opacity, fading to nothing — a wash
                    under the line, never a saturated block. */}
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickFormatter={(v) => formatLabel(v, period)}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(v) => formatCompactNaira(v)}
                width={56}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={(props) => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload as unknown as CustomTooltipProps["payload"]}
                    label={props.label}
                    period={period}
                  />
                )}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={LINE_COLOR}
                strokeWidth={2}
                fill="url(#revenueFill)"
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
        </div>
      )}
    </div>
  );
};

export default RevenueChart;

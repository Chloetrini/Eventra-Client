import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
// brand color is used directly.
const BAR_COLOR = "#0F6E56";

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
    <div className="rounded-lg border border-[#E8E6E0] bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-gray-500">{formatLabel(String(label), period)}</p>
      <p className="text-sm font-bold text-gray-900">{formatCompactNaira(amount)}</p>
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
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Revenue</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your earnings over time</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onPeriodChange(p.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                period === p.value
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-pressed={period === p.value}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-gray-500">
          No revenue yet for this period.
        </div>
      ) : (
        <div className="h-[260px] mt-4" role="img" aria-label="Bar chart of revenue over time">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#F0EFEC" />
              <XAxis
                dataKey="label"
                tickFormatter={(v) => formatLabel(v, period)}
                tickLine={false}
                axisLine={{ stroke: "#E8E6E0" }}
                tick={{ fill: "#6E6577", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6E6577", fontSize: 11 }}
                tickFormatter={(v) => formatCompactNaira(v)}
                width={56}
              />
              <Tooltip
                cursor={{ fill: "#0F6E56", fillOpacity: 0.06 }}
                content={(props) => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload as unknown as CustomTooltipProps["payload"]}
                    label={props.label}
                    period={period}
                  />
                )}
              />
              <Bar dataKey="amount" fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;

import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TicketsByTypeSlice } from "@/types/dashboard";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TicketsByTypeSlice }>;
}

// Validated categorical order (dataviz skill default palette) — fixed
// slot order, never cycled per-render. Passes CVD/contrast checks for
// adjacent bar pairs in both light and dark; the two lowest-contrast
// slots (aqua, yellow) get their "relief": every bar already carries a
// visible text label, so identity never depends on the fill color alone.
const CATEGORICAL_PALETTE = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];

const MAX_SLOTS = CATEGORICAL_PALETTE.length;

function toChartRows(data: TicketsByTypeSlice[]) {
  if (data.length <= MAX_SLOTS) {
    return data.map((d, i) => ({ ...d, color: CATEGORICAL_PALETTE[i] }));
  }
  // Fold anything past the validated slot count into "Other" rather than
  // generating a 9th hue.
  const head = data.slice(0, MAX_SLOTS - 1);
  const tail = data.slice(MAX_SLOTS - 1);
  const other = {
    name: "Other",
    count: tail.reduce((sum, d) => sum + d.count, 0),
    percentage: tail.reduce((sum, d) => sum + d.percentage, 0),
  };
  return [...head, other].map((d, i) => ({ ...d, color: CATEGORICAL_PALETTE[i] }));
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-muted-foreground">{row.name}</p>
      <p className="text-sm font-bold text-foreground">
        {row.count.toLocaleString()} tickets · {row.percentage}%
      </p>
    </div>
  );
}

interface TicketsByTypeChartProps {
  data: TicketsByTypeSlice[];
}

const TicketsByTypeChart: React.FC<TicketsByTypeChartProps> = ({ data }) => {
  const rows = toChartRows(data);
  const hasData = rows.length > 0;
  // Taller list of ticket types gets more vertical room; short lists stay compact.
  const chartHeight = Math.max(rows.length * 44, 120);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-1">
        <h3 className="text-base font-semibold text-foreground">Tickets by type</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Paid ticket tiers, by volume</p>
      </div>

      {!hasData ? (
        <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">
          No paid ticket sales yet.
        </div>
      ) : (
        <>
          <div style={{ height: chartHeight }} className="mt-4" role="img" aria-label="Horizontal bar chart of tickets sold by ticket type">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rows}
                layout="vertical"
                barCategoryGap="24%"
                margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={96}
                  tick={{ fill: "#1A1523", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip cursor={{ fill: "#1A1523", fillOpacity: 0.04 }} content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {rows.map((row) => (
                    <Cell key={row.name} fill={row.color} />
                  ))}
                  <LabelList
                    dataKey="percentage"
                    position="right"
                    formatter={(value: React.ReactNode) => `${value}%`}
                    className="fill-foreground text-xs font-semibold"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend — always present for 2+ series, so identity never relies on color alone. */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-border">
            {rows.map((row) => (
              <div key={row.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="inline-block size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                {row.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TicketsByTypeChart;

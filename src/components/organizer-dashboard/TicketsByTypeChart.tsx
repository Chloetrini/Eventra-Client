import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TicketsByTypeSlice } from "@/types/dashboard";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TicketsByTypeSlice }>;
}

// Brand-matched categorical order (green/amber/indigo/rose/blue), validated
// separately for light and dark via the dataviz skill's validate_palette.js
// (lightness band, chroma floor, CVD separation, contrast all pass in both
// modes — see the --chart-cat-* custom properties in index.css). Referenced
// as CSS vars so each slot repaints correctly across the light/dark toggle;
// fixed slot order, never cycled per-render. Every slice also carries a
// visible legend label, so identity never depends on fill color alone.
const CATEGORICAL_PALETTE = [
  "var(--chart-cat-1)", // green
  "var(--chart-cat-2)", // amber
  "var(--chart-cat-3)", // indigo
  "var(--chart-cat-4)", // rose
  "var(--chart-cat-5)", // blue
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
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-1">
        <h3 className="text-base font-grotesk font-semibold text-foreground">Tickets by type</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Paid ticket tiers, by volume</p>
      </div>

      {!hasData ? (
        <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">
          No paid ticket sales yet.
        </div>
      ) : (
        <>
          <div className="relative h-[220px] mt-4" role="img" aria-label="Donut chart of tickets sold by ticket type">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rows}
                  dataKey="count"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  // 2px surface-color gap between touching segments,
                  // instead of a stroke around each one.
                  stroke="var(--card)"
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {rows.map((row) => (
                    <Cell key={row.name} fill={row.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center total — the hero number this chart leads with. */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-foreground font-grotesk">{total.toLocaleString()}</p>
              <p className="text-[11px] font-medium tracking-wider text-muted-foreground">TICKETS</p>
            </div>
          </div>

          {/* Legend — always present for 2+ series, so identity never relies on color alone. */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-border">
            {rows.map((row) => (
              <div key={row.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="inline-block size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                {row.name} · {row.percentage}%
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TicketsByTypeChart;

import { cn } from "@/lib/utils";
import type { RevenueRange } from "@/types/overview";

const RANGES: { value: RevenueRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "12m", label: "12M" },
];

interface RevenueRangeToggleProps {
  value: RevenueRange;
  onChange: (range: RevenueRange) => void;
}

export default function RevenueRangeToggle({ value, onChange }: RevenueRangeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
      {RANGES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          aria-pressed={value === r.value}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            value === r.value
              ? "border border-border bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
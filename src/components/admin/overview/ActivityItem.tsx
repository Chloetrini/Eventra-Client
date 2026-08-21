import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/lib/icon-map";
import type { ActivityEntry, ActivityTone } from "@/types/overview";

const TONE_STYLES: Record<ActivityTone, string> = {
  success: "bg-emerald-500/10 text-emerald-500",
  info: "bg-blue-500/10 text-blue-500",
  warning: "bg-amber-500/10 text-amber-500",
  danger: "bg-destructive/10 text-destructive",
};

export default function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const Icon = ICON_MAP[entry.icon];

  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          TONE_STYLES[entry.tone]
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-foreground">
          {entry.segments.map((segment, i) => (
            <span key={i} className={cn(segment.bold && "font-semibold")}>
              {segment.text}
            </span>
          ))}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{entry.timestamp}</p>
      </div>
    </div>
  );
}
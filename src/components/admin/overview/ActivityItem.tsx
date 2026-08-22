import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/lib/icon-map";
import type { ActivityEntry, ActivityTone } from "@/types/overview";

const TONE_STYLES: Record<ActivityTone, string> = {
  success: "bg-emerald-500/10 text-emerald-500",
  info: "bg-blue-500/10 text-blue-500",
  warning: "bg-amber-500/10 text-amber-500",
  danger: "bg-destructive/10 text-destructive", // Uses global destructive var
};

export default function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const Icon = ICON_MAP[entry.icon];

  return (
    <div className="flex items-start gap-4">
      {/* Rounded icon container matching Figma */}
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          TONE_STYLES[entry.tone]
        )}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        {/* Main Text - Uses global foreground color to switch themes */}
        <p className="font-geist text-[13px] font-normal text-foreground leading-4.5 tracking-normal">
          {entry.segments.map((segment, i) => (
            <span key={i} className={cn(segment.bold && "font-bold tracking-[-2.5%]")}>
              {segment.text}
            </span>
          ))}
        </p>

        {/* Timestamp - Uses global muted color */}
        <p className="mt-1 font-geist text-[11px] font-normal text-muted-foreground tracking-normal">
          {entry.timestamp}
        </p>
      </div>
    </div>
  );
}
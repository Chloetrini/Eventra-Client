import { Link } from "react-router";
import { Heart, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event-types";
import { formatNaira } from "@/lib/utils"

type EventCardProps = {
  event: Event;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  className?: string;
};

export function EventCard({
  event,
  isSaved = false,
  onToggleSave,
  className,
}: EventCardProps) {
  const date = new Date(event.createdAt);
  const dateLabel = date.toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md w-full md:max-w-[294px] max-h-[398px]",
        className
      )}
    >
      <div className="relative overflow-hidden max-h-[189px]">
        <img
          src={event.coverImage}
          alt={event.title}
          loading="lazy"
          className="aspect-[294/189] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="flex items-center justify-center " >
          <p className="absolute left-3 top-6 text-[12px] font-[700]  text-white font-mono drop-shadow tracking-wider">No {event.no}</p>
           {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(event.id)}
            aria-label={isSaved ? "Remove from saved" : "Save event"}
            aria-pressed={isSaved}
            className={cn(
              "absolute right-3 top-3 grid h-[37px] w-[37px] place-items-center rounded-full backdrop-blur transition",
              isSaved
                ? "bg-[#F5A524] hover:bg-[#F5A524]"
                : "bg-[#6E6577] hover:[#6E6577]"
            )}
          >
            <Heart
              className={cn(
                "h-[10.49px] w-[12.33px]",
                isSaved ? "fill-[#7A4E02] text-[#7A4E02]" : "fill-none text-white"
              )}
            />
          </button>
        )}
        </div>
        
      </div>

      <div className="space-y-1 p-4 max-h-[209px]">
        <p className="text-[13px] font-[400] uppercase tracking-wide  text-[#0A4F41] font-space">
          {event.category === "Parties" ? "Party" : event.category === "Concerts" ? "Concert" : event.category}
          {event.subcategory && ` · ${event.subcategory}`}
        </p>

        <h3 className="font-[700] leading-snug font-grotesk md:text-[20px] text-[19px]">{event.title}</h3>

        <p className="text-[14px] text-muted-foreground text-[#6E6577] font-[500] font-sans ">
          {dateLabel} · {event.venue}, {event.city}
        </p>

        <div className="flex items-center justify-between pt-8 pb-2">
          <span className="font-[16px] font-mono text-[#4A4451] font-[700]">{event.minPrice === 0 ? "Free" : formatNaira(event.minPrice)} </span>
          <Link
            to={`/events/${event.id}`}
            aria-label={`View ${event.title}`}
            className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#E4F1EB] text-[#0A4F41] transition hover:bg-emerald-100"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
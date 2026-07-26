import { Link } from "react-router";
import { Heart, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/schema";

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
  const date = new Date(event.startsAt);
  const dateLabel = date.toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const priceLabel =
    event.price === 0 ? "Free" : `₦${event.price.toLocaleString("en-NG")}`;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(event.id)}
            aria-label={isSaved ? "Remove from saved" : "Save event"}
            aria-pressed={isSaved}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isSaved ? "fill-orange-500 text-orange-500" : "text-gray-700"
              )}
            />
          </button>
        )}
      </div>

      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {event.category}
          {event.subcategory && ` · ${event.subcategory}`}
        </p>

        <h3 className="font-semibold leading-snug">{event.title}</h3>

        <p className="text-sm text-muted-foreground">
          {dateLabel} · {event.venue}, {event.city}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold">{priceLabel}</span>
          <Link
            to={`/events/${event.id}`}
            aria-label={`View ${event.title}`}
            className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
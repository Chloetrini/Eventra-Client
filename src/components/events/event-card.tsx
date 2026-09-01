import { Link, useNavigate } from "react-router";
import { Heart, ArrowUpRight, Star } from "lucide-react";
import { cn, shortEventNo } from "@/lib/utils";
import type { Event } from "@/types/event-types";
import { formatNaira } from "@/lib/utils"
import { useAuthGate } from "@/context/auth.gate";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type EventCardProps = {
  event: Event;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  className?: string;
  variant?: "explore" | "home";
};

export function EventCard({
  event,
  isSaved = false,
  onToggleSave,
  className,
  variant = "explore",
}: EventCardProps) {
  const date = new Date(event.startDate);
  const dateLabel = date.toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const eventNo = shortEventNo(event);
  const isHome = variant === "home";
  const { requireAuth } = useAuthGate();
  const navigate = useNavigate();
  // Whole card navigates to the event now, not just the small arrow
  // button. This first tried a "stretched link" — an absolutely
  // positioned <Link> laid under everything else — but that only catches
  // a click if it's literally the topmost element at that pixel, and the
  // image wrapper below (`position: relative`, no z-index of its own)
  // painted above it by DOM order regardless, silently swallowing clicks
  // on the image/badges with nothing to bubble to (a sibling <Link> never
  // sees a click that landed on a DIFFERENT sibling, only a genuine
  // ancestor does). Putting the handler directly on the card and letting
  // the click bubble up to it — the normal way React event handling
  // works — doesn't depend on stacking order at all. The heart button and
  // the arrow link both stop propagation so clicking THEM doesn't also
  // trigger this.
  const goToEvent = () => navigate(`/events/${event.slug}`);
  return (
    <article
      onClick={goToEvent}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToEvent();
        }
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md w-full  min-h-[398px] cursor-pointer",
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

        {isHome ? (
          <>
            {/* HOME variant: Featured badge top-left, number top-right, no heart */}
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-[15px] bg-[#F5A524] px-3 py-1 text-[13px] font-[500] text-[#7A4E02] font-sans">
              <Star className="h-3 w-3 fill-[#7A4E02] text-[#7A4E02]" />
              Featured
            </span>
            <p className="absolute right-3 top-4 text-[12px] font-[700] text-white font-mono drop-shadow tracking-wider">
              {eventNo}
            </p>
          </>
        ) : (
          <>
            {/* EXPLORE variant: Featured badge (promoted only) top-left,
                number top-left below it — except promoted cards don't show
                the number at all, since "No 0421" next to a Featured badge
                read as clutter/noise on a card that's already flagged as
                featured. Heart stays top-right either way. */}
            {event.isPromoted && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-[15px] bg-[#F5A524] px-3 py-1 text-[13px] font-[500] text-[#7A4E02] font-sans">
                <Star className="h-3 w-3 fill-[#7A4E02] text-[#7A4E02]" />
                Featured
              </span>
            )}
            {!event.isPromoted && (
              <p className="absolute left-3 top-6 text-[12px] font-[700] text-white font-mono drop-shadow tracking-wider">
                No {eventNo}
              </p>
            )}
            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  // Don't also trigger the card's own onClick (navigate)
                  e.stopPropagation();
                  if (!requireAuth("save-event")) return;
                  onToggleSave(event.slug);
                }}
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
          </>
        )}
      </div>

      <div className="flex flex-col space-y-1 p-4 max-h-[209px] h-full">
        <p className="text-[13px] font-[400] uppercase tracking-wide text-[#0A4F41] dark:text-[#4ADE80] font-space">
          {event.category === "Parties" ? "Party" : event.category === "Concerts" ? "Concert" : event.category}
          {event.subcategory && ` · ${event.subcategory}`}
        </p>

        <Tooltip>
          <TooltipTrigger
            render={
              <h3 className="text-left font-[700] leading-snug font-grotesk md:text-[20px] text-[19px] line-clamp-2 min-h-[2lh] text-foreground" />
            }
          >
            {event.title}
          </TooltipTrigger>
          <TooltipContent>{event.title}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <p className="text-left text-[14px] text-muted-foreground font-[500] font-sans line-clamp-1" />
            }
          >
            {dateLabel} · {event.venue.name}, {event.venue.city}
          </TooltipTrigger>
          <TooltipContent>
            {dateLabel} · {event.venue.name}, {event.venue.city}
          </TooltipContent>
        </Tooltip>

        <div className="mt-auto flex items-center justify-between pt-8 pb-2">
          <span className="font-[16px] font-mono text-foreground font-[700]">{event.minPrice === 0 ? "Free" : formatNaira(event.minPrice, event.currency)} </span>
          <Link
            to={`/events/${event.slug}`}
            aria-label={`View ${event.title}`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#E4F1EB] text-[#0A4F41] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80] transition hover:bg-emerald-100 dark:hover:bg-[#0F6E56]/25"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

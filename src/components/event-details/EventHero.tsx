import { type Event } from "@/types/event-types"
import { Heart, MapPin, Calendar } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { cn, formatDate, formatTime } from "@/lib/utils"
import { useAuthGate } from "@/context/auth.gate";
import { ShareButton } from "@/components/ui/share-button";
type EventHeroProps = {
  event: Event;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  className?: string;
};
export const EventHero = ({ event,
  isSaved = false,
  onToggleSave,
  className, }: EventHeroProps) => {

  const { requireAuth } = useAuthGate();
  return (
    <div className={cn("relative rounded-2xl", className)}>
      <img className="rounded-2xl h-74 md:h-131.75 w-full object-cover object-center" src={event.coverImage ?? undefined} alt={event.title} />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/40 to-transparent rounded-2xl"></div>
      <div className="absolute md:left-10 left-3 md:right-10 right-3 md:top-5 top-3 flex justify-between">
        {event.isPromoted && (
          <Badge className="md:p-4 p-2 bg-[#F5A524] text-[#3A3A3A] hover:bg-[#F5A524] h-7.5 md:w-30 w-28 px-4">★ Featured concert</Badge>
        )}
        <div className="flex gap-2 ml-auto">
          {onToggleSave && (
            <button
              type="button"
              onClick={() => {
                requireAuth("save-event");
                onToggleSave(event.slug);
              }}
              aria-label={isSaved ? "Remove from saved" : "Save event"}
              aria-pressed={isSaved}
              className={cn(
                "flex h-8 w-8 md:h-12 md:w-12 items-center justify-center border rounded-md bg-transparent transition hover:bg-white/30",
                isSaved
                  ? "bg-[#F5A524] hover:bg-[#F5A524]"
                  : "bg-[#6E6577] hover:[#6E6577]"
              )}
            >
              <Heart
                className={cn(
                  "md:h-8 md:w-8 w-5 h-5 text-white",
                  isSaved ? "fill-[#7A4E02] text-[#7A4E02]" : "fill-none text-white"
                )}
              />
            </button>
          )}
          {/* Was a MoveUpRight arrow button with no onClick at all — looked
              like a share button but did nothing. This is that button,
              actually wired up. */}
          <ShareButton
            title={event.title}
            url={typeof window !== "undefined" ? `${window.location.origin}/events/${event.slug}` : `/events/${event.slug}`}
          />
        </div>
      </div>

      <div className="absolute md:bottom-15 md:left-10 md:p-4 bottom-8 left-5">
        <h1 className="text-3xl font-bold text-white md:text-6xl">{event.title}</h1>
        <div className="pt-2 flex flex-wrap items-center gap-3 text-[13px] text-white/80">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(event.startDate)} · {formatTime(event.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.venue.name}, {event.venue.city}
          </span>
          {event.musicType && (
            <span className="flex items-center gap-1">🎵 {event.musicType}</span>
          )}
        </div>
      </div>
    </div>
  )
}

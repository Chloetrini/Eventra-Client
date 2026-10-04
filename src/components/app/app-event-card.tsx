import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router";
import { useAuthGate } from "@/context/auth-gate";
import { cn, formatPrice } from "@/lib/utils";
import type { Event } from "@/types/event-types";

type Props = {
  event: Event;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
  /** "feature" is the tall poster card used in the carousel. */
  variant?: "list" | "feature";
};

function DateBadge({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <div className="flex w-12 flex-col items-center rounded-xl bg-white py-1.5 shadow-sm dark:bg-[#111A16]">
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#0F6E56] dark:text-[#3CCB9C]">
        {d.toLocaleDateString("en-GB", { month: "short" })}
      </span>
      <span className="text-lg font-bold leading-5 text-[#0B1F1A] dark:text-[#EEF5F2]">{d.getDate()}</span>
    </div>
  );
}

function SaveButton({ event, isSaved, onToggleSave }: Pick<Props, "event" | "isSaved" | "onToggleSave">) {
  const { requireAuth } = useAuthGate();
  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove from saved" : "Save event"}
      aria-pressed={isSaved}
      onClick={(e) => {
        e.preventDefault();
        if (!requireAuth("save-event")) return;
        onToggleSave(event.slug);
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 backdrop-blur active:scale-90"
    >
      <Heart className={cn("h-[18px] w-[18px] text-white", isSaved && "fill-[#F43F5E] text-[#F43F5E]")} />
    </button>
  );
}

export function AppEventCard({ event, isSaved, onToggleSave, variant = "list" }: Props) {
  const price = event.type === "free" || event.minPrice === 0 ? "Free" : `From ${formatPrice(event.minPrice, event.currency)}`;
  const where = event.venue ? [event.venue.name, event.venue.city].filter(Boolean).join(", ") : "Venue to be announced";

  if (variant === "feature") {
    return (
      <Link to={`/events/${event.slug}`} className="relative block h-[350px] w-[270px] shrink-0 snap-start overflow-hidden rounded-[28px] bg-[#14532D] active:scale-[0.99]">
        {event.coverImage ? <img src={event.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /> : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/25 to-black/85" />
        <div className="absolute left-3 top-3"><DateBadge iso={event.startDate} /></div>
        <div className="absolute right-3 top-3"><SaveButton event={event} isSaved={isSaved} onToggleSave={onToggleSave} /></div>
        <div className="absolute inset-x-4 bottom-4 space-y-1.5">
          <h3 className="line-clamp-2 text-2xl font-bold leading-7 tracking-tight text-white">{event.title}</h3>
          <p className="flex items-center gap-1 text-[13px] text-white/85"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{where}</span></p>
          <p className="text-[13px] font-semibold text-[#FCD34D]">{price}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/events/${event.slug}`} className="block overflow-hidden rounded-[20px] border border-[#E2E9E6] bg-white shadow-[0_8px_18px_rgba(11,31,26,0.07)] active:scale-[0.99] dark:border-[#22302A] dark:bg-[#111A16] dark:shadow-none">
      <div className="relative h-[190px] bg-[#E3F2EC] dark:bg-[#12332A]">
        {event.coverImage ? <img src={event.coverImage} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
        <div className="absolute left-3 top-3"><DateBadge iso={event.startDate} /></div>
        <div className="absolute right-3 top-3"><SaveButton event={event} isSaved={isSaved} onToggleSave={onToggleSave} /></div>
      </div>
      <div className="space-y-1.5 p-3.5">
        <h3 className="line-clamp-2 text-[17px] font-bold leading-6 text-[#0B1F1A] dark:text-[#EEF5F2]">{event.title}</h3>
        <p className="flex items-center gap-1 text-[13px] text-[#5F7068] dark:text-[#9BAAA3]"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{where}</span></p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[13px] text-[#5F7068] dark:text-[#9BAAA3]">
            {new Date(event.startDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className={cn("rounded-full px-3 py-1 text-[13px] font-semibold", price === "Free" ? "bg-[#E3F2EC] text-[#0F6E56] dark:bg-[#12332A] dark:text-[#3CCB9C]" : "bg-[#FEF3DC] text-[#B45309] dark:bg-[#3A2E0E] dark:text-[#FBBF24]")}>{price}</span>
        </div>
      </div>
    </Link>
  );
}

export function AppEventCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-[190px] rounded-[20px] bg-[#EEF3F1] dark:bg-[#1A2621]" />
      <div className="h-4 w-2/3 rounded bg-[#EEF3F1] dark:bg-[#1A2621]" />
      <div className="h-3 w-1/3 rounded bg-[#EEF3F1] dark:bg-[#1A2621]" />
    </div>
  );
}

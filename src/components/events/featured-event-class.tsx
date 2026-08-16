import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event-types";
import { formatNaira } from "@/services/utils";
type FeaturedEventCardProps = {
  event: Event;
  onGetTickets?: (id: string) => void;
};

export function FeaturedEventCard({ event, onGetTickets }: FeaturedEventCardProps) {
  const date = new Date(event.startDate);
  const dateLabel = date.toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <article className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-orange-200 dark:border-orange-900/40 gap-6 md:gap-[35px] w-full  md:h-[231px]">
      <div className="relative aspect-[4/3] md:aspect-auto w-full md:w-[314px] md:shrink-0">
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 flex items-center gap-1 rounded-[15px] bg-[#F5A524] px-3 py-1 text-[13px] w-[96px] h-[32px] font-[500] text-[#7A4E02] font-sans">
          <Star className="h-3 w-3 fill-[#7A4E02] text-[#7A4E02]" />
          Featured
        </span>
      </div>

      <div className="flex flex-col gap-3 px-5  pb-2 md:pb-8 md:px-0 md:py-8">
        <p className="text-[13px] md:text-[12px] font-[400] uppercase tracking-widest text-[#0F6E56] dark:text-[#4ADE80] flex items-center gap-2 ">
          {event.category}
          {event.subcategory && ` · ${event.subcategory}`}
        </p>

        <h2 className="text-[26px] md:text-[22px] md:text-[28px] font-[700] font-grotesk tracking-tight text-foreground">{event.title}</h2>

        <p className="text-[14px] font-[500] text-muted-foreground ">
          {dateLabel} · {event.venue.name}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-[24px]">
          <span className="md:text-[20px] text-[18px] font-[700] font-mono text-foreground">{event.minPrice === 0 ? "Free" : formatNaira(event.minPrice)}</span>
          <Button
            onClick={() => onGetTickets?.(event.slug)}
            className="bg-[#0F6E56] hover:bg-emerald-800 w-[122px] h-[42px] font-[700] text-[15px]"
          >
            Get tickets
          </Button>
        </div>
      </div>
    </article>
  );
}
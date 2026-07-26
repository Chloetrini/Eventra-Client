import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/schema";

type FeaturedEventCardProps = {
  event: Event;
  onGetTickets?: (id: string) => void;
};

export function FeaturedEventCard({ event, onGetTickets }: FeaturedEventCardProps) {
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
    <article className="flex overflow-hidden rounded-2xl border border-orange-200 gap-[35px] h-[231px]">
      <div className="relative aspect-[4/3] md:aspect-auto w-[314px]">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#F5A524] px-3 py-1 text-xs font-semibold text-[#7A4E02]">
          <Star className="h-3 w-3 fill-[#7A4E02] text-[#7A4E02]" />
          Featured
        </span>
      </div>

     
      <div className="flex flex-col gap-3 py-8">
        <p className="text-xs font-[400] uppercase tracking-widest text-[#0F6E56] flex items-center gap-2 ">
          {event.category}
          {event.subcategory && ` · ${event.subcategory}`}
        </p>

        <h2 className="text-2xl font-[700] font-grotesk tracking-tight">{event.title}</h2>

        <p className="text-sm text-muted-foreground">
          {dateLabel} · {event.venue}
        </p>

        <div className="mt-2 flex items-center gap-4">
          <span className="text-lg font-bold">{priceLabel}</span>
          <Button
            onClick={() => onGetTickets?.(event.id)}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            Get tickets
          </Button>
        </div>
      </div>
    </article>
  );
}
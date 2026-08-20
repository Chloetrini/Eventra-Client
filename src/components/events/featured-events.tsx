import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { EventCard } from "@/components/events/event-card";
import type { Event } from "@/types/event-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedEventsProps {
  events: Event[];
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  events,
}) => {
  return (
    <section className="mt-7">
      <div className="flex items-end justify-between mb-3.5">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
            <span className="text-xs uppercase text-[#0F6E56] tracking-tight font-geist dark:text-[#84f8db]">
              HANDPICKED
            </span>
          </div>
          <h2 className="font-geist font-bold text-2xl tracking-[-2%] text-[#1A1523] dark:text-white md:text-[34px]">
            Featured this week
          </h2>
        </div>

        <Link to="/explore" className="flex flex-row items-center gap-1 hover:bg-[#0F6E56]/10 rounded-2xl px-2.5 py-1.25 transition-colors duration-300 cursor-pointer">
          <h5 className="font-geist font-regular text-[#0F6E56] dark:text-[#84f8db]">View All</h5>
          <span><ArrowRight className="w-4 h-4" /></span>
        </Link>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden -mx-4 sm:-mx-6">
        <div className="flex gap-3.5 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide">
          {events.map((event) => (
            <div key={event.slug} className="shrink-0 w-73.5">
              <EventCard
                event={event}
                variant="home"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: carousel */}
      <div className="hidden md:block">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {events.map((event) => (
              <CarouselItem
                key={event.slug}
                className="basis-1/2 lg:basis-1/4"
              >
                <EventCard
                  event={event}
                  variant="home"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
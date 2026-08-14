import React, { useState, useEffect } from "react";
import { UI_ASSETS } from "@/lib/assets";
import { Format } from "@/lib/utils";
import { Link } from "react-router";
import type { Event } from "@/types/event-types";

interface StackedCardCarouselProps {
  events: Event[];
}

export const StackedCardCarousel: React.FC<StackedCardCarouselProps> = ({
  events,
}) => {
  const DISPLAY_EVENTS = events.slice(0, 3);

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (DISPLAY_EVENTS.length === 0) return;
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % DISPLAY_EVENTS.length);
        setAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [DISPLAY_EVENTS.length]);

  if (DISPLAY_EVENTS.length === 0) return null;

  return (
    <div className="relative w-full h-95">
      {DISPLAY_EVENTS.map((event, idx) => {
        const position =
          (idx - activeIndex + DISPLAY_EVENTS.length) % DISPLAY_EVENTS.length;
        // position 0 = front, 1 = middle, 2 = back
        const isFront = position === 0;
        const isMiddle = position === 1;
        const isBack = position === 2;
        return (
          <div
            key={event.slug}
            className="absolute w-full bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out"
            style={{
              top: isBack ? "16px" : isMiddle ? "8px" : "0px",
              right: isBack ? "-12px" : isMiddle ? "-6px" : "0px",
              zIndex: isFront ? 30 : isMiddle ? 20 : 10,
              transform: isFront && animating ? "translateX(-20px)" : "none",
              opacity: isFront && animating ? 0 : 1,
              scale: isBack ? "0.94" : isMiddle ? "0.97" : "1",
            }}
          >
            <div className="relative h-45 overflow-hidden">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#F5A524] text-black text-[12px] font-medium font-geist px-3 py-1 rounded-full flex items-center gap-1">
                <img className="h-3 w-3" src={UI_ASSETS.star} alt="star" />
                Featured
              </span>
              <span className="absolute top-3 right-3 text-white font-bold text-[12px] font-space tracking-widest">
                № {String(DISPLAY_EVENTS.indexOf(event) + 1).padStart(4, "0")}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs text-[#0F6E56] font-geist uppercase tracking-widest font-medium">
                {event.category}
              </span>
              <h3 className="text-xl font-bold text-[#1A1523] font-grotesk mt-0.5">
                {event.title}
              </h3>
              <p className="text-sm text-[#4A4451] font-geist mt-1">
                {new Date(event.startDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}{" "}
                · {event.venue.name}
              </p>
              <div className="mt-4 pt-3 border-t border-[#E8E6E0] flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold font-space text-[#1A1523]">
                    {event.minPrice === 0 ? "Free" : Format.amount(event.minPrice)}
                  </span>
                  <span className="text-xs text-[#4A4451] block font-geist">
                    from Regular
                  </span>
                </div>
                <Link to={`/events/${event.slug}`} className="px-4 py-2 bg-[#0F6E56] hover:bg-[#0A4F41] text-white font-bold text-sm rounded-lg transition-colors font-geist">
                  Get tickets
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
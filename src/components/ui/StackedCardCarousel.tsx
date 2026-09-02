import React, { useState, useEffect, useMemo, useCallback } from "react";
import { UI_ASSETS } from "@/lib/assets";
import { Format, shortEventNo } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import type { Event } from "@/types/event-types";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

interface StackedCardCarouselProps {
  events: Event[];
}

export const StackedCardCarousel: React.FC<StackedCardCarouselProps> = ({
  events,
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Memoize DISPLAY_EVENTS to preserve array identity across renders
  const DISPLAY_EVENTS = useMemo(() => events.slice(0, 3), [events]);
  const total = DISPLAY_EVENTS.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Infinite timer loop setup
  useEffect(() => {
    if (total <= 1 || isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [total, isHovered, handleNext]);

  if (total === 0) return null;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40 || info.offset.x > 40) {
      handleNext();
    }
  };

  // Compute card positions safely based on current activeIndex
  const frontEvent = DISPLAY_EVENTS[activeIndex % total];
  const middleEvent = total > 1 ? DISPLAY_EVENTS[(activeIndex + 1) % total] : null;
  const backEvent = total > 2 ? DISPLAY_EVENTS[(activeIndex + 2) % total] : null;

  return (
    <div
      className="relative w-full h-[380px] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Back Card */}
      {backEvent && (
        <div
          key={`back-${backEvent.slug}`}
          className="absolute w-full bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-md pointer-events-none transition-all duration-500 ease-out"
          style={{
            top: "16px",
            right: "-12px",
            zIndex: 10,
            transform: "scale(0.94)",
            transformOrigin: "top center",
            opacity: 0.75,
          }}
        >
          <CardContent event={backEvent} />
        </div>
      )}

      {/* Middle Card */}
      {middleEvent && (
        <div
          key={`middle-${middleEvent.slug}`}
          className="absolute w-full bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-lg pointer-events-none transition-all duration-500 ease-out"
          style={{
            top: "8px",
            right: "-6px",
            zIndex: 20,
            transform: "scale(0.97)",
            transformOrigin: "top center",
            opacity: 0.9,
          }}
        >
          <CardContent event={middleEvent} />
        </div>
      )}

      {/* Front Active Card (Slide Transition) */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={frontEvent.slug}
          onClick={() => navigate(`/events/${frontEvent.slug}`)}
          role="button"
          tabIndex={0}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/events/${frontEvent.slug}`);
            }
          }}
          className="absolute w-full bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
          style={{ zIndex: 30, top: 0, right: 0 }}
          initial={{ x: "100%", opacity: 0, scale: 0.96 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: "-100%", opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        >
          <CardContent event={frontEvent} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const CardContent: React.FC<{ event: Event }> = ({ event }) => (
  <>
    <div className="relative h-44 overflow-hidden">
      <img
        src={event.coverImage}
        alt={event.title}
        className="w-full h-full object-cover pointer-events-none"
      />
      <span className="absolute top-3 left-3 bg-[#F5A524] text-black text-[12px] font-medium font-geist px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
        <img className="h-3 w-3" src={UI_ASSETS.star} alt="star" />
        Featured
      </span>
      <span className="absolute top-3 right-3 text-white font-bold text-[12px] font-space tracking-widest drop-shadow-md">
        № {shortEventNo(event)}
      </span>
    </div>

    <div className="p-4 flex flex-col justify-between">
      <div>
        <span className="text-xs text-[#0F6E56] dark:text-[#4ADE80] font-geist uppercase tracking-widest font-bold">
          {event.category}
        </span>
        <h3 className="text-xl font-bold text-foreground font-grotesk mt-0.5 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground font-geist mt-1 truncate">
          {new Date(event.startDate).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}{" "}
          · {event.venue.name}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
        <div>
          <span className="text-lg font-bold font-space text-foreground block leading-tight">
            {event.minPrice === 0
              ? "Free"
              : Format.amount(event.minPrice, event.currency)}
          </span>
          <span className="text-xs text-muted-foreground block font-geist">
            from Regular
          </span>
        </div>
        <Link
          to={`/events/${event.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2 bg-[#0F6E56] hover:bg-[#0A4F41] text-white font-bold text-sm rounded-lg transition-colors font-geist shrink-0 pointer-events-auto"
        >
          Get tickets
        </Link>
      </div>
    </div>
  </>
);

export default StackedCardCarousel;
import React from "react";
import { UI_ASSETS } from "@/lib/assets";
import { Link } from "react-router";

export const OrganizersCta: React.FC = () => {
  return (
    <section className="bg-white md:bg-[#E4F1EB] dark:bg-[#0D1F1A] w-full py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-25 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-2">
          <span className="text-xs font-normal uppercase text-[#F5A524] tracking-wider font-geist flex items-center gap-1">
            <span className="w-[11.81px] h-0 border border-[#F5A524] inline-block" />
            FOR ORGANIZERS
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold md:font-extrabold text-[#1A1523] dark:text-white font-geist leading-tight">
            Selling tickets? Do it properly.
          </h2>

          <p className="text-sm sm:text-base text-[#4A4451] dark:text-white/70 font-geist leading-relaxed">
            Publish a polished event in minutes, sell with real payments, check
            guests in at the gate, and get paid — no screenshots, no chasing
            transfers.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1 mx-auto">
            <Link
              to="/organizer"
              className="w-full sm:w-auto px-6 py-3 bg-[#0F6E56] hover:bg-[#0A4F41] text-white font-bold text-sm rounded-xl transition-colors font-geist flex items-center justify-center"
            >
              Start creating events
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-transparent border border-[#E8E6E0] md:border-black dark:border-white/30 text-#3A3A3A dark:text-white font-semibold text-sm rounded-xl hover:bg-[#1A1523]/5 dark:hover:bg-white/10 transition-colors font-geist flex items-center justify-center gap-2"
            >
              See how it works
            </Link>
          </div>

          {/* Fine print */}
          <p className="text-[11px] text-[#4A4451] dark:text-white/50 font-geist pt-1 mt-6.75">
            5% per ticket sold · Free events are free · Payout a few days after
            the event
          </p>
        </div>
        <img
          src={UI_ASSETS.sellingTickets}
          alt="Eventra organizer dashboard"
          className="w-full object-contain drop-shadow-xl dark:drop-shadow-xl-white"
        />
      </div>
    </section>
  );
};
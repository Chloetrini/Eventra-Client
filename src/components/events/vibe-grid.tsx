import React from "react";
import { useCategories } from "@/hooks/use-event";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

// Fallback images for categories, keyed by category name.
// Extend this map as more categories get their own art, or fall back to a generic one.
import { UI_ASSETS } from "@/lib/assets";

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "Music & Concerts": UI_ASSETS.concert,
  "Parties": UI_ASSETS.party,
  "Conference": UI_ASSETS.conference,
  "Comedy": UI_ASSETS.comedy,
  "Sports": UI_ASSETS.sport,
  "Arts & Theatre": UI_ASSETS.arts,
  "Food & Drink": UI_ASSETS.food,
  "Tech & Startups": UI_ASSETS.tech,
};

const FALLBACK_IMAGE = UI_ASSETS.tech; // pick any sensible default

export const VibeGrid: React.FC = () => {
  const { categories, isLoading } = useCategories();

  // Only show categories that actually have events, so the grid doesn't
  // advertise empty categories with 0 events.
  const displayCategories = categories.filter((c) => c.eventCount > 0);

  if (isLoading || displayCategories.length === 0) {
    return null; // or a skeleton, if you want a loading state here
  }

  return (
    <section className="mb-5 md:mb-10">
      <div className="flex flex-row justify-between items-end mb-2 md:mb-8.25 mt-4 lg:mt-6.75">
        <div className="">
          <div className="flex items-center gap-1.25">
            <div className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
            <h6 className="font-geist font-regular tracking-[1%] lg:tracking-[16%] uppercase text-[#0F6E56] text-xs">
              SOMETHING FOR EVERYONE
            </h6>
          </div>
          <h2 className="font-geist font-bold text-2xl tracking-[-2%] text-[#1A1523] md:text-[34px]">
            Browse by vibe
          </h2>
        </div>
        <Link
          to="/explore"
          className="flex flex-row items-center gap-1 hover:bg-[#0F6E56]/10 rounded-2xl px-2.5 py-1.25 transition-colors duration-300 cursor-pointer"
        >
          <h5 className="font-geist font-regular text-[#0F6E56]">
            All Categories
          </h5>
          <span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {/* mobile */}
      <div className="md:hidden -mx-4 sm:-mx-6">
        <div className="flex gap-3.5 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide">
          {displayCategories.map((category) => (
            <Link
            to={`/explore?category=${category.slug}`}
              key={category.slug}
              className="relative flex-none w-[75vw] max-w-75 h-42.5 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${CATEGORY_IMAGE_MAP[category.name] ?? FALLBACK_IMAGE})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1A1523]/90 via-[#1A1523]/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end">
                <h3 className="text-[20px] font-bold text-[#E4F1EB] transition-colors duration-300 font-grotesk">
                  {category.name}
                </h3>
                <span className="text-xs text-[#E4F1EB] font-mono uppercase font-normal">
                  {category.eventCount} {category.eventCount === 1 ? "Event" : "Events"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* desktop */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {displayCategories.map((category) => (
          <Link
            to={`/explore?category=${category.slug}`}
            key={category.slug}
            className="relative h-50 rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${CATEGORY_IMAGE_MAP[category.name] ?? FALLBACK_IMAGE})` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1A1523]/90 via-[#1A1523]/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-[#E4F1EB] transition-colors duration-300 font-grotesk">
                {category.name}
              </h3>
              <span className="text-xs text-[#E4F1EB] font-mono">
                {category.eventCount} {category.eventCount === 1 ? "Event" : "Events"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
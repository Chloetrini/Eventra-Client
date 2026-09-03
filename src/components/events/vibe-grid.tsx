import React from "react";
import { useCategories } from "@/hooks/use-event";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { VibeGridSkeleton } from "@/components/skeletons/vibe-grid-skeleton";
import { UI_ASSETS } from "@/lib/assets";

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  Music: UI_ASSETS.concert,
  Parties: UI_ASSETS.party,
  Conference: UI_ASSETS.conference,
  Comedy: UI_ASSETS.comedy,
  Sports: UI_ASSETS.sport,
  "Arts & Theatre": UI_ASSETS.arts,
  "Food & Drink": UI_ASSETS.food,
  "Tech & Startups": UI_ASSETS.tech,
  Networking: UI_ASSETS.networking,
  Religious: UI_ASSETS.religious,
};

const FALLBACK_IMAGE = UI_ASSETS.tech;

export const VibeGrid: React.FC = () => {
  const { categories, isLoading } = useCategories();

  const displayCategories = categories.filter((c) => c.eventCount > 0);

  if (isLoading) {
    return <VibeGridSkeleton />;
  }

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="mb-5 md:mb-10">
     <div className="items-start sm:items-end mb-2 md:mb-8 mt-4 lg:mt-6">
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-1.5 w-full">
            <div className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block shrink-0" />
            <h6 className="font-geist font-normal text-[12px] tracking-wider uppercase text-[#0F6E56] dark:text-[#4ADE80] w-full">
              SOMETHING FOR EVERYONE 
            </h6>
          </div>
          
          
        </div>
        <div className="flex  items-start justify-between ">
          <h2 className="font-geist font-[700] text-[22x] py-1 tracking-tight text-foreground md:text-[34px]">
            Browse by vibe
          </h2>
           <Link
          to="/explore"
          className="flex flex-row items-center gap-1.5 hover:bg-[#0F6E56]/10 rounded-2xl px-3 py-1.5 transition-colors duration-300 cursor-pointer shrink-0"
        >
          <span className="font-geist font-normal text-[12px] text-[#0F6E56] dark:text-[#4ADE80] md:text-sm">
            All Categories
          </span>
          <ArrowRight className="w-4 h-4 text-[#0F6E56] dark:text-[#4ADE80]" />
        </Link>
        </div>
       
      </div>

      {/* Mobile Horizontal Carousel */}
      <div className="md:hidden -mx-4 sm:-mx-6">
        <div className="flex gap-3.5 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide">
          {displayCategories.map((category) => (
            <Link
              to={`/explore?categories=${category._id}`}
              key={category._id}
              className="relative flex-none w-[75vw] max-w-[300px] h-[170px] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                style={{
                  backgroundImage: `url(${CATEGORY_IMAGE_MAP[category.name] ?? FALLBACK_IMAGE})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1523]/90 via-[#1A1523]/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-[#E4F1EB] font-grotesk">
                  {category.name}
                </h3>
                <span className="text-xs text-[#E4F1EB] font-mono uppercase">
                  {category.eventCount} {category.eventCount === 1 ? "Event" : "Events"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Responsive Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCategories.map((category) => (
          <Link
            to={`/explore?categories=${category._id}`}
            key={category._id}
            className="relative h-[200px] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
              style={{
                backgroundImage: `url(${CATEGORY_IMAGE_MAP[category.name] ?? FALLBACK_IMAGE})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1523]/90 via-[#1A1523]/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-[#E4F1EB] font-grotesk">
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
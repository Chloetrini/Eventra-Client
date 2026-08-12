import React from "react";
import { VIBE_CATEGORIES } from "@/lib/home-constants";
import { UI_ASSETS } from "@/lib/assets";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export const VibeGrid: React.FC = () => {
  return (
    <section className="mb-5 md:mb-10">
      {/* the div holding all of them*/}
      <div className="flex flex-row justify-between items-end mb-2 md:mb-8.25 mt-4 lg:mt-6.75">
        {/* left div */}
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
        {/* right div */}
        <Link
          to="/categories"
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

      {/* grid showing the vibes on mobile display*/}
      <div className="md:hidden -mx-4 sm:-mx-6">
        <div className="flex gap-3.5 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide">
          {VIBE_CATEGORIES.map((category) => (
            <Link
            to={`/explore?category=${category.slug}`}
              key={category.slug}
              className="relative flex-none w-[75vw] max-w-75 h-42.5 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1A1523]/90 via-[#1A1523]/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end">
                <h3 className="text-[20px] font-bold text-[#E4F1EB] transition-colors duration-300 font-grotesk">
                  {category.title}
                </h3>
                <span className="text-xs text-[#E4F1EB] font-mono uppercase font-normal">
                  {category.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* for desktop display */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {VIBE_CATEGORIES.map((category) => (
          <Link
            to={`/explore?category=${category.slug}`}
            key={category.slug}
            className="relative h-50 rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1A1523]/90 via-[#1A1523]/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-[#E4F1EB] transition-colors duration-300 font-grotesk">
                {category.title}
              </h3>
              <span className="text-xs text-[#E4F1EB] font-mono">
                {category.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export const VibeCategory = VibeGrid;

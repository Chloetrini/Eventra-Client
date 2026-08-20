import React from "react";
import { SECTION_TWO_FEATURES } from "@/lib/organizer-constants";
import { PencilIcon, Coins, ScanLine, ZapIcon } from "lucide-react";

const iconMap = {
  PencilIcon,
  Coins,
  ScanLine,
  ZapIcon,
};

const SectionTwo: React.FC = () => {
  const featureData = SECTION_TWO_FEATURES;

  return (
    <section className="py-20 bg-white dark:bg-[#0D0D0D] transition-colors duration-300">
      <div>
        {/* Top badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#F5A524] h-[1px] w-[20px] rounded-[20px]" />
          <p className="text-[12px] font-bold text-[#0A4F41] dark:text-[#1DA882] leading-4 tracking-[16%] uppercase">
            Everything you need
          </p>
        </div>

        {/* Heading */}
        <h2 className="font-extrabold text-2xl md:text-[34px] text-[#1A1523] dark:text-white leading-10 tracking-[-2px] mb-12">
          One dashboard, end to end
        </h2>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((feature) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={feature.id}
                className="flex flex-col items-start p-6 border border-[#E4F1EB] dark:border-[#1E1E1E] bg-white dark:bg-[#141414] rounded-xl shadow-sm hover:shadow-md dark:hover:border-[#2A2A2A] transition-all duration-200"
              >
                <div className="mb-12 p-3 bg-[#F0F9F6] dark:bg-[#0F3D2E] rounded-[10px]">
                  {IconComponent && (
                    <IconComponent
                      className="w-6 h-6 text-[#0F6E56] dark:text-[#1DA882]"
                      strokeWidth={1.75}
                    />
                  )}
                </div>
                <h3 className="text-[20px] font-bold text-[#1A1523] dark:text-white mb-2 leading-6 tracking-[-1%]">
                  {feature.title}
                </h3>
                <p className="text-[14px] font-medium text-[#4A4451] dark:text-[#A09AA8] leading-[1.4rem] tracking-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;
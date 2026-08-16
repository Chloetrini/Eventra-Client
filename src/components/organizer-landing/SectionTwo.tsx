import React from "react";
import { SECTION_TWO_FEATURES } from "@/services/organizer-constants";
import { PencilIcon, Coins, ScanLine, ZapIcon } from "lucide-react";

// Map icon names to Lucide components
const iconMap = {
  PencilIcon,
  Coins,
  ScanLine,
  ZapIcon,
};

const SectionTwo: React.FC = () => {
  
  const featureData = SECTION_TWO_FEATURES;


  return (
    <section className="py-20  bg-background">
      <div >
        {/* Top badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#F5A524]  h-[1px] w-[2 0px] rounded-[20px]"></span>
          <p className="text-[12px] font-bold text-[#0A4F41] dark:text-[#4ADE80] leading-4 tracking-[16%] uppercase">
            EVERYTHING YOU NEED
          </p>
        </div>

        {/* Heading */}
        <h2 className="font-extrabold text-2xl md:text-[34px] text-foreground leading-10 tracking-[-2px] mb-12">
          One dashboard, end to end
        </h2>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((feature) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={feature.id}
                className="flex flex-col items-start p-6 border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-12 p-3 bg-[#F0F9F6] dark:bg-[#0F6E56]/15 rounded-[10px]">
                  {IconComponent && (
                    <IconComponent
                      className="w-6 h-6 text-[#0F6E56] dark:text-[#4ADE80]"
                      strokeWidth={1.75}
                    />
                  )}
                </div>
                <h3 className="text-[20px] font-bold text-foreground mb-2 leading-6 tracking-[-1%]">
                  {feature.title}
                </h3>
                <p className="text-[14px] font-medium text-muted-foreground leading-5.25 tracking-normal">
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


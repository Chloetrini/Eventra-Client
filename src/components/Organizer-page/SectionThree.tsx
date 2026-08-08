import React from "react";
import { Link } from "react-router";

import { SECTION_THREE_FEATURES } from "@/lib/organizer-constants";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Percent,
  CreditCard,
  Banknote,
  QrCode,
  Calculator,
  Tag,
} from "lucide-react";

const iconMap = {
  Ticket,
  Percent,
  CreditCard,
  Banknote,
  QrCode,
};

const SectionThree: React.FC = () => {
  

  
  const features = SECTION_THREE_FEATURES;

  return (
    <section className="p-20 max-w-6xl mx-auto border border-[#E8E6E0] rounded-[20px]">
      <div className=" flex flex-col lg:flex-row items-center">
        {/* Left side */}
        <div className="flex-1 w-[50%]">
          {/* Badge */}
          <div className="flex items-center gap-3 ">
            <span className="bg-[#F5A524] h-1 w-6 md:w-8 rounded-full"></span>
            <p className="text-[12px] font-bold text-[#0A4F41] leading-4 tracking-[16%] uppercase">
              SIMPLE, HONEST PRICING
            </p>
          </div>

          {/* Main heading */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1523] leading-tight tracking-[-2px] mb-3">
            Only pay when <br className="hidden sm:block" /> you sell
          </h2>

          {/* Feature list */}
          <div className="space-y-1">
            {features.map((feature) => {
              const IconComponent =
                iconMap[feature.icon as keyof typeof iconMap];
              return (
                <div key={feature.id} className="flex items-center gap-4">
                  <div className="shrink-0 mt-1 p-2 rounded-[10px] border border-[#E5E7EB] bg-white">
                    {IconComponent && (
                      <IconComponent
                        className="w-5 h-5 text-[#0F6E56]"
                        strokeWidth={1.75}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1523]">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#4A4451] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center items-center gap-8 border-l border-[#6E6577]">
          {/* Pricing card */}
          <div className="w-52.5 h-52.5 rounded-full shadow-sm p-4 border border-[#E4F1EB] relative">
            <div className="w-45 h-45 rounded-full p-4 border-12 border-[#0F6E56] relative z-10">
              <div className="flex flex-col items-center ">
                <span className=" flex justify-center items-center rounded-full bg-[#ffffff] absolute bottom-36 z-20 w-12.5 h-12.5">
                  <Tag
                    className="w-8 h-8 text-[#0F6E56] shrink-0  scale-x-[-1]"
                    strokeWidth={1.5}
                  />
                </span>
                <div className="flex flex-col justify-center items-center mt-4">
                  <div className=" text-[45px]  md:text-[64px] font-extrabold text-[#0F6E56] leading-16 tracking-[-3%]">
                    5%
                  </div>
                  <div className=" text-[16px] font-bold text-[#0A4F41] mt-1  leading-6.5 tracking-normal">
                    / paid ticket
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom text & button */}
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <p className="text-sm text-[#4A4451] leading-relaxed ">
              That's it – no set up fees, no <br className="hidden sm:block" />{" "}
              monthly charges, no surprises.
            </p>
            <Link to="/auth/organizer/register">
              <Button
                variant="default"
                size="lg"
                className="w-full px-8 py-6 text-base font-semibold rounded-[10px] shadow-lg hover:shadow-xl transition-shadow bg-[#0F6E56] text-white hover:bg-[#0A4F41] flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" strokeWidth={1.75} />
                Create your first event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionThree;
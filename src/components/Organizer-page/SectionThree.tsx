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
    <section className="p-20 max-w-6xl mx-auto border border-[#E8E6E0] dark:border-[#1E1E1E] bg-white dark:bg-[#111111] rounded-[20px] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row items-center">

        {/* ── LEFT SIDE ── */}
        <div className="lg:flex-1 lg:w-[50%] mb-8 lg:mb-0 pr-0 lg:pr-12">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#F5A524] h-[1px] w-[30px] rounded-full" />
            <p className="text-[12px] font-bold text-[#0A4F41] dark:text-[#1DA882] leading-4 tracking-[16%] uppercase">
              Simple, honest pricing
            </p>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1523] dark:text-white leading-tight tracking-[-2px] mb-6">
            Only pay when <br className="hidden sm:block" /> you sell
          </h2>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((feature) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <div key={feature.id} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 p-2 rounded-[10px] border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A]">
                    {IconComponent && (
                      <IconComponent
                        className="w-5 h-5 text-[#0F6E56] dark:text-[#1DA882]"
                        strokeWidth={1.75}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1523] dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#4A4451] dark:text-[#A09AA8] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center items-center gap-8 md:border-l md:border-[#E8E6E0] dark:border-[#1E1E1E] md:pl-12">
          {/* Pricing circle */}
          <div className="w-[210px] h-[210px] rounded-full shadow-sm p-4 border border-[#E4F1EB] dark:border-[#1A3D2E] relative">
            <div className="w-[180px] h-[180px] rounded-full p-4 border-[12px] border-[#0F6E56] dark:border-[#1DA882] relative z-10">
              <div className="flex flex-col items-center">
                <span className="flex justify-center items-center rounded-full bg-white dark:bg-[#111111] border border-[#E4F1EB] dark:border-[#1A3D2E] absolute -top-6 z-20 w-12 h-12">
                  <Tag
                    className="w-6 h-6 text-[#0F6E56] dark:text-[#1DA882] shrink-0 scale-x-[-1]"
                    strokeWidth={1.5}
                  />
                </span>
                <div className="flex flex-col justify-center items-center mt-6">
                  <div className="text-[45px] md:text-[64px] font-extrabold text-[#0F6E56] dark:text-[#1DA882] leading-none tracking-tight">
                    5%
                  </div>
                  <div className="text-[16px] font-bold text-[#0A4F41] dark:text-[#1DA882] mt-1">
                    / paid ticket
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text + button */}
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <p className="text-sm text-[#4A4451] dark:text-[#A09AA8] leading-relaxed text-center">
              That's it – no set up fees, no monthly charges, no surprises.
            </p>
            <Link to="/auth/organizer/register">
              <Button
                variant="default"
                size="lg"
                className="w-full px-8 py-6 text-base font-semibold rounded-[10px] shadow-lg hover:shadow-xl transition-shadow bg-[#0F6E56] dark:bg-[#1DA882] text-white hover:bg-[#0A4F41] dark:hover:bg-[#18936E] flex items-center justify-center gap-2"
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
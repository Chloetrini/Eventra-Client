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
    <section className="w-full max-w-6xl mx-auto p-6 sm:p-10 lg:p-16 border border-border rounded-2xl lg:rounded-[20px] mb-10 sm:mb-14 bg-card/40">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
        {/* Left side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Badge */}
          <div className="flex items-center gap-3">
            <span className="bg-[#F5A524] h-[2px] w-[30px] rounded-full"></span>
            <p className="text-xs font-bold text-[#0F6E56] dark:text-[#4ADE80] tracking-wider uppercase font-space">
              SIMPLE, HONEST PRICING
            </p>
          </div>

          {/* Main heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            Only pay when <br className="hidden sm:block" /> you sell
          </h2>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((feature) => {
              const IconComponent =
                iconMap[feature.icon as keyof typeof iconMap];
              return (
                <div key={feature.id} className="flex items-start gap-3.5 sm:gap-4">
                  <div className="shrink-0 mt-0.5 p-2 rounded-lg border border-border bg-card shadow-xs">
                    {IconComponent && (
                      <IconComponent
                        className="w-5 h-5 text-[#0F6E56] dark:text-[#4ADE80]"
                        strokeWidth={1.75}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center gap-8 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border">
          {/* Pricing card */}
          <div className="w-56 h-56 sm:w-60 sm:h-60 rounded-full shadow-xs p-4 border border-[#E4F1EB] dark:border-[#0F6E56]/30 flex items-center justify-center relative bg-card">
            {/* Floating Tag Icon */}
            <span className="flex justify-center items-center rounded-full bg-card border border-border shadow-xs absolute -top-3 z-20 w-12 h-12">
              <Tag
                className="w-6 h-6 text-[#0F6E56] dark:text-[#4ADE80] shrink-0 -scale-x-100"
                strokeWidth={1.75}
              />
            </span>

            <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full p-4 border-8 sm:border-[10px] border-[#0F6E56] dark:border-[#0F6E56]/80 flex flex-col items-center justify-center relative">
              <div className="flex flex-col justify-center items-center text-center">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F6E56] dark:text-[#4ADE80] tracking-tight leading-none">
                  5%
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0F6E56] dark:text-[#4ADE80] mt-1 tracking-wide uppercase">
                  / paid ticket
                </span>
              </div>
            </div>
          </div>

          {/* Bottom text & button */}
          <div className="w-full flex flex-col justify-center items-center gap-4 text-center px-2">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              That's it – no set up fees, no <br className="hidden sm:block" />{" "}
              monthly charges, no surprises.
            </p>
            <Link to="/auth/organizer/register" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-lg sm:rounded-[10px] shadow-sm hover:shadow-md transition-shadow bg-[#0F6E56] text-white hover:bg-[#0A4F41] flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5 shrink-0" strokeWidth={1.75} />
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
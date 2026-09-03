import React from "react";
import { UI_ASSETS } from "@/lib/assets";
import PageWrapper from "../page-wrapper";

const steps = [
  {
    number: "01",
    label: "FIND",
    title: "Discover the good stuff",
    description:
      "Browse what's on near you, filter by vibe, and save the events you're eyeing.",
    icon: UI_ASSETS.searchIcon ? (
      <img
        src={UI_ASSETS.searchIcon}
        alt="search icon"
        className="w-10 h-10 object-contain"
      />
    ) : null,
  },
  {
    number: "02",
    label: "PAY",
    title: "Pay your way",
    description:
      "Card, bank transfer, or USSD. Your money is held safely until the event happens.",
    icon: UI_ASSETS.walletIcon ? (
      <img
        src={UI_ASSETS.walletIcon}
        alt="wallet icon"
        className="w-10 h-10 object-contain"
      />
    ) : null,
  },
  {
    number: "03",
    label: "ENTER",
    title: "Show your QR, walk in",
    description:
      "Your ticket lives in the app with a QR that can't be faked. Scan and you're in.",
    icon: UI_ASSETS.qrcodeicon ? (
      <img
        src={UI_ASSETS.qrcodeicon}
        alt="QR code icon"
        className="w-10 h-10 object-contain"
      />
    ) : null,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <PageWrapper className="rounded-3xl overflow-hidden p-[20px] mb-12 bg-[linear-gradient(135deg,#24151F_0%,#391B25_100%)]  min-h-[612px]">
      {/* ── TOP HALF ── */}
      <div className="relative min-h-[320px] md:min-h-80 flex flex-col md:flex-row justify-between overflow-hidden p">
        {/* Text Content */}
        <div className="relative z-10 px-6 sm:px-10 md:px-12 pt-8 md:pt-10 pb-6 md:pb-8 w-full md:max-w-[75%] space-y-3 sm:space-y-4">
          <span className="text-xs font-normal uppercase text-[#F5A524] tracking-wider font-geist flex items-center gap-1">
            <span className="w-[11.81px] h-0 border border-[#F5A524] inline-block" />
            HOW EVENTRA WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[54px] font-bold text-white font-geist md:font-grotesk leading-tight w-full">
            From "where&apos;s it happening?" to{" "}
            <span className="text-[#C084A0]">"it&apos;s happening here!"</span>
          </h2>
          <p className="text-white/80 text-xs sm:text-sm font-geist leading-relaxed font-normal max-w-md">
            Eventra takes you from discovery to entry—fast, secure, and
            effortless.
          </p>
        </div>

        {/* Background Asset Image */}
        <div className="relative md:absolute top-0 right-0 h-48 sm:h-64 md:h-full w-full md:w-[45%] z-0 shrink-0">
          <img
            src={UI_ASSETS.afroBeats}
            alt="Afrobeats Night Market ticket"
            className="h-full w-full object-cover object-center md:object-left-bottom"
          />
          {/* Top fade for stacked mobile view */}
          <div className="absolute inset-x-0 top-0 h-12 md:hidden bg-gradient-to-b from-[#24151F] to-transparent" />
          {/* Left fade on desktop */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#24151F] to-transparent" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#2A1520]" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 mx-6 sm:mx-10 md:mx-12" />

      {/* DESKTOP: 3 columns */}
      <div className="hidden md:grid grid-cols-3 px-8 sm:px-12 py-8 gap-0">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className={`flex flex-col gap-3 py-4
              ${idx !== steps.length - 1 ? "border-r border-white/10 pr-8" : ""}
              ${idx !== 0 ? "pl-8" : ""}
            `}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <span className="text-[11px] font-normal tracking-widest text-[#F5A524] font-geist uppercase">
              {step.number} — {step.label}
            </span>
            <h3 className="text-lg font-bold text-white font-grotesk leading-snug">
              {step.title}
            </h3>
            <p className="text-sm text-white/60 font-geist leading-6">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* MOBILE: stacked with left timeline line */}
      <div className="md:hidden px-6 sm:px-10 py-8">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-white/10" />

          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4 sm:gap-5 items-start">
                {/* Icon — sits on top of the line */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#24151F] flex items-center justify-center z-10">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1 pt-0.5">
                  <span className="text-[11px] font-normal tracking-widest text-[#F5A524] font-geist uppercase">
                    {step.number} — {step.label}
                  </span>
                  <h3 className="text-base font-bold text-white font-grotesk leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 font-geist leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HowItWorks;
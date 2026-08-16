import React from "react";
import { UI_ASSETS } from "@/services/assets";

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
        className="w-16.75 h-16.75"
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
        className="w-16.75 h-16.75"
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
        className="w-10 h-10"
      />
    ) : null,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section
      className="rounded-3xl overflow-hidden mx-6 sm:mx-12 lg:mx-25 my-16 md:my-24"
      style={{
        background: "linear-gradient(135deg, #24151F 0%, #391B25 100%)",
      }}
    >
      {/* ── TOP HALF ── */}
      <div className="relative min-h-70 md:min-h-80 overflow-none">
        <div className="absolute top-0 right-0 h-full w-[55%] md:w-[45%] z-0">
          <div
            className="absolute inset-0 bg-cover bg-center z-0  scale-100"
            style={{ backgroundImage: `url(${UI_ASSETS.afroBeats})` }}
          />
          <img
            src={UI_ASSETS.afroBeats}
            alt="Afrobeats Night Market ticket"
            className="h-full w-full object-cover object-left-bottom"
          />
          {/* Left fade so image blends into the gradient bg */}
          <div
            className="absolute inset-y-0 left-0 w-2/3"
            style={{
              background:
                "linear-gradient(to right, #24151F 0%, transparent 100%)",
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #2A1520 100%)",
            }}
          />
        </div>

        {/* Text — sits on the left, z above image */}
        <div className="relative z-10 px-8 sm:px-12 pt-10 pb-8 max-w-[60%] md:max-w-[55%] space-y-4">
          <span className="text-xs font-normal uppercase text-[#F5A524] tracking-wider font-geist flex items-center gap-1">
            <span className="w-[11.81px] h-0 border border-[#F5A524] inline-block" />
            HOW EVENTRA WORKS
          </span>
          <h2 className="text-2xl md:text-[54px] font-bold text-white font-geist md:font-grotesk ">
            From “where's it happening?” to{" "}
            <span className="text-[#C084A0]">inside the gate.</span>
          </h2>
          <p className="text-white text-xs sm:text-sm font-geist leading-relaxed font-normal">
            Eventra takes you from discovery to entry-fast, secure, and
            effortless.
          </p>
        </div>
      </div>

      {/* Divider */}
      {/* hhhh */}
      <div className="h-px bg-white/10 mx-8 sm:mx-12" />

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
      <div className="md:hidden px-8 py-8">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-10 bottom-10 w-px bg-white/10" />

          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-5">
                {/* Icon — sits on the line */}
                <div className="shrink-0 w-10 h-10 rounded-full  flex items-center justify-center z-10">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[11px] font-normal tracking-widest text-[#F5A524] font-geist uppercase">
                    {step.number} — {step.label}
                  </span>
                  <h3 className="text-base font-bold text-white font-grotesk leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/60 font-geist leading-6">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

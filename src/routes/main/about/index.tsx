import React from "react";
import PartyHandsUp from "@/assets/party handsup.png";
import { FaShield } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi2";
import { TbScan } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Celeb from "@/assets/Celeb.png";
import Combined from "@/assets/Combined.png";
import PageWrapper from "@/components/pageWrapper";
import { CtaBanner } from "@/components/ui/ctaBanner";
import { UI_ASSETS } from "@/lib/assets";
import { Link } from "react-router";

export default function About() {
  const principles = [
    {
      icon: <FaShield size={22} />,
      title: "Trust first",
      description:
        "A ticket that can't be faked and money that arrives on time. Everything else comes after.",
    },
    {
      icon: <FaStar size={22} />,
      title: "Made for here",
      description:
        "Build around how Nigerians really pay and party, not a template borrowed from abroad.",
    },
    {
      icon: <BsLightningChargeFill size={22} />,
      title: "Simple & fast",
      description:
        "Find, pay and get in — in seconds. Powerful for organizers, effortless for fans.",
    },
  ];

  const stats = [
    {
      icon: <HiOutlineTag size={24} />,
      currency: "₦",
      value: "2B+",
      label: "Tickets processed",
    },
    {
      icon: <HiOutlineUsers size={24} />,
      value: "50k",
      label: "Organizers",
    },
    {
      icon: <TbScan size={24} />,
      value: "120k",
      label: "Tickets scanned",
    },
    {
      icon: <HiOutlineLocationMarker size={24} />,
      value: "18",
      label: "Cities & counting",
    },
  ];

  return (
    <PageWrapper className="px-5 md:px-10 lg:px-16 xl:px-24">
      <main className="overflow-x-hidden bg-white dark:bg-[#0D0D0D] antialiased transition-colors duration-300">

        {/* ── HERO ── */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-10 py-14 md:py-20">
          {/* Left copy */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#0F6E56] dark:bg-[#1DA882]" />
              <p className="font-schibsted font-semibold text-sm md:text-base text-[#0F6E56] dark:text-[#1DA882] uppercase tracking-wide">
                About Eventra
              </p>
            </div>

            <h1 className="font-schibsted font-extrabold text-[32px] sm:text-[42px] lg:text-[50px] leading-tight text-[#0A0A0A] dark:text-white">
              We're fixing how Nigeria buys tickets.
            </h1>

            <p className="font-geist text-base md:text-lg leading-relaxed text-[#6E6577] dark:text-[#A09AA8]">
              For too long, buying a ticket meant sending a transfer to a
              stranger and hoping the screenshot works at the gate. Eventra
              replaces that with real payments and tickets that can't be faked —
              so fans show up with confidence and organizers get paid without
              stress.
            </p>

            <Link
              to="/explore"
              className="hidden md:inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-md bg-[#0F6E56] dark:bg-[#1DA882] text-white font-geist font-bold text-sm hover:bg-[#0D5B4A] dark:hover:bg-[#18936E] transition-colors duration-300"
            >
              Explore events
            </Link>
          </div>

          {/* Right image */}
          <div className="w-full md:w-1/2">
            <img
              className="hidden md:block w-full rounded-2xl object-cover"
              src={PartyHandsUp}
              alt="People celebrating at a party"
            />
          </div>
        </section>

        {/* ── ORIGIN STORY ── */}
        <section className="flex flex-col md:flex-row items-center gap-10 md:gap-16 py-12 md:py-16 border-t border-[#E8E6E0] dark:border-[#1E1E1E]">
          {/* Image — left on desktop */}
          <div className="order-2 md:order-1 w-full md:w-1/2">
            <img
              className="w-full rounded-2xl object-cover"
              src={Combined}
              alt="Eventra concert and ticket"
            />
          </div>

          {/* Copy — right on desktop */}
          <div className="order-1 md:order-2 w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="font-schibsted font-extrabold text-2xl sm:text-3xl lg:text-[36px] leading-tight text-[#0A0A0A] dark:text-white">
              Built for the way Lagos actually parties.
            </h2>

            <div className="flex flex-col gap-3 text-base md:text-[17px] leading-relaxed text-[#6E6577] dark:text-[#A09AA8] font-geist">
              <p>
                Eventra started with a simple frustration: the best events in
                the city were the hardest to buy into. Tickets lived in DMs,
                payments were manual, and fakes were everywhere.
              </p>
              <p>
                So we built one place to discover events, pay the way you
                already pay — card, transfer, or USSD — and hold tickets you can
                trust.
              </p>
              <p>
                For organizers, that means selling more, chasing less, and
                getting settled on time.
              </p>
              <p>We're just getting started. Building it for the culture.</p>
            </div>
          </div>
        </section>

        {/* ── PRINCIPLES ── */}
        <section className="py-12 md:py-16 border-t border-[#E8E6E0] dark:border-[#1E1E1E]">
          <div className="flex flex-col gap-8 md:gap-12">
            {/* Section header */}
            <div className="flex flex-col gap-1">
              <p className="font-geist font-semibold text-sm text-[#0F6E56] dark:text-[#1DA882] uppercase tracking-widest">
                What we believe
              </p>
              <h2 className="font-schibsted font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1A1523] dark:text-white">
                Our principles
              </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {principles.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#E8E6E0] dark:border-[#1E1E1E] bg-white dark:bg-[#141414] p-6 md:p-7 flex flex-col gap-4 hover:shadow-md dark:hover:border-[#2A2A2A] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-full bg-[#E4F1EB] dark:bg-[#0F3D2E] flex items-center justify-center text-[#0F6E56] dark:text-[#1DA882]">
                    {item.icon}
                  </div>
                  <h3 className="font-schibsted font-bold text-lg md:text-xl text-[#0A0A0A] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="font-geist text-sm md:text-base leading-relaxed text-[#4A4451] dark:text-[#A09AA8]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-12 md:py-16 border-t border-[#E8E6E0] dark:border-[#1E1E1E]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((item, index) => (
              <div key={index} className="flex flex-col gap-3">
                <div className="w-11 h-11 rounded-full bg-[#E4F1EB] dark:bg-[#0F3D2E] flex items-center justify-center text-[#0F6E56] dark:text-[#1DA882]">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-geist font-bold text-2xl md:text-[34px] text-[#0A0A0A] dark:text-white leading-none">
                    {item.currency ? `${item.currency}${item.value}` : item.value}
                  </p>
                  <p className="font-geist text-sm md:text-base text-[#6E6577] dark:text-[#A09AA8]">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MOBILE CTA CARD ── */}
        <section className="md:hidden py-8">
          <div className="w-full rounded-2xl p-6 flex flex-col gap-5 bg-[#090519] dark:bg-[#0F0F0F] dark:border dark:border-[#1E1E1E]">
            <p className="font-mono text-xs text-[#F5A524] text-center uppercase tracking-widest">
              Come build the culture
            </p>
            <div className="flex flex-col gap-2 text-center">
              <h2 className="font-geist font-bold text-2xl leading-tight text-white">
                Ready to join the party?
              </h2>
              <p className="font-geist text-sm text-[#C4BFD0]">
                Discover your next event, or start selling tickets to your own.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/explore"
                className="w-full rounded-md px-4 py-2.5 bg-[#0F6E56] text-white font-geist font-bold text-sm text-center hover:bg-[#0D5B4A] transition-colors duration-300"
              >
                Find an event
              </Link>
              <Link
                to="/contact"
                className="w-full rounded-md border border-white px-4 py-2.5 text-white font-geist font-bold text-sm text-center hover:bg-white/10 transition-colors duration-300"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA BANNER (desktop) ── */}
        <CtaBanner
          label="Come build the culture"
          heading="Ready to join the party?"
          body="Discover your next event, or start selling tickets to your own."
          primaryBtn={{ text: "Find an event", to: "/explore" }}
          secondaryBtn={{ text: "Talk to us", to: "/auth/register" }}
          bgImage={UI_ASSETS.manWithHandUp}
          align="left"
        />
      </main>
    </PageWrapper>
  );
}
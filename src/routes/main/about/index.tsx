import React from "react";
import PartyHandsUp from "@/assets/party handsup.png";
import { FaShield } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi2";
import { TbScan } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Combined from "@/assets/Combined.png";
import PageWrapper from "@/components/page-wrapper";
import { CtaBanner } from "@/components/ui/ctaBanner";
import { UI_ASSETS } from "@/lib/assets";
import { useNavigate } from "react-router";

export default function About() {
  const navigate = useNavigate();

  const principles = [
    {
      icon: <FaShield size={24} />,
      title: "Trust first",
      description:
        "A ticket that can't be faked and money that arrives on time. Everything else comes after.",
    },
    {
      icon: <FaStar size={24} />,
      title: "Made for here",
      description:
        "Built around how Nigerians really pay and party, not a template borrowed from abroad.",
    },
    {
      icon: <BsLightningChargeFill size={24} />,
      title: "Simple & fast",
      description:
        "Find, pay and get in—in seconds. Powerful for organizers, effortless for fans.",
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
      label: "Tickets Scanned",
    },
    {
      icon: <HiOutlineLocationMarker size={24} />,
      value: "18",
      label: "Cities & Counting",
    },
  ];

  return (
    <PageWrapper className="p-4 sm:p-6 lg:p-8">
      <main className="w-full overflow-x-hidden bg-background antialiased space-y-12 sm:space-y-16 lg:space-y-20">
        
        {/* 1. HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="w-6 sm:w-8 h-[3px] bg-[#0F6E56] dark:bg-[#4ADE80] rounded-full"></span>
              <p className="font-schibsted font-semibold text-xs sm:text-sm lg:text-base tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80]">
                About Eventra
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <h1 className="font-schibsted font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight text-foreground">
                We’re fixing how Nigeria buys tickets.
              </h1>
              <p className="font-geist text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
                For too long, buying a ticket meant sending a transfer to a stranger
                and hoping the screenshot works at the gate. Eventra replaces that
                with real payments and tickets that can't be faked — so fans show up
                with confidence and organizers get paid without stress.
              </p>
            </div>

            <button
              onClick={() => navigate("/explore")}
              className="mt-2 w-full sm:w-auto self-start px-6 py-3 rounded-md bg-[#0F6E56] font-geist font-bold text-sm text-[#E8E6E0] cursor-pointer hover:bg-[#0D5B4A] transition-colors duration-300"
            >
              Explore events
            </button>
          </div>

          <div className="w-full lg:w-1/2">
            <img
              className="w-full h-auto max-h-[320px] sm:max-h-[420px] lg:max-h-[480px] rounded-2xl object-cover shadow-sm"
              src={PartyHandsUp}
              alt="Party crowd with hands up"
            />
          </div>
        </section>

        {/* 2. ORIGIN / LAGOS SECTION */}
        <section className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="order-1 lg:order-2 w-full lg:w-1/2 flex flex-col gap-4">
            <h2 className="font-schibsted font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight text-foreground">
              Built for the way Lagos actually parties.
            </h2>
            <div className="flex flex-col gap-3 text-sm sm:text-base leading-relaxed text-muted-foreground font-geist">
              <p>
                Eventra started with a simple frustration: the best events in the city
                were the hardest to buy into. Tickets lived in DMs, payments were manual,
                and fakes were everywhere.
              </p>
              <p>
                So we built one place to discover events, pay the way you already pay —
                card, transfer, or USSD — and hold tickets you can trust.
              </p>
              <p>
                For organizers, that means selling more, chasing less, and getting settled
                on time.
              </p>
              <p className="font-medium text-foreground">
                We’re just getting started and we’re building it for the culture.
              </p>
            </div>
          </div>

          <div className="order-2 lg:order-1 w-full lg:w-1/2">
            <img
              className="w-full h-auto rounded-2xl object-cover shadow-sm"
              src={Combined}
              alt="Eventra concert atmosphere and ticket UI"
            />
          </div>
        </section>

        {/* 3. PRINCIPLES SECTION */}
        <section className="w-full">
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="w-full max-w-md flex flex-col gap-1">
              <p className="font-geist font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0F6E56] dark:text-[#4ADE80]">
                WHAT WE BELIEVE
              </p>
              <h2 className="font-schibsted font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground">
                Our principles
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {principles.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border p-6 flex flex-col gap-4 bg-card shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 flex items-center justify-center text-[#0F6E56] dark:text-[#4ADE80] shrink-0">
                    {item.icon}
                  </div>

                  <h3 className="font-schibsted font-bold text-lg sm:text-xl text-foreground">
                    {item.title}
                  </h3>

                  <p className="font-geist text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. STATS SECTION */}
        <section className="w-full">
          <div className="rounded-2xl border border-border p-6 sm:p-8 lg:p-10 bg-card">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 flex items-center justify-center text-[#0F6E56] dark:text-[#4ADE80] shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-grotesk font-bold text-xl sm:text-2xl lg:text-3xl text-foreground truncate">
                      {item.currency ? `${item.currency} ${item.value}` : item.value}
                    </h3>
                    <p className="font-geist text-xs sm:text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA BANNER */}
        <section className="w-full pt-4">
          <CtaBanner
            label="COME BUILD THE CULTURE"
            heading="Ready to join the party?"
            body="Discover your next event, or start selling tickets to your own."
            primaryBtn={{ text: "Find an event", to: "/explore" }}
            secondaryBtn={{ text: "Talk to us", to: "/contact" }}
            bgImage={UI_ASSETS.manWithHandUp}
            align="left"
          />
        </section>
      </main>
    </PageWrapper>
  );
}
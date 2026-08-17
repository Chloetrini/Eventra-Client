import React from "react";
import PartyHandsUp from "@/assets/party handsup.png";
import { FaShield } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi2";
import { TbScan } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Combined from "@/assets/Combined.png"
import PageWrapper from "@/components/page-wrapper";
import { CtaBanner } from "@/components/ui/ctaBanner";
import { UI_ASSETS } from "@/lib/assets";
import { useNavigate } from "react-router";

export default function About() {
  const navigate = useNavigate()
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
                "Build around how Nigerians really pay and party, not a template borrowed from abroad.",
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
            icon: <HiOutlineTag size={28} />,
            currency: "₦",
            value: "2B+",
            label: "Tickets processed",
        },
        {
            icon: <HiOutlineUsers size={28} />,
            value: "50k",
            label: "Organizers",
        },
        {
            icon: <TbScan size={28} />,
            value: "120k",
            label: "Tickets Scanned",
        },
        {
            icon: <HiOutlineLocationMarker size={28} />,
            value: "18",
            label: "Cities & Counting",
        },
    ];

    const rows = [stats.slice(0, 4)];

    return (
        <PageWrapper className="p-[20px]">

            <main className=" overflow-x-hidden bg-background antialiased">
                <section className="flex flex-col md:flex-row lg:flex-row items-center justify-between gap-6 lg:gap-15 ">
                    <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-5 lg:items-start">
                        <div className="flex items-center gap-2 md:gap-4">
                            <span className="border-2 w-3 md:w-8 md:h-[3px] border-[#F5A524] md:border-[#0F6E56] md:dark:border-[#4ADE80]"></span>
                            <p className="font-schibsted font-semibold text-sm md:text-2xl text-[#0F6E56] dark:text-[#4ADE80]">
                                About Eventra
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 md:gap-6">
                            <h1 className="font-geist md:font-schibsted font-bold md:font-extrabold text-[30px] sm:text-[40px] md:text-[30px] lg:text-[40px] xl:text-[50px] 2xl:text-[50px] leading-tight text-foreground break-words">
                                We’re fixing how Nigeria buys tickets.
                            </h1>
                            <p className="font-geist font-normal md:font-medium text-md md:text-sm lg:text-md xl:text-[20px] leading-relaxed text-muted-foreground break-words">
                                For too long, buying a ticket meant sending a transfer to a strong
                                and hoping the screenshot works at the gate. Eventra replaces that
                                with real payments and ticket that cant be faked - so fans show up
                                with confidence and organizer get paid without stress.
                            </p>
                        </div>
                        <button onClick={()=> navigate("/explore")} className="hidden md:block w-[140px] h-[42px] rounded-md py-2 px-4 bg-[#0F6E56] font-geist font-bold text-sm text-[#E8E6E0] cursor-pointer hover:bg-[#0D5B4A] transition-colors duration-300">
                            Explore event
                        </button>
                    </div>

                    <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
                        <img
                            className="hidden md:block w-full rounded-2xl object-cover"
                            src={PartyHandsUp}
                            alt="party picture"
                        />
                    </div>
                </section>

                <section className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 xl:gap-12  md:my-12">
                    <div className="order-1 md:order-2 w-full md:max-w-xl flex flex-col gap-4 md:gap-3">
                        <h1 className="font-geist md:font-schibsted font-bold md:font-extrabold text-3xl sm:text-[40px] md:text-[25px] lg:text-[30px] xl:text-[35px] leading-tight text-foreground break-words">
                            Build for the way lagos actually parties.
                        </h1>
                        <div className="flex flex-col gap-3 md:gap-2 text-[14px] sm:text-[19px] md:text-[13px] lg:text-[18px] leading-relaxed text-muted-foreground font-geist font-normal md:font-medium break-words">
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
                            <p>
                                We’re just getting started and we’re building it for the culture.
                            </p>
                        </div>
                    </div>

                    <div className="order-2 md:order-1 relative w-full md:max-w-2xl">

                        <img
                            className="w-full rounded-2xl object-cover"
                            src={Combined}
                            alt="Eventra concert and ticket"
                        />

                    </div>
                </section>

                <section className=" my-12">
                    <div className="flex flex-col gap-6 md:gap-10">
                        <div className="w-full md:max-w-md flex flex-col gap-1 md:gap-2">
                            <p className="font-geist font-medium text-sm sm:text-base md:text-lg text-[#0F6E56] dark:text-[#4ADE80]">
                                WHAT WE BELIEVE
                            </p>
                            <h1 className="font-geist font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide text-foreground">
                                Our principles
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                            {principles.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-border p-5 md:p-7 flex flex-col gap-4 bg-card shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 flex items-center justify-center text-[#0F6E56] dark:text-[#4ADE80]">
                                        {item.icon}
                                    </div>

                                    <h2 className="font-geist md:font-schibsted font-bold text-lg sm:text-xl md:text-2xl text-foreground">
                                        {item.title}
                                    </h2>

                                    <p className="font-geist font-normal text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 my-12">
                    <div className="flex flex-col gap-6 md:gap-10 rounded-lg p-6 md:p-10 bg-card">
                        {rows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                            >
                                {row.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center text-center gap-2"
                                    >
                                        <div className="w-[89px] h-[89px] md:w-14 md:h-14 rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 flex items-center justify-center text-[#0F6E56] dark:text-[#4ADE80]">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col gap-1 md:gap-2 items-center">

                                        <h2 className="font-geist font-bold  sm:text-xl md:text-[34px] text-foreground font-grotesk">
                                            {item.currency ? `${item.currency} ${item.value}` : item.value}
                                        </h2>

                                        <p className="font-geist text-sm sm:text-base md:text-lg text-muted-foreground">
                                            {item.label}
                                        </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>


                <section className="w-full my-12">
                    <div className="md:hidden w-full max-w-sm rounded-[15px] p-6 flex flex-col gap-6 bg-[#090519] mx-auto">
                        <p className="font-[space-mono] text-sm text-[#F5A524] text-center">
                            COME BUILD THE CULTURE
                        </p>

                        <div className="flex flex-col text-center gap-2">
                            <h1 className="font-geist font-bold text-2xl leading-tight text-white">
                                Ready to join the party?
                            </h1>
                            <p className="font-geist text-base text-white">
                                Discover your next event, or start selling tickets to your own.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button className="w-full rounded-md px-4 py-2 bg-[#0F6E56] text-[#E8E6E0] font-geist font-bold text-sm text-center cursor-pointer">
                                Find an event
                            </button>

                            <button className="w-full rounded-md border border-white px-4 py-2 text-[#E8E6E0] font-geist font-bold text-sm text-center cursor-pointer">
                                Talk to us
                            </button>
                        </div>
                    </div>
                    {/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/}

                </section>
                   {/* 9. BOTTOM CTA BANNER */}
                           <CtaBanner
                             label="COME BUILD THE CULTURE"
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

import { useSearchParams } from "react-router";
import { TicketCard } from "@/components/ticket-card";
import { dummyTicket } from "@/lib/dummy-ticket";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/pageWrapper";

const TABS = [
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
] as const;

export default function Tickets() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") ?? "upcoming";

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
    };

    const filteredTickets = activeTab === "upcoming" ? dummyTicket : [];

    return (
        <PageWrapper className="py-8  px-[20px]" >
            <header className="flex items-center   mt-5">
                <div className="mb-5 flex items-center gap-2">
                    <span className="h-0.5 w-6 bg-[#F5A524]" />
                    <span className="text-[10px] min-[400px]:text-[12px] font-[400] leading-[16px] text-[#0F6E56] tracking-wide uppercase font-sans ">Your Account</span>
                </div>
            </header>
            <div>
                <h1 className="text-2xl min-[400px]:text-4xl lg:text-[54px] font-bold text-[#1A1523] lg:font-[700] mb-6 font-grotesk">
                   my tickets
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex justify-between min-[400px]:justify-start min-[400px]:gap-[84px] mb-6 pl-4 min-[400px]:pl-[35px] pr-4 min-[400px]:pr-[30px]">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={cn(
                            "text-sm min-[400px]:text-[16px] font-medium border-b-2 text-[#1A1523] -mb-px transition-colors",
                            activeTab === tab.value
                                ? "border-[#4A4451] text-emerald-950"
                                : "border-transparent text-[#4A4451] hover:text-black",
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Ticket Cards */}
            <div className="space-y-6">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <TicketCard key={ticket._id} ticket={ticket} />
                    ))
                ) : (
                    <p className="text-sm text-center py-12 text-muted-foreground">
                        No {activeTab} tickets to show.
                    </p>
                )}
            </div>
        </PageWrapper>
    );
}
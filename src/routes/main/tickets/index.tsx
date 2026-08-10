import { useNavigate, useSearchParams } from "react-router";
import { TicketCard } from "@/components/ticket-card";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/pageWrapper";
import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { useAuthGate } from "@/context/auth.gate";
import { useMyTickets } from "@/hooks/use-event";

const TABS = [
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
] as const;

// Real ticket → the shape TicketCard displays
function toDisplayTicket(t: any) {
    return {
        _id: t._id,
        eventName: t.event?.title ?? "Event",
        category: [],
        eventDateTime: t.event?.startDate ?? "",
        eventEntrance: "Main entrance",
        eventVenue: t.event?.venue
            ? `${t.event.venue.name}, ${t.event.venue.city}`
            : "",
        referenceCode: t.code,
        orderID: t._id,
        holderName: t.attendeeName,
        ticketDetails: [{ type: t.type === "free" ? "Free" : "General", unitPrice: t.price ?? 0, quantity: 1 }],
        qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(t.code)}`,
        refundPolicy: {
            type: (t.type === "free" ? "non-refundable" : "refundable") as "non-refundable" | "refundable",
            note: t.type === "free"
                ? "Free reservations can be cancelled from here."
                : "Refunds subject to the event's policy.",
        },
        _rawEvent: t.event,
    };
    
}

export default function Tickets() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") ?? "upcoming";

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
    };

    const { user, isLoading } = useAuth();
    const { requireAuth } = useAuthGate();
    const navigate = useNavigate();

    const { data: rawTickets = [], isLoading: ticketsLoading } = useMyTickets();
    const displayTickets = (rawTickets as any[]).map(toDisplayTicket);

    const now = new Date();
    const upcomingTickets = displayTickets.filter((t) => {
        const eventDate = t._rawEvent?.startDate ? new Date(t._rawEvent.startDate) : null;
        return !eventDate || eventDate >= now;
    });
    const pastTickets = displayTickets.filter((t) => {
        const eventDate = t._rawEvent?.startDate ? new Date(t._rawEvent.startDate) : null;
        return eventDate && eventDate < now;
    });

    const filteredTickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;

    useEffect(() => {
        if (!isLoading && !user) {
            requireAuth("my-tickets");
            navigate(-1);
        }
    }, [isLoading, user]);

    if (!isLoading && !user) {
        return null;
    }

    return (
        <PageWrapper className="p-[20px]" >
            <header className="flex items-center   mt-5">
                <div className="mb-5 flex items-center gap-2">
                    <span className="h-[1px] w-[12px] bg-[#F5A524]" />
                    <span className="text-[10px] md:text-[12px] font-[400] leading-[16px] text-[#0F6E56] tracking-wide uppercase font-sans ">Your Account</span>
                </div>
            </header>
            <div>
                <h1 className="text-2xl min-[400px]:text-4xl lg:text-[54px] font-bold text-[#1A1523] lg:font-[700] mb-6 font-grotesk">
                    my tickets
                </h1>
            </div>

            <div className="flex justify-between min-[400px]:justify-start min-[400px]:gap-[84px] mb-6 ">
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

            <div className="space-y-6">
                {ticketsLoading ? (
                    <p className="text-sm text-center py-12 text-muted-foreground">Loading your tickets…</p>
                ) : filteredTickets.length > 0 ? (
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
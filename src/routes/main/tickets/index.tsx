import { useNavigate, useSearchParams } from "react-router";
import { TicketCard } from "@/components/tickets/ticket-card";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/layout/page-wrapper";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useAuthGate } from "@/context/auth-gate";
import { useMyTickets } from "@/hooks/events/use-event";
import { TicketsSkeleton } from "@/components/skeletons/tickets-skeleton";
import { useAppMode } from "@/hooks/shared/use-app-mode";
import { AppScreenHeader } from "@/components/app/app-screen-header";

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
        // Friendly backend-generated ticket id (e.g. "TKT-A1B2C3D4") — never
        // the raw Mongo _id, which isn't meant to be shown to attendees.
        orderID: t.ticketId ?? t._id,
        holderName: t.attendeeName,
        // Was "General" for every paid ticket, discarding the real tier
        // name — the backend already sends it (`ticketType: { name }`,
        // same field the organizer's attendees list reads), it just wasn't
        // being picked up here. Falls back to "Paid" only if a paid ticket
        // somehow has no tier name.
        ticketDetails: [{ type: t.type === "free" ? "Free" : (t.ticketType?.name ?? "Paid"), unitPrice: t.price ?? 0, quantity: 1 }],
        qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(t.code)}`,
        refundPolicy: (() => {
            const policy = t.event?.refundPolicy;
            if (t.type === "free") {
                return {
                    type: "free-cancel" as const,
                    note: "Free event · cancel anytime to release your spot.",
                };
            }
            if (!policy || policy.type === "no-refunds") {
                return {
                    type: "non-refundable" as const,
                    note: "This ticket is non-refundable.",
                };
            }
            // type === "refund-until-days-before"
            return {
                type: "refundable" as const,
                note: policy.daysBefore
                    ? `Refunds allowed until ${policy.daysBefore} day${policy.daysBefore === 1 ? "" : "s"} before the event.`
                    : "Refunds allowed before the event.",
            };
        })(),
        _rawEvent: t.event,
    };

}

export default function Tickets() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") ?? "upcoming";

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
    };

    const appMode = useAppMode();
    const { user, isLoading } = useAuth();
    const { requireAuth } = useAuthGate();
    const navigate = useNavigate();

    const { data: rawTickets = [], isLoading: ticketsLoading } = useMyTickets();
    console.log(rawTickets);

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
        <PageWrapper className={cn("min-h-screen", appMode ? "max-w-xl px-0 pb-4" : "p-[20px]")} >
            {appMode ? (
                <>
                    <AppScreenHeader title="Tickets" sub="Your passes in one place" />
                    <div className="mb-4 flex gap-2 px-5">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={cn(
                                    "rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors active:scale-95",
                                    activeTab === tab.value
                                        ? "border-[#0F6E56] bg-[#0F6E56] text-white dark:border-[#3CCB9C] dark:bg-[#3CCB9C] dark:text-[#04140E]"
                                        : "border-[#E2E9E6] bg-white text-[#0B1F1A] dark:border-[#22302A] dark:bg-[#111A16] dark:text-[#EEF5F2]",
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <header className="flex items-center   mt-5">
                        <div className="mb-5 flex items-center gap-2">
                            <span className="h-[1px] w-[12px] bg-[#F5A524]" />
                            <span className="text-[10px] md:text-[12px] font-[400] leading-[16px] text-[#0F6E56] dark:text-[#4ADE80] tracking-wide uppercase font-sans ">Your Account</span>
                        </div>
                    </header>
                    <div>
                        <h1 className="text-2xl min-[400px]:text-4xl lg:text-[54px] font-bold text-foreground lg:font-[700] mb-6 font-grotesk">
                            my tickets
                        </h1>
                    </div>

                    <div className="flex justify-between min-[400px]:justify-start min-[400px]:gap-[84px] mb-6 ">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={cn(
                                    "text-sm min-[400px]:text-[16px] font-medium border-b-2 text-foreground -mb-px transition-colors",
                                    activeTab === tab.value
                                        ? "border-foreground text-foreground"
                                        : "border-transparent text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <div className={cn("space-y-6", appMode && "px-5")}>
                {ticketsLoading ? (
                    <TicketsSkeleton />
                ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <TicketCard key={ticket._id} ticket={ticket} showActions />
                    ))
                ) : (
                    <p className="text-sm text-center py-12 text-muted-foreground min-h-screen">
                        No {activeTab} tickets to show.
                    </p>
                )}
            </div>
        </PageWrapper>
    );
}

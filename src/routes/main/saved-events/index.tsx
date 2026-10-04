import PageWrapper from "@/components/layout/page-wrapper";
import { EventGrid } from "@/components/events/event-grid"; // adjust path if different
import { useEvents } from "@/hooks/events/use-event";
import { useSavedEvents } from "@/hooks/events/use-saved-events";
import { DEFAULT_FILTERS } from "@/types/event-types";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useAuthGate } from "@/context/auth-gate";
import { useNavigate } from "react-router";
import { useAppMode } from "@/hooks/shared/use-app-mode";
import { AppScreenHeader } from "@/components/app/app-screen-header";
import { AppEventCard, AppEventCardSkeleton } from "@/components/app/app-event-card";

export default function SavedEvent() {
    const appMode = useAppMode();
    const { data, isLoading } = useEvents(DEFAULT_FILTERS);
    const events = data?.events ?? [];
    const { savedIds, toggleSave } = useSavedEvents();

    const savedEvents = events.filter((e) => savedIds.has(e.slug));
    const { user, isLoading: isUserLoading } = useAuth();
    const { requireAuth } = useAuthGate();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUserLoading && !user) {
            requireAuth("saved-events");
            navigate(-1)
        }
    }, [isUserLoading, user]);

    if (!isUserLoading && !user) {
        return null;
    }
    if (appMode) {
        return (
            <div className="mx-auto max-w-xl pb-6">
                <AppScreenHeader title="Saved" sub="Events you're keeping an eye on" />
                <div className="space-y-[18px] px-5">
                    {isLoading ? (
                        <><AppEventCardSkeleton /><AppEventCardSkeleton /></>
                    ) : savedEvents.length === 0 ? (
                        <div className="rounded-2xl bg-white p-8 text-center dark:bg-[#111A16]">
                            <p className="font-semibold text-[#0B1F1A] dark:text-[#EEF5F2]">Nothing saved yet</p>
                            <p className="mt-1 text-sm text-[#5F7068] dark:text-[#9BAAA3]">Tap the heart on any event to save it here.</p>
                        </div>
                    ) : (
                        savedEvents.map((e) => (
                            <AppEventCard key={e._id} event={e} isSaved onToggleSave={toggleSave} />
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <PageWrapper className="py-8  px-[20px] min-h-screen " >
            <header className="flex items-center   mt-5">
                <div className="mb-5 flex items-center gap-2">
                    <span className="h-0.5 w-6 bg-[#F5A524]" />
                    <span className="text-[10px] min-[400px]:text-[12px] font-[400] leading-[16px] text-[#0F6E56] dark:text-[#4ADE80] tracking-wide uppercase font-sans ">Your Events</span>
                </div>
            </header>
            <div>
                <h1 className="text-2xl min-[400px]:text-4xl lg:text-[54px] font-bold text-foreground lg:font-[700] mb-6">
                    Saved events
                </h1>
            </div>
            <div className="[--card-w:400px] ">
                <EventGrid
                    className="grid-cols-[repeat(auto-fill,minmax(0,400px))] lg:max-xl:!grid-cols-2 xl:!grid-cols-[repeat(3,400px)] !w-auto  justify-center"
                    events={savedEvents}
                    isLoading={isLoading}
                    savedIds={[...savedIds]}
                    onToggleSave={toggleSave}
                    emptyMessage="You haven't saved any events yet."
                />
            </div>

        </PageWrapper>

    );
}
import PageWrapper from "@/components/pageWrapper";
import { EventGrid } from "@/components/events/event-grid"; // adjust path if different
import { useEvents } from "@/hooks/use-event";
import { useSavedEvents } from "@/hooks/use-saved-events";
import { DEFAULT_FILTERS } from "@/types/event-types";

export default function SavedEvent() {
    const { data, isLoading } = useEvents(DEFAULT_FILTERS);
    const events = data?.events ?? [];
    const { savedIds, toggleSave } = useSavedEvents();

    const savedEvents = events.filter((e) => savedIds.has(e.id));

    return (
        <PageWrapper className="py-8 px-8 " >
            <header className="flex items-center pl-4 min-[400px]:pl-[33px] mt-5">
                <div className="h-0.5 w-6 bg-[#F5A524] rounded-full" />
                <p className="text-[10px] min-[400px]:text-[12px] font-[400] leading-[16px] text-[#0F6E56] tracking-wide uppercase ml-2 mb-2 ">
                    Your events
                </p>
            </header>
            <div className="pl-4 min-[400px]:pl-[33px]">
                <h1 className="text-2xl min-[400px]:text-4xl lg:text-[54px] font-bold text-[#1A1523] lg:font-[700] mb-6">
                    Saved events
                </h1>
            </div>
            <div className="[--card-w:400px] px-4">
                <EventGrid
  className="grid-cols-[repeat(auto-fill,minmax(0,400px))] lg:max-xl:!grid-cols-2 xl:!grid-cols-[repeat(3,400px)] !w-auto px-2 justify-center"
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
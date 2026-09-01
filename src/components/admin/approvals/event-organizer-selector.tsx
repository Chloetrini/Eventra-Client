export type EventOrganizerTab = "events" | "organizers" | "promotions"

interface EventOrganizerSelectorProps {
    activeTab: EventOrganizerTab
    onTabChange: (tab: EventOrganizerTab) => void
    eventsCount: number
    organizersCount: number
    promotionsCount: number
}

const EventOrganizerSelector = ({
    activeTab,
    onTabChange,
    eventsCount,
    organizersCount,
    promotionsCount,
}: EventOrganizerSelectorProps) => {
    return (
        <div className="flex gap-3">
            <button
                type="button"
                onClick={() => onTabChange("events")}
                className={`flex items-center gap-2 px-5 py-3 rounded-[10px] font-medium text-sm transition-colors dark:border-2 ${activeTab === "events"
                        ? "bg-[#0F0F0F] text-white dark:bg-white dark:text-black"
                        : "bg-transparent border border-border text-foreground"
                    }`}
            >
                Events
                <span
                    className={`flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs ${activeTab === "events"
                            ? "bg-[#4A4451] text-white"
                            : "bg-[#F5A524] text-black"
                        }`}
                >
                    {eventsCount}
                </span>
            </button>

            <button
                type="button"
                onClick={() => onTabChange("organizers")}
                className={`flex items-center gap-2 px-5 py-3 rounded-[10px] font-medium text-sm transition-colors dark:border-2 ${activeTab === "organizers"
                        ? "bg-[#0F0F0F] text-white dark:bg-white dark:text-black"
                        : "bg-transparent border border-border text-foreground"
                    }`}
            >
                Organizers
                <span
                    className={`flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs ${activeTab === "organizers"
                            ? "bg-[#4A4451] text-white"
                            : "bg-[#F5A524] text-black"
                        }`}
                >
                    {organizersCount}
                </span>
            </button>

            <button
                type="button"
                onClick={() => onTabChange("promotions")}
                className={`flex items-center gap-2 px-5 py-3 rounded-[10px] font-medium text-sm transition-colors dark:border-2 ${activeTab === "promotions"
                        ? "bg-[#0F0F0F] text-white dark:bg-white dark:text-black"
                        : "bg-transparent border border-border text-foreground"
                    }`}
            >
                Promotions
                <span
                    className={`flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs ${activeTab === "promotions"
                            ? "bg-[#4A4451] text-white"
                            : "bg-[#F5A524] text-black"
                        }`}
                >
                    {promotionsCount}
                </span>
            </button>
        </div>
    )
}

export default EventOrganizerSelector

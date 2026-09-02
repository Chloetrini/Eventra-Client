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
    const tabs: { key: EventOrganizerTab; label: string; count: number }[] = [
        { key: "events", label: "Events", count: eventsCount },
        { key: "organizers", label: "Organizers", count: organizersCount },
        { key: "promotions", label: "Promotions", count: promotionsCount },
    ]

    return (
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto w-full pb-1 no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onTabChange(tab.key)}
                        className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-[10px] font-medium text-xs sm:text-sm whitespace-nowrap transition-colors shrink-0 ${
                            isActive
                                ? "bg-[#0F0F0F] text-white dark:bg-white dark:text-black dark:border-2 dark:border-white"
                                : "bg-transparent border border-border text-foreground hover:bg-muted/50"
                        }`}
                    >
                        {tab.label}
                        <span
                            className={`flex items-center justify-center min-w-5 h-5 sm:min-w-6 sm:h-6 px-1.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                                isActive
                                    ? "bg-[#4A4451] text-white dark:bg-muted dark:text-foreground"
                                    : "bg-[#F5A524] text-black"
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export default EventOrganizerSelector
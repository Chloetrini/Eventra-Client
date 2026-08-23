export type RefundDisputeTab = "requests" | "disputes"

interface RefundDisputeSelectorProps {
    activeTab: RefundDisputeTab
    onTabChange: (tab: RefundDisputeTab) => void
    requestsCount: number
    disputesCount: number
}

const RefundDisputeSelector = ({
    activeTab,
    onTabChange,
    requestsCount,
    disputesCount,
}: RefundDisputeSelectorProps) => {
    return (
        <div className="flex gap-3">
            <button
                type="button"
                onClick={() => onTabChange("requests")}
                className={`flex items-center gap-2 px-5 py-3 rounded-[10px] font-medium text-sm transition-colors dark:border-2 ${activeTab === "requests"
                        ? "bg-[#0F0F0F] text-white dark:bg-white dark:text-black"
                        : "bg-transparent border border-border text-foreground"
                    }`}
            >
                Refund requests
                <span
                    className={`flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs ${activeTab === "requests"
                            ? "bg-[#4A4451] text-white"
                            : "bg-[#F5A524] text-black"
                        }`}
                >
                    {requestsCount}
                </span>
            </button>

            <button
                type="button"
                onClick={() => onTabChange("disputes")}
                className={`flex items-center gap-2 px-5 py-3 rounded-[10px] font-medium text-sm transition-colors dark:border-2 ${activeTab === "disputes"
                        ? "bg-[#0F0F0F] text-white dark:bg-white dark:text-black"
                        : "bg-transparent border border-border text-foreground"
                    }`}
            >
                Disputes
                <span
                    className={`flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs ${activeTab === "disputes"
                            ? "bg-[#4A4451] text-white"
                            : "bg-[#F5A524] text-black"
                        }`}
                >
                    {disputesCount}
                </span>
            </button>
        </div>
    )
}

export default RefundDisputeSelector
import GemImage from "@/assets/Group 8.png"

export function EventsEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-[#E4F1EB] rounded-xl p-4 mb-4">
                <img src={GemImage} alt="Gem image" className="size-6" />
            </div>
            <p className="text-base font-semibold text-[#1A1523] ">
                 No Event here
            </p>
            <p className="text-sm mt-1 text-[#4A4451]">
                 Nothing  matches this filter yet.
            </p>
        </div>
    )
}
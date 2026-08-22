import type { TopOrganizer } from "@/types/overview";

export default function OrganizerRow({ organizer }: { organizer: TopOrganizer }) {
    // Split the value so the Naira symbol and the number can share styles
    const amount = organizer.revenue.replace("₦", "");

    return (
        <div className="flex items-center justify-between text-sm gap-4">
            {/* Organizer Name - Uses global foreground color */}
            <span className="font-geist text-[15px] font-normal text-foreground leading-5 tracking-normal">
                {organizer.name}
            </span>

            {/* Revenue - Uses global foreground color */}
            <span className="flex items-center gap-0.5 font-space text-[16px] font-bold text-foreground leading-5 tracking-normal">
                <span className="font-normal text-[20px]">₦</span>
                <span>{amount}</span>
            </span>
        </div>
    );
}
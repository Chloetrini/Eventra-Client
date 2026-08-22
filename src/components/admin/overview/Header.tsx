// import { cn } from "@/lib/utils";

interface HeaderProps {
    itemsCount: number;
}

export default function Header({ itemsCount }: HeaderProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {/* Control Room Label */}
            <p className="text-xs md:text-[13px] font-space font-normal tracking-wider text-[#0F6E56] uppercase leading-[100%]">
                Control Room
            </p>

            {/* Overview Title */}
            <h1 className="font-heading text-2xl md:text-[28px] font-bold text-foreground leading-[130%] md:leading-[120%] tracking-tight">
                Overview
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-[15px] text-[#4A4451] font-geist font-normal leading-[150%] md:leading-[140%] tracking-normal max-w-md">
                {itemsCount} items need your attention across the platform.
            </p>
        </div>
    );
}
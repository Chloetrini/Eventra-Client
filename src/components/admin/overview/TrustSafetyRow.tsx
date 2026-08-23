import { cn } from "@/lib/utils";
import type { TrustSafetyItem } from "@/types/overview";

export default function TrustSafetyRow({ item }: { item: TrustSafetyItem }) {
    return (
        <div className="flex items-center justify-between py-1 gap-4">
            {/* Left Label - Uses global foreground color */}
            <span className="font-geist text-[15px] font-normal text-foreground leading-5 tracking-normal">
                {item.label}
            </span>

            {/* Right Value - Uses global foreground color */}
            <span
                className={cn(
                    "font-space text-[16px] font-bold text-foreground leading-5 tracking-normal",
                    item.tone === "danger" && "text-destructive"
                )}
            >
                {item.value}
            </span>
        </div>
    );
}

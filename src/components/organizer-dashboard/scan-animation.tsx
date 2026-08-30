import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

type DottedGlowBackgroundDemoProps = {
    onClick?: () => void;
    text: string;
    disabled?: boolean;
};

export function DottedGlowBackgroundDemo({ onClick, text, disabled }: DottedGlowBackgroundDemoProps) {
    return (
        <button
            className="group relative flex w-full h-100 md:h-130 items-end justify-end overflow-hidden rounded-3xl border border-transparent px-4 shadow ring-1 shadow-black/10 ring-black/10 dark:shadow-white/10 dark:ring-white/5 hover:ring-4 hover:ring-black/10 dark:hover:ring-white/10 transition-all duration-300"
            onClick={onClick}
            disabled={disabled}
        >
            <div className="bg-gray-100 flex items-center justify-center absolute inset-0 z-20 size-32 m-auto rounded-lg transition-transform duration-300 group-hover:scale-105">
                <div>
                    <img
                        src="https://res.cloudinary.com/dyeh9qvbl/image/upload/v1788092545/https_eventra-client-delta_vercel_app__ssn902.png"
                        alt="QR code"
                        className="z-30 size-30"
                    />
                </div>
            </div>
            <div className="relative z-20 flex w-full justify-between px-2 py-3 backdrop-blur-[2px] md:px-4 text-center">
                <p className="text-xs font-normal text-neutral-600 md:text-sm dark:text-neutral-400 text-center w-full">
                    {text}
                </p>
            </div>
<DottedGlowBackground
    className="pointer-events-none mask-radial-to-90% mask-radial-at-center w-full"
    opacity={1}
    gap={8}
    radius={2.2}
    color="#0F6E56"
    glowColor="#0F6E56"
    colorDarkVar="--color-neutral-500"
    glowColorDarkVar="--color-sky-800"
    backgroundOpacity={0}
    speedMin={0.3}
    speedMax={1.6}
    speedScale={1}
/>
        </button>
    );
}
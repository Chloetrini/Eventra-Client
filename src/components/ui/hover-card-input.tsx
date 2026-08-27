import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

interface HoverCardInputProps {
    cardContent: React.ReactNode
    editCardContent?: string
    triggerContent?: React.ReactNode
    icon?: React.ElementType | string
    editIcon?: string
    className?: string
    side?: "left" | "top" | "bottom" | "right"
    onClick?: ()=> void
}

export function HoverCardInput({
    cardContent,
    editCardContent,
    triggerContent,
    icon,
    editIcon,
    className,
    side,
    onClick,
}: HoverCardInputProps) {
    const Icon = typeof icon === "string" ? null : icon

    return (
        <HoverCard>
            <HoverCardTrigger
                delay={10}
                closeDelay={100}
                render={
                    <Button variant="outline" className={className} onClick={onClick}>
                        {typeof icon === "string" ? <img
                            src={icon}
                            alt=""
                            className={editIcon}
                        /> : Icon && <Icon />}
                        {triggerContent}
                    </Button>
                }
            />

            <HoverCardContent side={side} className={`flex w-64 flex-col gap-0.5 ${editCardContent}`}>
                {cardContent}
            </HoverCardContent>
        </HoverCard>
    )
}
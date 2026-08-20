import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

// Custom tooltip instead of the native `title` attribute. Native title
// tooltips have a long, inconsistent delay before appearing (varies by
// browser/OS), are plain unstyled boxes, and don't work on touch devices at
// all — all of which made them read as "not working" when hovering over
// truncated text. This renders instantly on hover, is actually styled to
// match the app, and can be triggered by tap on touch/mobile too.
function TooltipProvider({
  delay = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  sideOffset?: number
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}) {
  const { side, align, ...popupProps } = props as typeof props & {
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
  }
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={sideOffset} side={side} align={align}>
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 max-w-xs rounded-lg border border-border bg-[#1A1523] dark:bg-zinc-800 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in zoom-in-95 data-[ending-style]:animate-out data-[ending-style]:fade-out data-[ending-style]:zoom-out-95",
            className
          )}
          {...popupProps}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

import { useState } from "react"
import type { SVGProps } from "react"
import { Link2, Check, Share2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"

// lucide-react is a generic icon set — it doesn't carry brand marks, so
// these are small inline SVGs of the actual WhatsApp/X/Facebook/Telegram
// logos. Same approach every share widget takes; brand shapes can't be
// approximated with a generic icon.
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.85.508 3.583 1.393 5.065L2 22l5.062-1.378A9.953 9.953 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.09a8.06 8.06 0 01-4.354-1.271l-.312-.196-3.005.818.812-2.929-.203-.301A8.075 8.075 0 013.91 12c0-4.465 3.626-8.09 8.091-8.09 4.464 0 8.09 3.625 8.09 8.09 0 4.464-3.626 8.09-8.09 8.09z" />
    </svg>
  )
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.94 4.463a1.5 1.5 0 00-1.55-.267L2.98 10.874a1.4 1.4 0 00.093 2.635l4.5 1.49 1.735 5.567a1.13 1.13 0 001.87.42l2.478-2.383 4.402 3.25a1.44 1.44 0 002.28-.868L22 5.485a1.5 1.5 0 00-.06-1.022zM9.06 14.24l9.02-6.84c.19-.145.42.096.257.263l-7.36 7.51a1.4 1.4 0 00-.36.65l-.35 1.68-1.207-3.263z" />
    </svg>
  )
}

type ShareButtonProps = {
  title: string
  url: string
  triggerClassName?: string
  contentClassName?: string
  iconClassName?: string
}

export function ShareButton({
  title,
  url,
  triggerClassName,
  contentClassName,
  iconClassName,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function"

  const shareLinks = [
    {
      label: "WhatsApp",
      Icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
    },
    {
      label: "X (Twitter)",
      Icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Facebook",
      Icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "Telegram",
      Icon: TelegramIcon,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ]

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // Cancelled or unsupported mid-call — nothing to do, this is a
      // normal outcome (user backed out of the share sheet).
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy the link")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Share event"
            className={cn(
              "flex h-8 w-8 md:h-12 md:w-12 items-center justify-center border rounded-md bg-[#5A4C6AA3] transition hover:bg-white/30",
              triggerClassName
            )}
          />
        }
      >
        <Share2 className={cn("md:h-8 md:w-8 w-5 h-5 text-white", iconClassName)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-56", contentClassName)}>
        {/* Native device share sheet — on a phone this already lists
            Instagram, Messages, Mail, and every other app registered to
            handle a shared link, without us building an integration for
            each one. Instagram has no public web URL for pre-filling a
            link share outside that sheet, so this is how it's covered. Only
            shown when the browser actually supports it (mobile Safari/
            Chrome mostly — most desktop browsers don't). */}
        {canNativeShare && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="h-4 w-4" />
              Share via…
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {shareLinks.map(({ label, Icon, href }) => (
          <DropdownMenuItem key={label} render={<a href={href} target="_blank" rel="noopener noreferrer" />}>
            <Icon className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

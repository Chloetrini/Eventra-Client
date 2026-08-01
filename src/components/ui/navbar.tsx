import { useState } from "react"
import { NavLink } from "react-router"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/explore", label: "Events" },
  { to: "/organizers", label: "For Organizers" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const

const AUTH_LINKS = [
  { to: "/auth/login", label: "Log in", variant: "ghost" },
  { to: "/auth/register", label: "Get Started", variant: "primary" },
] as const

type AuthLinkProps = {
  to: string
  label: string
  variant: "ghost" | "primary"
  className?: string
  onClick?: () => void
}

function NavItem({
  to,
  label,
  onClick,
}: {
  to: string
  label: string
  onClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "text-[#1A1523]",
          isActive ? "opacity-100 text-[#0F6E56] font-semibold" : "opacity-80 hover:opacity-100"
        )
      }
    >
      {label}
    </NavLink>
  )
}

function AuthLink({ to, label, variant, className, onClick }: AuthLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        variant === "primary"
          ? "bg-[#0F6E56] text-white px-[20px] py-[10px] rounded-[5px] text-[18px] font-bold"
          : "text-[#1A1523] mr-[20px] text-[18px] font-bold",
        className
      )}
    >
      {label}
    </NavLink>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  return (
    <div className="w-full bg-white border-b-2 border-[#E8E6E0]">
      <div className="flex w-full items-center p-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center" onClick={closeMenu}>
          <img className="pl-[clamp(24px,6vw,101.5px)]" src="/logo.svg" alt="Logo" />
        </NavLink>

        {/* Navigation Links */}
        <div className="hidden lg:flex gap-[23px] pl-[45px] text-[15px] font-medium">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </div>

        {/* Auth Links */}
        <div className="hidden lg:flex ml-auto mr-[clamp(24px,6vw,101.5px)] gap-[13px] items-center">
          {AUTH_LINKS.map((link) => (
            <AuthLink key={link.to} {...link} />
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-[#1A1523] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="flex flex-col gap-3 border-t border-[#E8E6E0] p-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.to} {...link} onClick={closeMenu} />
          ))}

          <div className="mt-2 flex flex-col gap-2">
            {AUTH_LINKS.map((link) => (
              <AuthLink
                key={link.to}
                {...link}
                className="text-center"
                onClick={closeMenu}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
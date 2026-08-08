import { useState } from "react"
import { NavLink } from "react-router"
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  Ticket,
  Heart,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import PageWrapper from "../pageWrapper"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
          isActive
            ? "opacity-100 text-[#0F6E56] font-semibold"
            : "opacity-80 hover:opacity-100"
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

  const { user, logout } = useAuth()

  // Generate initials from user's full name (e.g. "Ada Okafor" -> "AO")
  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <PageWrapper className="p-[20px]">
      <div className="w-full bg-white border-b-2 border-[#E8E6E0]">
        <div className="flex w-full items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center" onClick={closeMenu}>
            <img src="/logo.svg" alt="Logo" />
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden lg:flex gap-[23px] pl-[45px] text-[15px] font-medium">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </div>

          {/* Auth Links or User Profile Dropdown */}
          <div className="hidden lg:flex ml-auto gap-[13px] items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-[10px] border border-[#E8E6E0] rounded-full py-[6px] pl-[6px] pr-[14px] bg-white hover:bg-slate-50 transition-colors focus:outline-none">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#333333] text-white font-bold text-[14px]">
                    {getInitials(user.fullname)}
                  </div>
                  <span className="text-[17px] font-bold text-[#1A1523]">
                    {user.fullname}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#1A1523]" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-[310px] rounded-[24px] border border-[#E8E6E0] p-[24px] shadow-lg bg-white mt-2"
                >
                  {/* User Profile Header */}
                  <div className="flex items-center gap-[14px] pb-[20px]">
                    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#333333] text-white font-bold text-[18px]">
                      {getInitials(user.fullname)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[20px] font-bold text-[#1A1523] leading-tight">
                        {user.fullname}
                      </span>
                      <span className="text-[15px] text-[#52525B] mt-[2px]">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-[#E8E6E0] my-0" />

                  {/* Menu Options */}
                  <div className="py-[12px] space-y-[8px]">
                    <DropdownMenuItem>
                      <NavLink
                        to="/profile"
                        className="flex w-full items-center gap-[14px] px-0 py-[6px] text-[18px] font-bold text-[#1A1523] cursor-pointer hover:text-[#0F6E56]"
                      >
                        <UserIcon className="h-5 w-5 text-[#1A1523]" />
                        <span>Profile</span>
                      </NavLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <NavLink
                        to="/my-tickets"
                        className="flex w-full items-center gap-[14px] px-0 py-[6px] text-[18px] font-bold text-[#1A1523] cursor-pointer hover:text-[#0F6E56]"
                      >
                        <Ticket className="h-5 w-5 text-[#EAB308]" />
                        <span>My tickets</span>
                      </NavLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <NavLink
                        to="/saved-events"
                        className="flex w-full items-center gap-[14px] px-0 py-[6px] text-[18px] font-bold text-[#1A1523] cursor-pointer hover:text-[#0F6E56]"
                      >
                        <Heart className="h-5 w-5 text-[#1A1523]" />
                        <span>Saved events</span>
                      </NavLink>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-[#E8E6E0] my-0" />

                  {/* Sign Out Action */}
                  <div className="pt-[16px]">
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-[14px] px-0 py-[8px] text-[18px] font-bold text-[#B91C1C] cursor-pointer hover:text-[#991B1B]"
                    >
                      <LogOut className="h-5 w-5 text-[#B91C1C]" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              AUTH_LINKS.map((link) => (
                <AuthLink key={link.to} {...link} />
              ))
            )}
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
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-t border-[#E8E6E0]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#333333] text-white font-bold">
                      {getInitials(user.fullname)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1A1523]">
                        {user.fullname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className="py-1 text-sm font-semibold text-[#1A1523]"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/my-tickets"
                    onClick={closeMenu}
                    className="py-1 text-sm font-semibold text-[#1A1523]"
                  >
                    My tickets
                  </NavLink>
                  <NavLink
                    to="/saved-events"
                    onClick={closeMenu}
                    className="py-1 text-sm font-semibold text-[#1A1523]"
                  >
                    Saved events
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                    className="py-1 text-left text-sm font-bold text-[#B91C1C]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                AUTH_LINKS.map((link) => (
                  <AuthLink
                    key={link.to}
                    {...link}
                    className="text-center"
                    onClick={closeMenu}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default Navbar
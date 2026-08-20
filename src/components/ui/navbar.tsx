import { useState } from "react";
import { NavLink } from "react-router";
import { UI_ASSETS } from "@/lib/assets";
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  Ticket,
  Heart,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "../pageWrapper";
import { useAuth } from "@/context/auth.context";
import { useTheme } from "@/context/theme.context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { to: "/explore", label: "Events" },
  { to: "/organizers", label: "For Organizers" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const AUTH_LINKS = [
  { to: "/auth/login", label: "Log in", variant: "ghost" },
  { to: "/auth/register", label: "Get Started", variant: "primary" },
] as const;

type AuthLinkProps = {
  to: string;
  label: string;
  variant: "ghost" | "primary";
  className?: string;
  onClick?: () => void;
};

function NavItem({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "text-[#1A1523] dark:text-white",
          isActive
            ? "opacity-100 text-[#0F6E56] font-semibold dark:text-[#4ADE80]"
            : "opacity-80 hover:opacity-100",
        )
      }
    >
      {label}
    </NavLink>
  );
}

function AuthLink({ to, label, variant, className, onClick }: AuthLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        variant === "primary"
          ? "bg-[#0F6E56] text-white px-5 py-2.5 rounded-[5px] text-[18px] font-bold"
          : "text-[#1A1523] dark:text-white mr-5 text-[18px] font-bold",
        className,
      )}
    >
      {label}
    </NavLink>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const ThemeToggleButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E6E0] hover:bg-slate-50 transition-colors dark:border-white/10 dark:hover:bg-white/10 shrink-0"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-[#1A1523] dark:text-white" />
      ) : (
        <Moon className="h-5 w-5 text-[#1A1523]" />
      )}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-black">
      <PageWrapper className="p-5">
        <div className="w-full">
          <div className="flex w-full items-center">
            {/* Logo */}
            <NavLink to="/" className="flex items-center cursor-pointer gap-2" onClick={closeMenu}>
              <img src={UI_ASSETS.Eventraa} alt="Eventra-Logo" />
              <p className="font-extrabold text-[27px] dark:text-white font-grotesk tracking-tight">Eventra</p>
            </NavLink>

            {/* Navigation Links */}
            <div className="hidden lg:flex gap-5.75 pl-11.25 text-[15px] font-medium">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </div>

            {/* Auth Links or User Profile Dropdown */}
            <div className="hidden lg:flex ml-auto gap-3.25 items-center">
              {ThemeToggleButton}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2.5 border border-[#E8E6E0] rounded-full py-[6px] pl-[6px] pr-[14px] bg-white hover:bg-slate-50 transition-colors focus:outline-none dark:bg-[#18181B] dark:border-white/10 dark:hover:bg-white/10">
                    <div className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-[#333333] text-white font-bold text-[14px]">
                      {getInitials(user.fullname)}
                    </div>
                    <span className="text-[17px] font-bold text-[#1A1523] dark:text-white">
                      {user.fullname}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[#1A1523] dark:text-white" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-77.5 rounded-[24px] border border-[#E8E6E0] p-6 shadow-lg bg-white mt-2 dark:bg-[#18181B] dark:border-white/10"
                  >
                    <div className="flex items-center gap-3.5 pb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#333333] text-white font-bold text-[18px]">
                        {getInitials(user.fullname)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[20px] font-bold text-[#1A1523] dark:text-white leading-tight">
                          {user.fullname}
                        </span>
                        <span className="text-[15px] text-[#52525B] dark:text-white/60 mt-0.5">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <DropdownMenuSeparator className="bg-[#E8E6E0] dark:bg-white/10 my-0" />

                    <div className="py-[12px] space-y-[8px]">
                      <DropdownMenuItem>
                        <NavLink
                          to="/profile"
                          className="flex w-full items-center gap-[14px] px-0 py-[6px] text-[18px] font-bold text-[#1A1523] dark:text-white cursor-pointer hover:text-[#0F6E56]"
                        >
                          <UserIcon className="h-5 w-5 text-[#1A1523] dark:text-white" />
                          <span>Profile</span>
                        </NavLink>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <NavLink
                          to="/tickets"
                          className="flex w-full items-center gap-3.5 px-0 py-1.5 text-[18px] font-bold text-[#1A1523] dark:text-white cursor-pointer hover:text-[#0F6E56]"
                        >
                          <Ticket className="h-5 w-5 text-[#EAB308]" />
                          <span>My tickets</span>
                        </NavLink>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <NavLink
                          to="/saved-events"
                          className="flex w-full items-center gap-[14px] px-0 py-[6px] text-[18px] font-bold text-[#1A1523] dark:text-white cursor-pointer hover:text-[#0F6E56]"
                        >
                          <Heart className="h-5 w-5 text-[#1A1523] dark:text-white" />
                          <span>Saved events</span>
                        </NavLink>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-[#E8E6E0] dark:bg-white/10 my-0" />

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
                AUTH_LINKS.map((link) => <AuthLink key={link.to} {...link} />)
              )}
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-[#1A1523] dark:text-white lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* Mobile nav */}
          {open && (
            <div className="flex flex-col gap-3 border-t border-[#E8E6E0] dark:border-white/10 p-4 lg:hidden">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.to} {...link} onClick={closeMenu} />
              ))}

              <div className="flex items-center justify-between py-2 border-t border-[#E8E6E0] dark:border-white/10">
                <span className="text-sm font-semibold text-[#1A1523] dark:text-white">
                  Theme
                </span>
                {ThemeToggleButton}
              </div>

              <div className="mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2 border-t border-[#E8E6E0] dark:border-white/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#333333] text-white font-bold">
                        {getInitials(user.fullname)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1A1523] dark:text-white">
                          {user.fullname}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-white/60">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <NavLink
                      to="/profile-settings"
                      onClick={closeMenu}
                      className="py-1 text-sm font-semibold text-[#1A1523] dark:text-white"
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/tickets"
                      onClick={closeMenu}
                      className="py-1 text-sm font-semibold text-[#1A1523] dark:text-white"
                    >
                      My tickets
                    </NavLink>
                    <NavLink
                      to="/saved-events"
                      onClick={closeMenu}
                      className="py-1 text-sm font-semibold text-[#1A1523] dark:text-white"
                    >
                      Saved events
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMenu();
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
    </div>
  );
}

export default Navbar;

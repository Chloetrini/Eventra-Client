import { useState } from "react";
import { NavLink } from "react-router";
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LayoutDashboard,
  Ticket,
  Heart,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "../page-wrapper";
import { useAuth } from "@/context/auth.context";
import { useTheme } from "@/context/theme.context";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/notifications/notificationBell";

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
          ? "bg-[#0F6E56] text-white px-[20px] py-[10px] rounded-[5px] text-[18px] font-bold"
          : "text-[#1A1523] dark:text-white mr-[20px] text-[18px] font-bold",
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
  const isOrganizer = user?.role === "organizer";
  const isAdmin = user?.role === "admin";

  const dashboardPath = isAdmin
    ? "/admin/overview"
    : isOrganizer
      ? "/dashboard/overview"
      : "/profile";
  const dashboardLabel = isAdmin || isOrganizer ? "Dashboard" : "Profile";

  const ThemeToggleButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
    <div className="sticky top-0 z-40 border-b-2 border-[#E8E6E0] bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-[#18181B]/80">
      <PageWrapper className="p-[20px]">
        <div className="w-full">
          <div className="flex w-full items-center">
            <NavLink
              to="/"
              className="flex items-center"
              onClick={closeMenu}
              aria-label="Eventra home"
            >
              <svg
                width="141"
                height="33"
                viewBox="0 0 141 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.9115 11.5996C28.9115 11.5996 11.1241 21.0955 7.94662 23.7725C5.86744 25.5242 7.24628 30.1193 7.24628 30.1193C7.24628 30.1193 26.165 22.063 27.9063 20.8836C28.5771 20.4292 28.9558 19.5676 29.0924 18.5269C29.3871 16.2818 28.9115 11.5996 28.9115 11.5996Z"
                  fill="#0F6E56"
                />
                <path
                  d="M28.7379 0.398682C28.7379 0.398682 8.04258 14.748 6.88436 16.7647C5.3789 19.3861 6.78841 20.8937 6.78841 20.8937C6.78841 20.8937 24.754 11.5577 28.3002 8.75896C28.7379 8.41351 28.7379 0.398682 28.7379 0.398682Z"
                  fill="#0F6E56"
                />
                <path
                  d="M11.2732 32.0452L28.2564 24.2977C28.2564 24.2977 29.1711 29.2357 27.2497 31.126C25.9065 32.4476 22.5995 32.6371 19.356 32.5964C15.271 32.5452 11.2732 32.0452 11.2732 32.0452Z"
                  fill="#0F6E56"
                />
                <path
                  d="M39.7595 26.5V7.44997H53.5708V11.5113H44.5352V14.607H52.0891V18.4567H44.5352V22.4386H53.756V26.5H39.7595ZM59.154 26.5L53.73 12.2125H58.9159L62.0512 23.0736H61.7072L64.8293 12.2125H70.0152L64.6044 26.5H59.154ZM77.7151 26.8572C76.304 26.8572 75.0119 26.5529 73.8389 25.9444C72.6748 25.327 71.7443 24.4583 71.0476 23.3382C70.3508 22.2093 70.0025 20.8732 70.0025 19.3298C70.0025 17.804 70.342 16.4855 71.0211 15.3743C71.7002 14.2542 72.6218 13.3899 73.786 12.7813C74.9502 12.164 76.2599 11.8553 77.7151 11.8553C78.5176 11.8553 79.329 11.9744 80.1492 12.2125C80.9783 12.4506 81.7412 12.8739 82.4379 13.4825C83.1346 14.091 83.6947 14.9465 84.118 16.0489C84.5413 17.1426 84.753 18.5448 84.753 20.2558H72.979V17.8217H80.6123L80.2683 18.4699C80.1978 17.6409 80.0346 16.9706 79.7788 16.459C79.5319 15.9475 79.2188 15.5771 78.8396 15.3478C78.4691 15.1097 78.0502 14.9906 77.5828 14.9906C76.939 14.9906 76.4098 15.1802 75.9953 15.5595C75.5896 15.9387 75.2897 16.459 75.0957 17.1205C74.9017 17.7731 74.8047 18.5184 74.8047 19.3562C74.8047 20.6174 75.0295 21.6272 75.4793 22.3857C75.938 23.1442 76.67 23.5234 77.6754 23.5234C78.2927 23.5234 78.8307 23.3647 79.2893 23.0472C79.748 22.7209 80.1096 22.2093 80.3741 21.5126L84.5016 22.4916C84.1665 23.5323 83.6373 24.3745 82.9141 25.0183C82.1998 25.6622 81.384 26.1296 80.4667 26.4206C79.5495 26.7117 78.6323 26.8572 77.7151 26.8572ZM86.7776 26.5V12.2125H91.2887V15.533L91.1829 14.9377C91.6415 13.9499 92.2589 13.1914 93.035 12.6623C93.8199 12.1243 94.768 11.8553 95.8793 11.8553C97.0258 11.8553 97.9474 12.1199 98.6442 12.649C99.3497 13.1694 99.8613 13.8882 100.179 14.8054C100.496 15.7138 100.655 16.7501 100.655 17.9143V26.5H96.0248V18.1921C96.0248 17.2396 95.8837 16.5164 95.6015 16.0225C95.3281 15.5286 94.8342 15.2817 94.1198 15.2817C93.229 15.2817 92.5543 15.6918 92.0957 16.512C91.6459 17.3234 91.421 18.5934 91.421 20.322V26.5H86.7776ZM107.693 26.5C106.432 26.5 105.489 26.2134 104.862 25.6401C104.236 25.0668 103.923 24.2158 103.923 23.0 [truncated]"
                  fill="currentColor"
                  className="text-[#1A1523] dark:text-white"
                />
              </svg>
            </NavLink>

            <div className="hidden lg:flex gap-[23px] pl-[45px] text-[15px] font-medium">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </div>

            <div className="ml-auto hidden items-center gap-[13px] lg:flex">
              {ThemeToggleButton}
              {user && <NotificationBell />}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-[10px] border border-[#E8E6E0] rounded-full py-[6px] pl-[6px] pr-[14px] bg-white hover:bg-slate-50 transition-colors focus:outline-none dark:bg-[#18181B] dark:border-white/10 dark:hover:bg-white/10">
                    <UserAvatar
                      avatarUrl={user.avatarUrl}
                      name={user.fullname}
                      className="h-[38px] w-[38px] text-[14px]"
                    />
                    <span className="text-[17px] font-bold text-[#1A1523] dark:text-white">
                      {user.fullname}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[#1A1523] dark:text-white" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-[310px] rounded-[24px] border border-[#E8E6E0] bg-white p-[24px] shadow-lg mt-2 dark:bg-[#18181B] dark:border-white/10"
                  >
                    <div className="flex items-center gap-[14px] pb-[20px]">
                      <UserAvatar
                        avatarUrl={user.avatarUrl}
                        name={user.fullname}
                        className="h-[48px] w-[48px] text-[18px]"
                      />
                      <div className="flex flex-col">
                        <span className="text-[20px] font-bold text-[#1A1523] dark:text-white leading-tight">
                          {user.fullname}
                        </span>
                        <span className="text-[15px] text-[#52525B] dark:text-white/60 mt-[2px]">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <DropdownMenuSeparator className="bg-[#E8E6E0] dark:bg-white/10 my-0" />

                    <div className="py-[12px] space-y-[8px]">
                      <DropdownMenuItem>
                        <NavLink
                          to={dashboardPath}
                          className="flex w-full items-center gap-[14px] px-0 py-[6px] text-[18px] font-bold text-[#1A1523] dark:text-white cursor-pointer hover:text-[#0F6E56]"
                        >
                          {isAdmin || isOrganizer ? (
                            <LayoutDashboard className="h-5 w-5 text-[#1A1523] dark:text-white" />
                          ) : (
                            <UserIcon className="h-5 w-5 text-[#1A1523] dark:text-white" />
                          )}
                          <span>{dashboardLabel}</span>
                        </NavLink>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <NavLink
                          to="/tickets"
                          className="flex w-full items-center gap-[14px] px-0 py-[6px] text-[18px] font-bold text-[#1A1523] dark:text-white cursor-pointer hover:text-[#0F6E56]"
                        >
                          <Ticket className="h-5 w-5 text-[#EAB308] dark:text-[#FACC15]" />
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
                        className="flex items-center gap-[14px] px-0 py-[8px] text-[18px] font-bold text-[#B91C1C] cursor-pointer hover:text-[#991B1B] dark:text-red-400 dark:hover:text-red-300"
                      >
                        <LogOut className="h-5 w-5 text-[#B91C1C] dark:text-red-400" />
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

          <div
            className={`grid transition-all duration-300 ease-in-out lg:hidden ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden flex flex-col gap-3 border-t border-[#E8E6E0] dark:border-white/10 p-4">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.to} {...link} onClick={closeMenu} />
              ))}

              <div className="flex items-center justify-between py-2 border-t border-[#E8E6E0] dark:border-white/10">
                <span className="text-sm font-semibold text-[#1A1523] dark:text-white">Theme</span>
                {ThemeToggleButton}
              </div>

              {user && (
                <div className="flex items-center justify-between py-2 border-t border-[#E8E6E0] dark:border-white/10">
                  <span className="text-sm font-semibold text-[#1A1523] dark:text-white">Notifications</span>
                  <NotificationBell />
                </div>
              )}

              <div className="mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2 border-t border-[#E8E6E0] dark:border-white/10">
                      <UserAvatar
                        avatarUrl={user.avatarUrl}
                        name={user.fullname}
                        className="h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1A1523] dark:text-white">{user.fullname}</span>
                        <span className="text-xs text-gray-500 dark:text-white/60">{user.email}</span>
                      </div>
                    </div>

                    <NavLink
                      to={dashboardPath}
                      onClick={closeMenu}
                      className="py-1 text-sm font-semibold text-[#1A1523] dark:text-white"
                    >
                      {dashboardLabel}
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
                      className="py-1 text-left text-sm font-bold text-[#B91C1C] dark:text-red-400"
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
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

export default Navbar;

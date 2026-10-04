import { Compass, Heart, Ticket, User } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Discover", icon: Compass, end: true },
  { to: "/saved-events", label: "Saved", icon: Heart, end: false },
  { to: "/tickets", label: "Tickets", icon: Ticket, end: false },
  { to: "/profile", label: "Profile", icon: User, end: false },
] as const;

export function AppTabBar() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E2E9E6] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-[#22302A] dark:bg-[#111A16]/95"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-around">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-semibold transition-colors active:scale-95",
                  isActive ? "text-[#0F6E56] dark:text-[#3CCB9C]" : "text-[#93A19B] dark:text-[#68776F]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 1.8} fill={isActive && label !== "Discover" ? "currentColor" : "none"} />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

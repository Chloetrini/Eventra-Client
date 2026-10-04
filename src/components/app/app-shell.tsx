import { Outlet, useLocation } from "react-router";
import { AppTabBar } from "./app-tab-bar";

// The installed-app frame: no website navbar or footer, just the screen and a
// bottom tab bar. Event pages have their own buy bar, so the tab bar steps aside there.
export function AppShell() {
  const { pathname } = useLocation();
  const hideTabs = pathname.startsWith("/events/") || pathname.startsWith("/payment");

  return (
    <div className="min-h-dvh bg-[#F6F8F7] text-foreground dark:bg-[#08100D]">
      <main className={hideTabs ? "" : "pb-[calc(76px+env(safe-area-inset-bottom))]"}>
        <Outlet />
      </main>
      {hideTabs ? null : <AppTabBar />}
    </div>
  );
}

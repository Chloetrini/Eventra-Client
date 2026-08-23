import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";

// Previously this never wired up SideBar's isOpen/onClose or TopBar's
// onMenuClick — both components already support the mobile drawer, but
// nothing here ever opened it, so the hamburger button below `lg` did
// nothing and the admin console was effectively unusable on a phone. Same
// sidebarOpen/setSidebarOpen pattern as the organizer dashboard's layout.
export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close the mobile drawer whenever the route changes, so it doesn't stay
  // open over the newly-loaded page after tapping a nav link.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}  />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto ">
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}

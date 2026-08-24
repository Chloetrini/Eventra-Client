import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Sidebar from "@/components/organizer-dashboard/SideBar";
import TopBar from "@/components/organizer-dashboard/TopBar";
import { useDashboard } from "@/hooks/useDashboard";
import { clearCreatedEventId } from "@/lib/create-event-api";
import { CREATE_EVENT_STORAGE_KEY } from "@/routes/dashboard/create-event/layout";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard/overview": "Overview",
  "/dashboard/events": "Events",
  "/dashboard/attendees": "Attendees",
  "/dashboard/check-in": "Check-in",
  "/dashboard/promotion": "Promotions",
  // Missing before — these two pages silently fell back to the "Overview"
  // default below and never showed their own title in the top bar.
  "/dashboard/payouts": "Payouts",
  "/dashboard/settings": "Settings",
  "/dashboard/create-event": "Create event",
};

const LayoutSkeleton = () => (
  <div className="flex h-screen bg-background animate-pulse">
    <div className="hidden lg:flex w-[295px] bg-gray-800 h-full p-4 flex-col gap-4 shrink-0">
      <div className="h-8 bg-gray-700 rounded w-3/4" />
      <div className="flex-1 space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 bg-gray-700 rounded" />
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col min-w-0">
      <div className="h-16 bg-card border-b border-border flex items-center px-4 sm:px-6 gap-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="ml-auto flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-200 dark:bg-white/10 rounded-full" />
          <div className="hidden sm:block h-6 w-20 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-white/10 rounded" />
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        <div className="h-24 bg-gray-200 dark:bg-white/10 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-white/10 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-white/10 rounded-xl" />
      </div>
    </div>
  </div>
);

export default function DashBoardLayout() {
  const { data, isLoading, isError } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close the mobile drawer whenever the route changes (e.g. after tapping
  // a nav link) so it doesn't stay open over the newly-loaded page.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleCreateEvent = () => {
    // Same "start fresh" guard as the Events page's own Create Event
    // button — clears any abandoned draft so the wizard doesn't resume
    // stale data.
    clearCreatedEventId();
    localStorage.removeItem(CREATE_EVENT_STORAGE_KEY);
    navigate("/dashboard/create-event/type");
  };

  if (isLoading) return <LayoutSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-red-500 dark:text-red-400 font-medium">
          Failed to load dashboard. Please refresh or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        organization={data.organization}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          organization={data.organization}
          onCreateEvent={handleCreateEvent}
          onMenuClick={() => setSidebarOpen(true)}
          title={PAGE_TITLES[location.pathname] ?? "Overview"}
        />
        {/* max-w + mx-auto here, not per-page — Settings was the only
            dashboard page capping/centering its own content, so every
            other page (Overview, Attendees, Check-in, Payouts, ...)
            stretched full-width instead. Centralizing it here means every
            dashboard page matches Settings' width automatically. */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[1147px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

import { Outlet } from "react-router";
import Sidebar from "@/components/organizer-dashboard/SideBar";
import TopBar from "@/components/organizer-dashboard/TopBar";
import { useDashboard } from "@/hooks/useDashboard";

const LayoutSkeleton = () => (
  <div className="flex h-screen bg-gray-50 animate-pulse">
    <div className="w-64 bg-gray-800 h-full p-4 flex flex-col gap-4">
      <div className="h-8 bg-gray-700 rounded w-3/4" />
      <div className="flex-1 space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 bg-gray-700 rounded" />
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col">
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="ml-auto flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

export default function OrganizerLayout() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <LayoutSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500 font-medium">
          Failed to load dashboard. Please refresh or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar organization={data.organization} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          organization={data.organization}
          onCreateEvent={() => console.log("Create event")}
          title="Overview"
        />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
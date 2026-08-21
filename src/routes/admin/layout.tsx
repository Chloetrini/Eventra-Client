import { Outlet } from "react-router";
import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
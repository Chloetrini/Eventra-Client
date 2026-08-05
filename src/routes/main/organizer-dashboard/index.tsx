import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import SideBar from '@/components/organizer-dashboard/SideBar';
import TopBar from '@/components/organizer-dashboard/TopBar';
import StatsBanner from '@/components/organizer-dashboard/StatsBanner';
import StatsCards from '@/components/organizer-dashboard/StatsCards';
import RecentEventsTable from '@/components/organizer-dashboard/RecentEventsTable';

// 1. Local Skeleton Component (Does NOT touch global suspense-ui.tsx)
const DashboardPageSkeleton = () => (
  <div className="flex-1 overflow-y-auto px-8 py-6 animate-pulse">
    {/* Banner Skeleton */}
    <div className="h-24 bg-gray-200 rounded-xl mb-6 w-full" />
    
    {/* Header Skeleton */}
    <div className="mb-6">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20 mt-4" />
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-32" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center px-6 py-4 border-b border-gray-100 gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 flex flex-col gap-1">
             <div className="h-4 bg-gray-200 rounded w-1/3" />
             <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  // 2. Using standard isLoading check (Safe without breaking global suspense)
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <DashboardPageSkeleton />;
  
  if (isError || !data) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 font-medium">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          organization={data.organization} 
          onCreateEvent={() => console.log('create event')} 
        />
        
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Status Banner */}
          <StatsBanner 
            status={data.accountStatus} 
            onAction={() => console.log('Action clicked')}
            onClose={() => console.log('Banner closed')}
          />

          {/* Welcome Header */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-[#0F6E56] uppercase tracking-widest mb-1">DASHBOARD</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {data.organization.name} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's how your events are performing. Full charts and activity land in Batch 2.
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={data.stats} />

          {/* Recent Events Table */}
          <RecentEventsTable 
            events={data.recentEvents} 
            onViewAll={() => console.log('View all clicked')} 
          />
        </main>
      </div>
    </div>
  );
}
import React from 'react';

export default function ProfileSettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-200 mb-8">
        <div className="h-20 w-20 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>

      {/* Settings Form Skeleton */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 mt-2" />
      </div>

      {/* NToggles Skeleton */}
      <div className="space-y-6 border-t border-gray-200 pt-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="h-6 w-11 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-6 w-11 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
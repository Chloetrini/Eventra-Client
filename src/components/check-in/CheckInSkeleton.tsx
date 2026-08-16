import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function CheckInSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <Skeleton className="h-24 w-full rounded-xl" />

      {/* Gate Section Skeleton */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Skeleton className="w-28 h-28 rounded-2xl shrink-0" />
            <div className="flex-1 w-full space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Card Skeleton */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Lookup Skeleton */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



export { default as CheckInSkeleton } from './CheckInSkeleton';
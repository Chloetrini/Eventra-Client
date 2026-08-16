import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function PromotionSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Boost an event card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-11 w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Where promoted events appear card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full max-w-[280px]" />
              ))}
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* Your Promotions table */}
      <Card size="sm">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-(--card-spacing) py-4 border-t border-border"
            >
              <Skeleton className="h-4 w-1/4 max-w-[160px]" />
              <Skeleton className="h-4 w-1/6 max-w-[100px]" />
              <Skeleton className="h-4 w-1/6 max-w-[100px]" />
              <Skeleton className="h-4 w-20 ml-auto" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

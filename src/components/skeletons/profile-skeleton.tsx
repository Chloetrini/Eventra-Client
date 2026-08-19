import { Skeleton } from "@/components/ui/skeleton";
import PageWrapper from "@/components/page-wrapper";

/** Was `profile-settings/ProfileSettingsSkeleton.tsx`, built from raw
 * `bg-gray-200 dark:bg-white/10` divs — moved into the shared skeletons
 * folder and rebuilt on the same <Skeleton> primitive every other skeleton
 * in the app uses, so this one isn't the odd one out. */
export function ProfileSkeleton() {
  return (
    <PageWrapper className="p-[20px]">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-border mb-8">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Settings form */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32 mt-2" />
      </div>

      {/* Notification toggles */}
      <div className="space-y-6 border-t border-border pt-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

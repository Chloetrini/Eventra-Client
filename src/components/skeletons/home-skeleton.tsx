import { Skeleton } from "@/components/ui/skeleton";
import { EventCardSkeleton } from "@/components/skeletons/event-card-skeleton";

/** Replaces the "N EVENTS THIS WEEK" eyebrow line while the home page's
 * event query is loading. */
export function HomeEventCountSkeleton() {
  return <Skeleton className="h-3 w-40 bg-white/20" />;
}

/** Matches the mobile hero card / desktop StackedCardCarousel's front-card
 * shape (image, category label, title, date, price, CTA) — shown in place
 * of the featured event card while events are still loading. */
export function HomeHeroCardSkeleton() {
  return (
    <div className="w-full bg-card rounded-2xl overflow-hidden shadow-xl">
      <Skeleton className="h-45 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Matches FeaturedEvents' "Featured this week" section — header +
 * mobile scroll row / desktop 4-up grid of EventCardSkeletons. */
export function FeaturedEventsSkeleton() {
  return (
    <section>
      <div className="flex items-end justify-between mb-3.5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="hidden sm:block h-8 w-20 rounded-2xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

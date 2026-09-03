import React from "react";
import { Link } from "react-router";
import { useCategories } from "@/hooks/use-event";

// Replaces the old hardcoded "Afrobeats · Tech · Comedy · Detty December"
// row in the home hero — those four names were typed directly into the
// component and never changed no matter what categories/events actually
// existed. This pulls the real category list from the backend (same
// /categories endpoint + useCategories hook the "Browse by vibe" grid
// uses), auto-scrolls it like a marquee, pauses on hover, and each name
// is a real link to that category's events on /explore — same
// `/explore?categories=<id>` pattern vibe-grid.tsx already uses.
export const PopularCategoriesMarquee: React.FC = () => {
  const { categories, isLoading } = useCategories();

  const displayCategories = categories.filter((c) => c.eventCount > 0);

  // Nothing to show — hide the whole row rather than render an empty
  // "POPULAR" label with no tags after it (same call vibe-grid.tsx makes
  // when there are no categories with events yet).
  if (!isLoading && displayCategories.length === 0) {
    return null;
  }

  // A CSS marquee loops by translating a track exactly -50% where the
  // track is two identical copies of the item list back to back — the
  // jump from -50% back to 0% is invisible because both halves are
  // identical. That only reads as continuous motion if the track is
  // comfortably wider than the viewport, so pad short lists (e.g. just
  // 2-3 categories) by repeating them before duplicating, rather than
  // letting a two-or-three-item track loop so fast it looks like it's
  // stuttering.
  const padded: typeof displayCategories = [];
  while (displayCategories.length > 0 && padded.length < 8) {
    padded.push(...displayCategories);
  }
  const trackItems = [...padded, ...padded];

  return (
    <div className="font-geist flex flex-row items-start sm:items-center gap-3">
      <span className="font-medium text-[13px] text-white/70 shrink-0 pt-px sm:pt-0">
        POPULAR
      </span>

      {isLoading ? (
        <div className="h-4 w-48 rounded bg-white/10 animate-pulse" />
      ) : (
        <div className="relative flex-1 min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
          <div className="flex flex-row items-center gap-x-3 w-max animate-popular-categories-scroll hover:[animation-play-state:paused]">
            {trackItems.map((category, i) => (
              <React.Fragment key={`${category._id}-${i}`}>
                {i > 0 && <span className="text-white/40 text-[13px]">●</span>}
                <Link
                  to={`/explore?categories=${category._id}`}
                  className="text-[#FCD98A] text-[13px] whitespace-nowrap hover:underline"
                >
                  {category.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

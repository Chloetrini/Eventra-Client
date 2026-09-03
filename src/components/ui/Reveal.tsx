import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms — use this to fan out a row/grid of cards. */
  delayMs?: number;
  /** Re-plays the animation every time the section re-enters view instead
   *  of only once. Off by default — a page that keeps re-animating every
   *  time you scroll past the same section gets tiring fast. */
  repeat?: boolean;
}

/**
 * Fades + slides a section up into place the first time it scrolls into
 * view — used across the home page (stats bar, vibe grid, featured
 * events, feature highlights, how-it-works, testimonials, FAQ, CTA) so the
 * page feels alive as you scroll instead of every section just being
 * fully rendered from the first paint.
 *
 * Pure CSS transition driven by one IntersectionObserver per instance —
 * no animation library needed. Respects prefers-reduced-motion: a viewer
 * who's asked for reduced motion sees everything at full opacity/position
 * immediately, no observer even attached.
 */
export const Reveal: React.FC<RevealProps> = ({ children, className, delayMs = 0, repeat = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            setVisible(false);
          }
        });
      },
      // Fires a little before the section reaches the very bottom edge of
      // the viewport, and only once ~15% of it is showing — reads as
      // "arriving just in time" rather than either popping in at the very
      // last pixel or triggering too early while it's still far below the
      // fold.
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <div
      ref={ref}
      className={cn("reveal-on-scroll", visible && "reveal-on-scroll-visible", className)}
      style={delayMs ? ({ transitionDelay: `${delayMs}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
};

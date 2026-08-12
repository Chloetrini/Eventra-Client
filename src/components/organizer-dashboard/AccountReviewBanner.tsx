import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountReviewBannerProps {
  onViewStatus?: () => void;
}

export default function AccountReviewBanner({ onViewStatus }: AccountReviewBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full rounded-2xl bg-[#eaf4ec] border border-[#d2e9d7] p-3.5 sm:p-4 transition-all dark:bg-emerald-950/30 dark:border-emerald-900/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Icon + Message */}
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#185e42] text-white shadow-xs">
            <Clock className="size-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold text-[#44381e] dark:text-emerald-200">
                Your account is under review
              </h4>
              <span className="inline-flex items-center rounded-full bg-[#cbe3d3] px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#245837] uppercase">
                PENDING
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              We usually approve within a day. Free events can go live now, paid events unlock once you're verified.
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <Button
            type="button"
            onClick={onViewStatus}
            className="h-9 px-4 rounded-lg bg-[#1c1d22] text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            View status
          </Button>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Button } from '@/components/ui/button';

interface PromotionsCardProps {
  isPromoted?: boolean;
  message?: string;
  onPromote?: () => void;
}

export default function PromotionsCard({
  isPromoted = false,
  message = 'This event is not promoted yet. Boost it for a featured spot on homepage and explore',
  onPromote,
}: PromotionsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-4 shadow-2xs dark:bg-zinc-900 dark:border-zinc-800">
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
        Promotions
      </h3>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {message}
      </p>

      <div>
        <Button
          type="button"
          onClick={onPromote}
          className="h-8 rounded-lg px-4 text-xs font-semibold bg-[#185e42] text-white hover:bg-[#134c35] transition-colors"
        >
          {isPromoted ? 'Manage promotion' : 'Promote event'}
        </Button>
      </div>
    </div>
  );
}

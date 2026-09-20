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
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <h3 className="text-base font-bold text-foreground">
        Promotions
      </h3>

      <p className="text-xs text-muted-foreground leading-relaxed">
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

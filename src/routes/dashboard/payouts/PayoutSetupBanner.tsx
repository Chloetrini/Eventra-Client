import { Clock, X } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PayoutSetupBannerProps {
  onDismiss?: () => void;
}

// Distinct from AccountReviewBanner on purpose — bank readiness is tracked
// independently of admin approval (see useOrganizerProfile), so an
// otherwise-verified organizer can still be missing a bank account. This
// only renders for that specific gap, never alongside the general
// unverified/pending/rejected banner.
export function PayoutSetupBanner({ onDismiss }: PayoutSetupBannerProps) {
  return (
    <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center justify-between gap-4 rounded-xl border border-[#F4DFB6] dark:border-[#7A4E02]/40 bg-[#FCD98A]/40 dark:bg-[#7A4E02]/20 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-card">
          <Clock className="h-4 w-4 text-[#7A4E02] dark:text-[#F5C875]" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[15px] font-semibold text-[#7A4E02] dark:text-[#F5C875]">
              Set up payouts
            </p>
            <Badge className="border-transparent bg-card text-[#7A4E02] dark:text-[#F5C875] font-space text-[10px]">
              ACTION NEEDED
            </Badge>
          </div>
          <p className="mt-0.5 text-[13px] text-[#7A4E02]/90 dark:text-[#F5C875]/80">
            Add and verify your bank account to receive payouts. Your earnings are held safely until you're set up.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 w-full min-[480px]:w-auto">
        <Button
          size="sm"
          className="bg-[#1A1523] text-white hover:bg-[#1A1523]/90 flex-1 min-[480px]:flex-none"
          render={<Link to="/onboarding/organisation" />}
        >
          Add bank account
        </Button>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="text-[#7A4E02] dark:text-[#F5C875] shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

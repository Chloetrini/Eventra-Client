import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { PayoutSetupBanner } from "./PayoutSetupBanner";
import { HowPayoutsWork } from "./HowPayoutsWork";
import { EarningsByEvent } from "./EarningsByEvent";
import { PayoutHistory } from "./PayoutHistory";
import { StatCards } from "./StatCards";
import { PayoutsSkeleton } from "@/components/payouts-skeleton";
import { fetchPayouts } from "@/lib/payouts-api";
import { useOrganizerProfile } from "@/lib/organizer-api";

export default function Payouts() {
  const [showSetupBanner, setShowSetupBanner] = useState(true);
  const { status: organizerStatus, isPayoutReady, isLoading: profileLoading } = useOrganizerProfile();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payouts"],
    queryFn: fetchPayouts,
  });

  if (isLoading || profileLoading) {
    return <PayoutsSkeleton />;
  }

  if (isError || !data) {
    return (
      <p className="text-center py-12 text-sm text-destructive">
        Something went wrong loading payouts.
      </p>
    );
  }

  const { earningsByEvent, payoutHistory } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AccountReviewBanner status={organizerStatus} />

      <div>
        <p className="text-[13px] font-medium tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80] font-space">
          Money
        </p>
        <h1 className="text-[28px] sm:text-3xl font-grotesk font-bold text-foreground mt-1">
          Payouts
        </h1>
        <p className="text-[15px] text-muted-foreground mt-1">
          Track what you've earned per event and when it's landed in your account.
        </p>
      </div>

      {/* Bank-specific nudge, independent of admin approval — an already
          verified organizer can still be missing bank details. The
          AccountReviewBanner above already covers unverified/pending/
          rejected, so this only shows for the one gap it doesn't. */}
      {showSetupBanner && organizerStatus === "verified" && !isPayoutReady && (
        <PayoutSetupBanner onDismiss={() => setShowSetupBanner(false)} />
      )}

      <StatCards earnings={earningsByEvent} history={payoutHistory} />

      <HowPayoutsWork />
      <EarningsByEvent earnings={earningsByEvent} />
      <PayoutHistory history={payoutHistory} />
    </div>
  );
}

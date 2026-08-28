import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { PayoutSetupBanner } from "./PayoutSetupBanner";
import { HowPayoutsWork } from "../../../components/payout/HowPayoutsWork";
import { EarningsByEvent } from "../../../components/payout/EarningsByEvent";
import { PayoutHistory } from "../../../components/payout/PayoutHistory";
import { StatCards } from "./StatCards";
import { PayoutsSkeleton } from "@/components/skeletons/payouts-skeleton";
import { fetchPayouts } from "@/lib/payouts-api";
import { useOrganizerBankStatus, useOrganizerProfile, useOrganizerProfileComplete } from "@/lib/organizer-api";

export default function Payouts() {
  const [showSetupBanner, setShowSetupBanner] = useState(true);
  const { status: organizerStatus, isPayoutReady, isLoading: profileLoading } = useOrganizerProfile();
  const { bankStatus } = useOrganizerBankStatus();
  const { isProfileComplete } = useOrganizerProfileComplete();
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

  const { earningsByEvent, payoutHistory, currency } = data;

  return (
    <div className="space-y-6">
      <AccountReviewBanner status={organizerStatus}
        bankStatus={bankStatus}
        isProfileComplete={isProfileComplete} />

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

      {/* Bank-specific nudge, independent of admin approval. Shows as soon
          as the bank account isn't set up yet, including while still
          pending review, so the organizer can get payouts ready ahead of
          approval instead of waiting until after. */}
      {showSetupBanner && !isPayoutReady && (
        <PayoutSetupBanner onDismiss={() => setShowSetupBanner(false)} />
      )}

      <StatCards earnings={earningsByEvent} history={payoutHistory} currency={currency} />

      <HowPayoutsWork />
      <EarningsByEvent earnings={earningsByEvent} currency={currency} />
      <PayoutHistory history={payoutHistory} currency={currency} />
    </div>
  );
}

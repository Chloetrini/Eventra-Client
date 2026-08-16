import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Wallet, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { PayoutsSkeleton } from "@/components/payouts-skeleton";
import { cn, formatDate, formatNaira } from "@/lib/utils";
import { fetchPayouts, type PayoutEventStatus } from "@/lib/payouts-api";
import { useOrganizerStatus } from "@/lib/organizer-api";

const EVENT_STATUS_STYLES: Record<PayoutEventStatus, string> = {
  paid: "bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]",
  ready: "bg-[#DCEAFB] text-[#1D4ED8] dark:bg-[#1D4ED8]/20 dark:text-[#93C5FD]",
  held: "bg-[#F4DFB6] text-[#7A4E02] dark:bg-[#7A4E02]/20 dark:text-[#FBBF24]",
  free_no_payout: "bg-muted text-muted-foreground border border-border",
};

const EVENT_STATUS_LABELS: Record<PayoutEventStatus, string> = {
  paid: "PAID OUT",
  ready: "READY",
  held: "HELD",
  free_no_payout: "FREE EVENT",
};

export default function Payouts() {
  const { status: organizerStatus } = useOrganizerStatus();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payouts"],
    queryFn: fetchPayouts,
  });

  if (isLoading) {
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

  const totalEarnings = earningsByEvent.reduce((sum, row) => sum + row.earnings, 0);
  const totalHeld = earningsByEvent
    .filter((row) => row.status === "held" || row.status === "ready")
    .reduce((sum, row) => sum + row.earnings, 0);
  const totalPaidOut = payoutHistory.reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AccountReviewBanner status={organizerStatus} />

      <div>
        <p className="text-[13px] font-medium tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80] font-space">
          Earn
        </p>
        <h1 className="text-[28px] sm:text-3xl font-grotesk font-bold text-foreground mt-1">
          Payouts
        </h1>
        <p className="text-[15px] text-muted-foreground mt-1">
          Track what each event has earned and when it was paid out to your bank.
        </p>
      </div>

      {organizerStatus === "unverified" && (
        <Alert className="border-[#f1ebdd] bg-[#F4DFB6] dark:border-[#7A4E02]/40 dark:bg-[#7A4E02]/20">
          <LockKeyhole className="mt-3 text-[#7A4E02] dark:text-[#FBBF24]" />
          <AlertTitle className="flex items-center gap-2 text-[#1A1523] dark:text-zinc-50">
            Add your bank details to get paid
            <Badge className="border-transparent bg-[#E4F1EB] text-[#1A1523] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]">
              UNVERIFIED
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-[#4A4451] dark:text-zinc-300">
            Earnings still accrue per event, but payouts can't be sent until your bank account is on file.
          </AlertDescription>
          <AlertAction className="static mt-3 sm:absolute sm:top-2 sm:mt-0">
            <Button size="sm" className="bg-[#0F6E56] text-[#FFFFFF] hover:bg-[#297260]" render={<Link to="/onboarding/organisation" />}>
              Add bank account
            </Button>
          </AlertAction>
        </Alert>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 relative">
          <div className="absolute top-5 right-5 h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center text-[#0F6E56] dark:text-[#4ADE80]">
            <Wallet className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold font-space text-muted-foreground uppercase tracking-wider">
            Total earnings
          </p>
          <p className="text-3xl font-bold font-space text-foreground mt-2">
            {formatNaira(totalEarnings)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-bold font-space text-muted-foreground uppercase tracking-wider">
            Held / pending payout
          </p>
          <p className="text-3xl font-bold font-space text-foreground mt-2">
            {formatNaira(totalHeld)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-bold font-space text-muted-foreground uppercase tracking-wider">
            Paid out to date
          </p>
          <p className="text-3xl font-bold font-space text-foreground mt-2">
            {formatNaira(totalPaidOut)}
          </p>
        </div>
      </div>

      {/* Earnings by event */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by event</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {earningsByEvent.length === 0 ? (
            <p className="px-(--card-spacing) py-6 text-sm text-muted-foreground">
              No earnings yet — they'll show up here once tickets start selling.
            </p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-t text-left text-xs text-muted-foreground">
                  <th className="px-(--card-spacing) py-2 font-normal">Event</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Gross sales</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Commission</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Your earnings</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {earningsByEvent.map((row) => (
                  <tr key={row.eventId} className="border-t align-top">
                    <td className="px-(--card-spacing) py-3 font-semibold text-foreground">
                      {row.eventTitle}
                    </td>
                    <td className="px-(--card-spacing) py-3 text-foreground">
                      {formatNaira(row.grossSales)}
                    </td>
                    <td className="px-(--card-spacing) py-3 text-foreground">
                      {formatNaira(row.commission)}
                    </td>
                    <td className="px-(--card-spacing) py-3 font-bold text-foreground">
                      {formatNaira(row.earnings)}
                    </td>
                    <td className="px-(--card-spacing) py-3">
                      <Badge
                        className={cn(
                          "border-transparent rounded-full font-bold text-[10px] font-space",
                          EVENT_STATUS_STYLES[row.status],
                        )}
                      >
                        {EVENT_STATUS_LABELS[row.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Payout history */}
      <Card>
        <CardHeader>
          <CardTitle>Payout history</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {payoutHistory.length === 0 ? (
            <p className="px-(--card-spacing) py-6 text-sm text-muted-foreground">
              No payouts have been sent yet.
            </p>
          ) : (
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-t text-left text-xs text-muted-foreground">
                  <th className="px-(--card-spacing) py-2 font-normal">Date</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Sent to</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Amount</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((row, i) => (
                  <tr key={`${row.date}-${i}`} className="border-t align-top">
                    <td className="px-(--card-spacing) py-3 text-foreground">
                      {formatDate(row.date)}
                    </td>
                    <td className="px-(--card-spacing) py-3 text-foreground">
                      {row.bankLabel ?? "-"}
                    </td>
                    <td className="px-(--card-spacing) py-3 font-bold text-foreground">
                      {formatNaira(row.amount)}
                    </td>
                    <td className="px-(--card-spacing) py-3">
                      <Badge className="border-transparent rounded-full font-bold text-[10px] font-space bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]">
                        PAID
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

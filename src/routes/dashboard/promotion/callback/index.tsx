import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";
import PageWrapper from "@/components/page-wrapper";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { fetchMyPromotions } from "@/lib/promotion-api";

// This is the page Paystack sends an organizer's browser BACK to after they
// pay to promote an event (the backend sets this as the callback_url when
// it initializes the transaction — see requestPromotion in
// promotion.controller.ts). Mirrors routes/main/payment/checkout-callback:
// the actual promotion.paidAt flip happens server-side via Paystack's
// webhook (or listMyPromotions's own self-heal reconciliation, see its doc
// comment), independent of whether this page ever loads — so this page
// just polls fetchMyPromotions until the matching reference shows paid,
// then hands off to the real Promotions page.
const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 10; // ~20s — comfortably past typical webhook latency

const PromotionCheckoutCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Paystack sends back "reference" (what we sent it) or "trxref" on some
  // integrations — accept either, same as the ticket checkout callback.
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const [status, setStatus] = useState<"polling" | "timeout" | "error">("polling");
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const scheduleRetry = () => {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setStatus("timeout");
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    async function poll() {
      try {
        const promotions = await fetchMyPromotions();
        if (cancelled) return;

        const match = promotions.find(p => p.paystackReference === reference);

        if (match?.paid) {
          queryClient.invalidateQueries({ queryKey: ["my-promotions"] });
          toast.success("Payment confirmed — your promotion is now awaiting admin review.");
          navigate("/dashboard/promotion", { replace: true });
          return;
        }

        // Not paid yet — the webhook (or listMyPromotions's own fallback
        // reconciliation) hasn't landed. Keep polling.
        scheduleRetry();
      } catch {
        if (cancelled) return;
        scheduleRetry();
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reference, navigate, queryClient]);

  if (status === "polling") {
    return (
      <PageWrapper className="p-5">
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <LoadingSpinner size="lg" color="gray-600" />
          <p className="text-lg font-semibold text-foreground">Confirming your payment…</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            This usually takes a few seconds. Please don't close this page.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-5">
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FCEBC9] dark:bg-[#7A4E02]/20">
          <AlertCircle className="h-7 w-7 text-[#7A4E02] dark:text-[#F5C877]" />
        </div>
        <p className="text-lg font-semibold text-foreground">
          {status === "timeout" ? "Still confirming your payment" : "We couldn't find that payment"}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {status === "timeout"
            ? "This is taking longer than usual, but if your payment went through, it'll show up on the Promotions page shortly."
            : "This payment link looks incomplete or expired. If you were charged, it'll still show up on the Promotions page."}
        </p>
        <Link
          to="/dashboard/promotion"
          className="mt-2 rounded-lg bg-[#0A4F41] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083b31]"
        >
          Go to Promotions
        </Link>
      </div>
    </PageWrapper>
  );
};

export default PromotionCheckoutCallback;

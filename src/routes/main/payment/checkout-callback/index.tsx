import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { getOrderByReference } from "@/lib/tickets-api";
import { useAuth } from "@/context/auth.context";
import PageWrapper from "@/components/page-wrapper";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AlertCircle } from "lucide-react";

// This is the page Paystack sends a paying customer's browser BACK to after
// they complete payment on Paystack's hosted checkout (the backend sets
// `${CLIENT_URL}/checkout/callback` as the callback_url when it initializes
// the transaction — see initializeCheckout in ticket.controller.ts). The
// actual order/ticket creation happens server-side via Paystack's webhook,
// independent of whether this page ever loads — so a missing/broken page
// here doesn't lose anyone's purchase, but it WOULD leave every paying
// customer staring at a dead end right after paying, which reads as a
// failed purchase even though it succeeded. This page just polls until the
// webhook has caught up, then hands off to the real confirmation screen.
const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 10; // ~20s — comfortably past typical webhook latency

const CheckoutCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Paystack sends back "reference" (what we sent it) or "trxref" on some
  // integrations — accept either.
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
        const order = (await getOrderByReference(reference as string)) as any;
        if (cancelled) return;

        if (order.status === "paid" && Array.isArray(order.tickets) && order.tickets.length > 0) {
          const venue = order.event?.venue
            ? `${order.event.venue.name}, ${order.event.venue.city}`
            : "";
          navigate("/payment/ticket-confirmation", {
            replace: true,
            state: {
              tickets: order.tickets.map((t: any) => ({
                _id: t._id,
                ticketId: t.ticketId,
                code: t.code,
                attendeeName: t.attendeeName,
                attendeeEmail: t.attendeeEmail,
                type: t.type,
                price: t.price,
                event: order.event?._id,
                // The backend already populates this (same field the
                // organizer's attendees list and My Tickets read) — was
                // just never picked up here, so the confirmation page had
                // no way to show the real tier name and fell back to a
                // generic "Paid" label.
                ticketType: t.ticketType ?? null,
              })),
              event: {
                eventId: order.event?._id,
                eventName: order.event?.title,
                eventImage: order.event?.coverImage ?? null,
                eventDateTime: order.event?.startDate,
                eventVenue: venue,
                slug: order.event?.slug,
              },
              buyer: {
                firstName: order.guestName?.split(" ")[0] ?? "",
                lastName: order.guestName?.split(" ").slice(1).join(" ") ?? "",
                email: order.guestEmail ?? user?.email ?? "",
                phoneNumber: order.guestPhone ?? "",
              },
              type: "paid",
            },
          });
          return;
        }

        if (order.status === "failed") {
          setStatus("error");
          return;
        }

        // Still "pending" — the webhook (or this endpoint's own fallback
        // reconciliation) hasn't landed yet. Keep polling.
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
  }, [reference, navigate, user]);

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
            ? "This is taking longer than usual, but if your payment went through, your ticket will show up in My Tickets shortly."
            : "This payment link looks incomplete or expired. If you were charged, your ticket will still show up in My Tickets."}
        </p>
        <Link
          to="/tickets"
          className="mt-2 rounded-lg bg-[#0A4F41] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083b31]"
        >
          View my tickets
        </Link>
      </div>
    </PageWrapper>
  );
};

export default CheckoutCallback;

import { useState } from "react";
import { useNavigate } from "react-router";
import { type Event } from "@/types/event-types";
import { type TicketTier } from "@/types/ticket-tiers";
import { formatPrice, CURRENCY_SYMBOLS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const TierRow = ({
  tier,
  quantity,
  currency,
  onIncrement,
  onDecrement,
}: {
  tier: TicketTier;
  quantity: number;
  currency?: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) => {
  const isSoldOut = tier.availability === "sold out";
  // Same limit the backend already enforces at checkout
  // (ticket.controller.ts rejects an order over purchaseLimitPerPerson) —
  // this just stops the picker from letting someone dial past it in the
  // first place, instead of only finding out after they hit "Select
  // tickets". Also cap on remaining stock for the same reason: nothing
  // here previously stopped the "+" button once quantityLeft ran out.
  const atLimit =
    tier.purchaseLimitPerPerson !== undefined && quantity >= tier.purchaseLimitPerPerson;
  const atStock = quantity >= tier.quantityLeft;
  const canIncrement = !isSoldOut && !atLimit && !atStock;

  return (
    <div className={cn("space-y-1", isSoldOut && "opacity-60")}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{tier.type}</p>
          {tier.description && (
            <p className="text-xs text-muted-foreground">{tier.description}</p>
          )}
          {tier.quantityLeft && (
            <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#7A4E02] dark:text-[#F5C877]">
              only {tier.quantityLeft} left
            </p>
          )}
        </div>
        <div className="text-right font-space">
          <p className="text-sm font-bold">
            {isSoldOut ? (
              <span className="text-[#c14747] dark:text-[#FFC4C4]">Sold out</span>
            ) : (
              formatPrice(tier.unitPrice, currency)
            )}
          </p>
        </div>
      </div>

      {!isSoldOut && (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onDecrement}
            disabled={quantity === 0}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-sm transition hover:scale-110 disabled:opacity-40 cursor-pointer"
          >
            −
          </button>
          <span className="w-4 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrement}
            disabled={!canIncrement}
            aria-label={
              atLimit
                ? `Limit ${tier.purchaseLimitPerPerson} per order reached`
                : atStock
                  ? "No more left"
                  : `Add another ${tier.type} ticket`
            }
            className="flex h-7 w-7 items-center justify-center rounded-full border text-sm transition hover:scale-110 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
          >
            +
          </button>
        </div>
      )}
      {!isSoldOut && atLimit && (
        <p className="text-right text-xs text-muted-foreground">
          Limit {tier.purchaseLimitPerPerson} per order
        </p>
      )}
      {isSoldOut && (
        <div className="flex justify-end">
          <Badge variant="outline" className="text-xs mr-auto text-[#c14747] dark:text-[#FFC4C4]">
            Sold out
          </Badge>
        </div>
      )}
    </div>
  );
};

export const PaidEventTicket = ({
  event,
  tiers,
  serviceFeePercent,
  slug,
}: {
  event: Event;
  tiers: TicketTier[];
  serviceFeePercent: number;
  slug?: string
}) => {
  const navigate = useNavigate();
  // event.currency is denormalized onto every event by the fetch layer
  // (events-api.ts) from the backend's getEventBySlug response — every
  // price on this event (event.minPrice and each ticket type's price) has
  // already been converted into it server-side. Was never read here, so
  // this whole card always rendered with the hardcoded ₦ default instead
  // of the viewer's actual currency.
  const currency = event.currency ?? "Naira";
  const currencySymbol = CURRENCY_SYMBOLS[currency] ?? "₦";

  // Helper to ensure a consistent tier key (_id or id)
  const getTierId = (tier: any, index: number): string | number =>
    tier.id ?? tier._id ?? index;

  const ticketTiers = tiers ?? [];
  const feePercent = serviceFeePercent ?? 0;

  // 1. Safely initialize state
  const [quantities, setQuantities] = useState<Record<string | number, number>>(() =>
    Object.fromEntries(ticketTiers.map((t, idx) => [getTierId(t, idx), 0]))
  );

  // 2. Calculate subtotal safely
  const subtotal = ticketTiers.reduce(
    (sum, tier, idx) => sum + tier.unitPrice * (quantities[getTierId(tier, idx)] ?? 0),
    0
  );

  // 3. Service fee calculation
  const serviceFee = Math.round(subtotal * (feePercent / 100));
  const total = subtotal + serviceFee;

  // 4. Safe check for scarce availability
  const isSelling = ticketTiers.some((t) => t.availability === "scarce");

  const increment = (tierKey: string | number, tier: TicketTier) => {
    setQuantities((prev) => {
      const current = prev[tierKey] ?? 0;
      const limit = tier.purchaseLimitPerPerson ?? Infinity;
      if (current >= limit || current >= tier.quantityLeft) return prev;
      return { ...prev, [tierKey]: current + 1 };
    });
  };

  const decrement = (tierKey: string | number) => {
    setQuantities((prev) => ({
      ...prev,
      [tierKey]: Math.max(0, (prev[tierKey] ?? 0) - 1),
    }));
  };

  const handleSelectTickets = () => {
    const selectedTiers = ticketTiers
      .filter((t, idx) => (quantities[getTierId(t, idx)] ?? 0) > 0)
      .map((t, idx) => ({
        id: getTierId(t, idx),
        type: t.type,
        unitPrice: t.unitPrice,
        quantity: quantities[getTierId(t, idx)],
      }));

    navigate("/payment/checkout", {
      state: {
        eventId: event._id,
        eventName: event.title,
        eventImage: event.coverImage,
        eventDateTime: event.startDate,
        eventVenue: `${event.venue.name}, ${event.venue.city}`,
        ticketDetails: selectedTiers,
        subtotal,
        serviceFee,
        total,
        slug,
        currency,
      },
    });
  };

  if (!ticketTiers || ticketTiers.length === 0) {
    return (
      <div className="rounded-2xl border p-6 shadow-sm text-center text-sm text-muted-foreground">
        No ticket options available for this event.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6 shadow-[0_0_15px_rgba(0,0,0,0.15)] h-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Get tickets</h2>
        {isSelling && (
          <Badge className="bg-[#FCEBC9] dark:bg-[#7A4E02]/20 font-medium text-[#7A4E02] dark:text-[#F5C877]">
            Selling fast
          </Badge>
        )}
      </div>
      <div className="mt-6 space-y-5">
        {ticketTiers.map((tier, idx) => {
          const key = getTierId(tier, idx);
          return (
            <TierRow
              key={key}
              tier={tier}
              quantity={quantities[key] ?? 0}
              currency={currency}
              onIncrement={() => increment(key, tier)}
              onDecrement={() => decrement(key)}
            />
          );
        })}
      </div>
      <Separator className="my-5" />
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{subtotal === 0 ? `${currencySymbol}0` : formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Service fee ({feePercent}%)</span>
          <span>{serviceFee === 0 ? `${currencySymbol}0` : formatPrice(serviceFee, currency)}</span>
        </div>
        <div className="flex items-center justify-between font-bold">
          <span>Total</span>
          {/* formatPrice shows "Free" for a genuinely free tier, which is
              correct everywhere else it's used — but here 0 just means
              "nothing picked yet" on a paid event, so show {currencySymbol}0 instead. */}
          <span>{total === 0 ? `${currencySymbol}0` : formatPrice(total, currency)}</span>
        </div>
      </div>
      <Button
        onClick={handleSelectTickets}
        className="mt-5 w-full bg-[#0F6E56] text-white hover:bg-emerald-900 cursor-pointer"
        disabled={total === 0}
      >
        Select tickets
      </Button>
      <div className="mt-4 space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          🔒 Secure checkout · Card, transfer & USSD
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          ✓ Every ticket is a unique QR — it can't be faked
        </p>
      </div>
    </div>
  );
};

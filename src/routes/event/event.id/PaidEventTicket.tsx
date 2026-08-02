import { useState } from "react";
import { type Event, type ticketDetails } from "@/types/event";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";


const TierRow = ({
  tier,
  quantity,
  onIncrement,
  onDecrement,
}: {
  tier: ticketDetails;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) => {
  const isSoldOut = tier.availability === "sold out";
  return (
    <div className={cn("space-y-1", isSoldOut && "opacity-60")}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{tier.type}</p>
          <p className="text-xs text-[#6E6577]">{tier.description}</p>
          {tier.quantityLeft && (
            <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#7A4E02]">
              only {tier.quantityLeft} left
            </p>
          )}
        </div>
        <div className="text-right font-space">
          {tier.originalPrice && (
            <p className="text-xs text-[#6E6577] font-grotesk line-through">
              {formatPrice(tier.originalPrice)}
            </p>
          )}
          <p className="text-sm font-bold ">
            {isSoldOut ? (
              <span className="text-[#FFC4C4]">Sold out</span>
            ) : (
              formatPrice(tier.unitPrice)
            )}
          </p>
        </div>
      </div>
      {!isSoldOut && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onDecrement}
            disabled={quantity === 0}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-sm transition hover:scale-120 disabled:opacity-40"
          >
            −
          </button>
          <span className="w-4 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            onClick={onIncrement}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-sm transition hover:scale-120"
          >
            +
          </button>
        </div>
      )}
      {isSoldOut && (
        <div className="flex justify-end">
          <Badge variant="outline" className="text-xs mr-auto text-[#FFC4C4]">
            Sold out
          </Badge>
        </div>
      )}
    </div>
  );
};

export const PaidEventTicket = ({ event }: { event: Event }) => {
  // 1. Safely initialize state with a fallback empty array if ticketTiers is missing
  const [quantities, setQuantities] = useState<Record<number, number>>(() =>
    Object.fromEntries((event?.ticketTiers ?? []).map((t) => [t.id, 0])),
  );

  // 2. Safe reduction with fallback array
  const subtotal = (event?.ticketTiers ?? []).reduce(
    (sum, tier) => sum + tier.unitPrice * (quantities[tier.id] ?? 0),
    0,
  );

  // 3. Fallback to 0 if serviceFeePercent doesn't exist yet
  const serviceFee = Math.round(
    subtotal * ((event?.serviceFeePercent ?? 0) / 100),
  );
  const total = subtotal + serviceFee;

  // 4. Safe check for scarce availability
  const isSelling = (event?.ticketTiers ?? []).some(
    (t) => t.availability === "scarce",
  );

  const increment = (tierId: number) => {
    setQuantities((prev) => ({ ...prev, [tierId]: (prev[tierId] ?? 0) + 1 }));
  };
  const decrement = (tierId: number) => {
    setQuantities((prev) => ({
      ...prev,
      [tierId]: Math.max(0, (prev[tierId] ?? 0) - 1),
    }));
  };

  if (!event || !event.ticketTiers) {
    return (
      <div className="rounded-2xl border p-6 shadow-sm">Loading tickets...</div>
    );
  }

  return (
    <div className="rounded-2xl border p-6 shadow-[0_0_15px_rgba(0,0,0,0.15)] h-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Get tickets</h2>
        {isSelling && (
          <Badge className="bg-[#FCEBC9] font-medium text-[#7A4E02]">
            Selling fast
          </Badge>
        )}
      </div>
      <div className="mt-6 space-y-5">
        {event.ticketTiers.map((tier) => (
          <TierRow
            key={tier.id}
            tier={tier}
            quantity={quantities[tier.id] ?? 0}
            onIncrement={() => increment(tier.id)}
            onDecrement={() => decrement(tier.id)}
          />
        ))}
      </div>
      <Separator className="my-5" />
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-[#4A4451]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[#4A4451]">
          <span>Service fee ({event.serviceFeePercent}%)</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>
        <div className="flex items-center justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <Button
        className="mt-5 w-full bg-[#0F6E56] text-white hover:bg-emerald-900"
        disabled={total === 0}
      >
        Select tickets
      </Button>
      <div className="mt-4 space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs text-[#6E6577]">
          🔒 Secure checkout · Card, transfer & USSD
        </p>
        <p className="flex items-center gap-1.5 text-xs text-[#6E6577]">
          ✓ Every ticket is a unique QR — it can't be faked
        </p>
      </div>
    </div>
  );
};
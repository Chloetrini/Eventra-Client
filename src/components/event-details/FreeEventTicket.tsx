import { useState } from "react"
import { type Event } from "@/types/event-types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, Mail } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/auth.context"
import { useAuthGate } from "@/context/auth.gate"

const MAX_GUESTS_PER_RESERVATION = 4

export const FreeEventTicket = ({
  event,
  slug,
}: {
  event: Event;
  slug?: string
}) => {
  const [guests, setGuests] = useState(1)
  const { user } = useAuth()
  const { requireAuth } = useAuthGate()
  const navigate = useNavigate()

  const capacity = event.capacity ?? null
  const reservationsCount = event.reservationsCount ?? 0
  const hasCapLimit = capacity !== null
  const spotsLeft = hasCapLimit ? Math.max(capacity - reservationsCount, 0) : null
  const percentFilled = hasCapLimit && capacity > 0
    ? ((capacity - (spotsLeft ?? 0)) / capacity) * 100
    : 0
  const isFull = hasCapLimit && (spotsLeft ?? 0) <= 0

  const increment = () => setGuests((g) => Math.min(MAX_GUESTS_PER_RESERVATION, g + 1))
  const decrement = () => setGuests((g) => Math.max(1, g - 1))

  const handleReserve = () => {
    if (!user) {
      const allowed = requireAuth("buy-ticket");
      if (!allowed) return; // modal is open
    }

    navigate("/payment/checkout", {
      state: {
        type: "free",
        eventId: event._id,
        eventName: event.title,
        eventImage: event.coverImage,
        eventDateTime: event.startDate,
        eventVenue: `${event.venue.name}, ${event.venue.city}`,
        ticketDetails: [{ id: 1, type: "Free", unitPrice: 0, quantity: guests }],
        slug: slug ?? event.slug,
        guests,
      },
    });
  };

  return (
    <div className="rounded-2xl border p-6 shadow-[0_0_15px_rgba(0,0,0,0.15)] h-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-foreground">Reserve your spot</h2>
        <span className="rounded-full w-22 h-8 flex items-center justify-center bg-[#FCEBC9] dark:bg-[#7A4E02]/20 px-3 py-1 text-sm font-medium text-[#7A4E02] dark:text-[#F5C877]">Free</span>
      </div>

      {hasCapLimit ? (
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Spots left</span>
            <span className="font-bold">
              {spotsLeft} <span className="font-normal text-muted-foreground">/ {capacity}</span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15">
            <div className="h-full rounded-full bg-[#0F6E56] dark:bg-[#4ADE80]" style={{ width: `${percentFilled}%` }} />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Unlimited spots available</p>
      )}

      <div className="mt-5 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold">Guests</p>
            <p className="text-xs text-muted-foreground">Up to {MAX_GUESTS_PER_RESERVATION} per reservation</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              disabled={guests === 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm transition hover:bg-muted disabled:opacity-40"
            >
              −
            </button>
            <span className="w-4 text-center text-base font-semibold">{guests}</span>
            <button
              onClick={increment}
              disabled={guests === MAX_GUESTS_PER_RESERVATION}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm transition hover:bg-muted disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-normal">Price</span>
        <span className="font-bold tracking-wider font-space text-[#0F6E56] dark:text-[#4ADE80]">Free</span>
      </div>
      <p className="mt-2 text-xs font-normal text-muted-foreground">
        No payment needed. You'll get a QR ticket to show at the door and you can cancel anytime to release your spot.
      </p>

      <Button
        className="mt-5 w-full bg-[#0F6E56] text-white hover:bg-emerald-900"
        disabled={isFull}
        onClick={handleReserve}
      >
        {isFull ? "Fully booked" : "Reserve my spot"}
      </Button>

      <div className="mt-4 space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5" /> Free entry · Your QR admits {guests}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" /> Instant confirmation sent to your mail
        </p>
      </div>
    </div>
  )
}
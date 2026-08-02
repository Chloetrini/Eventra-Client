import { formatDate, formatPrice } from "@/lib/utils"
import { type Event } from "@/types/event"
import { Link } from "react-router"
import { Card } from "@/components/ui/card"
import { MoveUpRight } from "lucide-react"


export const RelatedEvents = ({ events }: { events: Event[] }) => {
  if (events.length === 0) return null
  return (
    <section>
      <h2 className="text-xl font-bold pt-10">You might also like</h2>
      <div className="py-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {events.map((event) => (
          <Link key={event.id} to={`/events/${event.id}`} className="rounded-xl border transition hover:shadow-md">
            <Card className="relative h-72 overflow-hidden">
              {/* <div className="relative  overflow-hidden"> */}
                <img src={event.coverImageUrl ?? undefined} alt={event.name} className="h-7/12 w-full object-cover transition hover:scale-105" />
              {/* </div> */}
              <div className="px-3 flex justify-between items-end">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider">{event.subTags.join(' · ')}</p>
                <p className="mt-1 text-sm font-bold leading-snug">{event.name}</p>
                <p className="mt-1 text-xs font-medium text-[#6E6577]">{formatDate(event.startDate)} · {event.location.venueName}</p>
                <p className="pt-4 text-sm font-semibold text-[#1A1523]">{formatPrice(event.startingPrice)}</p>
                </div>
                <div className="rounded-full border h-8.75 w-8.75 flex items-center justify-center bg-[#E4F1EB]">
                  <MoveUpRight className="h-4 w-4 text-[#0A4F41]"/>
                </div>

              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
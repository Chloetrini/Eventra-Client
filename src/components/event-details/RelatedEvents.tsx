import { formatDate, formatPrice } from "@/lib/utils"
import { type Event } from "@/types/event-types"
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
          <Link key={event._id} to={`/events/${event._id}`} className="rounded-xl border transition hover:shadow-md">
            <Card className="relative h-72 overflow-hidden">
              {/* <div className="relative  overflow-hidden"> */}
                <img src={event.coverImage ?? undefined} alt={event.title} className="h-7/12 w-full object-cover transition hover:scale-105" />
              {/* </div> */}
              <div className="px-3 flex justify-between items-end">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider">{event.tags?.join(' · ') || 'No tags'}</p>
                  <p className="mt-1 text-sm font-bold leading-snug">{event.title}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{formatDate(event.startDate)} · {event.venue.name}</p>
                  <p className="pt-4 text-sm font-semibold text-foreground">{formatPrice(event.minPrice ?? 0)}</p>
                </div>
                <div className="rounded-full border h-8.75 w-8.75 flex items-center justify-center bg-[#E4F1EB] dark:bg-[#0F6E56]/15">
                  <MoveUpRight className="h-4 w-4 text-[#0A4F41] dark:text-[#4ADE80]"/>
                </div>

              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
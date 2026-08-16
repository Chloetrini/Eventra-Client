import { type Event } from "@/types/event-types"
import { formatDate, formatTime } from "@/services/utils"
import { MapPin, Users } from "lucide-react"
import { Clock } from "lucide-react"

export const EventInfo = ({ event }: { event: Event }) => {
  // The backend never actually sends gatesOpenTime/doorsCloseTime (no such
  // fields exist on the Event model), so those lines always rendered as
  // "Gates open " / "Doors till " with nothing after them. lineupCount is
  // the same story - it's not populated, so it always showed "0 artists"
  // even when the event has a real lineup below. Drop the fake fields and
  // derive the real count from the lineup array everyone else already uses.
  const lineupCount = event.lineup?.length ?? 0

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:w-full items-stretch">
      <div className="flex gap-2 border p-2 rounded-xl">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-[11px] font-light tracking-wider">DATE & TIME</p>
          <p className="text-sm font-medium">{formatDate(event.startDate)}, {formatTime(event.startDate)}</p>
        </div>
      </div>

      <div className="flex gap-2 border p-2 rounded-xl">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-[11px] font-light tracking-wider">LOCATION</p>
          <p className="text-sm font-medium">{event.venue.name}</p>
          <p className="text-xs font-light line-clamp-2">{event.venue.address ? `${event.venue.address}, ` : ""}{event.venue.city}, {event.venue.state}</p>
        </div>
      </div>

      <div className="flex gap-2 border p-2 rounded-xl">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-[11px] font-light tracking-wider">LINE-UP</p>
          <p className="text-sm font-medium">{lineupCount} {lineupCount === 1 ? "artist" : "artists"}</p>
        </div>
      </div>
    </div>
  )
}
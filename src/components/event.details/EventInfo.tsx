import { type Event } from "@/types/event-types"
import { formatDate, formatTime } from "@/lib/utils"
import { MapPin, Users } from "lucide-react"
import { Clock } from "lucide-react"

export const EventInfo = ({ event }: { event: Event }) => {
  return (
    <div className="md:flex md:gap-2 grid-cols-3 space-y-2 md:w-full">
      <div className="flex gap-2 border p-2 rounded-xl md:w-4/12">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-[11px] font-light tracking-wider">DATE & TIME</p>
          <p className="text-sm font-medium">{formatDate(event.startDate)}, {formatTime(event.startDate)}</p>
          <p className="text-xs font-light">Gates open {event.gatesOpenTime}</p>
        </div>
      </div>


      <div className="flex gap-2 border p-2 rounded-xl md:w-4/12">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-[11px] font-light tracking-wider">LOCATION</p>
          <p className="text-sm font-medium">{event.venue.name}</p>
          <p className="text-xs font-light">{event.venue.city}, {event.venue.state}</p>
        </div>
      </div>


      <div className="flex gap-2 border p-2 rounded-xl md:w-4/12">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-[11px] font-light tracking-wider">LINE-UP</p>
          <p className="text-sm font-medium">{event.lineupCount} artists</p>
          <p className="text-xs font-light">Doors till {event.doorsCloseTime}</p>
        </div>
      </div>
    </div>
  )
}
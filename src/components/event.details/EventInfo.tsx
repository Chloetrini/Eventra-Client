import { type Event } from "@/types/event-types"
import { formatDate, formatTime } from "@/lib/utils"
import { MapPin, Users } from "lucide-react"
import { Clock } from "lucide-react"

export const EventInfo = ({ event }: { event: Event }) => {
  return (
    <div className="md:flex md:gap-2 grid-cols-3 space-y-2 md:w-full">
      <div className="flex gap-2 border p-2 rounded-xl md:w-4/12">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-xl bg-[#E4F1EB]">
          <Clock className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="font-geist text-[12px] font-normal tracking-[14%] text-[#6E6577]">DATE & TIME</p>
          <p className="text-sm font-semibold font-geist text-[#1A1523]">{formatDate(event.startDate)}, {formatTime(event.startDate)}</p>
          <p className="text-xs font-regular text-[#6E6577]">Gates open {event.gatesOpenTime}</p>
        </div>
      </div>

      <div className="flex gap-2 border p-2 rounded-xl md:w-4/12">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-lg bg-[#E4F1EB]">
          <MapPin className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="font-geist text-[12px] font-normal tracking-[14%] text-[#6E6577]">LOCATION</p>
          <p className="text-sm font-semibold font-geist text-[#1A1523]">{event.venue.name}</p>
          <p className="text-xs font-regular text-[#6E6577]">{event.venue.city}, {event.venue.state}</p>
        </div>
      </div>


      <div className="flex gap-2 border p-2 rounded-xl md:w-4/12">
        <div className="flex h-9 w-9 mt-1 items-center justify-center rounded-lg bg-[#E4F1EB]">
          <Users className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="font-geist text-[12px] font-normal tracking-[14%] text-[#6E6577]">LINE-UP</p>
          <p className="text-sm font-semibold font-geist text-[#1A1523]">{event.lineupCount} artists</p>
          <p className="text-xs font-regular text-[#6E6577]">Doors till {event.doorsCloseTime}</p>
        </div>
      </div>
    </div>
  )
}
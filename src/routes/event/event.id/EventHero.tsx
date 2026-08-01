import { type Event } from "@/types/event"
import { Heart, MoveUpRight, MapPin, Calendar } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/utils"

export const EventHero = ({ event }: { event: Event }) => {
  return (
    <div className="relative rounded-2xl">
        <img className="rounded-2xl h-74 md:h-131.75" src={event.coverImageUrl ?? undefined} alt={event.name}/>
      <div className="absolute md:left-10 left-3 md:right-10 right-3 md:top-5 top-3 flex justify-between">
        {event.featured && (
          <Badge className="md:p-4 p-2 bg-[#F5A524] text-[#3A3A3A] hover:bg-[#F5A524] h-7.5 md:w-30 w-28">★ Featured concert</Badge>
        )}
        <div className="flex gap-2 ml-auto">
          <button className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center border rounded-md bg-transparent transition hover:bg-white/30">
            <Heart className="md:h-8 md:w-8 w-5 h-5 text-white"/>
          </button>
          <button className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center border rounded-md bg-[#5A4C6AA3] transition hover:bg-white/30">
            <MoveUpRight className="md:h-8 md:w-8 w-5 h-5 text-white"/>
          </button>
        </div>
      </div>

      <div className="absolute md:bottom-15 md:left-10 md:p-4 bottom-8 left-5">
        <h1 className="text-3xl font-bold text-white md:text-6xl">{event.name}</h1>
        <div className="pt-2 flex flex-wrap items-center gap-3 text-[13px] text-white/80">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(event.startDate)} · {formatTime(event.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location.venueName}, {event.location.area}
          </span>
          {event.musicType && (
            <span className="flex items-center gap-1">🎵 {event.musicType}</span>
          )}
        </div>
      </div>
    </div>
  )
}
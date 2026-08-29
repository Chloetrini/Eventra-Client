import { type Event } from "@/types/event-types"
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router"
import flag from '@/assets/flag.png'
import { HoverCardInput } from "../ui/hover-card-input"

export const AboutEvent = ({ event }: { event: Event }) => {
  const tags = event.tags ?? []

  const navigate = useNavigate()
  const handleReportEvent = () => {
    navigate(`/events/${event.slug}/report`, { state: { event } })
  }

  return (
    <section>
      <div className="flex items-center justify-between">
      <h2 className="text-xl font-extrabold font-grotesk tracking-tight">About this event</h2>
        <HoverCardInput
          cardContent={"Report Event"}
          editCardContent="w-fit text-red-500 font-bold text-sm"
          className="w-fit"
          icon={flag}
          editIcon="w-4 h-4"
          side="left"
          onClick={handleReportEvent}
        />
      </div>

      {event.description && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed font-medium font-[#4A4451]">
          {event.description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag} to={`/search?query=${encodeURIComponent(tag)}`}>
              <Badge
                variant="outline"
                className="bg-tag h-9 w-21 rounded-full text-xs md:h-10 md:w-26"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
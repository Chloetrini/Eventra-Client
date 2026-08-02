import { type Event } from "@/types/event"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router"

export const AboutEvent = ({ event }: { event: Event }) => {
  return (
    <section>
      <h2 className="text-xl font-bold">About this event</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed font-medium">{event.description}</p>
      {event.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Link key={tag} to={`/search?query=${(tag)}`}>
            <Badge key={tag} variant="outline" className="bg-tag rounded-full text-xs w-21 h-9 md:w-26 md:h-10">{tag}</Badge>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
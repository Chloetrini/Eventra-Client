import type { Event } from "@/types/event-types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export const EventLineUp = ({ event }: { event: Event }) => {
  const { lineup } = event
  
  if (!lineup || lineup.length === 0) return null

  return (
    <section>
      <h2 className="text-xl font-bold">Line-up</h2>
      <div className="mt-4 space-y-3">
        {lineup.map((artist, index) => {
          // Standardize whether artist is a string or an object
          const isObject = typeof artist === "object" && artist !== null
          const name = isObject ? artist.name : String(artist)
          const role = isObject ? artist.role : undefined
          const imageUrl = isObject ? (artist.imageUrl ) : undefined

          // Fallback key order: _id -> name -> array index
          const uniqueKey = isObject && artist._id ? artist._id : `${name}-${index}`

          return (
            // Same bg-muted/rounded/border/padding treatment as the
            // Organizer card right below this section, so every
            // person-row on this page lines up the same way instead of
            // this one sitting flush against the edge.
            <div key={uniqueKey} className="bg-muted flex items-center gap-3 rounded-xl border p-4">
              <Avatar className="h-11 w-11">
                <AvatarImage src={imageUrl ?? undefined} alt={name} />
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{name}</p>
                {role && <p className="text-xs text-muted-foreground">{role}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
import type { LineupArtist } from "@/types/event"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export const EventLineUp = ({ lineup }: { lineup: LineupArtist[] }) => {
  if (lineup.length === 0) return null
  return (
    <section>
      <h2 className="text-xl font-bold">Line-up</h2>
      <div className="mt-4 space-y-4">
        {lineup.map((artist) => (
          <div key={artist.id} className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage src={artist.imageUrl ?? undefined} alt={artist.name} />
              <AvatarFallback>{artist.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{artist.name}</p>
              <p className="text-xs text-muted-foreground">{artist.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
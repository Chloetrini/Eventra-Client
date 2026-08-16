import { type Event } from "@/types/event-types"
import { Dot } from "lucide-react"



export const EventMap = ({ location }: { location: Event['location'] }) => {
  const mapSrc = location.coordinates
    ? `https://maps.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}&z=15&output=embed`
    : null
  return (
    <section>
      <h2 className="text-xl font-bold">Where it's happening</h2>
      {mapSrc && (
        <div className="mt-4 overflow-hidden rounded-xl border">
          <iframe src={mapSrc} title="Event location map" className="lg:h-71 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
        </div>
      )}
      <div className='md:flex items-center'>
        <p className="text-md font-medium">{location.venueName}</p>
        <Dot className='-mx-2 hidden md:block'/>
        <p className="text-sm font-light">{location.address}.</p>
        {location.parkingNote && <p className="text-sm font-light">{location.parkingNote}</p>}
      </div>
    </section>
  )
}
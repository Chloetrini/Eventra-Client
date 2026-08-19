import { type EventVenue } from "@/types/event-types"
import { Dot } from "lucide-react"
import LocationMap from "@/components/dashboard-create-event/location-map"

// Was its own bare Google Maps iframe, keyed off venue.coordinates — most
// events never get coordinates from the backend (it's an optional field
// organizers rarely fill in), so the map silently showed nothing for most
// events. Also: `location` was typed as `Event['location']` (a stray
// `z.any()` field, not the real venue data) so `location.venueName` and
// `location.parkingNote` were reading fields that don't exist on the actual
// venue object — always blank, separate bug from the coordinates one.
//
// Now reuses the same LocationMap component the Create Event flow already
// uses to preview a venue, and looks up the map by venue name + address
// text (same as Create Event does) instead of requiring coordinates — so
// it renders for every event that has a venue name/address, which is all
// of them, coordinates or not.
export const EventMap = ({ location }: { location: EventVenue }) => {
  return (
    <section>
      <h2 className="text-xl font-bold">Where it's happening</h2>
      <LocationMap
        name={location.name}
        address={`${location.address}, ${location.city}${location.state ? `, ${location.state}` : ""}`}
        className="mt-4"
        cardClassName="hidden"
      />
      <div className='md:flex items-center mt-2'>
        <p className="text-md font-medium">{location.name}</p>
        <Dot className='-mx-2 hidden md:block'/>
        <p className="text-sm font-light">{location.address}, {location.city}.</p>
      </div>
    </section>
  )
}

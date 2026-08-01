import { type Organizer } from "@/types/event"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check } from "lucide-react"


export const EventOrganizer = ({ organizer }: { organizer: Organizer }) => {

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Organizer</h2>
      <div className="bg-[#F5F3EF] flex items-center gap-3 rounded-xl border p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={organizer.imageUrl ?? undefined} alt={organizer.name} />
          <AvatarFallback className="bg-gray-900 text-white text-sm font-bold">{organizer.initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold">{organizer.name}</p>
            {organizer.isVerified && <Check className="h-4 w-4 bg-[#0F6E56] text-[#FFFFFF] rounded-full"/>}
            {!organizer.isVerified && <Check className="h-4 w-4 hidden md:hidden bg-[#0F6E56] text-[#FFFFFF] rounded-full"/>}
          </div>
          <p className="text-xs text-[#6E6577]">
            {organizer.isVerified ? 'Verified organizer' : 'Organizer'}
          </p>
        </div>
      </div>
    </section>
  )
}
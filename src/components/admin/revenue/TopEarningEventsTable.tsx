import { formatNaira } from "@/lib/utils";
import type { TopEarningEvent } from "@/types/revenue";


interface TopEarningEventsTableProps {
    events: TopEarningEvent[]
}

export default function TopEarningEventsTable({events} : TopEarningEventsTableProps) {
    return (
        <div className="border rounded-lg overflow-x-auto min-w-0 h-full">
            <div className="px-4 min-[400px]:px-6 py-3 min-[400px]:py-4 border-b">
                <h2 className="text-base min-[400px]:text-[18px] font-bold text-[#000000]">
                  Top earning events
                </h2>
            </div>
            <table className="w-full min-w-[420px]">
                <thead>
                    <tr>
                        <th className="text-left py-3 px-4 min-[400px]:px-6 font-bold font-space text-[#4A4451] text-xs min-[400px]:text-[20px] uppercase">Event</th>
                        <th className="text-left py-3 px-4 min-[400px]:px-6 font-bold font-space text-[#4A4451] text-xs min-[400px]:text-[20px] uppercase">Organizer</th>
                        <th className="text-left py-3 px-4 min-[400px]:px-6 font-bold font-space text-[#4A4451] text-xs min-[400px]:text-[20px] uppercase">Commission</th>
                    </tr>
                </thead>
                <tbody className="border-t">
                    {events.map((event) => (
                       <tr key={event.id} className="border-b last:border-b-0">
                         <td className="py-3 px-4 min-[400px]:px-6 text-xs min-[400px]:text-[16px] font-semibold text-[#6E6577]">{event.eventTitle}</td>
                        <td className="px-4 min-[400px]:px-6 text-xs min-[400px]:text-[16px] text-[#6E6577] font-semibold">{event.organizer}</td>
                        <td className="px-4 min-[400px]:px-6 font-bold text-xs min-[400px]:text-[20px] text-[#000000] font-space">{formatNaira(event.commission)}</td>
                       </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
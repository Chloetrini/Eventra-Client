import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { events } from "@/lib/dummy-event";
import type { Event } from "@/types/event";

const STATUS_STYLES: Record<Event["status"], string> = {
  Live: "bg-[#E4F1EB] text-[#0F6E56]",
  Draft: "bg-[#F4DFB6] text-[#7A4E02]",
  "Sold out": "bg-[#1A1523] text-white",
  Past: "bg-white text-[#4A4451] border border-[#4A4451]/30",
  Rejected: "bg-[#FFC4C4] text-[#3A3A3A]",
};

const RECENT_COUNT = 4;
export function RecentEventsTable() {
  const recentEvents = events.slice(0, RECENT_COUNT);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base min-[400px]:text-[20px] font-semibold text-[#1A1523]">
          Recent events
        </h2>
        <Link
          to="/events"
          className="text-xs min-[400px]:text-sm font-medium text-[#0F6E56] flex items-center gap-1 hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 font-medium text-[#6E6577] text-[16px]">
                EVENT
              </th>
              <th className="text-left py-2 font-medium text-[#6E6577] text-[16px]">
                DATE
              </th>
              <th className="text-left py-2 font-medium text-[#6E6577] text-[16px]">
                SOLD
              </th>
              <th className="text-left py-2 font-medium text-[#6E6577] text-[16px]">
                STATUS
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>

          <tbody>
            {recentEvents.map((event) => (
              <tr key={event._id} className="border-b last:border-b-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={event.coverImage}
                      alt={event.eventTitle}
                      className="size-10 rounded-md object-cover"
                    />

                    <div>
                      <p className="font-medium text-[17px] text-[#1A1523]">
                        {event.eventTitle}
                      </p>
                      <p className="text-[12px] text-[#6E6577]">
                        № {event.eventNumber} · {event.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-[#000000] text-[16px]">
                  {event.date ? formatDateTime(event.date, "EEE d MMM") : "--"}
                </td>

                <td className="font-bold text-[#000000]">
                  {event.sold !== null && event.capacity !== null
                    ? `${event.sold} / ${event.capacity}`
                    : "--"}
                </td>

                <td>
                  <Badge
                    className={`${STATUS_STYLES[event.status]} hover:${STATUS_STYLES[event.status]} rounded-full text-[10px]`}
                  >
                    {event.status.toUpperCase()}
                  </Badge>
                </td>

                <td>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
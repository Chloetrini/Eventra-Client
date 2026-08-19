import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCompactNaira, formatDateTime, formatNaira } from "@/lib/utils";
import type { Event } from "@/types/event";
import GemImage from "@/assets/Group 8.png";
import { EventActionsMenu } from "@/components/event-actions-menu";


interface EventsTableProps {
  events: Event[];
  onEventDeleted?: (eventId: string) => void;
}

const STATUS_STYLES: Record<Event["status"], string> = {
  Live: "bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]",
  Draft: "bg-[#F4DFB6] text-[#7A4E02] dark:bg-[#7A4E02]/25 dark:text-[#F4DFB6]",
  Pending: "bg-[#DCEAFB] text-[#1D4ED8] dark:bg-[#1D4ED8]/20 dark:text-[#93C5FD]",
  "Sold out": "bg-[#1A1523] text-white dark:bg-white dark:text-[#1A1523]",
  Past: "bg-muted text-muted-foreground border border-border",
  Rejected: "bg-[#FFC4C4] text-[#BE2525] dark:bg-[#BE2525]/20 dark:text-[#FF8A8A]",
  Cancelled: "bg-[#FFC4C4] text-[#BE2525] dark:bg-[#BE2525]/20 dark:text-[#FF8A8A]",
  Postponed: "bg-[#FDE4C8] text-[#9A3412] dark:bg-[#9A3412]/25 dark:text-[#FDE4C8]",
};

const TYPE_STYLES: Record<Event["EventType"], string> = {
  Free: "bg-[#F4DFB6] text-[#7A4E02] dark:bg-[#7A4E02]/25 dark:text-[#F4DFB6]",
  Paid: "bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]",
};


export function EventsTable({ events, onEventDeleted }: EventsTableProps) {
  return (
    <div className="overflow-x-auto border border-border rounded-xl ">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground font-medium font-space "> EVENT </TableHead>
            <TableHead className="text-muted-foreground font-medium font-space"> DATE </TableHead>
            <TableHead className="text-muted-foreground font-medium font-space"> TYPE </TableHead>
            <TableHead className="text-muted-foreground font-medium font-space"> SOLD </TableHead>
            <TableHead className="text-muted-foreground font-medium font-space">
              {" "}
              REVENUE{" "}
            </TableHead>
            <TableHead className="text-muted-foreground font-medium"> STATUS </TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-[#E4F1EB] dark:bg-[#0F6E56]/15 rounded-xl p-10 mb-4">
                    <img
                      src={GemImage}
                      alt="Gem Image"
                      className="size-6 text-[#0F6E56]"
                    />
                  </div>
                  <p className="text-base font-bold text-[28px] text-foreground">
                    No Events here
                  </p>
                  <p className="text-[15px] text-muted-foreground mt-1">
                    Nothing matches this filter yet.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event._id} className="h-[85px]">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={event.coverImage}
                      alt={event.eventTitle}
                      className="size-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-[17px] font-semibold text-foreground">
                        {event.eventTitle}
                      </p>
                      <p className="text-[12px] text-muted-foreground font-space">
                        {/* event.eventNumber already comes back as "№ 0001"
                            from fetchMyEvents — this was prepending another
                            "№ " in front of it, so every row showed the
                            symbol twice ("№ № 0001"). */}
                        {event.eventNumber} · {event.category}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-[16px] text-foreground ">
                  {event.date ? formatDateTime(event.date, "EEE d MMM") : "--"}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`${TYPE_STYLES[event.EventType]} hover:${TYPE_STYLES[event.EventType]} rounded-full text-[10px] px-6 py-3 font-space font-bold`}
                  >
                    {event.EventType.toUpperCase()}
                  </Badge>
                </TableCell>

                <TableCell className="text-[16px] font-bold text-foreground font-space">
                  {event.sold !== null && event.capacity !== null
                    ? `${event.sold} / ${event.capacity}`
                    : "--"}
                </TableCell>

                <TableCell className="text-[16px] text-foreground font-bold font-space ">
                  {event.revenue !== null ? formatCompactNaira(event.revenue) : "--"}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`${STATUS_STYLES[event.status]} hover:${STATUS_STYLES[event.status]} rounded-full font-bold text-[10px] px-5 py-3 font-space`}
                  >
                    {event.status.toUpperCase()}
                  </Badge>
                </TableCell>

                <TableCell>
                  <EventActionsMenu
                    eventId={event._id}
                    eventTitle={event.eventTitle}
                    status={event.status}
                    onDeleted={() => onEventDeleted?.(event._id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCompactNaira, formatDateTime, formatNaira } from "@/lib/utils";
import type { Event } from "@/types/event";
import GemImage from "@/assets/Group 8.png";
import Loading from "@/assets/more.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, Users, Megaphone, Copy, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import EditPen from "@/assets/magicpen.png"
import Promote from "@/assets/star.png"
import Duplicate from "@/assets/3square.png"
import UserProfile from "@/assets/profile-2user.png"
import Preview from "@/assets/play.png"


interface EventsTableProps {
  events: Event[];
  onDuplicate: (event: Event) => void;
  onDeleteRequest: (event: Event) => void;
}

const STATUS_STYLES: Record<Event["status"], string> = {
  Live: "bg-[#E4F1EB] text-[#0F6E56]",
  Draft: "bg-[#F4DFB6] text-[#7A4E02]",
  "Sold out": "bg-[#1A1523] text-white",
  Past: "bg-[#E8E6E0] text-[#4A4451] border",
  Rejected: "bg-[#FFC4C4] text-[#BE2525]",
};

const TYPE_STYLES: Record<Event["EventType"], string> = {
  Free: "bg-[#F4DFB6] text-[#7A4E02]",
  Paid: "bg-[#E4F1EB] text-[#0F6E56]",
};


export function EventsTable({ events, onDuplicate, onDeleteRequest}: EventsTableProps) {
    const navigate = useNavigate();
  return (
    <div className="overflow-x-auto border rounded-xl ">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#6E6577] font-medium font-space "> EVENT </TableHead>
            <TableHead className="text-[#6E6577] font-medium font-space"> DATE </TableHead>
            <TableHead className="text-[#6E6577] font-medium font-space"> TYPE </TableHead>
            <TableHead className="text-[#6E6577] font-medium font-space"> SOLD </TableHead>
            <TableHead className="text-[#6E6577] font-medium font-space">
              {" "}
              REVENUE{" "}
            </TableHead>
            <TableHead className="text-[#6E6577] font-medium"> STATUS </TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-[#E4F1EB] rounded-xl p-10 mb-4">
                    <img
                      src={GemImage}
                      alt="Gem Image"
                      className="size-6 text-[#0F6E56]"
                    />
                  </div>
                  <p className="text-base font-bold text-[28px] text-[#1A1523]">
                    No Events here
                  </p>
                  <p className="text-[15px] text-[#4A4451] mt-1">
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
                      <p className="text-[17px] font-semibold text-[#1A1523]">
                        {event.eventTitle}
                      </p>
                      <p className="text-[12px] text-[#6E6577] font-space">
                        № {event.eventNumber}· {event.category}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-[16px] text-[#000000] ">
                  {event.date ? formatDateTime(event.date, "EEE d MMM") : "--"}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`${TYPE_STYLES[event.EventType]} hover:${TYPE_STYLES[event.EventType]} rounded-full text-[10px] px-6 py-3 font-space font-bold`}
                  >
                    {event.EventType.toUpperCase()}
                  </Badge>
                </TableCell>

                <TableCell className="text-[16px] font-bold text-[##000000] font-space">
                  {event.sold !== null && event.capacity !== null
                    ? `${event.sold} / ${event.capacity}`
                    : "--"}
                </TableCell>

                <TableCell className="text-[16px] text-[#000000] font-bold font-space ">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon">
                            <img src={Loading} alt="More Option" className="size-6 text-[#292D32]"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/events/${event._id}/edit`)} className="text-[#6E6577] text-[13px]">
                         <img src={EditPen} alt="magic pen" className="size-4 "/> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem disabled className="text-[#6E6577] text-[13px]">
                     <img src={Preview} alt="Preview image" className="size-4" /> Preview
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => navigate(`/attendees?event=${event._id}`)} className="text-[#6E6577] text-[13px]">
                        <img src={UserProfile} alt="User profile" className="size-4" />Attendance
                      </DropdownMenuItem>

                      <DropdownMenuItem disabled className="text-[#6E6577] text-[13px]">
                        <img src={Promote} alt="Promote icon" className="size-4" /> Promote
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(event)} className="text-[#6E6577] text-[13px] border-t border-[#E8E6E0]">
                        <img src={Duplicate} alt="Duplicate icon" className="size-4" /> Duplicate
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-[#BE2525] focus:text-[#BE2525] text-[13px]" onClick={() => onDeleteRequest(event)}>
                        <Trash2 className="size-4 hover:text-red-600" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
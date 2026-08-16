import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { Attendee } from "@/types/attendees";

interface AttendeeListProps {
  attendees: Attendee[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function AttendeeList({ attendees }: AttendeeListProps) {
  if (attendees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-lg">
        <p className="text-base text-[20px] font-bold text-foreground">
          No attendees found
        </p>
        <p className="font-medium text-muted-foreground mt-1">
          Nothing matches this filter yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-border font-space">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              ATTENDEE
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              TICKET
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              REFERENCE
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              PURCHASED
            </th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground text-[16px]">
              STATUS
            </th>
          </tr>
        </thead>

        <tbody>
          {attendees.map((attendee) => (
            <tr
              key={attendee._id}
              className="border-border last:border-b-0 "
            >
              <td className="py-5 px-4">
                <div className="flex items-center gap-3">
                  {attendee.avatarUrl ? (
                    <img
                      src={attendee.avatarUrl}
                      alt={attendee.name}
                      className="size-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="size-8 w-[50px] h-[50px] rounded-full bg-[#1A1523] text-[#FFFFFF] flex items-center justify-center text-[18px] font-bold shrink-0">
                      {getInitials(attendee.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-foreground font-semibold text-[17px]">
                      {attendee.name}
                    </p>
                    <p className="text-[16px] font-medium text-muted-foreground">{attendee.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 text-foreground text-[16px]">
                {attendee.ticketType === "Table"
                  ? `Table(${attendee.tableSize})`
                  : attendee.ticketType}
              </td>
              <td className="px-4 font-bold font-space text-foreground text-[20px]">
                {attendee.referenceCode}
              </td>
              <td className="px-4 text-foreground text-[16px]">
                {formatDateTime(attendee.purchasedDate, "MMM d")}
              </td>
              <td className="px-4">
                <Badge
                  className={
                    attendee.checkedIn
                      ? "bg-[#E4F1EB] dark:bg-[#0F6E56]/15 text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/15 rounded-[15px] w-[122px] h-[36px] font-semibold text-[13px]"
                      : "bg-muted text-muted-foreground hover:bg-accent rounded-full text-[10px] w-[122px] h-[28px] font-medium text-[13px]"
                  }
                >
                  {attendee.checkedIn ? "CHECKED IN" : "GOING"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { fetchEventAttendees, fetchMyEvents } from "@/lib/events-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { AttendeeList } from "@/components/attendee-list";
import { useOrganizerStatus } from "@/lib/organizer-api";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "checked-in", label: "Checked in" },
  { value: "not-in", label: "Not in" },
] as const;

export default function Attendees() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: fetchMyEvents,
  });

  const selectEventId = searchParams.get("event") ?? events[0]?._id ?? "";
  const activeFilter = searchParams.get("filter") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";

  const {
    data: attendees = [],
    isLoading: attendeesLoading,
    isError,
  } = useQuery({
    queryKey: ["attendees", selectEventId],
    queryFn: () => fetchEventAttendees(selectEventId),
    enabled: Boolean(selectEventId),
  });
  const { status } = useOrganizerStatus();
  const handleEventChange = (eventId: string | null) => {
    if (!eventId) return;
    const params = new URLSearchParams(searchParams);
    params.set("event", eventId);
    setSearchParams(params);
  };

  const handleFilterChnage = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const selectedEvent = events.find((event) => event._id === selectEventId);
  const total = attendees.length;
  const checkedIn = attendees.filter((a) => a.checkedIn).length;
  const notIn = total - checkedIn;

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "checked-in" && attendee.checkedIn) ||
      (activeFilter === "not-in" && !attendee.checkedIn);
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (eventsLoading || attendeesLoading) {
    return (
      <p className="text-center py-12 text-sm text-muted-foreground">
        Loading Attendees...
      </p>
    );
  }
  if (isError) {
    return (
      <p className="text-center py-12 text-sm text-red-500">
        Something went wrong loading attendees
      </p>
    );
  }

  return (
    <div className="max-w-[1147px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AccountReviewBanner status={status} />
      <div>
        <p className="text-[16px] min-[400px]:text-sm lg:text-[16px] font-medium tracking-wide uppercase text-[#0A4F41]">
          Manage
        </p>
        <h1 className="text-[34px] leading-[40px] font-grotesk min-[400px] font-semibold text-[#1A1523] mt-1">
          Attendees
        </h1>
        <p className="text-[16px] leading-[26px] font-medium min-[400px]:text-sm lg:text-[16px] text-[#4A4451] mt-1">
          See who's coming to each event and report the guest list.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="py-[5px] text-[#6E6577] text-[16px] font-light uppercase">Event</span>
        <Select value={selectEventId} onValueChange={handleEventChange}>
          <SelectTrigger className="w-auto rounded-md py-3 min-[400px]:py-[18px] px-3 min-[400px]:px-4 border-[#E8E6E0] border text-[15px] min-[400px]:text-[15px] text-[#1A1523] font-bold">
            <SelectValue placeholder="Select event">
              {selectedEvent?.eventTitle}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event._id} value={event._id}>
                {event.eventTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="border-[#E8E6E0] border text-[#6E6577] rounded-md px-3 min-[400px]:px-4 py-1.5 min-[400px]:py-2 text-[15px]min-[400px]:text-[15px] font-bold">
          Total <span className="font-bold text-[15px] text-[#1A1523]">{total}</span>
        </div>
        <div className="border-[#E8E6E0] border text-[#6E6577] rounded-md px-3 min-[400px]:px-4 py-1.5 min-[400px]:py-2 text-[15px]min-[400px]:text-[15px] font-bold">
          Checked in <span className="font-bold text-[15px] text-[#1A1523]">{checkedIn}</span>
        </div>
        <div className="border-[#E8E6E0] border text-[#6E6577] rounded-md px-3 min-[400px]:px-4 py-1.5 min-[400px]:py-2 text-[15px]min-[400px]:text-[15px] font-bold">
          Not in <span className="font-bold text-[15px] text-[#1A1523]">{notIn}</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#B5B5B5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search name, email or reference"
            className="w-full pl-9 pr-3 py-2 text-[15px] text-[#6E6577] border border-[#E8E6E0] rounded-[7px] outline-none"
          />
        </div>
        <div className="flex w-full lg:w-auto gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChnage(filter.value)}
              className={cn(
                "px-4 py-1.5 rounded-[7px] font-medium border transition-colors shrink-0",
                activeFilter === filter.value
                  ? "bg-[#0A4F41] text-[#FFFFFF] border-[#0A4F41] font-bold text-[15px]"
                  : "bg-white text-[16px] text-[#6E6577] border border-[#E8E6E0]",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <AttendeeList attendees={filteredAttendees} />
    </div>
  );
}
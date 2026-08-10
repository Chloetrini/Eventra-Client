import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { getAttendees } from "@/lib/api/attendees";
import { events } from "@/lib/dummy-event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RecentEventsTable } from "@/components/recent-evnts-table";
import { AccountReviewBanner } from "@/components/account-review-banner";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "checked-in", label: "Checked in" },
  { value: "not-in", label: "Not in" },
] as const;

const DEFAULT_EVENT_ID = "2";

export default function Attendees() {
  const {
    data: attendees,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attendees"],
    queryFn: getAttendees,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectEventId = searchParams.get("event") ?? DEFAULT_EVENT_ID;
  const activeFilter = searchParams.get("filter") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";

  const handleEventChange = (eventId: string | null) => {
    if (!eventId) return;

    const params = new URLSearchParams(searchParams);

    if (eventId === DEFAULT_EVENT_ID) {
      params.delete("event");
    } else {
      params.set("event", eventId);
    }
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

  const eventAttendees =
    attendees?.filter((a) => a.eventId === selectEventId) ?? [];
  const selectedEvent = events.find((event) => event._id === selectEventId);
  const total = eventAttendees.length;
  const checkedIn = eventAttendees.filter((a) => a.checkedIn).length;
  const notIn = total - checkedIn;

  if (isLoading) {
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
      <AccountReviewBanner />

      <div>
        <p className="text-xs min-[400px]:text-sm lg:text-[16px] font-medium tracking-wide uppercase text-[#0A4F41]">
          Manage
        </p>
        <h1 className="text-xl min-[400px]:text-2xl font-bold text-[#1A1523] mt-1">
          Attendees
        </h1>
        <p className="text-xs min-[400px]:text-sm lg:text-[16px] text-[#4A4451] mt-1">
          See who's coming to each event and report the guest list.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectEventId} onValueChange={handleEventChange}>
          <SelectTrigger className="w-auto rounded-md py-3 min-[400px]:py-[18px] px-3 min-[400px]:px-4 border-[#4A4451]/20 text-xs min-[400px]:text-[15px] font-medium text-[#1A1523] font-bold">
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

        <div className="border-[#E8E6E0] border text-[#6E6577] rounded-md px-3 min-[400px]:px-4 py-1.5 min-[400px]:py-2 text-xs min-[400px]:text-[15px] font-medium">
          Total <span className="font-bold text-black">{total}</span>
        </div>

        <div className="border-[#E8E6E0] border text-[#6E6577] rounded-md px-3 min-[400px]:px-4 py-1.5 min-[400px]:py-2 text-xs min-[400px]:text-[15px] font-medium">
          Checked in <span className="font-bold text-black">{checkedIn}</span>
        </div>

        <div className="border-[#E8E6E0] border text-[#6E6577] rounded-md px-3 min-[400px]:px-4 py-1.5 min-[400px]:py-2 text-xs min-[400px]:text-[15px] font-medium">
          Not in <span className="font-bold text-black">{notIn}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6E6577]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search name, email or reference"
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#4A4451]/20 rounded-md outline-none focus:border-[#0F6E56]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 w-full lg:w-auto [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChnage(filter.value)}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-medium border transition-colors shrink-0",
                activeFilter === filter.value
                  ? "bg-[#0A4F41] text-white border-[#0A4F41]"
                  : "bg-white text-[#4A4451] border-[#4A4451]/20 hover:border-[#4A4451]/40",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <RecentEventsTable />
    </div>
  );
}
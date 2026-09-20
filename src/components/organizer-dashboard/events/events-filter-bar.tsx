import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "sold-out", label: "Sold out" },
  { value: "past", label: "Past" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "postponed", label: "Postponed" },
] as const;

export function EventsFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatus = searchParams.get("status") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
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

  return (
    // Was `flex-row justify-between` with the pills sharing a row with the
    // search box — the pills then had to compete for whatever leftover width
    // was left after the 520px search input, so the row wrapped mid-list at
    // an inconsistent point (e.g. just "Postponed" alone on its own line).
    // Giving the pills their own full-width row means they always wrap
    // against the *full* container width, so the wrap point is consistent
    // and never strands a single pill by itself.
    <div className="flex flex-col gap-3">
      <div className="relative w-full lg:w-[520px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground " />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search Events..."
          className="w-full pl-9 py-3 pr-3 text-[13px] border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-[10px] outline-none focus:border-[#0F6E56] "
        />
      </div>

      <div className="flex gap-2 flex-wrap w-full">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleStatusChange(filter.value)}
            className={cn(
              "px-[15px] py-[10px] rounded-[20px] text-[13px] border border-border transition-colors whitespace-nowrap",
              activeStatus === filter.value
                ? "bg-[#3A3A3A] text-[#FFFFFF] border-[#3A3A3A] dark:bg-white dark:text-[#1A1523]"
                : "text-muted-foreground hover:border-foreground/30",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

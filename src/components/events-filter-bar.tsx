import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "draft", label: "Draft" },
  { value: "sold-out", label: "Sold out" },
  { value: "past", label: "Past" },
  { value: "rejected", label: "Rejected" },
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
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
      <div className="relative w-full lg:w-[520px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6E6577] " />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search Events..."
          className="w-full pl-9 py-3 pr-3 text-[13px] border text-[#6E6577] rounded-[10px] outline-none focus:border-[#0F6E56] "
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleStatusChange(filter.value)}
            className={cn(
              "px-[15px] py-[10px] rounded-[20px] text-[13px] border border-[#E8E6E0] transition-colors",
              activeStatus === filter.value
                ? "bg-[#3A3A3A] text-[#FFFFFF] border-[#E8E6E0]"
                : "text-[#6E6577] hover:border-[#E8E6E0]",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

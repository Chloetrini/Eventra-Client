import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { STATES, type State } from "@/types/event-types";
import { DATE_WINDOWS, type DateWindow } from "@/types/event-types"
import { SORT_OPTIONS, type SortOption, ACCESS_OPTIONS } from "@/types/event-types";
import { useEventSearchSuggestions } from "@/hooks/use-event-search-suggestions";
import { EventSearchSuggestions } from "@/components/search/event-search-suggestions";
type TopBarProps = {
    searchValue: string;
    stateValue: string;
    dateValue: DateWindow;
    accessValue: string;
    sortValue: SortOption;
    sortOnChange: (sortValue: string | null) => void;
    accessOnClick: (accessValue: string) => void;
    stateOnChange: (stateValue: string | null) => void;
    searchOnChange: (searchValue: string) => void;
    dateOnChange: (dateValue: string | null) => void;
    placeholder?: string;
    debounceMs?: number;
};

export function TopBarFilter({
    searchValue,
    stateValue,
    dateValue,
    sortValue,
    accessValue,
    stateOnChange,
    accessOnClick,
    sortOnChange,
    searchOnChange,
    dateOnChange,
    placeholder = "Search events, artists, venues",
    debounceMs = 300,
}: TopBarProps) {
    const [local, setLocal] = useState(searchValue);
   
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const navigate = useNavigate();
    const { suggestions, isLoading: suggestionsLoading } = useEventSearchSuggestions(local);

    useEffect(() => {
        setLocal(searchValue);
    }, [searchValue]);


    useEffect(() => {
        if (local === searchValue) return;
        const timer = setTimeout(() => searchOnChange(local), debounceMs);
        return () => clearTimeout(timer);
    }, [local, searchValue, searchOnChange, debounceMs]);

    const goToSuggestedEvent = (slug: string) => {
        setSuggestionsOpen(false);
        navigate(`/events/${slug}`);
    };

    const seeAllResults = () => {
        setSuggestionsOpen(false);
        searchOnChange(local);
    };

    return (
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 w-full justify-between  ">
            <div className="relative w-full md:min-w-[240px] md:max-w-[467px]">
                <Search className="absolute left-3 top-1/2 w-[12px] h[12px] md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    onFocus={() => setSuggestionsOpen(true)}
                    onBlur={() => setSuggestionsOpen(false)}
                    placeholder={placeholder}
                    className="pl-9 w-full !h-[42px] text-[13px] md:[15px]"
                />
                {suggestionsOpen && (
                    <EventSearchSuggestions
                        query={local}
                        suggestions={suggestions}
                        isLoading={suggestionsLoading}
                        onSelectEvent={goToSuggestedEvent}
                        onSeeAll={seeAllResults}
                    />
                )}
            </div>
            <div className="md:flex gap-2 grid grid-cols-2">
                <Select
                    value={stateValue}
                    onValueChange={stateOnChange}
                >
                    <SelectTrigger className="w-full md:w-[125px] !h-[42px] py-0 items-center rounded-[18px] text-[13px] md:text-[15px]">
                        <SelectValue placeholder="All states" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]">
                        <SelectItem value="all">All states</SelectItem>
                        {STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                                {state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={dateValue === "any" ? "" : dateValue}
                    onValueChange={(v) => dateOnChange(v)}>
                    <SelectTrigger className="w-full md:w-[161px] !h-[42px] py-0 items-center rounded-[18px] ">
                        <SelectValue placeholder="Any dates" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]">
                        {(Object.keys(DATE_WINDOWS) as DateWindow[]).map((key) => (
                            <SelectItem key={key} value={key}>
                                {DATE_WINDOWS[key].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex rounded-[10px] md:rounded-[18px] border p-1 h-[42px] items-center w-full md:w-[163px] overflow-hidden text-[13px] md:text-[15px]">
                    {ACCESS_OPTIONS.map((option, index) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => accessOnClick(option)}
                            className={cn(
                                "flex-1 h-full md:px-3 text-sm capitalize transition-colors",
                                index === 0 && "md:rounded-l-[16px] rounded-l-[10px]",
                                index === ACCESS_OPTIONS.length - 1 && "md:rounded-r-[16px] rounded-r-[10px]",
                                accessValue === option
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <Select value={sortValue}
                    onValueChange={sortOnChange}>
                    <SelectTrigger className="w-full md:w-[125px] !h-[44px] py-0 items-center">
                        <span className="text-muted-foreground mr-1">Sort:</span>
                       <SelectValue placeholder="Trending" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]">
                        {(Object.keys(SORT_OPTIONS) as SortOption[]).map((key) => (
                            <SelectItem key={key} value={key}>
                                {SORT_OPTIONS[key]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


        </div>
    );
}

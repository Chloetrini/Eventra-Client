import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search events, artists, venues",
  debounceMs = 300,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  // Sync back if the URL changes from elsewhere (back button, clear all).
  useEffect(() => {
    setLocal(value);
  }, [value]);

  // Only push upward once typing pauses.
  useEffect(() => {
    if (local === value) return;
    const timer = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(timer);
  }, [local, value, onChange, debounceMs]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="pl-9 w-[495px] h-[34px]"
      />
    </div>
  );
}
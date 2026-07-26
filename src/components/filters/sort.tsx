import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, type SortOption } from "@/lib/schema";

type SortSelectProps = {
  value: SortOption;
  onChange: (sortOption: SortOption) => void;
};

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[160px] h-[54px]">
      <span className="text-muted-foreground mr-1">Sort:</span>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {(Object.keys(SORT_OPTIONS) as SortOption[]).map((key) => (
        <SelectItem key={key} value={key}>
          {SORT_OPTIONS[key]}
        </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
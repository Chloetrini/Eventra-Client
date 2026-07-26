import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DATE_WINDOWS, type DateWindow } from "@/lib/schema";

type DateSelectProps = {
  value: DateWindow;
  onChange: (dateWindow: DateWindow) => void;
};

export function DateSelect({ value, onChange }: DateSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateWindow)}>
      <SelectTrigger className="w-[125px] h-[54px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(DATE_WINDOWS) as DateWindow[]).map((key) => (
          <SelectItem key={key} value={key}>
            {DATE_WINDOWS[key].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
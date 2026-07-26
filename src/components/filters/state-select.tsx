import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { STATES, type State } from "@/lib/schema";

type StateSelectProps = {
  value: State | "";
  onChange: (state: State | "") => void;
};

export function StateSelect({ value, onChange }: StateSelectProps) {
  return (
    <Select
      value={value || "All states"}
      onValueChange={(v) => onChange(v === "all" ? "" : (v as State))}
    >
      <SelectTrigger className="w-[125px] h-[54px]">
        <SelectValue placeholder="All states" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All states</SelectItem>
        {STATES.map((state) => (
          <SelectItem key={state} value={state}>
            {state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
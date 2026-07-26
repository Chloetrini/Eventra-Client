// when-filter.tsx
import { DATE_WINDOWS, type DateWindow } from "@/lib/schema";

type WhenFilterProps = {
  selected: DateWindow;
  onSelect: (when: DateWindow) => void;
};

export function WhenFilter({ selected, onSelect }: WhenFilterProps) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        When
      </h3>
      <ul className="space-y-2">
        {(Object.keys(DATE_WINDOWS) as DateWindow[]).map((key) => (
          <li key={key} className="flex items-center gap-2">
            <input
              type="radio"
              id={`when-${key}`}
              name="when"
              checked={selected === key}
              onChange={() => onSelect(key)}
              className="accent-emerald-600"
            />
            <label htmlFor={`when-${key}`} className="cursor-pointer text-sm">
              {DATE_WINDOWS[key].label}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
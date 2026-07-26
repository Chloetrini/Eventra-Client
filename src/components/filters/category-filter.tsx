import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORIES, type Category } from "@/lib/schema";

type CategoryFilterProps = {
  selected: Category[];
  counts: Record<string, number>;
  onToggle: (category: Category) => void;
};

export function CategoryFilter({
  selected,
  counts,
  onToggle,
}: CategoryFilterProps) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Category
      </h3>
      <ul className="space-y-2">
        {CATEGORIES.map((category) => (
          <li key={category} className="flex items-center gap-2">
            <Checkbox
              id={`cat-${category}`}
              checked={selected.includes(category)}
              onCheckedChange={() => onToggle(category)}
            />
            <label
              htmlFor={`cat-${category}`}
              className="flex-1 cursor-pointer text-sm"
            >
              {category}
            </label>
            <span className="text-xs text-muted-foreground">
              {counts[category] ?? 0}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
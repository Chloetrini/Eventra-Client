import { CategoryFilter } from "./category-filter";
import { WhenFilter } from "./when-filter";
import { PriceFilter } from "./price-filter";
import { Button } from "@/components/ui/button";
import type { EventFilters, Category, DateWindow, PriceTier } from "@/lib/schema";

type FilterSidebarProps = {
  filters: EventFilters;
  categoryCounts: Record<string, number>;
  onToggleCategory: (c: Category) => void;
  onSelectWhen: (w: DateWindow) => void;
  onSelectPrice: (p: PriceTier) => void;
  onClearAll: () => void;
};

export function FilterSidebar({
  filters,
  categoryCounts,
  onToggleCategory,
  onSelectWhen,
  onSelectPrice,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-8">
      <CategoryFilter
        selected={filters.categories}
        counts={categoryCounts}
        onToggle={onToggleCategory}
      />
      <WhenFilter selected={filters.when} onSelect={onSelectWhen} />
      <PriceFilter selected={filters.price} onSelect={onSelectPrice} />

      <Button variant="ghost" size="sm" onClick={onClearAll}>
        Clear all filters
      </Button>
    </aside>
  );
}
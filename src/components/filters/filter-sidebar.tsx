import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORIES, PRICE_TIERS, type Category } from "@/types/event-types";
import { Button } from "@/components/ui/button";
import type { EventFilters } from "@/types/event-types";
import type { DateWindow, PriceTier } from "@/types/event-types";


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
  onSelectPrice,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-8 w-full lg:w-[248px] lg:shrink-0">
      <Button variant="ghost" size="sm" onClick={onClearAll}
      className="text-[12px] text-[#6E6577] font-[400] font-sans p-0 m-0 pb-4  ">
        Clear all filters
      </Button>

      <section>
        <h3 className="mb-3 text-[12px] font-[600] uppercase tracking-wide text-muted-foreground font-sans tracking-wider">
          Category
        </h3>
        <ul className="space-y-4 ">
          {CATEGORIES.map((category) => (
            <li key={category} className="flex items-center gap-2 ">
              <Checkbox
                id={`cat-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => onToggleCategory(category)}
                className="w-[19px] h-[19px]"
              />
              <label
                htmlFor={`cat-${category}`}
                className="flex-1 cursor-pointer text-[15px] font-sans text-[#6E6577] font-[400]"
              >
                {category}
              </label>
              <span className="text-xs text-muted-foreground">
                {categoryCounts[category] ?? 0}
              </span>
            </li>
          ))}
        </ul>
        <hr className="mt-7" />
      </section>
      <section className="font-sans">
        <h3 className="mb-3 text-[12px] uppercase tracking-wide text-muted-foreground font-[600] text-[#4A4451]">
          Price
        </h3>
        <ul className="space-y-2">
          {(Object.keys(PRICE_TIERS) as PriceTier[]).map((key) => (
            <li key={key} className="flex items-center gap-2">
              <Checkbox
                id={`price-${key}`}
                 checked={filters.price === key}
                onCheckedChange={() => onSelectPrice(key)}
               className="w-[19px] h-[19px] data-[state=checked]:!bg-green-500 data-[state=checked]:!border-green-500 data-[state=checked]:!text-white"
              />
              <label htmlFor={`price-${key}`} className="cursor-pointer text-[15px] text-[#6E6577] font-[400] font-sans">
                {PRICE_TIERS[key].label}
              </label>
            </li>
          ))}
        </ul>
      </section>



    </aside>
  );
}
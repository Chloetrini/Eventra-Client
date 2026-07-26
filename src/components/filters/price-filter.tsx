// price-filter.tsx
import { PRICE_TIERS, type PriceTier } from "@/lib/schema";

type PriceFilterProps = {
  selected: PriceTier;
  onSelect: (price: PriceTier) => void;
};

export function PriceFilter({ selected, onSelect }: PriceFilterProps) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Price
      </h3>
      <ul className="space-y-2">
        {(Object.keys(PRICE_TIERS) as PriceTier[]).map((key) => (
          <li key={key} className="flex items-center gap-2">
            <input
              type="radio"
              id={`price-${key}`}
              name="price"
              checked={selected === key}
              onChange={() => onSelect(key)}
              className="accent-emerald-600"
            />
            <label htmlFor={`price-${key}`} className="cursor-pointer text-sm">
              {PRICE_TIERS[key].label}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth, type User } from "@/context/auth.context";
import { useUpdateProfile } from "@/hooks/use-profile";
import type { CurrencyPreference as CurrencyPreferenceValue } from "@/lib/user-api";
import { toast } from "react-toastify";

const CURRENCY_OPTIONS: { value: CurrencyPreferenceValue; label: string }[] = [
  { value: "Naira", label: "Naira (₦)" },
  { value: "Dollar", label: "Dollar ($)" },
  { value: "Cedis", label: "Cedis (₵)" },
  { value: "Pound", label: "Pound (£)" },
];

interface CurrencyPreferenceProps {
  // Card heading + helper copy differ slightly per role (attendee vs
  // organizer vs admin) so this reads naturally wherever it's dropped in,
  // without needing three near-identical copies of the same component.
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Lets the signed-in user (any role — attendee, organizer, or admin) pick
 * which currency they see prices in across the site. This is purely a
 * personal display preference: it never converts or rewrites anything
 * stored, it just changes what resolveViewerCurrency (backend,
 * lib/viewerCurrency.ts) hands back on this account's next request. Saves
 * immediately on change, same pattern as the admin Platform Configuration
 * currency Select (which sets the sitewide DEFAULT this falls back to when
 * unset) — no separate "Save" button needed.
 */
export function CurrencyPreference({
  title = "Currency",
  description = "Prices across the site will show in this currency.",
  className,
}: CurrencyPreferenceProps) {
  const { user, setUser } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const handleChange = async (value: string) => {
    if (!value) return;
    try {
      const updatedUser = await updateProfileMutation.mutateAsync({
        currencyPreference: value as CurrencyPreferenceValue,
      });
      setUser(updatedUser as User);
      // Every price on the site is converted server-side per request from
      // resolveViewerCurrency (backend, lib/viewerCurrency.ts) — changing
      // the preference here doesn't touch anything already sitting in the
      // React Query cache (home page, explore, tickets, dashboard/admin
      // revenue, etc.), so without this, prices kept showing the old
      // currency everywhere until a full page refresh forced a refetch.
      // A blanket invalidateQueries() is the safe fix: currency changes
      // are rare, and this guarantees every currency-dependent view on the
      // site refetches, instead of trying to enumerate every query key
      // that happens to show a price today (and missing new ones later).
      queryClient.invalidateQueries();
      toast.success("Currency updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update currency");
    }
  };

  return (
    <div className={className}>
      <label className="text-xs font-medium text-muted-foreground">{title.toUpperCase()}</label>
      <div className="mt-1.5">
        <Select
          value={user?.currencyPreference ?? ""}
          onValueChange={(val) => handleChange(val ?? "")}
          disabled={updateProfileMutation.isPending}
        >
          <SelectTrigger className="w-full sm:w-49.75">
            <SelectValue placeholder="Choose your currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1.5">{description}</p>}
      {updateProfileMutation.isPending && (
        <p className="text-xs text-muted-foreground mt-1">Saving…</p>
      )}
    </div>
  );
}

export default CurrencyPreference;

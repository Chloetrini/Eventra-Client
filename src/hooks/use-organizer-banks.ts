import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchBanks, resolveBankAccount } from "@/lib/settings";

// Same shape as onboarding's own bank list/verify (use-onboarding.ts) but
// against the settings.ts versions of these functions — the organizer
// "add bank account" dialog in Settings, not the onboarding wizard.

export function useOrganizerBanks(enabled = true) {
  return useQuery({
    queryKey: ["organizer-banks"],
    queryFn: fetchBanks,
    enabled,
    staleTime: Infinity,
  });
}

export function useResolveOrganizerBankAccount() {
  return useMutation({
    mutationFn: ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) =>
      resolveBankAccount(accountNumber, bankCode),
  });
}

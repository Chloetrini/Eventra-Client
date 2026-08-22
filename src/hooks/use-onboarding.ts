import { useMutation, useQuery } from "@tanstack/react-query";
import {
  saveOrganizerProfile,
  submitOrganizerProfileForReview,
  listBanks,
  resolveBankAccount,
} from "@/lib/onboarding-api";

// Every onboarding step (organisation, bank account, review) called its lib
// function directly with a hand-rolled isSubmitting useState. Same read/write
// split as everywhere else: listBanks is a read (useQuery, barely changes so
// cached indefinitely), everything else is a write (useMutation).

export function useListBanks() {
  return useQuery({ queryKey: ["banks"], queryFn: listBanks, staleTime: Infinity });
}

export function useSaveOrganizerProfile() {
  return useMutation({
    mutationFn: saveOrganizerProfile,
  });
}

export function useSubmitOrganizerProfileForReview() {
  return useMutation({
    mutationFn: submitOrganizerProfileForReview,
  });
}

export function useResolveBankAccount() {
  return useMutation({
    mutationFn: resolveBankAccount,
  });
}

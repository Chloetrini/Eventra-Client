import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchAdminPayoutsOverview,
  fetchAwaitingPayouts,
  fetchPayoutHistory,
  releaseEventPayout,
} from "@/lib/api/admin-payouts"
import { toast } from "react-toastify"

export function useAdminPayoutsOverview() {
  return useQuery({
    queryKey: ["admin", "payouts", "overview"],
    queryFn: fetchAdminPayoutsOverview,
  })
}

export function useAwaitingPayouts() {
  return useQuery({
    queryKey: ["admin", "payouts", "awaiting"],
    queryFn: fetchAwaitingPayouts,
  })
}

export function usePayoutHistory() {
  return useQuery({
    queryKey: ["admin", "payouts", "history"],
    queryFn: fetchPayoutHistory,
  })
}

export function useReleasePayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: releaseEventPayout,
    onSuccess: () => {
      toast.success("Payout process initiated")
      queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to release payout")
    },
  })
}
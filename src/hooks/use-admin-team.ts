import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteAdminAccount, fetchAdmins, inviteAdminAccount, updateAdminMemberRole } from "@/lib/api/admin-settings"
import type { AdminTier } from "@/types/admin-settings"

export const adminTeamKeys = {
  all: ["admin", "team"] as const,
}

export function useAdminTeam() {
  return useQuery({
    queryKey: adminTeamKeys.all,
    queryFn: fetchAdmins,
  })
}

export function useInviteAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { fullname: string; email: string; adminRole: AdminTier }) => inviteAdminAccount(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.all })
    },
  })
}

export function useUpdateAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, adminRole }: { id: string; adminRole: AdminTier }) => updateAdminMemberRole(id, adminRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.all })
    },
  })
}

// Owner-only — the backend rejects a non-owner caller (or a target that's
// itself an owner, or the caller's own account) with a 400/403, see
// deleteAdmin's doc comment in admin.controller.ts.
export function useDeleteAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.all })
    },
  })
}

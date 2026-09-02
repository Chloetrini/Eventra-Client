import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminOrganizers,
  fetchAdminOrganizerDetail,
  approveOrganizer,
  rejectOrganizer,
  suspendOrganizer,
  unsuspendOrganizer,
  flagOrganizer,
  unflagOrganizer,
  dismissOrganizerFlag,
  fetchPendingAdminOrganizers,
} from "@/lib/api/admin-organizer";
import type { OrganizerStatusFilterOption } from "@/components/admin/organizer/AdminOrganizerFilterBar";

// Scoped key factory for admin organizer management
export const adminOrganizerKeys = {
  all: ["admin", "organizers"] as const,
  lists: () => [...adminOrganizerKeys.all, "list"] as const,
  list: (tab: OrganizerStatusFilterOption, q: string, page = 1) =>
    [...adminOrganizerKeys.lists(), { tab, q, page }] as const,
  details: () => [...adminOrganizerKeys.all, "detail"] as const,
  detail: (id: string) => [...adminOrganizerKeys.details(), id] as const,
};

// Hook: Fetch paginated & filtered list of organizers for Admin Console
export function useAdminOrganizers(tab: OrganizerStatusFilterOption, q: string, page = 1) {
  return useQuery({
    queryKey: adminOrganizerKeys.list(tab, q, page),
    queryFn: () => fetchAdminOrganizers({ tab, q: q || undefined, page }),
  });
}
export function usePendingAdminOrganizers() {
  return useQuery({
    queryKey: ["admin", "organizers", "pending"],
    queryFn: fetchPendingAdminOrganizers,
  })
}
// Hook: Fetch full details for a single organizer
export function useAdminOrganizerDetail(id: string | undefined) {
  return useQuery({
    queryKey: adminOrganizerKeys.detail(id as string),
    queryFn: () => fetchAdminOrganizerDetail(id as string),
    enabled: !!id,
  });
}

// Hook: Approve organizer KYC application
export function useApproveOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveOrganizer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.lists() });
    },
  });
}

// Hook: Reject organizer application with optional reason
export function useRejectOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectOrganizer(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.lists() });
    },
  });
}

export function useToggleSuspendOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isSuspended, reason }: { id: string; isSuspended: boolean; reason?: string }) =>
      isSuspended ? unsuspendOrganizer(id) : suspendOrganizer({ id, reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.lists() });
    },
  });
}

// Hook: Flag an organizer account
export function useFlagOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      flagOrganizer(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.lists() });
    },
  });
}

// Hook: Unflag or dismiss an organizer account flag
export function useUnflagOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dismissReport = false }: { id: string; dismissReport?: boolean }) =>
      dismissReport ? dismissOrganizerFlag(id) : unflagOrganizer(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminOrganizerKeys.lists() });
    },
  });
}
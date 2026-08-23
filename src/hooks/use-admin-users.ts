import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminUserDetail,
  fetchAdminUsers,
  suspendAdminUser,
  unsuspendAdminUser,
  type FetchAdminUsersParams,
} from "@/lib/admin-users-api";

export const adminUsersKeys = {
  all: ["admin", "users"] as const,
  list: (params: FetchAdminUsersParams) => [...adminUsersKeys.all, "list", params] as const,
  detail: (id: string) => [...adminUsersKeys.all, "detail", id] as const,
};

export function useAdminUsers(params: FetchAdminUsersParams) {
  return useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => fetchAdminUsers(params),
  });
}

export function useAdminUserDetail(id: string | undefined) {
  return useQuery({
    queryKey: adminUsersKeys.detail(id ?? ""),
    queryFn: () => fetchAdminUserDetail(id as string),
    enabled: Boolean(id),
  });
}

// Both mutations invalidate the whole `admin.users` branch (list + this
// user's detail) rather than hand-patching cache entries — the list is
// paginated/filtered by status, so a targeted cache update would have to
// know which page/filter combination the suspended user currently lives
// on. Simpler and safer to just refetch.
export function useSuspendAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
    },
  });
}

export function useUnsuspendAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unsuspendAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
    },
  });
}

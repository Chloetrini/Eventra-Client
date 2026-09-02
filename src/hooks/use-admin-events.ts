import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminEvents,
  fetchAdminEventDetail,
  flagAdminEvent,
  unflagAdminEvent,
  removeAdminEvent,
  approveEvent,
  rejectEvent,
  fetchPendingAdminEvents,
  unsuspendEvent,
  suspendEvent,
} from "@/lib/api/admin-events";
import type { StatusFilterOption } from "@/components/admin/events/AdminEventsFilterBar";

export interface FetchAdminEventsParams {
  status?: StatusFilterOption;
  tab?: StatusFilterOption;
  q?: string;
  page?: number;
  limit?: number;
}

export const adminEventsKeys = {
  all: ["admin", "events"] as const,
  lists: () => [...adminEventsKeys.all, "list"] as const,
  list: (params: FetchAdminEventsParams) =>
    [...adminEventsKeys.lists(), params] as const,
  detail: (id: string) => [...adminEventsKeys.all, "detail", id] as const,
};

export function useAdminEvents(params: FetchAdminEventsParams = {}) {
  const { status, tab, q = "", page = 1, limit = 20 } = params;
  const activeStatus = status ?? tab ?? "all";

  return useQuery({
    queryKey: adminEventsKeys.list({ status: activeStatus, q, page, limit }),
    queryFn: () =>
      fetchAdminEvents({
        status: activeStatus,
        q: q || undefined,
        page,
        limit,
      }),
  });
}

export function usePendingAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events", "pending"],
    queryFn: fetchPendingAdminEvents,
  });
}

export function useAdminEventDetail(id: string | undefined) {
  return useQuery({
    queryKey: adminEventsKeys.detail(id as string),
    queryFn: () => fetchAdminEventDetail(id as string),
    enabled: !!id,
  });
}

// One mutation covers both directions — flagged events show an "Unflag"
// button, unflagged ones show "Flag" (see AdminEventDetail's isFlagged
// branch), so the caller always knows which way to toggle.
export function useToggleFlagAdminEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, flagged }: { id: string; flagged: boolean }) =>
      flagged ? unflagAdminEvent(id) : flagAdminEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.all });
    },
  });
}

export function useRemoveAdminEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeAdminEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.all });
    },
  });
}

export function useApproveEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.lists() });
    },
  });
}

// Hook: Reject organizer application with optional reason
export function useRejectEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectEvent(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.lists() });
    },
  });
}

// Hook: Suspend event with optional reason
export function useSuspendEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      suspendEvent(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.lists() });
    },
  });
}

// Hook: Unsuspend event
export function useUnsuspendEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unsuspendEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminEventsKeys.lists() });
    },
  });
}
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
} from "@/lib/api/admin-events";
import type { StatusFilterOption } from "@/components/admin/events/AdminEventsFilterBar";


export const adminEventsKeys = {
  all: ["admin", "events"] as const,
  lists: () => [...adminEventsKeys.all, "list"] as const,
  list: (tab: StatusFilterOption, q: string) => [...adminEventsKeys.all, "list", tab, q] as const,
  detail: (id: string) => [...adminEventsKeys.all, "detail", id] as const,
};

export function useAdminEvents(tab: StatusFilterOption, q: string) {
  return useQuery({
    queryKey: adminEventsKeys.list(tab, q),
    queryFn: () => fetchAdminEvents({ tab, q: q || undefined }),
  });
}
export function usePendingAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events", "pending"],
    queryFn: fetchPendingAdminEvents,
  })
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


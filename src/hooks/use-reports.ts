import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFlags,
  getAuditLog,
  getEventFlagDetail,
  getOrganizerFlagDetail,
  dismissEventFlag,
  dismissOrganizerFlag,
  removeFlaggedEvent,
  suspendFlaggedOrganizer,
} from "@/lib/api/admin";
import type { Flag, AuditLogEntry, FlagTargetType } from "@/types/report";

export const reportsKeys = {
  all: ["admin", "reports"] as const,
  flags: () => [...reportsKeys.all, "flags"] as const,
  eventFlagDetail: (eventId: string) => [...reportsKeys.all, "flags", "event", eventId] as const,
  organizerFlagDetail: (organizerId: string) => [...reportsKeys.all, "flags", "organizer", organizerId] as const,
  auditLog: () => [...reportsKeys.all, "auditLog"] as const,
};

export function useFlags() {
  return useQuery<Flag[]>({
    queryKey: reportsKeys.flags(),
    queryFn: getFlags,
  });
}

export function useAuditLog() {
  return useQuery<AuditLogEntry[]>({
    queryKey: reportsKeys.auditLog(),
    queryFn: getAuditLog,
  });
}

export function useEventFlagDetail(eventId: string | undefined) {
  return useQuery({
    queryKey: reportsKeys.eventFlagDetail(eventId as string),
    queryFn: () => getEventFlagDetail(eventId as string),
    enabled: !!eventId,
  });
}

export function useOrganizerFlagDetail(organizerId: string | undefined) {
  return useQuery({
    queryKey: reportsKeys.organizerFlagDetail(organizerId as string),
    queryFn: () => getOrganizerFlagDetail(organizerId as string),
    enabled: !!organizerId,
  });
}

// One mutation covers both target types — dismissing a flag closes out its
// reports and clears the flag in the same call (see dismissEventFlag on
// the backend), so there's nothing further for the caller to do besides
// invalidate the flags list.
export function useDismissFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetType, targetId }: { targetType: FlagTargetType; targetId: string }) =>
      targetType === "event" ? dismissEventFlag(targetId) : dismissOrganizerFlag(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.all });
    },
  });
}

// The "take action" side — removes the event site-wide or suspends the
// organizer's account, depending on what was flagged.
export function useActionFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetType, targetId, reason }: { targetType: FlagTargetType; targetId: string; reason?: string }) =>
      targetType === "event" ? removeFlaggedEvent(targetId, reason) : suspendFlaggedOrganizer(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.all });
    },
  });
}

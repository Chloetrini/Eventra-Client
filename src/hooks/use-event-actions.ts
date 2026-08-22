import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent, duplicateEvent, cancelEvent, postponeEvent } from "@/lib/events-api";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";

// Shared by every place an event row's actions appear — the "..." menu
// (Events list, dashboard Overview, single-event details) and the
// single-event details page's own Cancel/Postpone dialogs. Extracted here
// instead of duplicated per-component so there's exactly one place that
// knows which caches a given event action touches.

function invalidateEventLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["my-events"] });
  queryClient.invalidateQueries({ queryKey: ["events"] });
  queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: (_data, eventId) => {
      invalidateEventLists(queryClient);
      queryClient.invalidateQueries({ queryKey: ["organizer-event-details", eventId] });
    },
  });
}

export function useDuplicateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => duplicateEvent(eventId),
    onSuccess: () => invalidateEventLists(queryClient),
  });
}

export function useCancelEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, reason }: { eventId: string; reason: string }) =>
      cancelEvent(eventId, reason),
    onSuccess: (_data, variables) => {
      invalidateEventLists(queryClient);
      queryClient.invalidateQueries({ queryKey: ["organizer-event-details", variables.eventId] });
    },
  });
}

export function usePostponeEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      newStartDate,
      reason,
    }: {
      eventId: string;
      newStartDate: string;
      reason?: string;
    }) => postponeEvent(eventId, newStartDate, reason),
    onSuccess: (_data, variables) => {
      invalidateEventLists(queryClient);
      queryClient.invalidateQueries({ queryKey: ["organizer-event-details", variables.eventId] });
    },
  });
}

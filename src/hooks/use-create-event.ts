import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";
import {
  createEvent,
  updateEvent,
  submitEventForApproval,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  fetchTicketTypesForEvent,
  getEvent,
} from "@/lib/create-event-api";



// The draft being edited (edit mode only — `enabled` is false with no id,
// so this is a no-op on the "create new" path).
export function useDraftEvent(eventId?: string | null) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId as string),
    enabled: Boolean(eventId),
  });
}

// Existing ticket types for a draft being edited, so the Tickets step can
// be pre-populated and Review can diff current-vs-existing on submit.
export function useDraftEventTicketTypes(eventId?: string | null) {
  return useQuery({
    queryKey: ["event-ticket-types", eventId],
    queryFn: () => fetchTicketTypesForEvent(eventId as string).catch(() => []),
    enabled: Boolean(eventId),
  });
}

// --- Writes ---

function invalidateEventLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["events"] });
  queryClient.invalidateQueries({ queryKey: ["my-events"] });
  queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });
}

// Step 1: creates the draft event.
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => invalidateEventLists(queryClient),
  });
}

// Steps 2-6: patches the draft event with each step's fields.
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, payload }: { eventId: string; payload: Record<string, unknown> }) =>
      updateEvent(eventId, payload),
    onSuccess: (_data, variables) => {
      invalidateEventLists(queryClient);
      queryClient.invalidateQueries({ queryKey: ["event", variables.eventId] });
    },
  });
}

// Review step: submits the draft for admin approval.
export function useSubmitEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => submitEventForApproval(eventId),
    onSuccess: (_data, eventId) => {
      invalidateEventLists(queryClient);
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
}

// Review step (paid events): create/update/delete a ticket type. All three
// invalidate the same ["event-ticket-types", eventId] list the Tickets step
// reads from.
export function useCreateTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: string;
      payload: Parameters<typeof createTicketType>[1];
    }) => createTicketType(eventId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["event-ticket-types", variables.eventId] });
    },
  });
}

export function useUpdateTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      ticketTypeId,
      payload,
    }: {
      eventId: string;
      ticketTypeId: string;
      payload: Parameters<typeof updateTicketType>[2];
    }) => updateTicketType(eventId, ticketTypeId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["event-ticket-types", variables.eventId] });
    },
  });
}

export function useDeleteTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, ticketTypeId }: { eventId: string; ticketTypeId: string }) =>
      deleteTicketType(eventId, ticketTypeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["event-ticket-types", variables.eventId] });
    },
  });
}

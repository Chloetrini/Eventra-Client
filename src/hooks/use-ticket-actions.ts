import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  rsvpFreeEvent,
  initializeCheckout,
  createRefundRequest,
  cancelReservation,
} from "@/lib/tickets-api";

// Checkout (free RSVP + paid initialize) and the attendee-facing ticket
// actions (refund request, cancel a free reservation) all used to call
// their lib function directly with a local isSubmitting/isProcessing
// useState. Same treatment as everywhere else — useMutation, and the two
// that change a ticket's status invalidate ["my-tickets"] on success.

export function useRsvpFreeEvent() {
  return useMutation({
    mutationFn: ({ eventId, payload }: { eventId: string; payload: Parameters<typeof rsvpFreeEvent>[1] }) =>
      rsvpFreeEvent(eventId, payload),
  });
}

export function useInitializeCheckout() {
  return useMutation({
    mutationFn: ({ eventId, payload }: { eventId: string; payload: Parameters<typeof initializeCheckout>[1] }) =>
      initializeCheckout(eventId, payload),
  });
}

export function useRequestTicketRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      reason,
      description,
      requestedResolution,
      evidence,
      additionalInformation,
    }: {
      ticketId: string;
      reason: string;
      description: string;
      requestedResolution: string;
      evidence: { url: string | null }[];
      additionalInformation: string;
    }) =>
      createRefundRequest(ticketId, reason, description, requestedResolution, evidence, additionalInformation),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-tickets"] }),
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => cancelReservation(ticketId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-tickets"] }),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import type { Attendee } from '@/types/check-in';
import {
    fetchEventAttendees,
    checkInAttendee,
    manualCheckIn,
} from '@/lib/check-in';
import { toast } from 'react-toastify';

// ─── Query Keys ──────────────────────────────────────────────────
export const checkInKeys = {
    all: ['check-in'] as const,
    attendees: (eventId: string) => [...checkInKeys.all, 'attendees', eventId] as const,
};

// ─── Hook ──────────────────────────────────────────────────────
export function useCheckIn(eventId: string) {

    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    // ─── Query: Fetch Attendees ──────────────────────────────────
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: checkInKeys.attendees(eventId),
        queryFn: () => fetchEventAttendees(eventId),
        staleTime: 30 * 1000,
    });

    // ─── Mutation: Manual Check-in ──────────────────────────────
    // The backend only checks in by ticket code — attendee.ticketReference
    // IS that code, not attendee.id (the ticket's database id).
    const { mutateAsync: manualCheckInMutation, isPending: isCheckingIn } = useMutation({
        mutationFn: ({ ticketReference }: { ticketReference: string }) =>
            manualCheckIn(eventId, ticketReference),
        onSuccess: (response, variables) => {
            queryClient.setQueryData(
                checkInKeys.attendees(eventId),
                (oldData: any) => {
                    if (!oldData) return oldData;
                    const updatedAttendees = oldData.attendees.map((a: Attendee) =>
                        a.ticketReference === variables.ticketReference
                            ? { ...a, checkedIn: true, checkedInAt: new Date().toISOString(), isScanned: true }
                            : a
                    );
                    return {
                        ...oldData,
                        attendees: updatedAttendees,
                        recentScan: updatedAttendees.find((a: Attendee) => a.ticketReference === variables.ticketReference),
                        stats: {
                            ...oldData.stats,
                            checkedIn: oldData.stats.checkedIn + 1,
                            remaining: oldData.stats.remaining - 1,
                            checkInRate:
                                ((oldData.stats.checkedIn + 1) / oldData.stats.totalAttendees) * 100,
                        },
                    };
                }
            );
            toast.success(response.message);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to check in attendee');
        },
    });

    // ─── Mutation: QR Code Check-in ─────────────────────────────
    const { mutateAsync: qrCheckInMutation, isPending: isScanning } = useMutation({
        mutationFn: ({ ticketReference }: { ticketReference: string }) =>
            checkInAttendee(eventId, ticketReference),
        onSuccess: (response) => {
            if (response.success && response.attendee) {
                queryClient.setQueryData(
                    checkInKeys.attendees(eventId),
                    (oldData: any) => {
                        if (!oldData) return oldData;
                        const existing = oldData.attendees.find(
                            (a: Attendee) => a.ticketReference === response.attendee?.ticketReference
                        );
                        let updatedAttendees;
                        if (existing) {
                            updatedAttendees = oldData.attendees.map((a: Attendee) =>
                                a.ticketReference === response.attendee?.ticketReference
                                    ? { ...a, checkedIn: true, checkedInAt: new Date().toISOString(), isScanned: true }
                                    : a
                            );
                        } else {
                            updatedAttendees = [...oldData.attendees, response.attendee];
                        }
                        return {
                            ...oldData,
                            attendees: updatedAttendees,
                            recentScan: response.attendee,
                            stats: {
                                ...oldData.stats,
                                checkedIn: oldData.stats.checkedIn + 1,
                                remaining: oldData.stats.remaining - 1,
                                checkInRate:
                                    ((oldData.stats.checkedIn + 1) / oldData.stats.totalAttendees) * 100,
                            },
                        };
                    }
                );
                toast.success(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Invalid ticket code');
        },
    });

    const handleCheckIn = useCallback(
        async (attendee: Attendee) => {
            if (attendee.checkedIn) {
                toast(`${attendee.name} is already checked in`);
                return;
            }
            await manualCheckInMutation({ ticketReference: attendee.ticketReference });
        },
        [manualCheckInMutation]
    );

    const handleQRCheckIn = useCallback(
        async (ticketReference: string): Promise<boolean> => {
            // Returns whether the scan succeeded, so the caller
            // (CheckInContent's onQRScan) knows whether to close the
            // scanner modal. onError above already shows the user-facing
            // toast for a bad scan ('Not a valid ticket for this event' /
            // 'already checked in') — this catch exists only to turn that
            // rejection into a `false` return instead of letting it
            // propagate, since propagating it would skip the modal-closing
            // logic in the caller entirely (an uncaught throw there just
            // aborts the async function, it doesn't "choose" to keep the
            // modal open — it happens to, by accident, which is fragile).
            try {
                await qrCheckInMutation({ ticketReference });
                return true;
            } catch {
                return false;
            }
        },
        [qrCheckInMutation]
    );

    const filteredAttendees = data?.attendees?.filter(
        (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.ticketReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return {
        attendees: data?.attendees || [],
        filteredAttendees,
        stats: data?.stats || { totalAttendees: 0, checkedIn: 0, remaining: 0, checkInRate: 0 },
        recentScan: data?.recentScan || null,
        eventName: data?.eventName || '',
        eventImage: data?.eventImage || null,
        isLoading,
        isError,
        isCheckingIn,
        isScanning,
        error,
        searchQuery,
        setSearchQuery,
        handleCheckIn,
        handleQRCheckIn,
        refetch,
    };
}
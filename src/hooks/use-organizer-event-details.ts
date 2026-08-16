import { useQuery } from '@tanstack/react-query';
import { fetchEventDashboard } from '@/services/events-api';
import type { OrganizerEventDetails } from '@/types/organizer-event';

export function useOrganizerEventDetails(eventId?: string) {
  return useQuery<OrganizerEventDetails>({
    queryKey: ['organizer-event-details', eventId],
    queryFn: () => fetchEventDashboard(eventId!),
    enabled: Boolean(eventId),
  });
}

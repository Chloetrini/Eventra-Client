import { fetchEventBySlug } from '@/lib/events-api';
import { fetchEventTickets } from '@/lib/tickets-api';
import { useQuery } from '@tanstack/react-query'


export const useFetchBySlug = ( slug?: string ) => {
    return useQuery ({
        queryKey: ["event", slug],
        queryFn: () => fetchEventBySlug(slug ?? ""),
        enabled: Boolean(slug),
    })
};

export const useFetchEventTickets = ( slug?: string ) => {
  return useQuery({
    queryKey: ["event-tickets", slug],
    queryFn: () => fetchEventTickets(slug ?? ""),
    enabled: Boolean(slug),
  });
}
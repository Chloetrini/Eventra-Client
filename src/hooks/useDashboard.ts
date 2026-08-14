import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/lib/organizer-api';

export const DASHBOARD_QUERY_KEY = 'dashboard';

export const useDashboard = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
  });
};
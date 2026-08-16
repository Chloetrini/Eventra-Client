import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/services/organizer-api';
import type { RevenuePeriod } from '@/types/dashboard';

export const DASHBOARD_QUERY_KEY = 'dashboard';

export const useDashboard = (period: RevenuePeriod = '30d') => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, period],
    queryFn: () => fetchDashboard(period),
    staleTime: 5 * 60 * 1000,
  });
};
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardMock } from '@/mocks/dashboardMockData';

export const DASHBOARD_QUERY_KEY = 'dashboard';

export const useDashboard = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: fetchDashboardMock,
    staleTime: 5 * 60 * 1000,
  });
};
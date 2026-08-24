import { useQuery } from '@tanstack/react-query';
import { fetchAdminNavCounts } from '@/lib/admin-nav-counts-api';

export const adminNavKeys = {
  all: ['admin-nav'] as const,
  counts: () => [...adminNavKeys.all, 'counts'] as const,
};

// Real counts from GET /admin/nav-counts — previously this returned
// hardcoded mock numbers (5/3/2) regardless of what was actually pending.
// Polls every 60s so a badge clears itself shortly after another admin (or
// this one, in another tab) resolves the last item in a queue, without
// needing a manual refresh.
export function useAdminNavCounts() {
  return useQuery({
    queryKey: adminNavKeys.counts(),
    queryFn: fetchAdminNavCounts,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

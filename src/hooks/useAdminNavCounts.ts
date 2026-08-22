import { useQuery } from '@tanstack/react-query';

// Counts shown as pill badges on the sidebar's Approvals / Refunds /
// Reports nav items. These are aggregate counts (e.g. "Approvals" folds
// together pending events + organizers + promotions), which is why they
// won't necessarily match the Overview page's Needs Action card counts
// one-for-one — different question ("how many of this kind exist across
// the whole admin console") than "what's shown on today's snapshot".
//
// Exported so SideBar.tsx can type `counts` against this directly —
// no manual cast needed as long as countKey stays one of these three keys.
export interface AdminNavCounts {
    pendingApprovals: number;
    pendingRefunds: number;
    flaggedReports: number;
}

const mockAdminNavCounts: AdminNavCounts = {
    pendingApprovals: 10, // events pending (5) + organizers to verify (3) + promotions pending (2)
    pendingRefunds: 5, // refund requests (3) + flagged refund requests (2)
    flaggedReports: 3, // flagged events (2) + open payment disputes (1)
};

export function useAdminNavCounts() {
    return useQuery<AdminNavCounts>({
        queryKey: ['admin', 'nav-counts'],
        queryFn: async () => {
            // Real call, once the backend endpoint exists:
            // const { data } = await apiClient.get("/admin/nav-counts");
            // return data;

            // Mock, pending backend:
            await new Promise((resolve) => setTimeout(resolve, 200));
            return mockAdminNavCounts;
        },
    });
}
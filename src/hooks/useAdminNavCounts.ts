import { useQuery } from '@tanstack/react-query';

// ─── MOCK DATA ──────────────────────────────────────────────
// Renamed keys to match what SideBar.tsx expects
const mockNavCounts = {
  pendingApprovals: 5,    
  pendingRefunds: 3,      
  flaggedReports: 2,      
  flaggedReportsInvestigate: 2, // Keep this if your sidebar needs it later
};

export const adminNavKeys = {
  all: ['admin-nav'] as const,
  counts: () => [...adminNavKeys.all, 'counts'] as const,
};

export function useAdminNavCounts() {
  return useQuery({
    queryKey: adminNavKeys.counts(),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400)); 
      return mockNavCounts;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}










// import { useQuery } from '@tanstack/react-query';

// // ─── MOCK DATA ──────────────────────────────────────────────
// // Comment this out when the real API is ready
// const mockNavCounts = {
//   pendingApprovals: 5,    // Yellow dot
//   pendingRefunds: 3,      // Yellow dot
//   flaggedReports: 2,      // Red dot
//   flaggedReportsInvestigate: 2, // Red dot
// };

// // ─── API FUNCTION (Commented out) ──────────────────────────
// // const fetchAdminNavCounts = async () => {
// //   const response = await api.get('/admin/nav-counts');
// //   return response.data;
// // };

// export const adminNavKeys = {
//   all: ['admin-nav'] as const,
//   counts: () => [...adminNavKeys.all, 'counts'] as const,
// };

// export function useAdminNavCounts() {
//   return useQuery({
//     queryKey: adminNavKeys.counts(),
//     // Replace this with: queryFn: fetchAdminNavCounts,
//     queryFn: async () => {
//       // Simulate network delay for realism
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       return mockNavCounts;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// }
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile } from '@/lib/api';

export const PROFILE_QUERY_KEY = 'profile';

export const useProfile = () => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedData) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY], updatedData);
    },
  });
};
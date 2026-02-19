import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { UserProfile } from '../types';

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get('/user-profile/me');
      return response.data.data;
    },
  });

  // Create or update user profile
  const updateProfile = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await api.put('/user-profile', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
};

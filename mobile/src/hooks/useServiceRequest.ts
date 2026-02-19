import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { ServiceRequest } from '../types';

export const useServiceRequest = () => {
  const queryClient = useQueryClient();

  const createRequest = useMutation({
    mutationFn: async (data: {
      service_type: ServiceRequest['service_type'];
      user_notes?: string;
    }) => {
      const response = await api.post('/service-requests', { data });
      return response.data.data as ServiceRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  return {
    createRequest: createRequest.mutate,
    isCreating: createRequest.isPending,
    error: createRequest.error,
  };
};

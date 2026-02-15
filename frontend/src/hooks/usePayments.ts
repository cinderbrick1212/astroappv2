import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Payment } from '../types';

export const usePayments = () => {
  const queryClient = useQueryClient();

  // Create payment order
  const createOrder = useMutation({
    mutationFn: async (data: { amount: number; plan_type: string }) => {
      const response = await api.post('/payments/create-order', data);
      return response.data;
    },
  });

  // Verify payment
  const verifyPayment = useMutation({
    mutationFn: async (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const response = await api.post('/payments/verify', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh premium status
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  return {
    createOrder: createOrder.mutate,
    verifyPayment: verifyPayment.mutate,
    isCreatingOrder: createOrder.isPending,
    isVerifying: verifyPayment.isPending,
  };
};

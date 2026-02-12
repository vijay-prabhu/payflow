import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPayments, fetchPayment, createPayment } from '../services/api';

export function usePayments(status?: string) {
  return useQuery({
    queryKey: ['payments', status],
    queryFn: () => fetchPayments(status),
    refetchInterval: 10_000,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => fetchPayment(id),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

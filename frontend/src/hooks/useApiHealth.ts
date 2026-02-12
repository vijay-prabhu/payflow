import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '../services/api';

export function useApiHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
  });
}

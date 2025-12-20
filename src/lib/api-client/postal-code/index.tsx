import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';

interface ListParams {
  page?: number;
  limit?: number;
  state?: string;
  paginate?: boolean;
}

const list = async ({ page = 1, limit = 100, state, paginate }: ListParams = {}) => {
  const response = await apiClient.get('/postal-codes', {
    params: { page, limit, state, paginate },
  });
  return response.data;
};

export const useList = ({ page = 1, limit = 100, state, paginate }: ListParams = {}) => {
  return useQuery({
    queryKey: ['postal-codes-list', page, limit, state, paginate],
    queryFn: () => list({ page, limit, state, paginate }),
    enabled: !!state,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

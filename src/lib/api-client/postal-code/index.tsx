import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';

interface ListParams {
  page?: number;
  limit?: number;
  state?: string;
  paginate?: boolean;
  search?: string;
}

const list = async ({ page = 1, limit = 100, state, paginate, search }: ListParams = {}) => {
  const response = await apiClient.get('/postal-codes', {
    params: { page, limit, state, paginate, search },
  });
  return response.data;
};

export const useList = ({ page = 1, limit = 100, state, paginate, search }: ListParams = {}) => {
  return useQuery({
    queryKey: ['postal-codes-list', page, limit, state, paginate, search],
    queryFn: () => list({ page, limit, state, paginate, search }),
    enabled: !!state,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

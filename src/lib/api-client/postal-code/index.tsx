import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';

interface ListParams {
  page?: number;
  limit?: number;
}

const list = async ({ page = 1, limit = 100 }: ListParams = {}) => {
  const response = await apiClient.get('/postal-codes', {
    params: { page, limit },
  });
  return response.data;
};

export const useList = ({ page = 1, limit = 100 }: ListParams = {}) => {
  return useQuery({
    queryKey: ['postal-codes-list', page, limit],
    queryFn: () => list({ page, limit }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

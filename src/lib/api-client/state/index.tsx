import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';

interface ListParams {
  country?: string;
  page?: number;
  limit?: number;
  paginate?: boolean;
}

const list = async ({ country, page, limit, paginate }: ListParams = {}) => {
  const response = await apiClient.get('/states', {
    params: { country, page, limit, paginate },
  });
  return response.data;
};

export const useList = ({ country, page = 1, limit = 100, paginate }: ListParams = {}) => {
  return useQuery({
    queryKey: ['states-list', country, page, limit, paginate],
    queryFn: () => list({ country, page, limit, paginate }),
    enabled: !!country,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

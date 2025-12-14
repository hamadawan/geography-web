import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';

const list = async () => {
  const response = await apiClient.get('/states');
  return response.data;
};

export const useList = () => {
  return useQuery({
    queryKey: ['states-list'],
    queryFn: list,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

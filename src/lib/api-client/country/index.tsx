import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';

interface ListParams {
    page?: number;
    limit?: number;
    paginate?: boolean;
}

const list = async ({ page = 1, limit = 100, paginate }: ListParams = {}) => {
    const response = await apiClient.get('/countries', {
        params: { page, limit, paginate },
    });
    return response.data;
};

export const useList = ({ page = 1, limit = 100, paginate }: ListParams = {}) => {
    return useQuery({
        queryKey: ['countries-list', page, limit, paginate],
        queryFn: () => list({ page, limit, paginate }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};

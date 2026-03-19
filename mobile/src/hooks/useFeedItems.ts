import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { FeedItem } from '../types';
import { queryKeys } from '../utils/queryKeys';

export const useFeedItems = () => {
  const { data: feedItems, isLoading, error, refetch } = useQuery<FeedItem[]>({
    queryKey: queryKeys.feedItems(),
    queryFn: async () => {
      const response = await api.get('/feed-items', {
        params: {
          filters: {
            is_active: true,
          },
          sort: ['priority:desc', 'published_at:desc'],
          pagination: {
            limit: 50,
          },
        },
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    feedItems: feedItems || [],
    isLoading,
    error,
    refetch,
  };
};

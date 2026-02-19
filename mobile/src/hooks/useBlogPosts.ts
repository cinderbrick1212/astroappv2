import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api';
import { BlogPost } from '../types';

export const useBlogPosts = (category?: string) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<BlogPost[]>({
    queryKey: ['blogPosts', category],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/blog-posts', {
        params: {
          ...(category ? { filters: { categories: { $containsi: category } } } : {}),
          sort: ['published_at:desc'],
          pagination: {
            page: pageParam,
            pageSize: 10,
          },
        },
      });
      return response.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    blogPosts: data?.pages.flat() ?? [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    refetch,
  };
};

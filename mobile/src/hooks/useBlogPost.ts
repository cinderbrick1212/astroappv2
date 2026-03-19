import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { BlogPost } from '../types';
import { queryKeys } from '../utils/queryKeys';

export const useBlogPost = (id: string) => {
  const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
    queryKey: queryKeys.blogPost(id),
    queryFn: async () => {
      const response = await api.get(`/blog-posts/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return { blogPost, isLoading, error };
};

export const queryKeys = {
  feedItems: () => ['feedItems'] as const,
  blogPosts: (category?: string) => ['blogPosts', category ?? 'all'] as const,
  blogPost: (id: string) => ['blogPost', id] as const,
  userProfile: (userId?: string) => ['userProfile', userId ?? 'me'] as const,
  serviceRequests: (userId?: string) => ['serviceRequests', userId ?? 'me'] as const,
};

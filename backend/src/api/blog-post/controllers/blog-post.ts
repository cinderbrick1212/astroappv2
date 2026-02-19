export default ({ strapi }) => ({
  /**
   * GET /api/blog-posts
   * Supports ?category=...&page=1&pageSize=20
   */
  async find(ctx) {
    try {
      const { category, page = '1', pageSize = '20' } = ctx.query as Record<string, string>;

      const pageNum = Math.max(1, parseInt(page, 10));
      const size = Math.min(50, Math.max(1, parseInt(pageSize, 10)));

      // When category filter is provided, use a raw where clause on the JSON field
      const where: Record<string, unknown> = {};
      if (category) {
        // Strapi v5: filter inside a json field via $contains
        where.categories = { $contains: category };
      }

      const [posts, total] = await Promise.all([
        strapi.db.query('api::blog-post.blog-post').findMany({
          where,
          orderBy: { createdAt: 'desc' },
          limit: size,
          offset: (pageNum - 1) * size,
          populate: ['featured_image'],
        }),
        strapi.db.query('api::blog-post.blog-post').count({ where }),
      ]);

      ctx.body = {
        data: posts,
        meta: {
          pagination: {
            page: pageNum,
            pageSize: size,
            total,
            pageCount: Math.ceil(total / size),
          },
        },
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      ctx.throw(500, 'Failed to fetch blog posts');
    }
  },

  /**
   * GET /api/blog-posts/:id
   */
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const post = await strapi.db.query('api::blog-post.blog-post').findOne({
        where: { id },
        populate: ['featured_image'],
      });

      if (!post) return ctx.notFound('Blog post not found');

      ctx.body = { data: post };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      ctx.throw(500, 'Failed to fetch blog post');
    }
  },
});

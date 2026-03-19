export default ({ strapi }) => ({
  /**
   * GET /api/feed-items
   * Supports ?lang=en|hi&type=tip|daily_horoscope|...&page=1&pageSize=20
   */
  async find(ctx) {
    try {
      const { lang, type, page = '1', pageSize = '20' } = ctx.query as Record<string, string>;

      const pageNum = Math.max(1, parseInt(page, 10));
      const size = Math.min(50, Math.max(1, parseInt(pageSize, 10)));

      const where: Record<string, unknown> = { is_active: true };
      if (lang) where.language_code = lang;
      if (type) where.type = type;

      const [items, total] = await Promise.all([
        strapi.db.query('api::feed-item.feed-item').findMany({
          where,
          orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
          limit: size,
          offset: (pageNum - 1) * size,
          populate: ['media'],
        }),
        strapi.db.query('api::feed-item.feed-item').count({ where }),
      ]);

      ctx.body = {
        data: items,
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
      strapi.log.error('Error fetching feed items:', error);
      ctx.throw(500, 'Failed to fetch feed items');
    }
  },

  /**
   * GET /api/feed-items/:id
   */
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const item = await strapi.db.query('api::feed-item.feed-item').findOne({
        where: { id, is_active: true },
        populate: ['media'],
      });

      if (!item) return ctx.notFound('Feed item not found');

      ctx.body = { data: item };
    } catch (error) {
      strapi.log.error('Error fetching feed item:', error);
      ctx.throw(500, 'Failed to fetch feed item');
    }
  },
});

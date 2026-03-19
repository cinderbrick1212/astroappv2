import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    // Strapi authentication only applies to /api/* routes.
    // All other paths (Strapi admin, content-manager, upload, and other
    // built-in plugin routes) use Strapi's own authentication system.
    if (!ctx.path.startsWith('/api/')) {
      return await next();
    }

    // Routes that bypass authentication entirely (no token required)
    const publicPaths = [
      '/api/auth/',        // Strapi native auth (login, register, etc.)
      '/api/payments/webhook', // Razorpay webhook (verified by signature)
    ];

    if (publicPaths.some(p => ctx.path.startsWith(p))) {
      return await next();
    }

    // Public /api/ routes that allow unauthenticated GET requests
    const publicGetPaths = [
      '/api/feed-items',
      '/api/blog-posts',
      '/api/health',
    ];

    if (publicGetPaths.some(p => ctx.path.startsWith(p)) && ctx.request.method === 'GET') {
      return await next();
    }

    // Require a Bearer token for all other /api/* routes
    const authHeader = ctx.request.header.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.unauthorized('No authorization token provided');
    }

    const token = authHeader.substring(7);

    try {
      // Verify Strapi JWT using the users-permissions JWT service
      const jwtService = strapi.plugin('users-permissions').service('jwt') as any;
      const decoded = await jwtService.verify(token);

      if (!decoded || !decoded.id) {
        return ctx.unauthorized('Invalid authentication token');
      }

      // Fetch the authenticated Strapi user
      const strapiUser = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { id: decoded.id } });

      if (!strapiUser || strapiUser.blocked) {
        return ctx.unauthorized('User not found or blocked');
      }

      // Find or create the custom api::user.user record linked by email
      let user = await strapi.db.query('api::user.user').findOne({
        where: { email: strapiUser.email },
      });

      if (!user) {
        user = await strapi.db.query('api::user.user').create({
          data: {
            email: strapiUser.email,
            name: strapiUser.username || null,
            premium_status: false,
          },
        });
      }

      // Attach the custom user to context (matches what firebase-auth previously set)
      ctx.state.user = user;
      ctx.state.strapiUser = strapiUser;

      await next();
    } catch (error) {
      strapi.log.error('Strapi auth error:', error);
      return ctx.unauthorized('Invalid authentication token');
    }
  };
};

import type { Core } from '@strapi/strapi';
import { verifyFirebaseToken } from '../services/firebase';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    // Skip authentication for public routes
    const publicRoutes = [
      '/api/feed-items',
      '/api/blog-posts',
      '/api/health',
      '/admin',
      '/_health',
    ];

    const isPublicRoute = publicRoutes.some(route => ctx.request.url.startsWith(route));
    
    if (isPublicRoute && ctx.request.method === 'GET') {
      return await next();
    }

    // Get the authorization header
    const authHeader = ctx.request.header.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.unauthorized('No authorization token provided');
    }

    const token = authHeader.substring(7);

    try {
      // Verify Firebase token
      const decodedToken = await verifyFirebaseToken(token);
      
      // Find or create user in Strapi
      let user = await strapi.db.query('api::user.user').findOne({
        where: { firebase_uid: decodedToken.uid },
      });

      if (!user) {
        // Create new user if doesn't exist
        user = await strapi.db.query('api::user.user').create({
          data: {
            firebase_uid: decodedToken.uid,
            email: decodedToken.email || null,
            phone: decodedToken.phone_number || null,
            name: decodedToken.name || null,
            premium_status: false,
          },
        });
      }

      // Attach user to context
      ctx.state.user = user;
      ctx.state.firebaseUser = decodedToken;

      await next();
    } catch (error) {
      console.error('Firebase auth error:', error);
      return ctx.unauthorized('Invalid authentication token');
    }
  };
};

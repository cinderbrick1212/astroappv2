import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://storage.googleapis.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://storage.googleapis.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: (ctx: any) => {
        const requestOrigin = ctx.request.header.origin;
        // Allow the configured origins; fall back to same-origin when not set
        const allowed = (process.env.CORS_ORIGIN || '')
          .split(',')
          .map((o: string) => o.trim())
          .filter(Boolean);
        if (!requestOrigin || allowed.length === 0 || allowed.includes('*') || allowed.includes(requestOrigin)) {
          return requestOrigin || true;
        }
        return false;
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  {
    name: 'strapi::session',
    config: {
      rolling: false,
      renew: false,
    },
  },
  'strapi::favicon',
  'strapi::public',
  'global::firebase-auth',
];

export default config;

import type { Core } from '@strapi/strapi';
import { initializeFirebase } from './services/firebase';

/**
 * Create the "Astrologer" Strapi admin role on first boot if it does not exist.
 * Astrologers use this role to log into the Strapi admin panel and manage
 * feed items, blog posts, and service requests.
 *
 * After creation the Strapi super-admin should assign the appropriate
 * content-manager permissions to this role via Settings → Roles in the
 * admin panel (or the permissions can be scripted here once the content
 * types are finalised).
 */
async function bootstrapRoles(strapi: Core.Strapi) {
  try {
    const roleService = strapi.service('admin::role') as any;
    const roles: any[] = await roleService.find();
    const exists = roles.some((r: any) => r.code === 'astrologer');

    if (!exists) {
      await roleService.create({
        name: 'Astrologer',
        description:
          'Manages astrology content (feed items, blog posts) and responds to service requests.',
        code: 'astrologer',
      });
      console.log('Strapi admin role "Astrologer" created successfully');
    }
  } catch (error) {
    // Non-fatal: the role can be created manually via the admin panel.
    console.error('Failed to bootstrap Astrologer role (non-fatal):', error);
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // Initialize Firebase Admin SDK
      initializeFirebase();
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
      // Allow app to start even if Firebase fails (for local development)
    }

    // Bootstrap admin roles (idempotent — safe to run on every startup)
    await bootstrapRoles(strapi);
  },
};

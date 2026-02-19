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

/**
 * Configure users-permissions plugin roles on first boot (idempotent).
 *
 * Public role  – read-only access to feed items and blog posts.
 * Authenticated role – full access to user, user-profile, and
 *   service-request endpoints.  Firebase Auth is the real authentication
 *   gate; Strapi's users-permissions layer must not block requests that
 *   have already been validated by the firebase-auth global middleware.
 */
async function bootstrapPermissions(strapi: Core.Strapi) {
  try {
    // Resolve the public and authenticated roles from the users-permissions plugin.
    const [publicRole, authenticatedRole] = await Promise.all([
      strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } }),
      strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' } }),
    ]);

    if (!publicRole || !authenticatedRole) {
      console.warn('users-permissions roles not found — skipping permission bootstrap');
      return;
    }

    /**
     * Actions accessible without any authentication (truly public content).
     * feed-item and blog-post routes already carry `auth: false` in their
     * route config, but registering them here makes the intent explicit and
     * keeps the admin panel view consistent.
     */
    const publicActions: string[] = [
      'api::feed-item.feed-item.find',
      'api::feed-item.feed-item.findOne',
      'api::blog-post.blog-post.find',
      'api::blog-post.blog-post.findOne',
    ];

    /**
     * Actions that require a Firebase-authenticated user.
     * Because the firebase-auth global middleware is the real authentication
     * gate (not Strapi's own JWT system), these actions are enabled for the
     * `authenticated` role.  The firebase-auth middleware validates every
     * inbound Firebase ID token before any route handler is reached.
     */
    const authenticatedActions: string[] = [
      // User endpoints
      'api::user.user.getMe',
      'api::user.user.updateMe',
      'api::user.user.updatePushToken',
      // User-profile endpoints
      'api::user-profile.user-profile.createOrUpdate',
      'api::user-profile.user-profile.getMyProfile',
      // Service-request endpoints
      'api::service-request.service-request.create',
      'api::service-request.service-request.findOne',
      'api::service-request.service-request.findUserRequests',
      'api::service-request.service-request.updateStatus',
    ];

    await enablePermissions(strapi, publicRole.id, publicActions);
    await enablePermissions(strapi, authenticatedRole.id, authenticatedActions);

    console.log('users-permissions role permissions configured successfully');
  } catch (error) {
    // Non-fatal: permissions can be configured manually via the admin panel.
    console.error('Failed to bootstrap users-permissions (non-fatal):', error);
  }
}

/**
 * Upsert users-permissions permission records so that each action in
 * `actions` is enabled for `roleId`.  Existing enabled records are left
 * untouched; disabled records are re-enabled; missing records are created.
 */
async function enablePermissions(
  strapi: Core.Strapi,
  roleId: number,
  actions: string[]
): Promise<void> {
  // Fetch all existing permission records for this role in one query.
  const existing: Array<{ id: number; action: string; enabled: boolean }> =
    await strapi.db
      .query('plugin::users-permissions.permission')
      .findMany({ where: { action: { $in: actions }, role: roleId } });

  const existingByAction = new Map(existing.map((p) => [p.action, p]));

  const toCreate: string[] = [];
  const toEnable: number[] = [];

  for (const action of actions) {
    const record = existingByAction.get(action);
    if (!record) {
      toCreate.push(action);
    } else if (!record.enabled) {
      toEnable.push(record.id);
    }
  }

  await Promise.all([
    ...toCreate.map((action) =>
      strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: roleId, enabled: true } })
    ),
    ...toEnable.map((id) =>
      strapi.db
        .query('plugin::users-permissions.permission')
        .update({ where: { id }, data: { enabled: true } })
    ),
  ]);
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

    // Bootstrap users-permissions role permissions (idempotent — safe to run on every startup)
    await bootstrapPermissions(strapi);
  },
};

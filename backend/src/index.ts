import type { Core } from '@strapi/strapi';
import { initializeFirebase } from './services/firebase';

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
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // Initialize Firebase Admin SDK
      initializeFirebase();
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
      // Allow app to start even if Firebase fails (for local development)
    }
  },
};

/**
 * Firebase Auth React Native shim
 *
 * Firebase 12+ ships platform-specific bundles. TypeScript's module resolution
 * picks the browser declaration (`auth-public.d.ts`) by default, which does NOT
 * export `getReactNativePersistence`. At runtime Metro correctly uses the RN
 * bundle, so this shim exists solely to give TypeScript the right types.
 *
 * When upgrading Firebase, verify that the upstream RN types still match by
 * checking `node_modules/@firebase/auth/dist/rn/index.rn.d.ts`.
 */

// Re-export everything from the real @firebase/auth package (the path alias
// in tsconfig only remaps 'firebase/auth', not '@firebase/auth', so this is
// safe and avoids a circular reference).
export * from '@firebase/auth';

// Add the RN-only export that the browser typings omit
import type { Persistence, ReactNativeAsyncStorage } from '@firebase/auth';
export declare function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;

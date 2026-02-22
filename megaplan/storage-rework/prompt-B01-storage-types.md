# Prompt B01 — Storage Types

## Phase
B — Storage Rework

## Task

Create `mobile/src/utils/storageTypes.ts` — the single source of truth for all
storage keys, value interfaces, TTL constants, and the cache-entry wrapper type.
No screen or service may use a raw string as a storage key after this prompt is applied.

---

## Context

### What it replaces / improves in the current `storage.ts`

The current `storage.ts` has:
```typescript
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  // … 12 more untyped string constants
};
```

Problems:
- Untyped: `storage.get<T>('anything')` compiles even with a typo
- No TTL: Kundli cache can be stale forever
- No versioning: schema changes break existing caches silently
- No per-user isolation: User B sees User A's cached chart after login switch
- No platform annotation: web uses `localStorage`, mobile uses `AsyncStorage`

This module fixes all four problems without changing any existing key string values.

---

## File to create: `mobile/src/utils/storageTypes.ts`

### Exports required

```typescript
// ── Cache version ─────────────────────────────────────────────────────────
// Increment this constant when any cached value schema changes.
// ChartCache will auto-invalidate all caches on version mismatch.
export const CACHE_VERSION = 1;

// ── TTL constants (milliseconds) ─────────────────────────────────────────
export const TTL = {
  KUNDLI:         7 * 24 * 60 * 60 * 1000,   // 7 days  — birth chart
  DASHA:          7 * 24 * 60 * 60 * 1000,   // 7 days
  COMPATIBILITY:  1 * 24 * 60 * 60 * 1000,   // 1 day
  PANCHANG:       6 * 60 * 60 * 1000,         // 6 hours — daily data
  RASHIFAL:       6 * 60 * 60 * 1000,         // 6 hours
  GOCHAR:         6 * 60 * 60 * 1000,         // 6 hours — transits change daily
  VARSHAPHAL:    30 * 24 * 60 * 60 * 1000,   // 30 days — annual
  FEED:           1 * 60 * 60 * 1000,         // 1 hour  — feed content
  ECLIPSE:       30 * 24 * 60 * 60 * 1000,   // 30 days — eclipse list
} as const;

// ── Storage key enum ──────────────────────────────────────────────────────
export enum StorageKey {
  // Auth (no TTL — cleared on logout)
  AUTH_TOKEN          = 'auth_token',
  USER_DATA           = 'user_data',
  USER_PROFILE        = 'user_profile',

  // App state (no TTL)
  ONBOARDING_COMPLETE = 'onboarding_complete',
  ONBOARDING_PROFILE  = 'onboarding_profile',
  THEME_PREFERENCE    = 'theme_preference',
  LANGUAGE_PREFERENCE = 'language_preference',
  PUSH_TOKEN          = 'push_token',
  NOTIFICATIONS_ENABLED = 'notifications_enabled',
  STREAK_REMINDER_ID  = 'streak_reminder_id',
  STREAK_DATA         = 'streak_data',

  // Chart caches (TTL-controlled, per-user keyed)
  KUNDLI_CACHE        = 'kundli_cache',
  DASHA_CACHE         = 'dasha_cache',
  COMPATIBILITY_HISTORY = 'compatibility_history',
  GOCHAR_CACHE        = 'gochar_cache',
  VARSHAPHAL_CACHE    = 'varshaphal_cache',
  ECLIPSE_CACHE       = 'eclipse_cache',

  // Feed / content caches (TTL-controlled, not per-user)
  FEED_CACHE          = 'feed_cache',
  LAST_SYNC           = 'last_sync',
  RASHIFAL_CACHE      = 'rashifal_cache',
  PANCHANG_CACHE      = 'panchang_cache',

  // Prashna history (append-only, local)
  PRASHNA_HISTORY     = 'prashna_history',
}

// ── CacheEntry wrapper ────────────────────────────────────────────────────
// Every value stored through ChartCache is wrapped in this envelope.
export interface CacheEntry<T> {
  data: T;
  storedAt: number;      // Date.now() timestamp
  version: number;       // must equal CACHE_VERSION — else entry is stale
  userId?: string;       // present on per-user entries; absent on shared entries
}

// ── Value type map ────────────────────────────────────────────────────────
// Maps each StorageKey to its expected value type.
// Update this map when adding new cached data types.
import type { KundliData } from '../services/kundli';
import type { CompatibilityResult } from '../services/compatibility';
import type { HoroscopeData } from '../services/horoscope';
import type { PanchangData } from '../services/panchang';
import type { DashaTimeline } from '../services/engine/dasha';
import type { GocharResult, EclipseEvent, VarshaphalChart } from '../services/astrologyEngine';

export interface PrashnaHistoryEntry {
  id: string;
  question: string;
  category: string;
  verdict: string;
  askedAt: number;       // timestamp
}

export interface StorageValueMap {
  [StorageKey.AUTH_TOKEN]:            string;
  [StorageKey.USER_DATA]:             Record<string, unknown>;
  [StorageKey.USER_PROFILE]:          Record<string, unknown>;
  [StorageKey.ONBOARDING_COMPLETE]:   boolean;
  [StorageKey.ONBOARDING_PROFILE]:    Record<string, unknown>;
  [StorageKey.THEME_PREFERENCE]:      'light' | 'dark' | 'system';
  [StorageKey.LANGUAGE_PREFERENCE]:   'en' | 'hi';
  [StorageKey.PUSH_TOKEN]:            string;
  [StorageKey.NOTIFICATIONS_ENABLED]: boolean;
  [StorageKey.STREAK_REMINDER_ID]:    string;
  [StorageKey.STREAK_DATA]:           Record<string, unknown>;
  [StorageKey.KUNDLI_CACHE]:          CacheEntry<KundliData>;
  [StorageKey.DASHA_CACHE]:           CacheEntry<DashaTimeline>;
  [StorageKey.COMPATIBILITY_HISTORY]: CacheEntry<CompatibilityResult[]>;
  [StorageKey.GOCHAR_CACHE]:          CacheEntry<GocharResult>;
  [StorageKey.VARSHAPHAL_CACHE]:      CacheEntry<VarshaphalChart>;
  [StorageKey.ECLIPSE_CACHE]:         CacheEntry<EclipseEvent[]>;
  [StorageKey.FEED_CACHE]:            CacheEntry<unknown[]>;
  [StorageKey.LAST_SYNC]:             number;
  [StorageKey.RASHIFAL_CACHE]:        CacheEntry<HoroscopeData>;
  [StorageKey.PANCHANG_CACHE]:        CacheEntry<PanchangData>;
  [StorageKey.PRASHNA_HISTORY]:       PrashnaHistoryEntry[];
}

// ── Helper: check if a CacheEntry is still valid ─────────────────────────
export function isCacheValid<T>(
  entry: CacheEntry<T> | null | undefined,
  ttlMs: number
): entry is CacheEntry<T> {
  if (!entry) return false;
  if (entry.version !== CACHE_VERSION) return false;
  return Date.now() - entry.storedAt < ttlMs;
}
```

---

## Platform compatibility

This file has zero React Native / Expo / AsyncStorage imports — it is pure
TypeScript types and constants. Works identically on Web, iOS, Android.

---

## Backward compatibility

The existing `storage.keys` object (used throughout the app as `storage.keys.KUNDLI_CACHE`)
must continue to work. In `storage.ts` (B03), `storage.keys` will be aliased to
the new `StorageKey` enum so existing callers do not break:
```typescript
// In storage.ts (B03):
export const storage = {
  keys: StorageKey,   // alias — all existing storage.keys.X calls still work
  ...
}
```

---

## Validation checklist

- [ ] `StorageKey` enum values are identical strings to the old `STORAGE_KEYS` object
- [ ] `StorageValueMap` covers every key in `StorageKey` enum (TypeScript exhaustiveness)
- [ ] `isCacheValid(null, TTL.KUNDLI)` returns `false`
- [ ] `isCacheValid({ data: {}, storedAt: Date.now(), version: CACHE_VERSION }, TTL.KUNDLI)` returns `true`
- [ ] `isCacheValid({ data: {}, storedAt: Date.now() - TTL.KUNDLI - 1, version: CACHE_VERSION }, TTL.KUNDLI)` returns `false`
- [ ] `isCacheValid({ data: {}, storedAt: Date.now(), version: 0 }, TTL.KUNDLI)` returns `false` (version mismatch)
- [ ] `npx tsc --noEmit` passes with zero errors

# Prompt B02 — Chart Cache (Platform-Adaptive)

## Phase
B — Storage Rework

## Task

Create `mobile/src/utils/chartCache.ts` — a platform-adaptive, per-user,
TTL-aware chart caching module. On mobile (iOS/Android) it uses
`@react-native-async-storage/async-storage`; on web it uses a `localStorage`
adapter with the same async interface.

---

## Context

### Depends on
- `utils/storageTypes.ts` (B01)

### Why this is needed

The current `kundliService.calculateKundliAsync` stores the chart under a single
`'kundli_cache'` key regardless of which user is logged in. If User A and User B
share a device (e.g. family sharing), the cache leaks User A's chart into User B's
session.

This module:
1. Keys every chart cache entry as `{userId}:{StorageKey}` to isolate per user
2. Wraps all entries in `CacheEntry<T>` (from B01) for TTL + version checking
3. Works on web via a `localStorage` adapter with the same Promise-based API

---

## File to create: `mobile/src/utils/chartCache.ts`

### Exports required

```typescript
import { Platform } from 'react-native';

// Internal platform-adaptive storage interface
interface AsyncStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiRemove(keys: string[]): Promise<void>;
}

// Factory — returns the right storage backend for the current platform
function getPlatformStorage(): AsyncStorageAdapter

// Public API
export async function getCachedChart<T>(
  userId: string,
  key: StorageKey,
  ttlMs: number
): Promise<T | null>

export async function setCachedChart<T>(
  userId: string,
  key: StorageKey,
  data: T
): Promise<void>

export async function clearUserCache(userId: string): Promise<void>

export async function clearAllCaches(): Promise<void>

export function makeUserKey(userId: string, key: StorageKey): string
```

---

## Implementation specs

### `getPlatformStorage()`

```typescript
function getPlatformStorage(): AsyncStorageAdapter {
  if (Platform.OS === 'web') {
    return localStorageAdapter;
  }
  return AsyncStorage;   // from @react-native-async-storage/async-storage
}
```

### `localStorageAdapter` (web only)

A thin wrapper that wraps `window.localStorage` in Promises:

```typescript
const localStorageAdapter: AsyncStorageAdapter = {
  async getItem(key) {
    return window.localStorage.getItem(key);
  },
  async setItem(key, value) {
    window.localStorage.setItem(key, value);
  },
  async removeItem(key) {
    window.localStorage.removeItem(key);
  },
  async getAllKeys() {
    return Object.keys(window.localStorage);
  },
  async multiRemove(keys) {
    keys.forEach(k => window.localStorage.removeItem(k));
  },
};
```

### `makeUserKey(userId, key)`
```typescript
return `${userId}:${key}`;
```

### `getCachedChart<T>(userId, key, ttlMs)`
```typescript
const storage = getPlatformStorage();
const raw = await storage.getItem(makeUserKey(userId, key));
if (!raw) return null;
const entry: CacheEntry<T> = JSON.parse(raw);
if (!isCacheValid(entry, ttlMs)) {
  await storage.removeItem(makeUserKey(userId, key));
  return null;
}
return entry.data;
```

### `setCachedChart<T>(userId, key, data)`
```typescript
const entry: CacheEntry<T> = {
  data,
  storedAt: Date.now(),
  version: CACHE_VERSION,
  userId,
};
const storage = getPlatformStorage();
await storage.setItem(makeUserKey(userId, key), JSON.stringify(entry));
```

### `clearUserCache(userId)`
Remove all keys that start with `${userId}:`:
```typescript
const storage = getPlatformStorage();
const allKeys = await storage.getAllKeys();
const userKeys = allKeys.filter(k => k.startsWith(`${userId}:`));
await storage.multiRemove(userKeys);
```

### `clearAllCaches()`
Remove all keys that contain `:` (i.e. user-keyed entries) — this targets chart
caches without deleting auth or preference keys:
```typescript
const storage = getPlatformStorage();
const allKeys = await storage.getAllKeys();
const cacheKeys = allKeys.filter(k => k.includes(':'));
await storage.multiRemove(cacheKeys);
```

---

## Updating `kundliService.calculateKundliAsync`

After this prompt is applied, update `services/kundli.ts` to use `chartCache`
instead of the raw `storage.get/set` pattern:

```typescript
// Old (in kundli.ts):
const cached = await storage.get<KundliCacheEntry>(storage.keys.KUNDLI_CACHE);
if (cached && cached.birthKey === birthKey) return cached.data;
await storage.set(storage.keys.KUNDLI_CACHE, { birthKey, data });

// New (after B02):
const userId = getCurrentUserId();  // from AuthContext
const cached = await chartCache.getCachedChart<KundliData>(
  userId, StorageKey.KUNDLI_CACHE, TTL.KUNDLI
);
if (cached) return cached;
await chartCache.setCachedChart(userId, StorageKey.KUNDLI_CACHE, data);
```

The birth key check is replaced by the TTL + user isolation — a chart is
recalculated if it is older than 7 days or was calculated for a different user.

---

## Logout integration

Call `chartCache.clearUserCache(userId)` when the user logs out:

```typescript
// In AuthContext.tsx — add to the signOut handler:
await chartCache.clearUserCache(user.uid);
```

---

## Platform validation

| Scenario | Expected behaviour |
|----------|--------------------|
| iOS — first chart calculation | `getCachedChart` returns `null`; `setCachedChart` stores via AsyncStorage |
| iOS — second call same day | `getCachedChart` returns cached data; no recalculation |
| iOS — after 7 days (TTL elapsed) | `getCachedChart` returns `null` (TTL expired); cache entry deleted |
| Android — same as iOS | Identical |
| Web — `npx expo start --web` | `getPlatformStorage()` returns `localStorageAdapter`; chart cached in `localStorage` |
| Web — DevTools → Application → localStorage | Entry appears as `{userId}:kundli_cache` with JSON value |
| Logout | `clearUserCache(userId)` removes only keys prefixed with that userId |
| Schema change (bump CACHE_VERSION) | `getCachedChart` returns `null` for old entries and deletes them |

---

## Validation checklist

- [ ] `Platform.OS === 'web'` causes `getPlatformStorage()` to return `localStorageAdapter`
- [ ] `Platform.OS === 'ios'` or `'android'` causes it to return `AsyncStorage`
- [ ] `makeUserKey('abc123', StorageKey.KUNDLI_CACHE)` returns `'abc123:kundli_cache'`
- [ ] `clearUserCache('abc123')` removes `'abc123:kundli_cache'` but not `'xyz456:kundli_cache'`
- [ ] `clearAllCaches()` removes all user-keyed entries but preserves `'auth_token'`
- [ ] TTL-expired entries are deleted on `getCachedChart` — not merely ignored
- [ ] Version-mismatched entries are deleted on `getCachedChart`
- [ ] `npx expo start --web` compiles without `AsyncStorage` import errors

# Prompt B03 — Storage Utility Update

## Phase
B — Storage Rework

## Task

Update `mobile/src/utils/storage.ts` to:
1. Use the new `StorageKey` enum (backward-compatible via alias)
2. Add compile-safe typed `getTyped` / `setTyped` wrappers
3. Add `savePrashnaHistory` / `getPrashnaHistory` helpers
4. Add `getFeedCache` / `setFeedCache` with stale-while-revalidate logic
5. Keep every existing method signature unchanged

---

## Context

### Depends on
- `utils/storageTypes.ts` (B01)
- `utils/chartCache.ts` (B02)

### Current file: `mobile/src/utils/storage.ts`

The file currently exports a `storage` object with `set`, `get`, `remove`,
`clear`, and `keys`. All existing callers use `storage.keys.XYZ` to reference
keys and `storage.get<T>` / `storage.set` for access.

---

## Required changes to `mobile/src/utils/storage.ts`

### 1. Import from storageTypes
```typescript
import {
  StorageKey,
  StorageValueMap,
  PrashnaHistoryEntry,
  CacheEntry,
  TTL,
  CACHE_VERSION,
  isCacheValid,
} from './storageTypes';
```

### 2. Keep existing raw `get` / `set` / `remove` / `clear` methods unchanged
These are used by many callers; do not change their signatures.

### 3. Add `storage.keys` as an alias for `StorageKey` enum
```typescript
export const storage = {
  keys: StorageKey,      // ← backward-compatible alias
  // ... all existing methods ...
};
```

### 4. Add `getTyped` / `setTyped`
```typescript
async getTyped<K extends StorageKey>(
  key: K
): Promise<StorageValueMap[K] | null> {
  return this.get<StorageValueMap[K]>(key);
}

async setTyped<K extends StorageKey>(
  key: K,
  value: StorageValueMap[K]
): Promise<void> {
  return this.set(key, value);
}
```

These are purely additive — they call the existing `get`/`set` under the hood,
just with compile-time type checking. New code should prefer `getTyped`/`setTyped`;
existing code using `get`/`set` is unchanged.

### 5. Add `getPrashnaHistory` / `savePrashnaHistory`

```typescript
async getPrashnaHistory(): Promise<PrashnaHistoryEntry[]> {
  const history = await this.get<PrashnaHistoryEntry[]>(StorageKey.PRASHNA_HISTORY);
  return history ?? [];
}

async savePrashnaHistory(entry: PrashnaHistoryEntry): Promise<void> {
  const history = await this.getPrashnaHistory();
  const updated = [entry, ...history].slice(0, 20);  // keep last 20
  await this.set(StorageKey.PRASHNA_HISTORY, updated);
}
```

### 6. Add `getFeedCache` / `setFeedCache` (stale-while-revalidate)

```typescript
async getFeedCache<T>(): Promise<{ data: T[] | null; isStale: boolean }> {
  const entry = await this.get<CacheEntry<T[]>>(StorageKey.FEED_CACHE);
  if (!entry) return { data: null, isStale: true };
  const isStale = !isCacheValid(entry, TTL.FEED);
  return { data: entry.data, isStale };
}

async setFeedCache<T>(items: T[]): Promise<void> {
  const entry: CacheEntry<T[]> = {
    data: items,
    storedAt: Date.now(),
    version: CACHE_VERSION,
  };
  await this.set(StorageKey.FEED_CACHE, entry);
}
```

The `isStale` flag allows the feed screen to show cached data immediately while
triggering a background refresh — the stale-while-revalidate pattern.

### 7. Add `getPanchangCache` / `setPanchangCache`

Same pattern as feed cache, using `StorageKey.PANCHANG_CACHE` and `TTL.PANCHANG`.

```typescript
async getPanchangCache<T>(): Promise<{ data: T | null; isStale: boolean }>
async setPanchangCache<T>(data: T): Promise<void>
```

---

## Updated `storage.ts` structure (full object shape after changes)

```typescript
export const storage = {
  keys: StorageKey,           // ← new alias (backward-compatible)

  // Existing methods — signatures unchanged
  async set(key: string, value: any): Promise<void>
  async get<T>(key: string): Promise<T | null>
  async remove(key: string): Promise<void>
  async clear(): Promise<void>

  // New typed wrappers
  async getTyped<K extends StorageKey>(key: K): Promise<StorageValueMap[K] | null>
  async setTyped<K extends StorageKey>(key: K, value: StorageValueMap[K]): Promise<void>

  // Prashna history
  async getPrashnaHistory(): Promise<PrashnaHistoryEntry[]>
  async savePrashnaHistory(entry: PrashnaHistoryEntry): Promise<void>

  // Feed (stale-while-revalidate)
  async getFeedCache<T>(): Promise<{ data: T[] | null; isStale: boolean }>
  async setFeedCache<T>(items: T[]): Promise<void>

  // Panchang (6h TTL)
  async getPanchangCache<T>(): Promise<{ data: T | null; isStale: boolean }>
  async setPanchangCache<T>(data: T): Promise<void>
};
```

---

## Backward compatibility contract

These existing callers must compile and work without modification after B03:

| Caller | Uses |
|--------|------|
| `kundli.ts` | `storage.get(storage.keys.KUNDLI_CACHE)` |
| `horoscope.ts` | `storage.get(storage.keys.FEED_CACHE)` |
| `AuthContext.tsx` | `storage.get(storage.keys.AUTH_TOKEN)`, `storage.set`, `storage.remove` |
| `useNotifications.ts` | `storage.get(storage.keys.PUSH_TOKEN)` |
| `OnboardingScreen.tsx` | `storage.set(storage.keys.ONBOARDING_COMPLETE)` |

---

## Validation checklist

- [ ] `storage.keys.KUNDLI_CACHE === 'kundli_cache'` (alias matches original string)
- [ ] `storage.getTyped(StorageKey.AUTH_TOKEN)` resolves as `Promise<string | null>`
- [ ] TypeScript error when passing wrong value type: `storage.setTyped(StorageKey.AUTH_TOKEN, 123)` → compile error
- [ ] `savePrashnaHistory` appends to front and caps at 20 entries
- [ ] `getPrashnaHistory` returns `[]` when nothing is stored (not `null`)
- [ ] `getFeedCache` returns `{ data: null, isStale: true }` when no cache exists
- [ ] `getFeedCache` returns `{ data: [...], isStale: false }` when cache is fresh
- [ ] `getFeedCache` returns `{ data: [...], isStale: true }` when cache exists but is expired
- [ ] All existing callers listed above still compile and run without modification
- [ ] `npx tsc --noEmit` passes with zero errors after B01+B02+B03

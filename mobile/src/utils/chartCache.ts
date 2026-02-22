import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { CACHE_VERSION, CacheEntry, isCacheValid, StorageKey } from './storageTypes';

interface AsyncStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<readonly string[]>;
  multiRemove(keys: readonly string[]): Promise<void>;
}

const localStorageAdapter: AsyncStorageAdapter = {
  async getItem(key) {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  async setItem(key, value) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
  async getAllKeys() {
    if (typeof window === 'undefined') return [];
    return Object.keys(window.localStorage);
  },
  async multiRemove(keys) {
    if (typeof window === 'undefined') return;
    keys.forEach((key) => window.localStorage.removeItem(key));
  },
};

function getPlatformStorage(): AsyncStorageAdapter {
  if (Platform.OS === 'web') return localStorageAdapter;
  return AsyncStorage;
}

export function makeUserKey(userId: string, key: StorageKey): string {
  return `${userId}:${key}`;
}

export async function getCachedChart<T>(
  userId: string,
  key: StorageKey,
  ttlMs: number
): Promise<T | null> {
  const storage = getPlatformStorage();
  const cacheKey = makeUserKey(userId, key);
  const raw = await storage.getItem(cacheKey);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (!isCacheValid(entry, ttlMs)) {
      await storage.removeItem(cacheKey);
      return null;
    }
    return entry.data;
  } catch {
    await storage.removeItem(cacheKey);
    return null;
  }
}

export async function setCachedChart<T>(
  userId: string,
  key: StorageKey,
  data: T
): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    storedAt: Date.now(),
    version: CACHE_VERSION,
    userId,
  };
  const storage = getPlatformStorage();
  await storage.setItem(makeUserKey(userId, key), JSON.stringify(entry));
}

export async function clearUserCache(userId: string): Promise<void> {
  const storage = getPlatformStorage();
  const allKeys = await storage.getAllKeys();
  const userKeys = allKeys.filter((key) => key.startsWith(`${userId}:`));
  if (userKeys.length > 0) {
    await storage.multiRemove(userKeys);
  }
}

export async function clearAllCaches(): Promise<void> {
  const storage = getPlatformStorage();
  const allKeys = await storage.getAllKeys();
  const cacheKeys = allKeys.filter((key) => key.includes(':'));
  if (cacheKeys.length > 0) {
    await storage.multiRemove(cacheKeys);
  }
}

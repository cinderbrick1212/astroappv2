import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StorageKey,
  type StorageValueMap,
  type PrashnaHistoryEntry,
  type CacheEntry,
  TTL,
  CACHE_VERSION,
  isCacheValid,
} from './storageTypes';

export const storage = {
  keys: StorageKey,

  // Save data
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  },

  // Get data
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  // Remove data
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  // Clear all data
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  async getTyped<K extends StorageKey>(key: K): Promise<StorageValueMap[K] | null> {
    return this.get<StorageValueMap[K]>(key);
  },

  async setTyped<K extends StorageKey>(key: K, value: StorageValueMap[K]): Promise<void> {
    return this.set(key, value);
  },

  async getPrashnaHistory(): Promise<PrashnaHistoryEntry[]> {
    const history = await this.get<PrashnaHistoryEntry[]>(StorageKey.PRASHNA_HISTORY);
    return history ?? [];
  },

  async savePrashnaHistory(entry: PrashnaHistoryEntry): Promise<void> {
    const history = await this.getPrashnaHistory();
    const updated = [entry, ...history].slice(0, 20);
    await this.set(StorageKey.PRASHNA_HISTORY, updated);
  },

  async getFeedCache<T>(): Promise<{ data: T[] | null; isStale: boolean }> {
    const entry = await this.get<CacheEntry<T[]>>(StorageKey.FEED_CACHE);
    if (!entry) return { data: null, isStale: true };
    return { data: entry.data, isStale: !isCacheValid(entry, TTL.FEED) };
  },

  async setFeedCache<T>(items: T[]): Promise<void> {
    const entry: CacheEntry<T[]> = {
      data: items,
      storedAt: Date.now(),
      version: CACHE_VERSION,
    };
    await this.set(StorageKey.FEED_CACHE, entry);
  },

  async getPanchangCache<T>(): Promise<{ data: T | null; isStale: boolean }> {
    const entry = await this.get<CacheEntry<T>>(StorageKey.PANCHANG_CACHE);
    if (!entry) return { data: null, isStale: true };
    return { data: entry.data, isStale: !isCacheValid(entry, TTL.PANCHANG) };
  },

  async setPanchangCache<T>(data: T): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      storedAt: Date.now(),
      version: CACHE_VERSION,
    };
    await this.set(StorageKey.PANCHANG_CACHE, entry);
  },
};

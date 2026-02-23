import type { KundliData } from '../services/kundli';
import type { CompatibilityResult } from '../services/compatibility';
import type { HoroscopeData } from '../services/horoscope';
import type { PanchangData } from '../services/panchang';
import type { DashaTimeline } from '../services/engine/dasha';
import type { GocharResult, EclipseEvent, VarshaphalChart } from '../services/astrologyEngine';

export const CACHE_VERSION = 1;

export const TTL = {
  KUNDLI: 7 * 24 * 60 * 60 * 1000,
  DASHA: 7 * 24 * 60 * 60 * 1000,
  COMPATIBILITY: 1 * 24 * 60 * 60 * 1000,
  PANCHANG: 6 * 60 * 60 * 1000,
  RASHIFAL: 6 * 60 * 60 * 1000,
  GOCHAR: 6 * 60 * 60 * 1000,
  VARSHAPHAL: 30 * 24 * 60 * 60 * 1000,
  FEED: 1 * 60 * 60 * 1000,
  ECLIPSE: 30 * 24 * 60 * 60 * 1000,
} as const;

export enum StorageKey {
  AUTH_TOKEN = 'auth_token',
  USER_DATA = 'user_data',
  USER_PROFILE = 'user_profile',
  ONBOARDING_COMPLETE = 'onboarding_complete',
  ONBOARDING_PROFILE = 'onboarding_profile',
  THEME_PREFERENCE = 'theme_preference',
  LANGUAGE_PREFERENCE = 'language_preference',
  PUSH_TOKEN = 'push_token',
  NOTIFICATIONS_ENABLED = 'notifications_enabled',
  STREAK_REMINDER_ID = 'streak_reminder_id',
  STREAK_DATA = 'streak_data',
  KUNDLI_CACHE = 'kundli_cache',
  DASHA_CACHE = 'dasha_cache',
  COMPATIBILITY_HISTORY = 'compatibility_history',
  GOCHAR_CACHE = 'gochar_cache',
  VARSHAPHAL_CACHE = 'varshaphal_cache',
  ECLIPSE_CACHE = 'eclipse_cache',
  FEED_CACHE = 'feed_cache',
  LAST_SYNC = 'last_sync',
  RASHIFAL_CACHE = 'rashifal_cache',
  PANCHANG_CACHE = 'panchang_cache',
  PRASHNA_HISTORY = 'prashna_history',
}

export interface CacheEntry<T> {
  data: T;
  storedAt: number;
  version: number;
  userId?: string;
}

export interface PrashnaHistoryEntry {
  id: string;
  question: string;
  category: string;
  verdict: string;
  askedAt: number;
}

export interface StorageValueMap {
  [StorageKey.AUTH_TOKEN]: string;
  [StorageKey.USER_DATA]: Record<string, unknown>;
  [StorageKey.USER_PROFILE]: Record<string, unknown>;
  [StorageKey.ONBOARDING_COMPLETE]: boolean;
  [StorageKey.ONBOARDING_PROFILE]: Record<string, unknown>;
  [StorageKey.THEME_PREFERENCE]: 'light' | 'dark' | 'system';
  [StorageKey.LANGUAGE_PREFERENCE]: 'en' | 'hi';
  [StorageKey.PUSH_TOKEN]: string;
  [StorageKey.NOTIFICATIONS_ENABLED]: boolean;
  [StorageKey.STREAK_REMINDER_ID]: string;
  [StorageKey.STREAK_DATA]: Record<string, unknown>;
  [StorageKey.KUNDLI_CACHE]: CacheEntry<KundliData>;
  [StorageKey.DASHA_CACHE]: CacheEntry<DashaTimeline>;
  [StorageKey.COMPATIBILITY_HISTORY]: CacheEntry<CompatibilityResult[]>;
  [StorageKey.GOCHAR_CACHE]: CacheEntry<GocharResult>;
  [StorageKey.VARSHAPHAL_CACHE]: CacheEntry<VarshaphalChart>;
  [StorageKey.ECLIPSE_CACHE]: CacheEntry<EclipseEvent[]>;
  [StorageKey.FEED_CACHE]: CacheEntry<unknown[]>;
  [StorageKey.LAST_SYNC]: number;
  [StorageKey.RASHIFAL_CACHE]: CacheEntry<HoroscopeData>;
  [StorageKey.PANCHANG_CACHE]: CacheEntry<PanchangData>;
  [StorageKey.PRASHNA_HISTORY]: PrashnaHistoryEntry[];
}

export function isCacheValid<T>(
  entry: CacheEntry<T> | null | undefined,
  ttlMs: number
): entry is CacheEntry<T> {
  if (!entry) return false;
  if (entry.version !== CACHE_VERSION) return false;
  return Date.now() - entry.storedAt < ttlMs;
}

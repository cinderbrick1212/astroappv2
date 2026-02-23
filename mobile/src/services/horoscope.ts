/**
 * Daily Horoscope Service
 * Deterministic per-rashi predictions that rotate daily.
 */

import { astrologyEngine } from './astrologyEngine';
import { storage } from '../utils/storage';
import { RASHIFAL_ENTRIES, NAKSHATRAS } from '../data';

export interface HoroscopeData {
  rashi: string;
  date: Date;
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
  rating: number;
}

// Lucky colors by day of week
const LUCKY_COLORS = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'White', 'Purple'];

// Cache structure: { dateKey, data }
interface HoroscopeCache {
  dateKey: string;
  data: HoroscopeData;
}

const inMemoryCache: Record<string, HoroscopeCache> = {};

const getTodayKey = () => new Date().toDateString();

export const horoscopeService = {
  /**
   * Get daily horoscope for a given rashi.
   * Results are cached in memory until midnight.
   */
  getDailyHoroscope(rashi: string, date: Date = new Date()): HoroscopeData {
    const todayKey = date.toDateString();
    const cacheKey = `${rashi}_${todayKey}`;
    const cached = inMemoryCache[cacheKey];
    if (cached && cached.dateKey === todayKey) {
      return cached.data;
    }

    const dayOfWeek = date.getDay();
    const entry = RASHIFAL_ENTRIES.find(
      (e) => e.rashiKey.toLowerCase() === rashi.toLowerCase() && e.weekday === dayOfWeek
    );

    if (entry) {
      const data: HoroscopeData = {
        rashi,
        date,
        prediction: entry.prediction,
        luckyColor: entry.luckyColor,
        luckyNumber: entry.luckyNumber,
        rating: 4, // Default rating
      };
      inMemoryCache[cacheKey] = { dateKey: todayKey, data };
      return data;
    }

    // Fallback if no entry found
    const data: HoroscopeData = {
      rashi,
      date,
      prediction: 'A balanced day ahead. Focus on your goals and stay positive.',
      luckyColor: LUCKY_COLORS[dayOfWeek % LUCKY_COLORS.length],
      luckyNumber: ((dayOfWeek + 7) % 9) + 1,
      rating: 4,
    };
    inMemoryCache[cacheKey] = { dateKey: todayKey, data };
    return data;
  },

  /**
   * Get lucky factors for the day based on nakshatra.
   */
  getLuckyFactors(
    userNakshatra: string,
    date: Date = new Date()
  ): { number: number; color: string; time: string } {
    const dayOfWeek = date.getDay();
    // Nakshatra lord cycle: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
    const NAKSHATRA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const LORD_NUMBERS: Record<string, number> = {
      Ketu: 7, Venus: 6, Sun: 1, Moon: 2, Mars: 9, Rahu: 4, Jupiter: 3, Saturn: 8, Mercury: 5,
    };
    const LORD_COLORS: Record<string, string> = {
      Ketu: 'Brown', Venus: 'Pink', Sun: 'Gold', Moon: 'Silver', Mars: 'Red',
      Rahu: 'Blue', Jupiter: 'Yellow', Saturn: 'Black', Mercury: 'Green',
    };

    const nNames = NAKSHATRAS.map(n => n.name);

    const nakshatraIndex = nNames.indexOf(userNakshatra);
    const lordIndex = nakshatraIndex >= 0 ? nakshatraIndex % 9 : dayOfWeek % 9;
    const lord = NAKSHATRA_LORDS[lordIndex];

    // Lucky time windows by day of week
    const LUCKY_TIMES = [
      '7:00 AM - 9:00 AM', '9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM',
      '1:00 PM - 3:00 PM', '3:00 PM - 5:00 PM', '5:00 PM - 7:00 PM',
      '7:00 AM - 9:00 AM',
    ];

    return {
      number: LORD_NUMBERS[lord] || 7,
      color: LORD_COLORS[lord] || 'Green',
      time: LUCKY_TIMES[dayOfWeek],
    };
  },

  /**
   * Get rashi from birth date using astrologyEngine (moon sign).
   */
  getRashiFromBirthDate(birthDate: Date): string {
    return astrologyEngine.getMoonSign(birthDate);
  },
};

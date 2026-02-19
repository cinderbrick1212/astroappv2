/**
 * Kundli (Birth Chart) Calculation Service
 * Uses the astrologyEngine for calculations and caches results in AsyncStorage.
 */

import { astrologyEngine, ChartData } from './astrologyEngine';
import { storage } from '../utils/storage';

export interface KundliData {
  lagna: string;
  rashi: string;
  nakshatra: string;
  sunSign: string;
  insights: string[];
  chartData: ChartData;
  dasha: {
    planet: string;
    endYear: number;
  };
}

// Vimshottari Dasha: nakshatra lord → dasha duration in years
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const NAKSHATRA_LORDS_CYCLE = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

// Insight templates keyed by (planet, house)
const getInsights = (rashi: string, nakshatra: string, lagna: string): string[] => {
  const insights: string[] = [];
  insights.push(`Your Moon is in ${rashi} — ${getMoonSignInsight(rashi)}`);
  insights.push(`Birth star ${nakshatra} blesses you with ${getNakshatraBlessing(nakshatra)}`);
  if (lagna !== rashi) {
    insights.push(`${lagna} lagna brings a ${getLagnaInsight(lagna)} disposition`);
  }
  return insights.slice(0, 3);
};

const getMoonSignInsight = (rashi: string): string => {
  const insights: Record<string, string> = {
    Aries: 'bold initiative and pioneering spirit', Taurus: 'steadiness and a love of beauty',
    Gemini: 'curiosity and communication skills', Cancer: 'deep empathy and intuition',
    Leo: 'natural leadership and generosity', Virgo: 'analytical precision and service',
    Libra: 'diplomacy and a sense of justice', Scorpio: 'intensity and transformative power',
    Sagittarius: 'optimism and a philosophical mind', Capricorn: 'discipline and ambition',
    Aquarius: 'originality and humanitarian vision', Pisces: 'compassion and spiritual sensitivity',
  };
  return insights[rashi] || 'a balanced and adaptable nature';
};

const getNakshatraBlessing = (nakshatra: string): string => {
  const blessings: Record<string, string> = {
    Ashwini: 'swift healing and new beginnings', Bharani: 'creative fertility and responsibility',
    Krittika: 'sharp focus and purifying energy', Rohini: 'prosperity and artistic talent',
    Mrigashira: 'curiosity and a searching nature', Ardra: 'transformative intensity and research ability',
    Punarvasu: 'renewal and a nurturing spirit', Pushya: 'nourishment, wisdom, and good fortune',
    Ashlesha: 'penetrating insight and intuitive power', Magha: 'ancestral strength and leadership',
    'Purva Phalguni': 'creative enjoyment and magnetic charm',
    'Uttara Phalguni': 'loyal partnerships and executive ability',
    Hasta: 'skilled hands and practical cleverness', Chitra: 'artistic brilliance and sharp intellect',
    Swati: 'independence, adaptability, and trade skills',
    Vishakha: 'determined focus and the power to achieve goals',
    Anuradha: 'devotion, friendship, and organizational skill',
    Jyeshtha: 'seniority, courage, and protective power',
    Mula: 'deep investigation and the courage to uproot the old',
    'Purva Ashadha': 'invincibility and the ability to purify',
    'Uttara Ashadha': 'lasting achievements and universal respect',
    Shravana: 'listening ability, learning, and connection',
    Dhanishtha: 'wealth, music, and abundant generosity',
    Shatabhisha: 'healing ability and visionary insight',
    'Purva Bhadrapada': 'passion, spiritual fire, and transformation',
    'Uttara Bhadrapada': 'depth of wisdom and compassionate detachment',
    Revati: 'safe journeys, nurturing abundance, and spiritual completion',
  };
  return blessings[nakshatra] || 'unique gifts and spiritual protection';
};

const getLagnaInsight = (lagna: string): string => {
  const insights: Record<string, string> = {
    Aries: 'dynamic and action-oriented', Taurus: 'patient and pleasure-loving',
    Gemini: 'versatile and intellectually agile', Cancer: 'sensitive and home-loving',
    Leo: 'regal and self-expressive', Virgo: 'detail-conscious and service-oriented',
    Libra: 'balanced and relationship-focused', Scorpio: 'intense and transformative',
    Sagittarius: 'philosophical and expansive', Capricorn: 'disciplined and success-driven',
    Aquarius: 'innovative and socially aware', Pisces: 'compassionate and spiritually inclined',
  };
  return insights[lagna] || 'balanced';
};

/** Compute current Mahadasha planet from birth nakshatra and birth date */
const getCurrentDasha = (nakshatra: string, birthDate: Date): { planet: string; endYear: number } => {
  const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
  ];
  const nIdx = NAKSHATRAS.indexOf(nakshatra);
  const lordIdx = nIdx >= 0 ? nIdx % 9 : 0;

  // Build dasha sequence starting from birth nakshatra lord
  let dashYear = birthDate.getFullYear();
  const currentYear = new Date().getFullYear();
  let startIdx = lordIdx;

  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const planet = NAKSHATRA_LORDS_CYCLE[idx];
    const years = DASHA_YEARS[planet];
    if (dashYear + years > currentYear) {
      return { planet, endYear: dashYear + years };
    }
    dashYear += years;
  }
  // Wrap-around
  const planet = NAKSHATRA_LORDS_CYCLE[lordIdx];
  return { planet, endYear: dashYear + DASHA_YEARS[planet] };
};

interface KundliCacheEntry {
  birthKey: string;
  data: KundliData;
}

export const kundliService = {
  /**
   * Calculate Kundli from birth details.
   * Results are cached in AsyncStorage keyed by birth details.
   */
  async calculateKundliAsync(
    birthDate: Date,
    birthTime: string,
    birthPlace: { latitude: number; longitude: number },
    timezone: string
  ): Promise<KundliData> {
    const birthKey = `${birthDate.toISOString()}_${birthTime}_${birthPlace.latitude}_${birthPlace.longitude}`;
    const cached = await storage.get<KundliCacheEntry>(storage.keys.KUNDLI_CACHE);
    if (cached && cached.birthKey === birthKey) {
      return cached.data;
    }
    const data = this.calculateKundli(birthDate, birthTime, birthPlace, timezone);
    await storage.set(storage.keys.KUNDLI_CACHE, { birthKey, data });
    return data;
  },

  /**
   * Synchronous Kundli calculation (no cache).
   */
  calculateKundli(
    birthDate: Date,
    birthTime: string,
    birthPlace: { latitude: number; longitude: number },
    timezone: string
  ): KundliData {
    // Parse birth time and build a UTC date
    const [hours, minutes] = birthTime.split(':').map(Number);
    const validHours = !isNaN(hours) ? hours : 6;
    const validMinutes = !isNaN(minutes) ? minutes : 0;
    if (isNaN(hours) || isNaN(minutes)) {
      console.warn('kundliService: invalid birthTime "' + birthTime + '", defaulting to 06:00');
    }
    const combinedDate = new Date(birthDate);
    combinedDate.setUTCHours(validHours, validMinutes, 0, 0);

    const chartData = astrologyEngine.calculateChart(
      combinedDate,
      birthPlace.latitude,
      birthPlace.longitude,
      timezone
    );

    const dasha = getCurrentDasha(chartData.nakshatra, birthDate);
    const insights = getInsights(chartData.moonSign, chartData.nakshatra, chartData.lagnaSign);

    return {
      lagna: chartData.lagnaSign,
      rashi: chartData.moonSign,
      nakshatra: chartData.nakshatra,
      sunSign: chartData.sunSign,
      insights,
      chartData,
      dasha,
    };
  },

  /**
   * Invalidate cached kundli (call when birth details change).
   */
  async clearCache(): Promise<void> {
    await storage.remove(storage.keys.KUNDLI_CACHE);
  },
};

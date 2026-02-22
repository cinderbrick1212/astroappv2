/**
 * Kundli (Birth Chart) Calculation Service
 * Uses the astrologyEngine for calculations and caches results in AsyncStorage.
 */

import { astrologyEngine, ChartData } from './astrologyEngine';
import { storage } from '../utils/storage';

/** Return UTC offset in hours for a timezone name (e.g. 'Asia/Kolkata' → 5.5) */
const getTimezoneOffset = (timezone: string): number => {
  const TIMEZONE_OFFSETS: Record<string, number> = {
    'Asia/Kolkata': 5.5, 'Asia/Calcutta': 5.5,
    'Asia/Mumbai': 5.5, 'Asia/Chennai': 5.5,
    'Asia/Colombo': 5.5, 'Asia/Kathmandu': 5.75,
    'Asia/Dhaka': 6, 'Asia/Karachi': 5,
    'Asia/Dubai': 4, 'Asia/Singapore': 8,
    'Asia/Shanghai': 8, 'Asia/Tokyo': 9,
    'Asia/Bangkok': 7, 'Asia/Jakarta': 7,
    'Europe/London': 0, 'UTC': 0,
    'America/New_York': -5, 'America/Chicago': -6,
    'America/Denver': -7, 'America/Los_Angeles': -8,
    'Australia/Sydney': 11, 'Pacific/Auckland': 13,
  };
  if (TIMEZONE_OFFSETS[timezone] !== undefined) return TIMEZONE_OFFSETS[timezone];
  // Fallback: try to compute offset using Intl
  try {
    const now = new Date();
    const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' });
    const tzStr = now.toLocaleString('en-US', { timeZone: timezone });
    return (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 3600000;
  } catch {
    return 5.5; // default to IST
  }
};

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

// Traditional insights keyed by rashi
const RASHI_INSIGHTS: Record<string, string[]> = {
  Aries:       ['Strong Mars bestows natural leadership and courage.', 'First house placement amplifies your drive for success.'],
  Taurus:      ['Venus blesses you with artistic sensibility and steadiness.', 'Earth sign stability supports long-term wealth accumulation.'],
  Gemini:      ['Mercury sharpens your intellect and communication skills.', 'Dual nature grants versatility in career and relationships.'],
  Cancer:      ['The Moon governs deep intuition and emotional intelligence.', 'Nurturing instincts make you a pillar of family strength.'],
  Leo:         ['Sun in your chart radiates confidence and natural authority.', 'Creative talents are a source of recognition and joy.'],
  Virgo:       ['Mercury in an earthy sign sharpens analytical precision.', 'Service orientation leads to meaningful professional fulfillment.'],
  Libra:       ['Venus blesses relationships with harmony and beauty.', 'Diplomatic gifts help you resolve conflict with grace.'],
  Scorpio:     ['Mars and Ketu grant transformative depth and resilience.', 'Hidden strengths emerge under pressure — trust the process.'],
  Sagittarius: ['Jupiter bestows wisdom, optimism, and expansive vision.', 'Philosophy and travel are natural paths of growth for you.'],
  Capricorn:   ['Saturn rewards disciplined effort with enduring success.', 'Ambition and patience together build lasting achievements.'],
  Aquarius:    ['Saturn and Rahu spark original thinking and innovation.', 'Humanitarian ideals guide your most important decisions.'],
  Pisces:      ['Jupiter and Neptune deepen spirituality and compassion.', 'Intuitive gifts and artistic vision set you apart.'],
};

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
    // Parse local birth time and convert to UTC using timezone offset
    const [hours, minutes] = birthTime.split(':').map(Number);
    const validHours = !isNaN(hours) ? hours : 6;
    const validMinutes = !isNaN(minutes) ? minutes : 0;
    if (isNaN(hours) || isNaN(minutes)) {
      console.warn('kundliService: invalid birthTime "' + birthTime + '", defaulting to 06:00');
    }
    const combinedDate = new Date(birthDate);

    // Convert local birth time to UTC by subtracting timezone offset
    const tzOffsetHours = getTimezoneOffset(timezone);
    const totalMinutesLocal = validHours * 60 + validMinutes;
    const totalMinutesUTC = totalMinutesLocal - tzOffsetHours * 60;
    const utcHours = Math.floor(totalMinutesUTC / 60);
    const utcMinutes = Math.round(totalMinutesUTC % 60);
    combinedDate.setUTCHours(utcHours, utcMinutes, 0, 0);

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

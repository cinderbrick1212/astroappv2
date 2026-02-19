/**
 * Kundli (Birth Chart) Calculation Service
 * Uses simplified astronomical approximations.
 */

import { astrologyEngine, approxMoonLongitude, toJulianDay, ChartData } from './astrologyEngine';

export interface KundliData {
  lagna: string;
  rashi: string;
  nakshatra: string;
  insights: string[];
  chartData: ChartData;
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
   * Uses approximate moon position for rashi and nakshatra.
   */
  calculateKundli(
    birthDate: Date,
    birthTime: string,
    birthPlace: { latitude: number; longitude: number },
    timezone: string
  ): KundliData {
    const jd = toJulianDay(birthDate);
    const moonLong = approxMoonLongitude(jd);

    const rashi = astrologyEngine.getZodiacSign(moonLong);
    const nakshatra = astrologyEngine.getNakshatra(moonLong);

    // Lagna: simplified – derived from birth time and longitude
    let lagnaHour = 0;
    if (birthTime) {
      const [hStr, mStr] = birthTime.split(':');
      lagnaHour = parseInt(hStr, 10) + parseInt(mStr || '0', 10) / 60;
    }
    const lagnaIdx = Math.floor(((birthPlace.longitude / 15 + lagnaHour) % 24) / 2) % 12;
    const SIGNS = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ];
    const lagna = SIGNS[lagnaIdx];

    const chartData = astrologyEngine.calculateChart(
      birthDate,
      birthPlace.latitude,
      birthPlace.longitude,
      timezone
    );

    const insights = RASHI_INSIGHTS[rashi] ?? RASHI_INSIGHTS['Aries'];

    return { lagna, rashi, nakshatra, insights, chartData };
  },

  /**
   * Get current Vimshottari Dasha planet from birth date.
   * Simplified: cycles through planets based on years since birth.
   */
  getCurrentDasha(birthDate: Date): { planet: string; startDate: Date; endDate: Date } {
    const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // Sun–Ketu order
    const DASHA_PLANETS = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
    const TOTAL_YEARS = DASHA_YEARS.reduce((a, b) => a + b, 0); // 120

    const yearsSinceBirth =
      (Date.now() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000);

    const offset = yearsSinceBirth % TOTAL_YEARS;
    let accumulated = 0;
    let planetIdx = 0;
    for (let i = 0; i < DASHA_YEARS.length; i++) {
      accumulated += DASHA_YEARS[i];
      if (offset < accumulated) {
        planetIdx = i;
        break;
      }
    }

    const yearsBeforeCurrent = DASHA_YEARS.slice(0, planetIdx).reduce((a, b) => a + b, 0);
    const startDate = new Date(birthDate);
    startDate.setFullYear(startDate.getFullYear() + Math.floor(yearsBeforeCurrent));
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + DASHA_YEARS[planetIdx]);

    return { planet: DASHA_PLANETS[planetIdx], startDate, endDate };
  },
};

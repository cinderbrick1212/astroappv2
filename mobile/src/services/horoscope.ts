/**
 * Daily Horoscope Service
 * Deterministic per-rashi predictions that rotate daily.
 */

import { astrologyEngine } from './astrologyEngine';
import { storage } from '../utils/storage';

export interface HoroscopeData {
  rashi: string;
  date: Date;
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
  rating: number;
}

// 7 predictions per rashi indexed by getDay() (0=Sunday … 6=Saturday)
const PREDICTIONS: Record<string, string[]> = {
  Aries: [
    'Bold initiatives bear fruit today — trust your instincts and act decisively.',
    'A financial opportunity surfaces. Review details carefully before committing.',
    'Your energy is magnetic; social connections open new professional doors.',
    'Take time for self-care. Physical rest will sharpen your focus tomorrow.',
    'A creative idea you have been nurturing is ready to take shape.',
    'Romance and warmth surround you. Cherish quality time with loved ones.',
    'Obstacles are stepping stones. Persistence transforms challenges into wins.',
  ],
  Taurus: [
    'Steady progress rewards your patience. Avoid shortcuts today.',
    'A trusted friend offers advice that changes your perspective. Listen well.',
    'Material matters improve. A pending payment or reward arrives soon.',
    'Nature restores your spirit. Even a short walk outdoors brings clarity.',
    'Your practical wisdom earns respect from colleagues today.',
    'Romance blooms when you express your feelings honestly and warmly.',
    'A stubborn obstacle yields to gentle persistence. Stay grounded.',
  ],
  Gemini: [
    'Your communication skills shine. Present your ideas with confidence.',
    'Curiosity leads to a fascinating discovery. Follow the thread.',
    'Networking pays off — an old contact re-emerges with a good opportunity.',
    'Mental restlessness calls for meditation or journaling to find focus.',
    'A short journey or outing refreshes your creative well.',
    'Lively conversation deepens a relationship that matters to you.',
    'Dual options before you: trust logic but do not ignore intuition.',
  ],
  Cancer: [
    'Family harmony is highlighted. A small gesture of care means everything.',
    'Intuition is strong today — trust what your gut says about a situation.',
    'Financial caution serves you well. Avoid impulsive purchases.',
    'A creative project gains momentum. Emotions fuel your best work.',
    'Home improvements or domestic matters find favorable resolution.',
    'Emotional bonds deepen. Share your feelings; you will be heard.',
    'Past efforts bear fruit. Acknowledge how far you have come.',
  ],
  Leo: [
    'Leadership opportunities arise. Step forward with confidence and grace.',
    'Recognition for past work is on its way. Maintain your high standards.',
    'Generosity returned. Someone surprises you with unexpected appreciation.',
    'Your creative flair turns heads. Let your authentic self shine.',
    'A social event opens doors. Be present and enjoy the spotlight.',
    'Romance is heightened — plan something special for the one you adore.',
    'Minor ego clashes resolve when you choose understanding over pride.',
  ],
  Virgo: [
    'Precision and attention to detail bring your best work forward today.',
    'Health-related goals receive a boost. Start that new routine now.',
    'A complex problem yields to your methodical approach. Trust the process.',
    'Colleagues lean on your expertise. Mentor with patience and clarity.',
    'Financial discipline today sets up stability for the weeks ahead.',
    'A thoughtful act of service strengthens an important relationship.',
    'Perfectionism can wait; done is better than endlessly refined today.',
  ],
  Libra: [
    'Balance and diplomacy resolve a situation that has lingered too long.',
    'Aesthetic projects flourish. Beauty and harmony draw positive energy.',
    'A partnership decision becomes clearer. Weigh both sides before acting.',
    'Social grace opens doors that persistence alone cannot unlock.',
    'Financial partnerships look favorable. Discuss terms openly.',
    'Romance thrives on the little details — a kind word, a shared moment.',
    'Indecision lifts as new information clarifies the right path forward.',
  ],
  Scorpio: [
    'Deep insights surface today. Trust your investigative instincts.',
    'Transformation is underway. Embrace change rather than resist it.',
    'A secret or hidden matter comes to light — handle it with discretion.',
    'Emotional intensity is high. Channel it into creativity or exercise.',
    'Financial research pays off. Dig beneath the surface before deciding.',
    'Intimacy deepens through vulnerability. Open your heart cautiously.',
    'Old patterns lose their grip. A new version of you is emerging.',
  ],
  Sagittarius: [
    'Adventure calls. Even a small act of exploration renews your spirit.',
    'Philosophical insight guides a decision that has been weighing on you.',
    'Travel or learning brings unexpected rewards. Broaden your horizons.',
    'Optimism is your superpower today — share it generously.',
    'A mentor or guide crosses your path with timely wisdom.',
    'Honesty in a close relationship brings relief and deeper trust.',
    'Goals that seemed distant are now within reach. Keep moving forward.',
  ],
  Capricorn: [
    'Disciplined effort pays off. A long-term project reaches a milestone.',
    'Professional recognition arrives for consistent, quality work.',
    'A practical problem has an elegant solution — look for the simple answer.',
    'Financial planning now prevents headaches later. Review your budget.',
    'Authority figures respond well to your calm, competent approach.',
    'Family responsibilities balance with personal ambitions. Pace yourself.',
    'Perseverance distinguishes you today. Others notice your dedication.',
  ],
  Aquarius: [
    'Innovative ideas gain traction. Share your vision with open minds.',
    'Community or group efforts advance when you take the initiative.',
    'Technology or a new tool simplifies something that has been complex.',
    'Humanitarian impulses lead you to a rewarding act of service.',
    'Unexpected connections bridge worlds you thought were unrelated.',
    'Friendship is highlighted. A meaningful conversation shifts your outlook.',
    'Unconventional thinking solves the problem that conventional logic missed.',
  ],
  Pisces: [
    'Intuition and creativity merge to produce something truly beautiful.',
    'A dream or vision carries a message worth reflecting on today.',
    'Compassionate listening heals a rift and strengthens a bond.',
    'Artistic or spiritual pursuits bring deep satisfaction and peace.',
    'Avoid escapism; channel sensitivity into constructive expression.',
    'A gentle act of kindness returns to you in an unexpected form.',
    'Boundaries protect your energy. It is okay to say no with love.',
  ],
};

// Lucky colors by day of week
const LUCKY_COLORS = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'White', 'Purple'];

// Lucky colors specific to rashi
const RASHI_LUCKY_COLORS: Record<string, string> = {
  Aries: 'Red', Taurus: 'Green', Gemini: 'Yellow', Cancer: 'Silver',
  Leo: 'Gold', Virgo: 'Navy', Libra: 'Pink', Scorpio: 'Maroon',
  Sagittarius: 'Orange', Capricorn: 'Black', Aquarius: 'Blue', Pisces: 'Purple',
};

const RASHI_LUCKY_NUMBERS: Record<string, number> = {
  Aries: 9, Taurus: 6, Gemini: 5, Cancer: 2,
  Leo: 1, Virgo: 5, Libra: 6, Scorpio: 9,
  Sagittarius: 3, Capricorn: 8, Aquarius: 4, Pisces: 7,
};

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

    const templates = PREDICTIONS[rashi] || PREDICTIONS['Aries'];
    const dayOfWeek = date.getDay();
    const prediction = templates[dayOfWeek];

    // Lucky number: rashi base + day offset (1–9)
    const baseNumber = RASHI_LUCKY_NUMBERS[rashi] || 7;
    const luckyNumber = ((baseNumber + dayOfWeek - 1) % 9) + 1;

    // Lucky color: rashi color on special days, day color otherwise
    const luckyColor =
      dayOfWeek === 0 || dayOfWeek === 6
        ? RASHI_LUCKY_COLORS[rashi] || 'Green'
        : LUCKY_COLORS[dayOfWeek % LUCKY_COLORS.length];

    // Rating: 3–5 based on day parity + rashi index
    const rashiIndex = Object.keys(PREDICTIONS).indexOf(rashi);
    const rating = ((rashiIndex + dayOfWeek) % 3) + 3;

    const data: HoroscopeData = { rashi, date, prediction, luckyColor, luckyNumber, rating };
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

    const NAKSHATRA_NAMES_LIST = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
      'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
    ];

    const nakshatraIndex = NAKSHATRA_NAMES_LIST.indexOf(userNakshatra);
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

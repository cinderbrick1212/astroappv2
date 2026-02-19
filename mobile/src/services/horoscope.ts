/**
 * Daily Horoscope Service
 * Rashi-specific predictions rotated by date seed.
 */

export interface HoroscopeData {
  rashi: string;
  date: Date;
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
  rating: number;
}

// 3 predictions per rashi – rotated daily
const RASHI_PREDICTIONS: Record<string, string[]> = {
  Aries: [
    'A burst of energy drives you forward today. Bold actions bring rewarding results.',
    'Your natural leadership shines. Take initiative in projects and relationships.',
    'Mars energizes your ambitions. Focus your drive and watch goals materialise.',
  ],
  Taurus: [
    'Stability and patience bring abundance. Trust the slow, steady path today.',
    'Financial matters look favourable. A practical decision yields long-term gains.',
    "Venus blesses your relationships. Enjoy beauty, comfort, and meaningful connection.",
  ],
  Gemini: [
    'Your communication gifts are amplified. Share ideas freely and listen closely.',
    'A curious mind opens new doors today. Learn something unexpected.',
    'Versatility is your superpower. Adapt quickly and seize multiple opportunities.',
  ],
  Cancer: [
    'Intuition guides you accurately today. Trust your inner voice above all.',
    'Home and family bring comfort. Nurture close bonds for lasting happiness.',
    'Emotional intelligence is your edge. Empathy resolves a challenging situation.',
  ],
  Leo: [
    'Your charisma is undeniable today. Step into the spotlight with confidence.',
    'Creative expression brings joy and recognition. Share your unique talents.',
    'Generosity returns to you multiplied. Give freely and receive graciously.',
  ],
  Virgo: [
    'Attention to detail reveals a hidden opportunity. Precision pays off today.',
    'Health and routine deserve focus. Small improvements compound over time.',
    'Your analytical mind solves a persistent problem. Trust your process.',
  ],
  Libra: [
    'Harmony in relationships is within reach. Seek balance in every interaction.',
    'Aesthetic sensibility guides a smart decision. Beauty and logic align.',
    'Diplomacy resolves a long-standing tension. Your fairness earns respect.',
  ],
  Scorpio: [
    'Depth and intensity fuel transformation today. Embrace necessary change.',
    'Hidden truths come to light. Your insight gives you a decisive advantage.',
    'Resilience is your gift. What challenges you now strengthens you permanently.',
  ],
  Sagittarius: [
    'Optimism opens unexpected doors. Pursue your higher goals with enthusiasm.',
    'A philosophical insight shifts your perspective. Broaden your horizons today.',
    'Adventure calls. Step beyond the familiar and discover something remarkable.',
  ],
  Capricorn: [
    'Discipline and perseverance pay dividends. Stay committed to your long-term plan.',
    'Professional recognition is on the horizon. Your hard work has not gone unnoticed.',
    'Saturn rewards patient effort. Lay another brick in the foundation of your success.',
  ],
  Aquarius: [
    'Innovation distinguishes you today. Think outside conventional boundaries.',
    'Community and collaboration amplify your impact. Connect with like-minded people.',
    'Original ideas attract the right attention. Express your vision boldly.',
  ],
  Pisces: [
    'Spiritual insight deepens your understanding. Meditation brings clarity.',
    'Creativity flows abundantly. Channel it into something meaningful.',
    'Compassion is your greatest strength today. Lead with kindness.',
  ],
};

// Lucky colors per rashi (traditional Vedic associations)
const RASHI_LUCKY_COLOR: Record<string, string> = {
  Aries: 'Red', Taurus: 'Green', Gemini: 'Yellow', Cancer: 'White',
  Leo: 'Gold', Virgo: 'Earthy Brown', Libra: 'Blue', Scorpio: 'Deep Red',
  Sagittarius: 'Purple', Capricorn: 'Black', Aquarius: 'Electric Blue', Pisces: 'Sea Green',
};

// Lucky number base per rashi (1–9 range)
const RASHI_LUCKY_NUMBER_BASE: Record<string, number> = {
  Aries: 9, Taurus: 6, Gemini: 5, Cancer: 2,
  Leo: 1, Virgo: 5, Libra: 6, Scorpio: 9,
  Sagittarius: 3, Capricorn: 8, Aquarius: 4, Pisces: 7,
};

/** Returns a date-seeded number in [0, max). */
function dateSeed(date: Date, max: number): number {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return seed % max;
}

export const horoscopeService = {
  /** Get daily horoscope for a given rashi. Predictions rotate daily. */
  getDailyHoroscope(rashi: string, date: Date = new Date()): HoroscopeData {
    const preds = RASHI_PREDICTIONS[rashi] ?? RASHI_PREDICTIONS['Aries'];
    const predIdx = dateSeed(date, preds.length);
    const baseNum = RASHI_LUCKY_NUMBER_BASE[rashi] ?? 7;
    const luckyNumber = ((baseNum + dateSeed(date, 5)) % 9) + 1;
    const rating = 3 + (dateSeed(date, 3)); // 3, 4, or 5

    return {
      rashi,
      date,
      prediction: preds[predIdx],
      luckyColor: RASHI_LUCKY_COLOR[rashi] ?? 'Green',
      luckyNumber,
      rating,
    };
  },

  /** Get lucky factors for the day derived from nakshatra and date. */
  getLuckyFactors(
    userNakshatra: string,
    date: Date = new Date()
  ): { number: number; color: string; time: string } {
    const LUCKY_TIMES = [
      '6:00 AM – 7:30 AM', '8:00 AM – 9:30 AM', '10:00 AM – 11:30 AM',
      '12:00 PM – 1:30 PM', '2:00 PM – 3:30 PM', '4:00 PM – 5:30 PM',
    ];
    const LUCKY_COLORS = ['White', 'Yellow', 'Green', 'Blue', 'Red', 'Orange', 'Purple'];
    const seed = dateSeed(date, 1000);

    return {
      number: (seed % 9) + 1,
      color: LUCKY_COLORS[seed % LUCKY_COLORS.length],
      time: LUCKY_TIMES[seed % LUCKY_TIMES.length],
    };
  },
};

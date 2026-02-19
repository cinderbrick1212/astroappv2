/**
 * Astrology Engine – simplified pure-JS Vedic calculations.
 * Uses astronomical approximations; not a full Swiss-Ephemeris implementation.
 */

export interface PlanetPosition {
  planet: string;
  longitude: number;
  latitude: number;
  sign: string;
  house: number;
}

export interface ChartData {
  ascendant: number;
  planets: PlanetPosition[];
  houses: number[];
}

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

/** Convert a calendar date to Julian Day Number */
export function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours() / 24;
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr +
    Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
}

/**
 * Approximate Moon longitude (ecliptic, tropical) for a given Julian Day.
 * Accuracy ±2° – sufficient for rashi/nakshatra without ephemeris data.
 */
export function approxMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000
  let L = 218.3165 + 481267.8813 * T;  // Mean longitude
  let M = 134.9634 + 477198.8676 * T;  // Mean anomaly
  const D = 297.8502 + 445267.1115 * T; // Mean elongation
  const F = 93.2721 + 483202.0175 * T;  // Argument of latitude
  // First-order corrections
  L += 6.289 * Math.sin(M * Math.PI / 180);
  L -= 1.274 * Math.sin((2 * D - M) * Math.PI / 180);
  L += 0.658 * Math.sin(2 * D * Math.PI / 180);
  return ((L % 360) + 360) % 360;
}

/**
 * Approximate Sun longitude (ecliptic, tropical) for a given Julian Day.
 */
export function approxSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const M = 357.5291 + 35999.0503 * T; // Mean anomaly
  const Mrad = M * Math.PI / 180;
  let L = 280.4665 + 36000.7698 * T;    // Mean longitude
  L += 1.9146 * Math.sin(Mrad);
  L += 0.0200 * Math.sin(2 * Mrad);
  return ((L % 360) + 360) % 360;
}

export const astrologyEngine = {
  /**
   * Calculate chart data (simplified, no actual ephemeris).
   */
  calculateChart(
    date: Date,
    latitude: number,
    longitude: number,
    timezone: string
  ): ChartData {
    const jd = toJulianDay(date);
    const ascLong = ((longitude + date.getUTCHours() * 15) % 360 + 360) % 360;
    return {
      ascendant: ascLong,
      planets: [],
      houses: Array.from({ length: 12 }, (_, i) => (ascLong + i * 30) % 360),
    };
  },

  /** Return the Vedic rashi name for a given ecliptic longitude. */
  getZodiacSign(longitude: number): string {
    const idx = Math.floor(((longitude % 360) + 360) % 360 / 30);
    return SIGNS[idx] ?? 'Aries';
  },

  /** Return the nakshatra name for a given moon longitude. */
  getNakshatra(moonLongitude: number): string {
    const normalized = ((moonLongitude % 360) + 360) % 360;
    const idx = Math.floor(normalized / (360 / 27));
    return NAKSHATRAS[idx] ?? 'Ashwini';
  },

  /** Derive the approximate Moon rashi for a birth date (no birth time needed). */
  getRashiFromDate(date: Date): string {
    const jd = toJulianDay(date);
    const moonLong = approxMoonLongitude(jd);
    return astrologyEngine.getZodiacSign(moonLong);
  },

  /** Derive nakshatra from a birth date. */
  getNakshatraFromDate(date: Date): string {
    const jd = toJulianDay(date);
    const moonLong = approxMoonLongitude(jd);
    return astrologyEngine.getNakshatra(moonLong);
  },

  /** Calculate tithi (lunar day 1–30) for a given date. */
  getTithi(date: Date): number {
    const jd = toJulianDay(date);
    const moonLong = approxMoonLongitude(jd);
    const sunLong = approxSunLongitude(jd);
    const diff = ((moonLong - sunLong) + 360) % 360;
    return Math.floor(diff / 12) + 1; // 1–30
  },
};

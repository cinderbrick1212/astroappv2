/**
 * Astrology Engine - Pure JS implementation
 * Uses simplified astronomical formulas (Meeus "Astronomical Algorithms")
 * without requiring a native Swiss Ephemeris module.
 */

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const RASHI_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// Lahiri ayanamsha for year 2000 and annual rate
const AYANAMSHA_2000 = 23.853;
const AYANAMSHA_RATE = 0.01396; // degrees per year

export interface PlanetPosition {
  planet: string;
  longitude: number;
  latitude: number;
  sign: string;
  house: number;
}

export interface ChartData {
  ascendant: number;
  lagnaSign: string;
  planets: PlanetPosition[];
  houses: number[];
  moonSign: string;
  sunSign: string;
  nakshatra: string;
}

/** Convert a calendar date/time to Julian Day Number */
export const toJulianDay = (date: Date): number => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440;

  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    day +
    B -
    1524.5
  );
};

/** Lahiri ayanamsha for a given Julian Day */
const getAyanamsha = (jd: number): number => {
  const yearsSince2000 = (jd - 2451545.0) / 365.25;
  return AYANAMSHA_2000 + AYANAMSHA_RATE * yearsSince2000;
};

/** Normalise angle to [0, 360) */
const norm = (angle: number): number => {
  angle = angle % 360;
  return angle < 0 ? angle + 360 : angle;
};

/** Approximate tropical sun longitude (Meeus, degrees) */
export const calcSunLongitude = (jd: number): number => {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * (Math.PI / 180);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  return norm(L0 + C);
};

/** Approximate tropical moon longitude (Meeus simplified, degrees) */
export const calcMoonLongitude = (jd: number): number => {
  const T = (jd - 2451545.0) / 36525;
  const L = 218.3165 + 481267.8813 * T;
  const M = (357.5291 + 35999.0503 * T) * (Math.PI / 180);
  const Mp = (134.9634 + 477198.8676 * T) * (Math.PI / 180);
  const D = (297.8502 + 445267.1115 * T) * (Math.PI / 180);
  const F = (93.2721 + 483202.0175 * T) * (Math.PI / 180);
  const dL =
    6.289 * Math.sin(Mp) -
    1.274 * Math.sin(2 * D - Mp) +
    0.658 * Math.sin(2 * D) -
    0.186 * Math.sin(M) -
    0.114 * Math.sin(2 * F);
  return norm(L + dL);
};

/** Convert tropical to Vedic (sidereal) longitude using Lahiri ayanamsha */
export const tropicalToVedic = (tropicalLon: number, jd: number): number =>
  norm(tropicalLon - getAyanamsha(jd));

export const astrologyEngine = {
  toJulianDay,
  calcSunLongitude,
  calcMoonLongitude,
  tropicalToVedic,

  /**
   * Calculate chart for a given birth date/time/location.
   * Returns sun sign, moon sign, nakshatra, lagna, and planet positions.
   */
  calculateChart(
    date: Date,
    latitude: number,
    longitude: number,
    timezone: string
  ): ChartData {
    const jd = toJulianDay(date);
    const sunVedic = tropicalToVedic(calcSunLongitude(jd), jd);
    const moonVedic = tropicalToVedic(calcMoonLongitude(jd), jd);

    // Simplified lagna: ascendant advances ~1° every 4 min from sun position.
    // NOTE: This is a rough approximation. Precise lagna requires the birthplace
    // longitude and Local Sidereal Time; treat this result as indicative only.
    const hourOfDay = date.getUTCHours() + date.getUTCMinutes() / 60;
    const lagnaApprox = norm(sunVedic + (hourOfDay - 6) * 15);

    const moonSign = this.getZodiacSign(moonVedic);
    const sunSign = this.getZodiacSign(sunVedic);
    const nakshatra = this.getNakshatra(moonVedic);
    const lagnaSign = this.getZodiacSign(lagnaApprox);

    const planets: PlanetPosition[] = [
      {
        planet: 'Sun',
        longitude: sunVedic,
        latitude: 0,
        sign: sunSign,
        house: (Math.floor(norm(sunVedic - lagnaApprox) / 30) % 12) + 1,
      },
      {
        planet: 'Moon',
        longitude: moonVedic,
        latitude: 0,
        sign: moonSign,
        house: (Math.floor(norm(moonVedic - lagnaApprox) / 30) % 12) + 1,
      },
    ];

    const houses = Array.from({ length: 12 }, (_, i) =>
      norm(lagnaApprox + i * 30)
    );

    return { ascendant: lagnaApprox, lagnaSign, planets, houses, moonSign, sunSign, nakshatra };
  },

  /**
   * Zodiac sign (Vedic rashi) for a given longitude
   */
  getZodiacSign(longitude: number): string {
    const index = Math.floor(norm(longitude) / 30);
    return RASHI_NAMES[index] || 'Unknown';
  },

  /**
   * Rashi index (0–11) for a given longitude
   */
  getRashiIndex(longitude: number): number {
    return Math.floor(norm(longitude) / 30);
  },

  /**
   * Nakshatra name from moon longitude
   */
  getNakshatra(moonLongitude: number): string {
    const index = Math.floor(norm(moonLongitude) * 27 / 360);
    return NAKSHATRA_NAMES[Math.min(index, 26)];
  },

  /**
   * Nakshatra index (0–26) from moon longitude
   */
  getNakshatraIndex(moonLongitude: number): number {
    return Math.floor(norm(moonLongitude) * 27 / 360) % 27;
  },

  /**
   * Approximate Vedic moon sign from a birth date
   */
  getMoonSign(birthDate: Date): string {
    const jd = toJulianDay(birthDate);
    const moonVedic = tropicalToVedic(calcMoonLongitude(jd), jd);
    return this.getZodiacSign(moonVedic);
  },

  /**
   * Approximate Vedic sun sign from a birth date
   */
  getSunSign(birthDate: Date): string {
    const jd = toJulianDay(birthDate);
    const sunVedic = tropicalToVedic(calcSunLongitude(jd), jd);
    return this.getZodiacSign(sunVedic);
  },
};

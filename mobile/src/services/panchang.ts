/**
 * Panchang Calculation Service
 * Tithi from Sun/Moon positions; Rahu Kaal by weekday; Nakshatra from moon longitude.
 */

import {
  toJulianDay,
  approxMoonLongitude,
  approxSunLongitude,
  NAKSHATRAS,
  astrologyEngine,
} from './astrologyEngine';

export interface PanchangData {
  tithi: string;
  nakshatra: string;
  rahuKaal: {
    start: string;
    end: string;
  };
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  muhurat: Array<{
    activity: string;
    time: string;
  }>;
}

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada (K)', 'Dwitiya (K)', 'Tritiya (K)', 'Chaturthi (K)', 'Panchami (K)',
  'Shashthi (K)', 'Saptami (K)', 'Ashtami (K)', 'Navami (K)', 'Dashami (K)',
  'Ekadashi (K)', 'Dwadashi (K)', 'Trayodashi (K)', 'Chaturdashi (K)', 'Amavasya',
];

const YOGA_NAMES = [
  'Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti',
];

const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija',
  'Vanija', 'Vishti', 'Bava', 'Balava', 'Kaulava',
];

// Rahu Kaal start/end by day of week (Sun=0 … Sat=6)
const RAHU_KAAL: Array<[string, string]> = [
  ['16:30', '18:00'], // Sunday
  ['07:30', '09:00'], // Monday
  ['15:00', '16:30'], // Tuesday
  ['12:00', '13:30'], // Wednesday
  ['13:30', '15:00'], // Thursday
  ['10:30', '12:00'], // Friday
  ['09:00', '10:30'], // Saturday
];

const MUHURATS: Array<{ activity: string; time: string }> = [
  { activity: 'New Ventures', time: '08:00 – 09:30' },
  { activity: 'Financial Transactions', time: '10:00 – 11:30' },
  { activity: 'Travel', time: '14:00 – 15:30' },
  { activity: 'Learning', time: '06:00 – 07:30' },
];

/** Approximate sunrise for a given latitude (simplified heuristic).
 *  At lat=20° (equatorial), sunrise is ~06:30. Each 30° poleward adds ~30 min. */
function approxSunrise(latitude: number): string {
  const baseHour = 6;
  // Offset by 1 unit per 30° of latitude above 20°
  const offset = Math.round((Math.abs(latitude) - 20) / 30);
  const hour = Math.max(5, Math.min(7, baseHour + offset));
  return `${String(hour).padStart(2, '0')}:30`;
}

/** Approximate sunset for a given latitude (symmetric with sunrise). */
function approxSunset(latitude: number): string {
  const baseHour = 18;
  const offset = Math.round((20 - Math.abs(latitude)) / 30);
  const hour = Math.max(17, Math.min(19, baseHour + offset));
  return `${String(hour).padStart(2, '0')}:30`;
}

export const panchangService = {
  /**
   * Calculate Panchang for a given date and location.
   */
  calculatePanchang(
    date: Date,
    latitude: number,
    longitude: number
  ): PanchangData {
    const jd = toJulianDay(date);
    const moonLong = approxMoonLongitude(jd);
    const sunLong = approxSunLongitude(jd);

    // Tithi: each 12° separation between Moon and Sun = 1 tithi
    const tithiIdx = Math.floor(((moonLong - sunLong + 360) % 360) / 12);

    // Nakshatra: each nakshatra spans 360/27 degrees
    const nakshatraIdx = Math.floor((moonLong % 360) / (360 / 27));

    // Yoga: sum of moon + sun longitude / 13.33°
    const yogaIdx = Math.floor(((moonLong + sunLong) % 360) / (360 / 27));

    // Karana: half-tithi
    const karanaIdx = tithiIdx % KARANA_NAMES.length;

    const dow = date.getDay();
    const [rahuStart, rahuEnd] = RAHU_KAAL[dow];

    return {
      tithi: TITHI_NAMES[tithiIdx] ?? 'Purnima',
      nakshatra: NAKSHATRAS[nakshatraIdx] ?? 'Ashwini',
      rahuKaal: { start: rahuStart, end: rahuEnd },
      yoga: YOGA_NAMES[yogaIdx % YOGA_NAMES.length] ?? 'Siddha',
      karana: KARANA_NAMES[karanaIdx] ?? 'Bava',
      sunrise: approxSunrise(latitude),
      sunset: approxSunset(latitude),
      muhurat: MUHURATS.slice(0, 2),
    };
  },
};

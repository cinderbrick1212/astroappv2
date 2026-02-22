/**
 * Nakshatra, Tithi & Panchang Yoga calculations
 * Pure math — no React Native / Expo imports.
 */

import { norm } from './ephemeris';

// ── Data tables ──────────────────────────────────────────────────────────────

export const NAKSHATRA_NAMES: string[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const NAKSHATRA_NAMES_HINDI: string[] = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा',
  'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्व फाल्गुनी', 'उत्तर फाल्गुनी',
  'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्व आषाढ़ा', 'उत्तर आषाढ़ा', 'श्रवण', 'धनिष्ठा',
  'शतभिषा', 'पूर्व भाद्रपद', 'उत्तर भाद्रपद', 'रेवती',
];

/** Dasha lord for each nakshatra (9-lord cycle × 3) */
export const NAKSHATRA_LORDS: string[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

export const TITHI_NAMES: string[] = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada (K)', 'Dwitiya (K)', 'Tritiya (K)', 'Chaturthi (K)', 'Panchami (K)',
  'Shashthi (K)', 'Saptami (K)', 'Ashtami (K)', 'Navami (K)', 'Dashami (K)',
  'Ekadashi (K)', 'Dwadashi (K)', 'Trayodashi (K)', 'Chaturdashi (K)', 'Amavasya',
];

export const PANCHANG_YOGA_NAMES: string[] = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarman', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva',
  'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
  'Brahma', 'Indra', 'Vaidhriti',
];

export const KARANA_NAMES: string[] = [
  'Bava', 'Balava', 'Kaulava', 'Taitula', 'Garaja',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
];

// ── Types ────────────────────────────────────────────────────────────────────

export interface NakshatraResult {
  index: number;
  name: string;
  nameHindi: string;
  pada: number;
  ruler: string;
  startDeg: number;
  endDeg: number;
  degreeWithin: number;
}

// ── Constants ────────────────────────────────────────────────────────────────

const NAKSHATRA_SPAN = 360 / 27; // 13.3333...°

// ── Functions ────────────────────────────────────────────────────────────────

/** Nakshatra index (0–26) from sidereal Moon longitude */
export function getNakshatraIndex(moonSiderealLon: number): number {
  return Math.floor(norm(moonSiderealLon) * 27 / 360) % 27;
}

/** Nakshatra name from sidereal Moon longitude */
export function getNakshatraName(moonSiderealLon: number): string {
  const index = getNakshatraIndex(moonSiderealLon);
  return NAKSHATRA_NAMES[index];
}

/** Nakshatra pada (1–4) from sidereal Moon longitude */
export function getNakshatraPada(moonSiderealLon: number): number {
  const index = getNakshatraIndex(moonSiderealLon);
  const startDeg = getNakshatraStartDeg(index);
  const degreeWithin = norm(moonSiderealLon) - startDeg;
  return Math.min(Math.floor(degreeWithin / (NAKSHATRA_SPAN / 4)) + 1, 4);
}

/** Start degree of a nakshatra by index */
export function getNakshatraStartDeg(index: number): number {
  return index * NAKSHATRA_SPAN;
}

/** Full nakshatra result with all metadata */
export function getNakshatraResult(moonSiderealLon: number): NakshatraResult {
  const index = getNakshatraIndex(moonSiderealLon);
  const startDeg = getNakshatraStartDeg(index);
  const endDeg = startDeg + NAKSHATRA_SPAN;
  const degreeWithin = norm(moonSiderealLon) - startDeg;
  const pada = Math.min(Math.floor(degreeWithin / (NAKSHATRA_SPAN / 4)) + 1, 4);

  return {
    index,
    name: NAKSHATRA_NAMES[index],
    nameHindi: NAKSHATRA_NAMES_HINDI[index],
    pada,
    ruler: NAKSHATRA_LORDS[index],
    startDeg,
    endDeg,
    degreeWithin,
  };
}

/** Tithi index (0–29) from sidereal Sun and Moon longitudes */
export function getTithiIndex(sunSiderealLon: number, moonSiderealLon: number): number {
  const moonSunDiff = norm(moonSiderealLon - sunSiderealLon);
  return Math.floor(moonSunDiff / 12) % 30;
}

/** Tithi name from sidereal Sun and Moon longitudes */
export function getTithiName(sunSiderealLon: number, moonSiderealLon: number): string {
  return TITHI_NAMES[getTithiIndex(sunSiderealLon, moonSiderealLon)];
}

/** Panchang Yoga index (0–26) */
export function getPanchangYogaIndex(sunSiderealLon: number, moonSiderealLon: number): number {
  return Math.floor(norm(sunSiderealLon + moonSiderealLon) / (360 / 27)) % 27;
}

/** Panchang Yoga name */
export function getPanchangYogaName(sunSiderealLon: number, moonSiderealLon: number): string {
  return PANCHANG_YOGA_NAMES[getPanchangYogaIndex(sunSiderealLon, moonSiderealLon)];
}

/** Karana index (0–10) */
export function getKaranaIndex(sunSiderealLon: number, moonSiderealLon: number): number {
  return Math.floor(norm(moonSiderealLon - sunSiderealLon) / 6) % 11;
}

/** Karana name */
export function getKaranaName(sunSiderealLon: number, moonSiderealLon: number): string {
  return KARANA_NAMES[getKaranaIndex(sunSiderealLon, moonSiderealLon)];
}

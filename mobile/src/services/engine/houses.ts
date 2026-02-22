/**
 * Houses & Lagna — Vedic house system module
 * Computes GMST, Local Sidereal Time, Ascendant, Whole Sign cusps.
 * Pure math — no React Native / Expo imports.
 */

import { norm, getLahiriAyanamsa, GrahaPosition } from './ephemeris';

// ── Constants ────────────────────────────────────────────────────────────────

const RASHI_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// ── Types ────────────────────────────────────────────────────────────────────

export interface HouseData {
  lagnaLon: number;
  lagnaSign: string;
  lagnaSignIndex: number;
  cusps: number[];
}

// ── Functions ────────────────────────────────────────────────────────────────

/** Greenwich Mean Sidereal Time in degrees (Meeus Ch. 12) */
export function calcGMST(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return norm(gmst);
}

/** Tropical Ascendant via Local Sidereal Time */
export function calcAscendant(jd: number, latDeg: number, lngDeg: number): number {
  const T = (jd - 2451545.0) / 36525;
  const obliquity = (23.4393 - 0.013 * T) * (Math.PI / 180);
  const gmst = calcGMST(jd);
  const lst = norm(gmst + lngDeg);
  const lstRad = lst * (Math.PI / 180);
  const latRad = latDeg * (Math.PI / 180);

  const y = Math.cos(lstRad);
  const x = -(Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity));
  const asc = Math.atan2(y, x) * (180 / Math.PI);
  return norm(asc);
}

/** Compute Vedic Lagna (sidereal Ascendant) and Whole Sign cusps */
export function getVedicLagna(jd: number, latDeg: number, lngDeg: number): HouseData {
  const tropicalAsc = calcAscendant(jd, latDeg, lngDeg);
  const siderealAsc = norm(tropicalAsc - getLahiriAyanamsa(jd));
  const lagnaSignIndex = Math.floor(siderealAsc / 30) % 12;
  const lagnaSign = RASHI_NAMES[lagnaSignIndex];

  // Whole Sign: each cusp starts at the beginning of the sign
  const cusps = Array.from({ length: 12 }, (_, i) =>
    norm(lagnaSignIndex * 30 + i * 30)
  );

  return { lagnaLon: siderealAsc, lagnaSign, lagnaSignIndex, cusps };
}

/** Assign a single planet to its Whole Sign house (1–12) */
export function assignHouse(planetSiderealLon: number, lagnaLon: number): number {
  const lagnaStart = Math.floor(lagnaLon / 30) * 30;
  const offset = norm(planetSiderealLon - lagnaStart);
  return Math.floor(offset / 30) + 1;
}

/** Assign houses to all planets, returning a new array with house numbers */
export function assignHouses(
  planets: GrahaPosition[],
  lagnaLon: number
): (GrahaPosition & { house: number })[] {
  return planets.map((p) => ({
    ...p,
    house: assignHouse(p.siderealLon, lagnaLon),
  }));
}

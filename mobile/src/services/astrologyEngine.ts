/**
 * Astrology Engine — Public API facade
 * Delegates all calculations to Phase A engine modules while preserving
 * 100% backward compatibility with every existing caller.
 */

import * as ephemeris from './engine/ephemeris';
import { calcGMST as _calcGMST, getVedicLagna, assignHouse as _assignHouse, assignHouses } from './engine/houses';
import { getNakshatraIndex as _getNakshatraIndex, getNakshatraName, getNakshatraPada, getNakshatraResult, NAKSHATRA_NAMES } from './engine/nakshatra';
import { getDashaTimeline } from './engine/dasha';
import { calculateAshtakoot } from './engine/ashtakoot';
import { calculateAshtakavarga as _calcAshtakavarga } from './engine/ashtakavarga';
import { calculateVarga } from './engine/vargas';
import { detectYogas } from './engine/yogas';

import type { GrahaPosition } from './engine/ephemeris';
import type { HouseData } from './engine/houses';
import type { DashaTimeline } from './engine/dasha';
import type { AshtakootResult } from './engine/ashtakoot';
import type { AshtakavargaResult } from './engine/ashtakavarga';
import type { VargaChart } from './engine/vargas';
import type { DetectedYoga } from './engine/yogas';
import type { UserProfile } from '../types';

// ── Re-exports for backward compatibility ────────────────────────────────────

export { toJulianDay } from './engine/ephemeris';
export { calcGMST } from './engine/houses';

export const calcSunLongitude = ephemeris.getSunLongitude;
export const calcMoonLongitude = ephemeris.getMoonLongitude;
export const tropicalToVedic = ephemeris.siderealLongitude;
export { calcAscendant } from './engine/houses';

// Re-export types from engine modules
export type { GrahaPosition, DashaTimeline, AshtakootResult, AshtakavargaResult, VargaChart, DetectedYoga, HouseData };

// ── Constants (kept for backward compat) ─────────────────────────────────────

const RASHI_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// ── Existing interfaces (preserved) ──────────────────────────────────────────

export interface PlanetPosition {
  planet: string;
  longitude: number;
  latitude: number;
  sign: string;
  house: number;
}

export interface ChartData {
  // Existing fields — unchanged
  ascendant: number;
  lagnaSign: string;
  planets: PlanetPosition[];
  houses: number[];
  moonSign: string;
  sunSign: string;
  nakshatra: string;

  // New fields added in A08
  nakshatraPada: number;
  nakshatraIndex: number;
  lagnaSignIndex: number;
  moonLongitude: number;
  sunLongitude: number;
}

// ── New types for Phase D ────────────────────────────────────────────────────

export interface GocharResult {
  transitPositions: GrahaPosition[];
  sadeSatiStatus: {
    isActive: boolean;
    phase: 'rising' | 'peak' | 'setting' | 'none';
    saturnSign: string;
    natalMoonSign: string;
  };
  ashtamaShaniActive: boolean;
  significantTransits: TransitEvent[];
}

export interface TransitEvent {
  transitingGraha: string;
  natalHouse: number;
  aspect: string;
  orb: number;
}

export interface VarshaphalChart {
  returnDate: Date;
  varshaLagna: string;
  varshaLagnaIndex: number;
  muntha: string;
  munthaHouse: number;
  planets: GrahaPosition[];
}

export interface EclipseEvent {
  type: 'total_solar' | 'annular_solar' | 'partial_solar' | 'total_lunar' | 'penumbral_lunar';
  date: Date;
  siderealDeg: number;
  rashi: string;
  nakshatra: string;
  visibleFromIndia: boolean;
}

export interface EclipseImpact {
  natalGraha: string;
  natalLon: number;
  orb: number;
}

export interface AfflictedGraha {
  graha: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

// ── Constants for affliction detection ────────────────────────────────────────

/** Debilitation sign index for each graha (0–11) */
const DEBILITATED: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function profileToDate(profile: UserProfile): Date {
  const [hours, minutes] = (profile.birth_time || '06:00').split(':').map(Number);
  const [y, m, d] = profile.birth_date.split('-').map(Number);

  // Construct a UTC date using the local hours/minutes
  const date = new Date(Date.UTC(y, m - 1, d, hours, minutes));

  // Determine timezone offset in minutes (default to IST +5.5 if unknown)
  let offsetMinutes = 330; // 5 hours 30 mins
  if (profile.timezone === 'UTC') offsetMinutes = 0;
  // Add other common offsets if necessary, but IST is primary for this app

  // Convert Local birth time to UTC: UTC = Local - Offset
  date.setUTCMinutes(date.getUTCMinutes() - offsetMinutes);

  return date;
}

// ── Public API ───────────────────────────────────────────────────────────────

export const astrologyEngine = {
  toJulianDay: ephemeris.toJulianDay,
  calcSunLongitude: ephemeris.getSunLongitude,
  calcMoonLongitude: ephemeris.getMoonLongitude,
  tropicalToVedic: ephemeris.siderealLongitude,

  /**
   * Calculate chart for a given birth date/time/location.
   * Now returns all 9 grahas (was Sun + Moon only).
   */
  calculateChart(
    date: Date,
    latitude: number,
    longitude: number,
    _timezone: string
  ): ChartData {
    const jd = ephemeris.toJulianDay(date);

    // Get all 9 graha positions
    const allGrahas = ephemeris.getAllGrahaPositions(jd);

    // Get Vedic Lagna
    const lagna = getVedicLagna(jd, latitude, longitude);
    const lagnaLon = lagna.lagnaLon;

    // Assign houses to planets
    const withHouses = assignHouses(allGrahas, lagnaLon);

    // Build PlanetPosition array (backward-compatible)
    const planets: PlanetPosition[] = withHouses.map((p) => ({
      planet: p.graha.charAt(0).toUpperCase() + p.graha.slice(1),
      longitude: p.siderealLon,
      latitude: 0,
      sign: this.getZodiacSign(p.siderealLon),
      house: p.house,
    }));

    const sunGraha = allGrahas.find((g) => g.graha === 'sun')!;
    const moonGraha = allGrahas.find((g) => g.graha === 'moon')!;
    const sunVedic = sunGraha.siderealLon;
    const moonVedic = moonGraha.siderealLon;

    const moonSign = this.getZodiacSign(moonVedic);
    const sunSign = this.getZodiacSign(sunVedic);
    const nakshatra = getNakshatraName(moonVedic);
    const nakshatraResult = getNakshatraResult(moonVedic);

    return {
      ascendant: lagnaLon,
      lagnaSign: lagna.lagnaSign,
      lagnaSignIndex: lagna.lagnaSignIndex,
      planets,
      houses: lagna.cusps,
      moonSign,
      sunSign,
      nakshatra,
      nakshatraPada: nakshatraResult.pada,
      nakshatraIndex: nakshatraResult.index,
      moonLongitude: moonVedic,
      sunLongitude: sunVedic,
    };
  },

  /** Zodiac sign (Vedic rashi) for a given longitude */
  getZodiacSign(longitude: number): string {
    const index = Math.floor(ephemeris.norm(longitude) / 30);
    return RASHI_NAMES[index] || 'Unknown';
  },

  /** Rashi index (0–11) for a given longitude */
  getRashiIndex(longitude: number): number {
    return Math.floor(ephemeris.norm(longitude) / 30);
  },

  /** Nakshatra name from moon longitude */
  getNakshatra(moonLongitude: number): string {
    return getNakshatraName(moonLongitude);
  },

  /** Nakshatra index (0–26) from moon longitude */
  getNakshatraIndex(moonLongitude: number): number {
    return _getNakshatraIndex(moonLongitude);
  },

  /** Approximate Vedic moon sign from a birth date */
  getMoonSign(birthDate: Date): string {
    const jd = ephemeris.toJulianDay(birthDate);
    const moonVedic = ephemeris.siderealLongitude(ephemeris.getMoonLongitude(jd), jd);
    return this.getZodiacSign(moonVedic);
  },

  /** Approximate Vedic sun sign from a birth date */
  getSunSign(birthDate: Date): string {
    const jd = ephemeris.toJulianDay(birthDate);
    const sunVedic = ephemeris.siderealLongitude(ephemeris.getSunLongitude(jd), jd);
    return this.getZodiacSign(sunVedic);
  },

  // ── New methods for Phase D ──────────────────────────────────────────────

  /** Tool 01 — Janma Kundli (convenience wrapper) */
  calculateKundli(profile: UserProfile): ChartData {
    const date = profileToDate(profile);
    return this.calculateChart(
      date,
      profile.latitude ?? 28.6,
      profile.longitude ?? 77.2,
      profile.timezone
    );
  },

  /** Tool 02 — Kundli Milan */
  calculateKundliMilan(profileA: UserProfile, profileB: UserProfile): AshtakootResult {
    const chartA = this.calculateKundli(profileA);
    const chartB = this.calculateKundli(profileB);
    const marsHouseA = chartA.planets.find((p) => p.planet === 'Mars')?.house ?? 0;
    const marsHouseB = chartB.planets.find((p) => p.planet === 'Mars')?.house ?? 0;
    return calculateAshtakoot(
      chartA.moonLongitude,
      chartB.moonLongitude,
      marsHouseA,
      marsHouseB,
      chartA.lagnaSignIndex,
      chartB.lagnaSignIndex
    );
  },

  /** Tool 03 — Vimshottari Dasha */
  calculateDasha(profile: UserProfile): DashaTimeline {
    const date = profileToDate(profile);
    const jd = ephemeris.toJulianDay(date);
    const moonSid = ephemeris.siderealLongitude(ephemeris.getMoonLongitude(jd), jd);
    return getDashaTimeline(new Date(profile.birth_date), moonSid);
  },

  /** Tool 04 — Gochar (Transits) */
  calculateGochar(profile: UserProfile, date?: Date): GocharResult {
    const transitDate = date ?? new Date();
    const transitJd = ephemeris.toJulianDay(transitDate);
    const transitPositions = ephemeris.getAllGrahaPositions(transitJd);

    const chart = this.calculateKundli(profile);
    const natalMoonSign = chart.moonSign;
    const natalMoonRashi = chart.planets.find((p) => p.planet === 'Moon')
      ? Math.floor(ephemeris.norm(chart.moonLongitude) / 30)
      : 0;

    const saturn = transitPositions.find((p) => p.graha === 'saturn');
    const saturnRashi = saturn ? Math.floor(ephemeris.norm(saturn.siderealLon) / 30) : -1;
    const saturnSign = saturn ? this.getZodiacSign(saturn.siderealLon) : '';

    // Sade Sati: Saturn in 12th, 1st, or 2nd from natal Moon sign
    const saturnMoonOffset = ((saturnRashi - natalMoonRashi + 12) % 12);
    let phase: GocharResult['sadeSatiStatus']['phase'] = 'none';
    let isActive = false;
    if (saturnMoonOffset === 11) { phase = 'rising'; isActive = true; }
    else if (saturnMoonOffset === 0) { phase = 'peak'; isActive = true; }
    else if (saturnMoonOffset === 1) { phase = 'setting'; isActive = true; }

    // Ashtama Shani: Saturn in 8th from natal Moon
    const ashtamaShaniActive = saturnMoonOffset === 7;

    // Significant transits
    const lagnaLon = chart.ascendant;
    const significantTransits: TransitEvent[] = transitPositions
      .filter((t) => t.graha !== 'rahu' && t.graha !== 'ketu')
      .map((t) => ({
        transitingGraha: t.graha,
        natalHouse: _assignHouse(t.siderealLon, lagnaLon),
        aspect: 'conjunction',
        orb: 0,
      }));

    return {
      transitPositions,
      sadeSatiStatus: { isActive, phase, saturnSign, natalMoonSign },
      ashtamaShaniActive,
      significantTransits,
    };
  },

  /** Live sidereal planet positions for today */
  getCurrentPositions(): GrahaPosition[] {
    const jd = ephemeris.toJulianDay(new Date());
    return ephemeris.getAllGrahaPositions(jd);
  },

  /** Tool 05 — Varshaphal (Solar Return) */
  calculateVarshaphal(profile: UserProfile, year?: number): VarshaphalChart {
    const targetYear = year ?? new Date().getFullYear();
    const birthDate = profileToDate(profile);
    const birthJd = ephemeris.toJulianDay(birthDate);
    const natalSunLon = ephemeris.getSunLongitude(birthJd);

    // Approximate solar return: find when Sun returns to natal longitude
    const approxReturnDate = new Date(targetYear, birthDate.getUTCMonth(), birthDate.getUTCDate());
    const returnJd = ephemeris.toJulianDay(approxReturnDate);
    const lat = profile.latitude ?? 28.6;
    const lng = profile.longitude ?? 77.2;

    const allGrahas = ephemeris.getAllGrahaPositions(returnJd);
    const lagna = getVedicLagna(returnJd, lat, lng);

    // Muntha: sign = (natal lagna sign + years since birth) % 12
    const chart = this.calculateKundli(profile);
    const age = targetYear - new Date(profile.birth_date).getFullYear();
    const munthaIdx = (chart.lagnaSignIndex + age) % 12;
    const muntha = RASHI_NAMES[munthaIdx];
    const munthaHouse = _assignHouse(munthaIdx * 30, lagna.lagnaLon);

    return {
      returnDate: approxReturnDate,
      varshaLagna: lagna.lagnaSign,
      varshaLagnaIndex: lagna.lagnaSignIndex,
      muntha,
      munthaHouse,
      planets: allGrahas,
    };
  },

  /** Tool 06 — Varga Charts */
  calculateVargaChart(profile: UserProfile, divisor: 3 | 7 | 9 | 10 | 12): VargaChart {
    const date = profileToDate(profile);
    const jd = ephemeris.toJulianDay(date);
    const allGrahas = ephemeris.getAllGrahaPositions(jd);
    const lagna = getVedicLagna(jd, profile.latitude ?? 28.6, profile.longitude ?? 77.2);
    return calculateVarga(allGrahas, lagna.lagnaLon, divisor);
  },

  /** Tool 10 — Nakshatra convenience */
  getMoonNakshatra(profile: UserProfile): { nakshatraKey: string; nakshatraIndex: number; pada: number } {
    const chart = this.calculateKundli(profile);
    return {
      nakshatraKey: chart.nakshatra,
      nakshatraIndex: chart.nakshatraIndex,
      pada: chart.nakshatraPada,
    };
  },

  /** Tool 11 — Eclipses (simplified; returns empty for now — expand with real data) */
  getEclipses(_year: number): EclipseEvent[] {
    return [];
  },

  /** Tool 11 — Eclipse personal impact */
  getEclipsePersonalImpact(_eclipseDeg: number, _profile: UserProfile): EclipseImpact[] {
    return [];
  },

  /** Tool 12 — Ashtakavarga */
  calculateAshtakavarga(profile: UserProfile): AshtakavargaResult {
    const date = profileToDate(profile);
    const jd = ephemeris.toJulianDay(date);
    const allGrahas = ephemeris.getAllGrahaPositions(jd);
    const lagna = getVedicLagna(jd, profile.latitude ?? 28.6, profile.longitude ?? 77.2);
    return _calcAshtakavarga(allGrahas, lagna.lagnaLon);
  },

  /** Tool 13 — Prashna (Horary Chart) */
  calculatePrashna(timestamp: Date, lat: number, lng: number): ChartData {
    return this.calculateChart(timestamp, lat, lng, 'UTC');
  },

  /** Tool 15 — Afflicted Grahas for remedies */
  getAfflictedGrahas(profile: UserProfile): AfflictedGraha[] {
    const chart = this.calculateKundli(profile);
    const afflicted: AfflictedGraha[] = [];

    for (const planet of chart.planets) {
      const rashiIdx = Math.floor(ephemeris.norm(planet.longitude) / 30);

      // Check debilitation
      if (DEBILITATED[planet.planet] === rashiIdx) {
        afflicted.push({
          graha: planet.planet,
          reason: 'debilitated',
          severity: 'high',
        });
      }

      // Combustion: planet within ~6° of Sun (except Moon)
      if (planet.planet !== 'Sun' && planet.planet !== 'Moon' &&
        planet.planet !== 'Rahu' && planet.planet !== 'Ketu') {
        const sunPlanet = chart.planets.find((p) => p.planet === 'Sun');
        if (sunPlanet) {
          let diff = Math.abs(planet.longitude - sunPlanet.longitude);
          if (diff > 180) diff = 360 - diff;
          if (diff < 6) {
            afflicted.push({
              graha: planet.planet,
              reason: 'combust',
              severity: diff < 3 ? 'high' : 'medium',
            });
          }
        }
      }
    }

    return afflicted;
  },
};

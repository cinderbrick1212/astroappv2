/**
 * Vimshottari Dasha Calculator
 * Full 120-year sequence with Mahadasha, Antardasha, Pratyantardasha.
 * Pure math — no React Native / Expo imports.
 */

import { norm } from './ephemeris';
import { NAKSHATRA_LORDS, getNakshatraIndex, getNakshatraStartDeg } from './nakshatra';

// ── Constants ────────────────────────────────────────────────────────────────

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const DASHA_LORDS_HINDI: Record<string, string> = {
  Ketu: 'केतु', Venus: 'शुक्र', Sun: 'सूर्य', Moon: 'चंद्र',
  Mars: 'मंगल', Rahu: 'राहु', Jupiter: 'बृहस्पति',
  Saturn: 'शनि', Mercury: 'बुध',
};

/** 9-lord cycle in Vimshottari order */
const LORD_CYCLE = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

// ── Types ────────────────────────────────────────────────────────────────────

export interface DashaPeriod {
  lord: string;
  lordHindi: string;
  durationYears: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface AntardashaPeriod {
  mahaLord: string;
  antarLord: string;
  antarLordHindi: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface PratyantarPeriod {
  mahaLord: string;
  antarLord: string;
  pratyantarLord: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface DashaTimeline {
  sequence: DashaPeriod[];
  currentMahadasha: DashaPeriod;
  currentAntardasha: AntardashaPeriod;
  currentPratyantardasha: PratyantarPeriod;
  antardashas: AntardashaPeriod[];
  pratyantars: PratyantarPeriod[];
}

// ── Functions ────────────────────────────────────────────────────────────────

/** Build the full 9-Mahadasha sequence from birth data */
export function buildDashaSequence(
  birthDate: Date,
  moonSiderealLon: number
): DashaPeriod[] {
  const nakIndex = getNakshatraIndex(moonSiderealLon);
  const startDeg = getNakshatraStartDeg(nakIndex);
  const degreeWithin = norm(moonSiderealLon) - startDeg;
  const fractionElapsed = degreeWithin / (360 / 27);

  const lordCycleIndex = nakIndex % 9;
  const firstLord = LORD_CYCLE[lordCycleIndex];
  const remainingYears = DASHA_YEARS[firstLord] * (1 - fractionElapsed);

  const sequence: DashaPeriod[] = [];
  let currentStart = new Date(birthDate.getTime());

  // First (partial) dasha
  const firstEnd = new Date(currentStart.getTime() + remainingYears * MS_PER_YEAR);
  sequence.push({
    lord: firstLord,
    lordHindi: DASHA_LORDS_HINDI[firstLord],
    durationYears: remainingYears,
    startDate: currentStart,
    endDate: firstEnd,
    isCurrent: false,
  });
  currentStart = firstEnd;

  // Remaining 8 dashas in cycle order
  for (let i = 1; i < 9; i++) {
    const lord = LORD_CYCLE[(lordCycleIndex + i) % 9];
    const years = DASHA_YEARS[lord];
    const endDate = new Date(currentStart.getTime() + years * MS_PER_YEAR);
    sequence.push({
      lord,
      lordHindi: DASHA_LORDS_HINDI[lord],
      durationYears: years,
      startDate: currentStart,
      endDate,
      isCurrent: false,
    });
    currentStart = endDate;
  }

  return sequence;
}

/** Build Antardashas within a Mahadasha */
function buildAntardashas(mahadasha: DashaPeriod): AntardashaPeriod[] {
  const mahaLord = mahadasha.lord;
  const mahaStart = mahadasha.startDate.getTime();
  const mahaDuration = mahadasha.durationYears;

  const startIdx = LORD_CYCLE.indexOf(mahaLord);
  const antardashas: AntardashaPeriod[] = [];
  let currentMs = mahaStart;

  for (let i = 0; i < 9; i++) {
    const antarLord = LORD_CYCLE[(startIdx + i) % 9];
    const antarYears = (DASHA_YEARS[antarLord] / 120) * mahaDuration;
    const endMs = currentMs + antarYears * MS_PER_YEAR;
    antardashas.push({
      mahaLord,
      antarLord,
      antarLordHindi: DASHA_LORDS_HINDI[antarLord],
      startDate: new Date(currentMs),
      endDate: new Date(endMs),
      isCurrent: false,
    });
    currentMs = endMs;
  }

  return antardashas;
}

/** Build Pratyantardashas within an Antardasha */
function buildPratyantars(antardasha: AntardashaPeriod): PratyantarPeriod[] {
  const antarStart = antardasha.startDate.getTime();
  const antarDurationYears =
    (antardasha.endDate.getTime() - antarStart) / MS_PER_YEAR;

  const startIdx = LORD_CYCLE.indexOf(antardasha.antarLord);
  const pratyantars: PratyantarPeriod[] = [];
  let currentMs = antarStart;

  for (let i = 0; i < 9; i++) {
    const pLord = LORD_CYCLE[(startIdx + i) % 9];
    const pYears = (DASHA_YEARS[pLord] / 120) * antarDurationYears;
    const endMs = currentMs + pYears * MS_PER_YEAR;
    pratyantars.push({
      mahaLord: antardasha.mahaLord,
      antarLord: antardasha.antarLord,
      pratyantarLord: pLord,
      startDate: new Date(currentMs),
      endDate: new Date(endMs),
      isCurrent: false,
    });
    currentMs = endMs;
  }

  return pratyantars;
}

/** Get the complete Dasha timeline with current periods highlighted */
export function getDashaTimeline(
  birthDate: Date,
  moonSiderealLon: number,
  referenceDate?: Date
): DashaTimeline {
  const now = referenceDate ?? new Date();
  const nowMs = now.getTime();

  const sequence = buildDashaSequence(birthDate, moonSiderealLon);

  // Mark current Mahadasha
  let currentMaha = sequence[0];
  for (const maha of sequence) {
    if (nowMs >= maha.startDate.getTime() && nowMs < maha.endDate.getTime()) {
      maha.isCurrent = true;
      currentMaha = maha;
    }
  }

  // Build Antardashas for the current Mahadasha
  const antardashas = buildAntardashas(currentMaha);
  let currentAntar = antardashas[0];
  for (const antar of antardashas) {
    if (nowMs >= antar.startDate.getTime() && nowMs < antar.endDate.getTime()) {
      antar.isCurrent = true;
      currentAntar = antar;
    }
  }

  // Build Pratyantardashas for the current Antardasha
  const pratyantars = buildPratyantars(currentAntar);
  let currentPratyantar = pratyantars[0];
  for (const p of pratyantars) {
    if (nowMs >= p.startDate.getTime() && nowMs < p.endDate.getTime()) {
      p.isCurrent = true;
      currentPratyantar = p;
    }
  }

  return {
    sequence,
    currentMahadasha: currentMaha,
    currentAntardasha: currentAntar,
    currentPratyantardasha: currentPratyantar,
    antardashas,
    pratyantars,
  };
}

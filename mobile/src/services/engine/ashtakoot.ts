/**
 * Ashtakoot Milan & Mangal Dosha — Vedic compatibility scoring
 * Pure math — no React Native / Expo imports.
 */

import { norm } from './ephemeris';
import { getNakshatraIndex } from './nakshatra';

// ── Data tables (copied from compatibility.ts) ──────────────────────────────

const NAKSHATRA_GANA = [
  0, 2, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 2, 0,
];

const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2,
];

const NAKSHATRA_YONI = [
  0, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 4, 0, 13, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11,
];

const YONI_COMPAT = [
  [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 2, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
];

const RASHI_VARNA = [1, 2, 3, 0, 1, 3, 0, 1, 1, 3, 0, 2];

const RASHI_VASHYA = [3, 0, 2, 1, 3, 2, 2, 4, 0, 0, 2, 1];

const RASHI_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter',
];

const PLANET_FRIEND: Record<string, Record<string, number>> = {
  Sun:     { Sun: 0, Moon: 1, Mars: 1, Mercury: 0, Jupiter: 1, Venus: -1, Saturn: -1 },
  Moon:    { Sun: 1, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus:  0, Saturn:  0 },
  Mars:    { Sun: 1, Moon: 1, Mars: 0, Mercury: -1, Jupiter: 1, Venus: 0, Saturn:  0 },
  Mercury: { Sun: 0, Moon: 0, Mars: 0, Mercury:  0, Jupiter: 0, Venus: 1, Saturn:  1 },
  Jupiter: { Sun: 1, Moon: 1, Mars: 1, Mercury: -1, Jupiter: 0, Venus: -1, Saturn:  0 },
  Venus:   { Sun: -1, Moon: 0, Mars: 0, Mercury:  1, Jupiter: 0, Venus:  0, Saturn:  1 },
  Saturn:  { Sun: -1, Moon: -1, Mars: -1, Mercury: 1, Jupiter: 0, Venus:  1, Saturn:  0 },
};

const KOOT_HINDI: Record<string, string> = {
  varna: 'वर्ण', vashya: 'वश्य', tara: 'तारा', yoni: 'योनि',
  graha_maitri: 'ग्रह मैत्री', gana: 'गण', bhakoot: 'भकूट', nadi: 'नाड़ी',
};

const MANGAL_DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];

// ── Types ────────────────────────────────────────────────────────────────────

export interface KootScore {
  koot: string;
  kootHindi: string;
  scored: number;
  max: number;
}

export interface MangalDoshaResult {
  hasDosha: boolean;
  affectedHouses: number[];
  severity: 'full' | 'partial' | 'none';
  cancellation: boolean;
}

export interface AshtakootResult {
  totalScore: number;
  maxScore: 36;
  koots: KootScore[];
  verdict: 'excellent' | 'good' | 'acceptable' | 'inauspicious';
  verdictHindi: string;
  mangalDoshaA: MangalDoshaResult;
  mangalDoshaB: MangalDoshaResult;
}

// ── Individual Koot functions ────────────────────────────────────────────────

/** Varna (max 1): boy's varna ≥ girl's → 1 else 0 */
export function calcVarna(boyRashiIdx: number, girlRashiIdx: number): number {
  return RASHI_VARNA[boyRashiIdx] >= RASHI_VARNA[girlRashiIdx] ? 1 : 0;
}

/** Vashya (max 2) */
export function calcVashya(boyRashiIdx: number, girlRashiIdx: number): number {
  if (boyRashiIdx === girlRashiIdx) return 2;
  const bv = RASHI_VASHYA[boyRashiIdx];
  const gv = RASHI_VASHYA[girlRashiIdx];
  if (bv === gv) return 2;
  if ((bv === 0 && gv === 3) || (bv === 3 && gv === 0)) return 1;
  return 0;
}

/** Tara (max 3): count from girl's nakshatra to boy's, check group */
export function calcTara(boyNakIdx: number, girlNakIdx: number): number {
  const count = ((boyNakIdx - girlNakIdx + 27) % 27) + 1;
  const group = ((count - 1) % 9) + 1;
  return [1, 2, 4, 6, 8].includes(group) ? 3 : 0;
}

/** Yoni (max 4): based on animal symbol pair */
export function calcYoni(boyNakIdx: number, girlNakIdx: number): number {
  const bY = NAKSHATRA_YONI[boyNakIdx] ?? 0;
  const gY = NAKSHATRA_YONI[girlNakIdx] ?? 0;
  const compat = YONI_COMPAT[bY]?.[gY] ?? 1;
  if (compat === 2) return 4;
  if (compat === 1) return 2;
  return 0;
}

/** Graha Maitri (max 5): planetary friendship between rashi lords */
export function calcGrahaMaitri(boyRashiIdx: number, girlRashiIdx: number): number {
  const bLord = RASHI_LORDS[boyRashiIdx];
  const gLord = RASHI_LORDS[girlRashiIdx];
  if (bLord === gLord) return 5;
  const bf = PLANET_FRIEND[bLord]?.[gLord] ?? 0;
  const gf = PLANET_FRIEND[gLord]?.[bLord] ?? 0;
  if (bf === 1 && gf === 1) return 5;
  if (bf === 1 || gf === 1) return 4;
  if (bf === 0 && gf === 0) return 3;
  if ((bf === -1 && gf === 1) || (bf === 1 && gf === -1)) return 1;
  return 0;
}

/** Gana (max 6): same=6, Deva-Manushya=5, Rakshasa involved=0 */
export function calcGana(boyNakIdx: number, girlNakIdx: number): number {
  const bg = NAKSHATRA_GANA[boyNakIdx] ?? 0;
  const gg = NAKSHATRA_GANA[girlNakIdx] ?? 0;
  if (bg === gg) return 6;
  if (bg === 2 || gg === 2) return 0;
  return 5;
}

/** Bhakoot (max 7): based on rashi interval */
export function calcBhakoot(boyRashiIdx: number, girlRashiIdx: number): number {
  const interval = ((boyRashiIdx - girlRashiIdx + 12) % 12) + 1;
  const revInterval = ((girlRashiIdx - boyRashiIdx + 12) % 12) + 1;
  const inauspicious: [number, number][] = [
    [6, 8], [8, 6], [5, 9], [9, 5], [12, 2], [2, 12],
  ];
  for (const [a, b] of inauspicious) {
    if (interval === a && revInterval === b) return 0;
  }
  return 7;
}

/** Nadi (max 8): different nadis = 8, same nadi = 0 */
export function calcNadi(boyNakIdx: number, girlNakIdx: number): number {
  const bn = NAKSHATRA_NADI[boyNakIdx] ?? 0;
  const gn = NAKSHATRA_NADI[girlNakIdx] ?? 0;
  return bn === gn ? 0 : 8;
}

// ── Mangal Dosha ─────────────────────────────────────────────────────────────

/** Detect Mangal Dosha from Mars house and Lagna rashi */
export function calcMangalDosha(marsHouse: number, lagnaRashiIdx: number): MangalDoshaResult {
  if (!MANGAL_DOSHA_HOUSES.includes(marsHouse)) {
    return { hasDosha: false, affectedHouses: [], severity: 'none', cancellation: false };
  }

  const fullHouses = [1, 7, 8];
  const severity = fullHouses.includes(marsHouse) ? 'full' as const : 'partial' as const;

  // Cancellation: Lagna is Aries (0), Scorpio (7), or Capricorn (9)
  const cancellation = [0, 7, 9].includes(lagnaRashiIdx);

  return {
    hasDosha: true,
    affectedHouses: [marsHouse],
    severity,
    cancellation,
  };
}

// ── Full Milan ───────────────────────────────────────────────────────────────

/** Calculate full Ashtakoot compatibility result */
export function calculateAshtakoot(
  moonLonA: number,
  moonLonB: number,
  marsHouseA: number,
  marsHouseB: number,
  lagnaIdxA: number,
  lagnaIdxB: number
): AshtakootResult {
  const rashiA = Math.floor(norm(moonLonA) / 30);
  const rashiB = Math.floor(norm(moonLonB) / 30);
  const nakA = getNakshatraIndex(moonLonA);
  const nakB = getNakshatraIndex(moonLonB);

  const koots: KootScore[] = [
    { koot: 'varna', kootHindi: KOOT_HINDI.varna, scored: calcVarna(rashiA, rashiB), max: 1 },
    { koot: 'vashya', kootHindi: KOOT_HINDI.vashya, scored: calcVashya(rashiA, rashiB), max: 2 },
    { koot: 'tara', kootHindi: KOOT_HINDI.tara, scored: calcTara(nakA, nakB), max: 3 },
    { koot: 'yoni', kootHindi: KOOT_HINDI.yoni, scored: calcYoni(nakA, nakB), max: 4 },
    { koot: 'graha_maitri', kootHindi: KOOT_HINDI.graha_maitri, scored: calcGrahaMaitri(rashiA, rashiB), max: 5 },
    { koot: 'gana', kootHindi: KOOT_HINDI.gana, scored: calcGana(nakA, nakB), max: 6 },
    { koot: 'bhakoot', kootHindi: KOOT_HINDI.bhakoot, scored: calcBhakoot(rashiA, rashiB), max: 7 },
    { koot: 'nadi', kootHindi: KOOT_HINDI.nadi, scored: calcNadi(nakA, nakB), max: 8 },
  ];

  const totalScore = koots.reduce((sum, k) => sum + k.scored, 0);

  let verdict: AshtakootResult['verdict'];
  let verdictHindi: string;
  if (totalScore >= 28) { verdict = 'excellent'; verdictHindi = 'उत्तम'; }
  else if (totalScore >= 21) { verdict = 'good'; verdictHindi = 'शुभ'; }
  else if (totalScore >= 18) { verdict = 'acceptable'; verdictHindi = 'सामान्य'; }
  else { verdict = 'inauspicious'; verdictHindi = 'अशुभ'; }

  const mangalDoshaA = marsHouseA > 0 ? calcMangalDosha(marsHouseA, lagnaIdxA) : { hasDosha: false, affectedHouses: [], severity: 'none' as const, cancellation: false };
  const mangalDoshaB = marsHouseB > 0 ? calcMangalDosha(marsHouseB, lagnaIdxB) : { hasDosha: false, affectedHouses: [], severity: 'none' as const, cancellation: false };

  return {
    totalScore,
    maxScore: 36,
    koots,
    verdict,
    verdictHindi,
    mangalDoshaA,
    mangalDoshaB,
  };
}

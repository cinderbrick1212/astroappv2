/**
 * Compatibility Service - Ashtakoot Milan algorithm
 * Classic Vedic compatibility scoring (max 36 points across 8 koots).
 */

import { astrologyEngine } from './astrologyEngine';

export interface CompatibilityResult {
  score: number;
  maxScore: number;
  strengths: string[];
  cautions: string[];
  advice: string;
  breakdown: {
    varna: number;
    vashya: number;
    tara: number;
    yoni: number;
    graha_maitri: number;
    gana: number;
    bhakoot: number;
    nadi: number;
  };
}

// ── Nakshatra metadata ──────────────────────────────────────────────────────

// Lord of each nakshatra (9-lord cycle repeated 3×)
const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

// Gana: 0=Deva, 1=Manushya, 2=Rakshasa
const NAKSHATRA_GANA = [
  0, 2, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 2, 0,
];

// Nadi: 0=Aadi, 1=Madhya, 2=Antya (repeating pattern of 9)
const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2,
];

// Yoni: animal symbol index (14 pairs)
const NAKSHATRA_YONI = [
  0, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 4, 0, 13, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11,
];
// Yoni compatibility table (14×14): 0=low, 1=neutral, 2=high
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

// Varna: 0=Brahmin, 1=Kshatriya, 2=Vaishya, 3=Shudra (by rashi)
const RASHI_VARNA = [1, 2, 3, 0, 1, 3, 0, 1, 1, 3, 0, 2];

// Vashya groupings (by rashi index): 0=Chatushpad, 1=Jalchar, 2=Manushya, 3=Vanchar, 4=Keeta
const RASHI_VASHYA = [3, 0, 2, 1, 3, 2, 2, 4, 0, 0, 2, 1];

// Rashi lords (for Graha Maitri)
const RASHI_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter',
];

// Planetary friendship table: 1=Friend, 0=Neutral, -1=Enemy
const PLANET_FRIEND: Record<string, Record<string, number>> = {
  Sun:     { Sun: 0, Moon: 1, Mars: 1, Mercury: 0, Jupiter: 1, Venus: -1, Saturn: -1 },
  Moon:    { Sun: 1, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus:  0, Saturn:  0 },
  Mars:    { Sun: 1, Moon: 1, Mars: 0, Mercury: -1, Jupiter: 1, Venus: 0, Saturn:  0 },
  Mercury: { Sun: 0, Moon: 0, Mars: 0, Mercury:  0, Jupiter: 0, Venus: 1, Saturn:  1 },
  Jupiter: { Sun: 1, Moon: 1, Mars: 1, Mercury: -1, Jupiter: 0, Venus: -1, Saturn:  0 },
  Venus:   { Sun: -1, Moon: 0, Mars: 0, Mercury:  1, Jupiter: 0, Venus:  0, Saturn:  1 },
  Saturn:  { Sun: -1, Moon: -1, Mars: -1, Mercury: 1, Jupiter: 0, Venus:  1, Saturn:  0 },
};

// ── Koot scoring functions ──────────────────────────────────────────────────

/** Varna (max 1): boy's varna ≥ girl's → 1 else 0 */
const calcVarna = (boyRashi: number, girlRashi: number): number =>
  RASHI_VARNA[boyRashi] >= RASHI_VARNA[girlRashi] ? 1 : 0;

/** Vashya (max 2) */
const calcVashya = (boyRashi: number, girlRashi: number): number => {
  if (boyRashi === girlRashi) return 2;
  const bv = RASHI_VASHYA[boyRashi];
  const gv = RASHI_VASHYA[girlRashi];
  if (bv === gv) return 2;
  // Chatushpad-Vanchar partial
  if ((bv === 0 && gv === 3) || (bv === 3 && gv === 0)) return 1;
  return 0;
};

/** Tara (max 3): count from girl's nakshatra to boy's, check divisibility */
const calcTara = (boyNak: number, girlNak: number): number => {
  const count = ((boyNak - girlNak + 27) % 27) + 1;
  const group = ((count - 1) % 9) + 1;
  // Auspicious: 1,2,4,6,8; Inauspicious: 3,5,7,9
  return [1, 2, 4, 6, 8].includes(group) ? 3 : 0;
};

/** Yoni (max 4): based on animal symbol pair */
const calcYoni = (boyNak: number, girlNak: number): number => {
  const bY = NAKSHATRA_YONI[boyNak] ?? 0;
  const gY = NAKSHATRA_YONI[girlNak] ?? 0;
  const compat = YONI_COMPAT[bY]?.[gY] ?? 1;
  if (compat === 2) return 4;
  if (compat === 1) return 2;
  return 0;
};

/** Graha Maitri (max 5): planetary friendship between rashi lords */
const calcGrahaMaitri = (boyRashi: number, girlRashi: number): number => {
  const bLord = RASHI_LORDS[boyRashi];
  const gLord = RASHI_LORDS[girlRashi];
  if (bLord === gLord) return 5;
  const bf = PLANET_FRIEND[bLord]?.[gLord] ?? 0;
  const gf = PLANET_FRIEND[gLord]?.[bLord] ?? 0;
  if (bf === 1 && gf === 1) return 5;
  if (bf === 1 || gf === 1) return 4;
  if (bf === 0 && gf === 0) return 3;
  if (bf === -1 && gf === 1) return 1;
  if (bf === 1 && gf === -1) return 1;
  return 0;
};

/** Gana (max 6): 6=same, 5=Deva-Manushya, 1=others with Rakshasa */
const calcGana = (boyNak: number, girlNak: number): number => {
  const bg = NAKSHATRA_GANA[boyNak] ?? 0;
  const gg = NAKSHATRA_GANA[girlNak] ?? 0;
  if (bg === gg) return 6;
  if (bg === 2 || gg === 2) return 0; // Rakshasa involved
  return 5; // Deva + Manushya
};

/** Bhakoot (max 7): based on rashi interval */
const calcBhakoot = (boyRashi: number, girlRashi: number): number => {
  const interval = ((boyRashi - girlRashi + 12) % 12) + 1;
  // Inauspicious: 6-8, 5-9, 12-2
  const inauspicious = [
    [6, 8], [8, 6], [5, 9], [9, 5], [12, 2], [2, 12],
  ];
  const revInterval = ((girlRashi - boyRashi + 12) % 12) + 1;
  for (const [a, b] of inauspicious) {
    if (interval === a && revInterval === b) return 0;
  }
  return 7;
};

/** Nadi (max 8): different nadis score 8, same nadi scores 0 */
const calcNadi = (boyNak: number, girlNak: number): number => {
  const bn = NAKSHATRA_NADI[boyNak] ?? 0;
  const gn = NAKSHATRA_NADI[girlNak] ?? 0;
  return bn === gn ? 0 : 8;
};

// ── Interpretations ─────────────────────────────────────────────────────────

const getStrengths = (score: number, breakdown: CompatibilityResult['breakdown']): string[] => {
  const strengths: string[] = [];
  if (breakdown.nadi === 8) strengths.push('Strong physical and mental compatibility (Nadi)');
  if (breakdown.gana === 6) strengths.push('Aligned temperaments and nature (Gana)');
  if (breakdown.graha_maitri >= 4) strengths.push('Planetary lords are friends — harmony in thinking');
  if (breakdown.bhakoot === 7) strengths.push('Balanced life goals and emotional wavelength (Bhakoot)');
  if (breakdown.yoni >= 3) strengths.push('Natural affinity and mutual attraction (Yoni)');
  if (strengths.length === 0) strengths.push('Shared values and mutual respect are your foundation');
  return strengths.slice(0, 2);
};

const getCautions = (score: number, breakdown: CompatibilityResult['breakdown']): string[] => {
  const cautions: string[] = [];
  if (breakdown.nadi === 0) cautions.push('Same Nadi — prioritise health planning before starting a family');
  if (breakdown.gana === 0) cautions.push('Different temperaments (Gana) — practice patience');
  if (breakdown.bhakoot === 0) cautions.push('Bhakoot dosha present — seek astrological remedies');
  if (cautions.length === 0 && score < 24) cautions.push('Communication styles differ — active listening helps');
  if (cautions.length === 0) cautions.push('Keep nurturing the relationship through open dialogue');
  return cautions.slice(0, 1);
};

const getAdvice = (score: number): string => {
  if (score >= 28) return 'This is an excellent match. Focus on building shared dreams and trust.';
  if (score >= 19) return 'A good match overall. Work together on the areas that need patience.';
  return 'Challenges can be overcome with understanding and astrological remedies. Consult a Vedic astrologer.';
};

// ── Public API ───────────────────────────────────────────────────────────────

export const compatibilityService = {
  /**
   * Calculate compatibility using the Ashtakoot Milan algorithm.
   * Uses birth dates to determine moon sign and nakshatra.
   */
  calculateCompatibility(
    user1BirthDate: Date,
    user2BirthDate: Date
  ): CompatibilityResult {
    const jd1 = astrologyEngine.toJulianDay(user1BirthDate);
    const jd2 = astrologyEngine.toJulianDay(user2BirthDate);

    const moon1 = astrologyEngine.tropicalToVedic(astrologyEngine.calcMoonLongitude(jd1), jd1);
    const moon2 = astrologyEngine.tropicalToVedic(astrologyEngine.calcMoonLongitude(jd2), jd2);

    const rashi1 = astrologyEngine.getRashiIndex(moon1);
    const rashi2 = astrologyEngine.getRashiIndex(moon2);
    const nak1 = astrologyEngine.getNakshatraIndex(moon1);
    const nak2 = astrologyEngine.getNakshatraIndex(moon2);

    // Treat user1 as "boy" (first born date), user2 as "girl"
    const breakdown = {
      varna: calcVarna(rashi1, rashi2),
      vashya: calcVashya(rashi1, rashi2),
      tara: calcTara(nak1, nak2),
      yoni: calcYoni(nak1, nak2),
      graha_maitri: calcGrahaMaitri(rashi1, rashi2),
      gana: calcGana(nak1, nak2),
      bhakoot: calcBhakoot(rashi1, rashi2),
      nadi: calcNadi(nak1, nak2),
    };

    const score =
      breakdown.varna + breakdown.vashya + breakdown.tara +
      breakdown.yoni + breakdown.graha_maitri + breakdown.gana +
      breakdown.bhakoot + breakdown.nadi;

    return {
      score,
      maxScore: 36,
      strengths: getStrengths(score, breakdown),
      cautions: getCautions(score, breakdown),
      advice: getAdvice(score),
      breakdown,
    };

    const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

    // Pick strengths/cautions deterministically from the rashi pair
    const seed = (r1 * 12 + r2) % STRENGTH_POOL.length;
    const strengths = STRENGTH_POOL[seed];
    const caution = CAUTION_POOL[(r1 + r2) % CAUTION_POOL.length];

    let advice: string;
    if (score >= 28) {
      advice = 'This is an excellent match. Nurture it with gratitude.';
    } else if (score >= 19) {
      advice = 'A solid foundation—focus on open communication to deepen the bond.';
    } else {
      advice = 'Patience, mutual respect, and conscious effort can bridge differences.';
    }

    return { score, maxScore: 36, strengths, cautions: [caution], advice, breakdown };
  },
};

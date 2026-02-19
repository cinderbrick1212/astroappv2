/**
 * Compatibility Calculation Service
 * Implements simplified Ashtakoot Milan based on Moon sign (rashi).
 */

import { astrologyEngine, toJulianDay, approxMoonLongitude } from './astrologyEngine';

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

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

/** Derive the rashi index (0–11) from a birth date */
function rashiIndex(date: Date): number {
  const jd = toJulianDay(date);
  const moonLong = approxMoonLongitude(jd);
  return Math.floor(((moonLong % 360) + 360) % 360 / 30);
}

// --- Ashtakoot tables ---

// Varna (1 pt): caste compatibility
const VARNA: number[] = [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]; // 0=Brahmin...3=Shudra
function kuta_varna(r1: number, r2: number): number {
  return VARNA[r1] >= VARNA[r2] ? 1 : 0;
}

// Vashya (2 pts): control/attraction
const VASHYA: number[][] = [
  // indexed [female][male] → max 2
  [2,0,1,0,0,0,0,0,0,0,0,0],
  [0,2,0,1,0,1,0,0,0,0,0,0],
  [1,0,2,0,1,0,0,0,0,0,0,0],
  [0,1,0,2,0,0,0,1,0,0,0,0],
  [0,0,1,0,2,0,0,0,1,0,0,0],
  [0,1,0,0,0,2,0,0,0,1,0,0],
  [0,0,0,0,0,0,2,0,0,0,1,0],
  [0,0,0,1,0,0,0,2,0,0,0,1],
  [0,0,0,0,1,0,0,0,2,0,0,0],
  [0,0,0,0,0,1,0,0,0,2,0,0],
  [0,0,0,0,0,0,1,0,0,0,2,0],
  [0,0,0,0,0,0,0,1,0,0,0,2],
];
function kuta_vashya(r1: number, r2: number): number {
  return VASHYA[r1]?.[r2] ?? 0;
}

// Tara (3 pts): birth star compatibility based on counting from one nakshatra to another.
// Auspicious positions (1=Janma, 3=Vipat avoided; 1,3,5,7,9,12 are considered good here
// in this simplified form that omits full 9-tara enumeration).
function kuta_tara(r1: number, r2: number): number {
  const diff = ((r2 - r1 + 12) % 12) + 1;
  const auspicious = [1, 3, 5, 7, 9, 12]; // simplified
  return auspicious.includes(diff) ? 3 : diff % 3 === 0 ? 1 : 0;
}

// Yoni (4 pts): nature/instinct compatibility (grouped by sign)
const YONI_GROUP: number[] = [0,1,2,3,4,5,6,7,8,9,10,11]; // simplified: each sign unique
function kuta_yoni(r1: number, r2: number): number {
  const diff = Math.abs(r1 - r2);
  if (diff === 0) return 4;
  if (diff <= 2) return 3;
  if (diff <= 4) return 2;
  if (diff <= 6) return 1;
  return 0;
}

// Graha Maitri (5 pts): planetary friendship between rashi lords.
// LORD index maps rashi → simplified planet group: 0=Mars, 1=Mercury, 2=Jupiter, 3=Moon/Saturn
const LORD: number[] = [0, 2, 1, 3, 0, 1, 2, 0, 3, 2, 1, 3];
function kuta_graha_maitri(r1: number, r2: number): number {
  const l1 = LORD[r1], l2 = LORD[r2];
  if (l1 === l2) return 5;
  const friends: number[][] = [[0,1,3],[0,2,3],[0,1,2],[1,2,3]];
  if (friends[l1].includes(l2) && friends[l2].includes(l1)) return 4;
  if (friends[l1].includes(l2) || friends[l2].includes(l1)) return 3;
  return 1;
}

// Gana (6 pts): temperament group
const GANA: number[] = [0, 1, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2]; // 0=Deva,1=Manushya,2=Rakshasa
function kuta_gana(r1: number, r2: number): number {
  const g1 = GANA[r1], g2 = GANA[r2];
  if (g1 === g2) return 6;
  if (g1 === 0 && g2 === 1) return 5;
  if (g1 === 1 && g2 === 0) return 5;
  if (g1 === 0 && g2 === 2) return 1;
  return 0;
}

// Bhakoot (7 pts): sign relationship
function kuta_bhakoot(r1: number, r2: number): number {
  const diff = ((r2 - r1 + 12) % 12) + 1;
  const bad = [6, 8, 12];
  return bad.includes(diff) ? 0 : 7;
}

// Nadi (8 pts): energy channel – must be different
const NADI: number[] = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0]; // 0=Adi,1=Madhya,2=Antya
function kuta_nadi(r1: number, r2: number): number {
  return NADI[r1] !== NADI[r2] ? 8 : 0;
}

const STRENGTH_POOL: string[][] = [
  ['Emotional harmony', 'Deep mutual understanding'],
  ['Shared values', 'Spiritual compatibility'],
  ['Strong mental connection', 'Complementary life goals'],
  ['Physical attraction', 'Aligned energies'],
  ['Loyalty and trust', 'Supportive partnership'],
];
const CAUTION_POOL: string[] = [
  'Communication needs conscious effort',
  'Financial perspectives may differ',
  'Temperaments require patience',
  'Ego clashes possible under stress',
  'Career priorities may diverge',
];

export const compatibilityService = {
  /** Calculate Ashtakoot Milan score for two birth dates. */
  calculateCompatibility(
    user1BirthDate: Date,
    user2BirthDate: Date
  ): CompatibilityResult {
    const r1 = rashiIndex(user1BirthDate);
    const r2 = rashiIndex(user2BirthDate);

    const breakdown = {
      varna:        kuta_varna(r1, r2),
      vashya:       kuta_vashya(r1, r2),
      tara:         kuta_tara(r1, r2),
      yoni:         kuta_yoni(r1, r2),
      graha_maitri: kuta_graha_maitri(r1, r2),
      gana:         kuta_gana(r1, r2),
      bhakoot:      kuta_bhakoot(r1, r2),
      nadi:         kuta_nadi(r1, r2),
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

/**
 * Yoga & Dosha Detection — natal chart analysis
 * Pure math — no React Native / Expo imports.
 */

import { norm, GrahaPosition } from './ephemeris';
import { HouseData, assignHouse } from './houses';

// ── Types ────────────────────────────────────────────────────────────────────

export type YogaQuality = 'benefic' | 'malefic' | 'neutral';
export type YogaCategory =
  | 'raja' | 'dhana' | 'pancha_mahapurusha' | 'dosha' | 'other';

export interface DetectedYoga {
  key: string;
  name: string;
  nameHindi: string;
  quality: YogaQuality;
  category: YogaCategory;
  formingCondition: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const KENDRA_HOUSES = [1, 4, 7, 10];

const OWN_EXALTED: Record<string, { own: number[]; exalted: number }> = {
  mars:    { own: [0, 7], exalted: 9 },
  mercury: { own: [2, 5], exalted: 5 },
  jupiter: { own: [8, 11], exalted: 3 },
  venus:   { own: [1, 6], exalted: 11 },
  saturn:  { own: [9, 10], exalted: 6 },
};

const PMP_YOGA_NAMES: Record<string, { name: string; nameHindi: string }> = {
  mars:    { name: 'Ruchaka Yoga', nameHindi: 'रुचक योग' },
  mercury: { name: 'Bhadra Yoga', nameHindi: 'भद्र योग' },
  jupiter: { name: 'Hamsa Yoga', nameHindi: 'हंस योग' },
  venus:   { name: 'Malavya Yoga', nameHindi: 'मालव्य योग' },
  saturn:  { name: 'Shasha Yoga', nameHindi: 'शश योग' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function findGraha(planets: GrahaPosition[], name: string): GrahaPosition | undefined {
  return planets.find((p) => p.graha === name);
}

function grahaRashiIndex(p: GrahaPosition): number {
  return Math.floor(norm(p.siderealLon) / 30);
}

function grahaHouse(p: GrahaPosition, lagnaLon: number): number {
  return assignHouse(p.siderealLon, lagnaLon);
}

// ── Detection ────────────────────────────────────────────────────────────────

export function detectYogas(
  planets: GrahaPosition[],
  houses: HouseData,
  _nakshatraIndex: number
): DetectedYoga[] {
  const yogas: DetectedYoga[] = [];
  const lagnaLon = houses.lagnaLon;

  const moon = findGraha(planets, 'moon');
  const sun = findGraha(planets, 'sun');
  const jupiter = findGraha(planets, 'jupiter');
  const mars = findGraha(planets, 'mars');
  const mercury = findGraha(planets, 'mercury');
  const venus = findGraha(planets, 'venus');
  const saturn = findGraha(planets, 'saturn');
  const rahu = findGraha(planets, 'rahu');
  const ketu = findGraha(planets, 'ketu');

  // Gajakesari Yoga: Jupiter in kendras (1,4,7,10) from Moon
  if (moon && jupiter) {
    const moonRashi = grahaRashiIndex(moon);
    const jupiterRashi = grahaRashiIndex(jupiter);
    const diff = ((jupiterRashi - moonRashi + 12) % 12) + 1;
    if (KENDRA_HOUSES.includes(diff)) {
      yogas.push({
        key: 'gajakesari',
        name: 'Gajakesari Yoga',
        nameHindi: 'गजकेसरी योग',
        quality: 'benefic',
        category: 'raja',
        formingCondition: 'Jupiter in kendra from Moon',
      });
    }
  }

  // Budhaditya Yoga: Sun and Mercury in same sign
  if (sun && mercury) {
    if (grahaRashiIndex(sun) === grahaRashiIndex(mercury)) {
      yogas.push({
        key: 'budhaditya',
        name: 'Budhaditya Yoga',
        nameHindi: 'बुधादित्य योग',
        quality: 'benefic',
        category: 'raja',
        formingCondition: 'Sun and Mercury in same sign',
      });
    }
  }

  // Chandra Mangal Yoga: Moon and Mars in same sign
  if (moon && mars) {
    if (grahaRashiIndex(moon) === grahaRashiIndex(mars)) {
      yogas.push({
        key: 'chandra_mangal',
        name: 'Chandra Mangal Yoga',
        nameHindi: 'चन्द्र मंगल योग',
        quality: 'benefic',
        category: 'dhana',
        formingCondition: 'Moon and Mars in same sign',
      });
    }
  }

  // Pancha Mahapurusha Yogas
  const pmpGrahas = [
    { graha: mars, name: 'mars' },
    { graha: mercury, name: 'mercury' },
    { graha: jupiter, name: 'jupiter' },
    { graha: venus, name: 'venus' },
    { graha: saturn, name: 'saturn' },
  ];

  for (const { graha, name } of pmpGrahas) {
    if (!graha) continue;
    const rashiIdx = grahaRashiIndex(graha);
    const house = grahaHouse(graha, lagnaLon);
    const ref = OWN_EXALTED[name];
    const inOwnOrExalted = ref.own.includes(rashiIdx) || rashiIdx === ref.exalted;
    if (inOwnOrExalted && KENDRA_HOUSES.includes(house)) {
      const yoga = PMP_YOGA_NAMES[name];
      yogas.push({
        key: `pancha_mahapurusha_${name}`,
        name: yoga.name,
        nameHindi: yoga.nameHindi,
        quality: 'benefic',
        category: 'pancha_mahapurusha',
        formingCondition: `${name} in own/exalted sign in kendra house ${house}`,
      });
    }
  }

  // Mangal Dosha: Mars in 1,2,4,7,8,12 from Lagna
  if (mars) {
    const marsH = grahaHouse(mars, lagnaLon);
    if ([1, 2, 4, 7, 8, 12].includes(marsH)) {
      yogas.push({
        key: 'mangal_dosha',
        name: 'Mangal Dosha',
        nameHindi: 'मंगल दोष',
        quality: 'malefic',
        category: 'dosha',
        formingCondition: `Mars in house ${marsH} from Lagna`,
      });
    }
  }

  // Kaal Sarpa Dosha: All 7 non-nodal planets hemmed between Rahu and Ketu
  if (rahu && ketu) {
    const rahuLon = norm(rahu.siderealLon);
    const ketuLon = norm(ketu.siderealLon);
    const nonNodal = planets.filter(
      (p) => p.graha !== 'rahu' && p.graha !== 'ketu'
    );
    const allHemmed = nonNodal.every((p) => {
      const lon = norm(p.siderealLon);
      if (rahuLon < ketuLon) {
        return lon >= rahuLon && lon <= ketuLon;
      } else {
        return lon >= rahuLon || lon <= ketuLon;
      }
    });
    if (allHemmed) {
      yogas.push({
        key: 'kaal_sarpa',
        name: 'Kaal Sarpa Dosha',
        nameHindi: 'काल सर्प दोष',
        quality: 'malefic',
        category: 'dosha',
        formingCondition: 'All 7 planets hemmed between Rahu and Ketu',
      });
    }
  }

  // Kemadrum Dosha: No planet in 2nd or 12th from Moon
  if (moon) {
    const moonRashi = grahaRashiIndex(moon);
    const secondFrom = (moonRashi + 1) % 12;
    const twelfthFrom = (moonRashi + 11) % 12;
    const nonMoon = planets.filter(
      (p) => p.graha !== 'moon' && p.graha !== 'rahu' && p.graha !== 'ketu'
    );
    const hasNeighbor = nonMoon.some((p) => {
      const r = grahaRashiIndex(p);
      return r === secondFrom || r === twelfthFrom;
    });
    if (!hasNeighbor) {
      yogas.push({
        key: 'kemadrum',
        name: 'Kemadrum Dosha',
        nameHindi: 'केमद्रुम दोष',
        quality: 'malefic',
        category: 'dosha',
        formingCondition: 'No planet in 2nd or 12th from Moon',
      });
    }
  }

  // Voshi Yoga: Planet (except Moon) in 12th from Sun
  if (sun) {
    const sunRashi = grahaRashiIndex(sun);
    const twelfthFrom = (sunRashi + 11) % 12;
    const voshiPlanets = planets.filter(
      (p) => p.graha !== 'sun' && p.graha !== 'moon' && p.graha !== 'rahu' && p.graha !== 'ketu'
    );
    if (voshiPlanets.some((p) => grahaRashiIndex(p) === twelfthFrom)) {
      yogas.push({
        key: 'voshi',
        name: 'Voshi Yoga',
        nameHindi: 'वोशी योग',
        quality: 'benefic',
        category: 'other',
        formingCondition: 'Planet in 12th from Sun',
      });
    }
  }

  // Veshi Yoga: Planet (except Moon) in 2nd from Sun
  if (sun) {
    const sunRashi = grahaRashiIndex(sun);
    const secondFrom = (sunRashi + 1) % 12;
    const veshiPlanets = planets.filter(
      (p) => p.graha !== 'sun' && p.graha !== 'moon' && p.graha !== 'rahu' && p.graha !== 'ketu'
    );
    if (veshiPlanets.some((p) => grahaRashiIndex(p) === secondFrom)) {
      yogas.push({
        key: 'veshi',
        name: 'Veshi Yoga',
        nameHindi: 'वेशी योग',
        quality: 'benefic',
        category: 'other',
        formingCondition: 'Planet in 2nd from Sun',
      });
    }
  }

  return yogas;
}

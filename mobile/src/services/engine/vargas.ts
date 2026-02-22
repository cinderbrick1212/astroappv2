/**
 * Varga (Divisional) Charts — D3, D7, D9, D10, D12
 * Pure math — no React Native / Expo imports.
 */

import { norm, GrahaPosition } from './ephemeris';

// ── Types ────────────────────────────────────────────────────────────────────

export interface VargaPosition {
  graha: string;
  siderealLon: number;
  vargaLon: number;
  vargaSign: string;
  vargaSignIndex: number;
  isVargottama?: boolean;
}

export interface VargaChart {
  divisor: number;
  name: string;
  nameHindi: string;
  lagna: VargaPosition;
  planets: VargaPosition[];
}

// ── Constants ────────────────────────────────────────────────────────────────

const RASHI_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const VARGA_INFO: Record<number, { name: string; hindi: string }> = {
  3:  { name: 'Drekkana', hindi: 'द्रेक्काण' },
  7:  { name: 'Saptamsha', hindi: 'सप्तांश' },
  9:  { name: 'Navamsa', hindi: 'नवांश' },
  10: { name: 'Dashamsha', hindi: 'दशांश' },
  12: { name: 'Dwadashamsha', hindi: 'द्वादशांश' },
};

// D9 (Navamsa) starting signs by element
// Fire (Aries=0, Leo=4, Sagittarius=8) → Aries (0)
// Earth (Taurus=1, Virgo=5, Capricorn=9) → Capricorn (9)
// Air (Gemini=2, Libra=6, Aquarius=10) → Libra (6)
// Water (Cancer=3, Scorpio=7, Pisces=11) → Cancer (3)
const NAVAMSA_START: Record<number, number> = {
  0: 0, 4: 0, 8: 0,    // Fire
  1: 9, 5: 9, 9: 9,    // Earth
  2: 6, 6: 6, 10: 6,   // Air
  3: 3, 7: 3, 11: 3,   // Water
};

// ── Functions ────────────────────────────────────────────────────────────────

function computeVargaSignIndex(
  siderealLon: number,
  divisor: number
): number {
  const rashiIndex = Math.floor(norm(siderealLon) / 30);
  const posWithinRashi = norm(siderealLon) % 30;
  const segmentSize = 30 / divisor;
  const segmentIndex = Math.floor(posWithinRashi / segmentSize);

  if (divisor === 9) {
    const startSign = NAVAMSA_START[rashiIndex] ?? 0;
    return (startSign + segmentIndex) % 12;
  }

  // D3, D7, D10, D12: sequential formula
  return (rashiIndex * divisor + segmentIndex) % 12;
}

function toVargaPosition(
  graha: string,
  siderealLon: number,
  divisor: number,
  d1RashiIndex?: number
): VargaPosition {
  const vargaSignIndex = computeVargaSignIndex(siderealLon, divisor);
  const vargaSign = RASHI_NAMES[vargaSignIndex];
  // vargaLon is the beginning of the varga sign
  const vargaLon = vargaSignIndex * 30;

  const result: VargaPosition = {
    graha,
    siderealLon,
    vargaLon,
    vargaSign,
    vargaSignIndex,
  };

  // Vargottama detection (D9 only)
  if (divisor === 9 && d1RashiIndex !== undefined) {
    result.isVargottama = d1RashiIndex === vargaSignIndex;
  }

  return result;
}

/** Calculate a Varga chart for all planets */
export function calculateVarga(
  planets: GrahaPosition[],
  lagnaLon: number,
  divisor: 3 | 7 | 9 | 10 | 12
): VargaChart {
  const info = VARGA_INFO[divisor];
  const lagnaD1Rashi = Math.floor(norm(lagnaLon) / 30);
  const lagna = toVargaPosition('lagna', lagnaLon, divisor, divisor === 9 ? lagnaD1Rashi : undefined);

  const vargaPlanets = planets.map((p) => {
    const d1Rashi = Math.floor(norm(p.siderealLon) / 30);
    return toVargaPosition(p.graha, p.siderealLon, divisor, divisor === 9 ? d1Rashi : undefined);
  });

  return {
    divisor,
    name: info.name,
    nameHindi: info.hindi,
    lagna,
    planets: vargaPlanets,
  };
}

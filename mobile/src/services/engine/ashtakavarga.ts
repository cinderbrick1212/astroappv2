/**
 * Ashtakavarga — 8×12 individual grids and Sarva Ashtakavarga totals
 * Uses simplified contribution tables (initial rework).
 * Pure math — no React Native / Expo imports.
 */

import { norm, GrahaPosition } from './ephemeris';

// ── Types ────────────────────────────────────────────────────────────────────

export interface IndividualAshtakavarga {
  graha: string;
  points: number[];
}

export interface AshtakavargaResult {
  individual: IndividualAshtakavarga[];
  sarva: number[];
  savByHouse: Record<number, number>;
}

// ── Contribution tables ──────────────────────────────────────────────────────
// Simplified: Sun's contribution offsets for each contributor.
// Full Parashari tables should be expanded in a future iteration.

const CONTRIBUTION_OFFSETS: Record<string, number[]> = {
  sun:     [1, 2, 4, 7, 8, 9, 10, 11],
  moon:    [3, 6, 10, 11],
  mars:    [1, 2, 4, 7, 8, 9, 10, 11],
  mercury: [5, 6, 9, 11, 12],
  jupiter: [5, 6, 9, 11],
  venus:   [8, 11, 12],
  saturn:  [1, 2, 4, 7, 8, 9, 10, 11],
  lagna:   [3, 4, 6, 10, 11, 12],
};

// ── Functions ────────────────────────────────────────────────────────────────

/** Calculate full Ashtakavarga grids and SAV totals */
export function calculateAshtakavarga(
  planets: GrahaPosition[],
  lagnaLon: number
): AshtakavargaResult {
  // Build sign index lookup for all contributors
  const signOf: Record<string, number> = {};
  for (const p of planets) {
    if (p.graha === 'rahu' || p.graha === 'ketu') continue;
    signOf[p.graha] = Math.floor(norm(p.siderealLon) / 30);
  }
  signOf['lagna'] = Math.floor(norm(lagnaLon) / 30);

  const contributors = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'lagna'];

  const individual: IndividualAshtakavarga[] = contributors.map((contributor) => {
    const points = new Array(12).fill(0);
    const contributorSign = signOf[contributor];
    if (contributorSign === undefined) return { graha: contributor, points };

    const offsets = CONTRIBUTION_OFFSETS[contributor] ?? [];
    for (const offset of offsets) {
      const signIndex = (contributorSign + offset - 1) % 12;
      points[signIndex] = 1;
    }

    return { graha: contributor, points };
  });

  // SAV: sum all individual points per sign
  const sarva = new Array(12).fill(0);
  for (const row of individual) {
    for (let i = 0; i < 12; i++) {
      sarva[i] += row.points[i];
    }
  }

  // Map by house number (1-indexed)
  const savByHouse: Record<number, number> = {};
  for (let i = 0; i < 12; i++) {
    savByHouse[i + 1] = sarva[i];
  }

  return { individual, sarva, savByHouse };
}

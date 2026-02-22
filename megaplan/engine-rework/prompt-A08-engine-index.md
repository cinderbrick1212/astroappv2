# Prompt A08 — Engine Public API (astrologyEngine.ts)

## Phase
A — Engine Rework

## Task

Rewrite `mobile/src/services/astrologyEngine.ts` as a thin public API facade
that delegates all calculations to the Phase A engine modules while preserving
100% backward compatibility with every existing caller in the codebase.

---

## Context

### Depends on (all Phase A modules must exist first)
- `engine/ephemeris.ts` (A01)
- `engine/houses.ts` (A02)
- `engine/nakshatra.ts` (A03)
- `engine/dasha.ts` (A04)
- `engine/panchang.ts` (A05)
- `engine/ashtakoot.ts` (A06)
- `engine/yogas.ts` (A07)
- `engine/vargas.ts` (A07)
- `engine/ashtakavarga.ts` (A07)

### Current callers to preserve (do not break any of these)

| Caller file | Methods called |
|---|---|
| `services/kundli.ts` | `toJulianDay`, `calcSunLongitude`, `calcMoonLongitude`, `tropicalToVedic`, `calculateChart`, `getZodiacSign`, `getNakshatra`, `getNakshatraIndex`, `getRashiIndex` |
| `services/compatibility.ts` | `toJulianDay`, `tropicalToVedic`, `calcMoonLongitude`, `getRashiIndex`, `getNakshatraIndex` |
| `services/panchang.ts` (old) | `astrologyEngine.getNakshatra`, `calcSunLongitude`, `calcMoonLongitude`, `toJulianDay`, `tropicalToVedic` |
| `services/horoscope.ts` | `getMoonSign` |
| All tool screens (Phase D) | New methods listed below |

---

## File to update: `mobile/src/services/astrologyEngine.ts`

### What to keep (backward-compatible methods)

All existing exports must remain with identical signatures:

```typescript
export { toJulianDay }        from './engine/ephemeris';
export { calcGMST }           from './engine/houses';

// Re-export with old names for backward compatibility
export const calcSunLongitude  = ephemeris.getSunLongitude;
export const calcMoonLongitude = ephemeris.getMoonLongitude;
export const tropicalToVedic   = ephemeris.siderealLongitude;

export interface PlanetPosition { ... }   // keep existing interface
export interface ChartData { ... }        // extend — see below
```

### `ChartData` interface — extend to include all 9 grahas

```typescript
export interface ChartData {
  // Existing fields — unchanged
  ascendant: number;
  lagnaSign: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  houses: number[];
  planets: PlanetPosition[];   // now contains all 9 grahas (was Sun + Moon only)

  // New fields added in A08
  nakshatraPada: number;       // 1–4
  nakshatraIndex: number;      // 0–26
  lagnaSignIndex: number;      // 0–11
  moonLongitude: number;       // sidereal Moon longitude
  sunLongitude: number;        // sidereal Sun longitude
}
```

### `calculateChart()` — update to include all 9 grahas

The method signature stays identical:
```typescript
calculateChart(date: Date, latitude: number, longitude: number, timezone: string): ChartData
```

Internal change: use `ephemeris.getAllGrahaPositions(jd)` to get all 9 grahas,
then `houses.assignHouses(planets, lagnaLon)` to assign house numbers.

### New methods for Phase D tool screens

Add these to the `astrologyEngine` object:

```typescript
// Tool 01 — Janma Kundli (convenience wrapper that accepts a profile object)
calculateKundli(profile: UserProfile): ChartData

// Tool 02 — Kundli Milan (delegates to engine/ashtakoot)
calculateKundliMilan(profileA: UserProfile, profileB: UserProfile): AshtakootResult

// Tool 03 — Vimshottari Dasha
calculateDasha(profile: UserProfile): DashaTimeline

// Tool 04 — Gochar
calculateGochar(profile: UserProfile, date?: Date): GocharResult
getCurrentPositions(): GrahaPosition[]   // live sidereal positions for today

// Tool 05 — Varshaphal
calculateVarshaphal(profile: UserProfile, year?: number): VarshaphalChart

// Tool 06 — Varga Charts
calculateVargaChart(profile: UserProfile, divisor: 3|7|9|10|12): VargaChart

// Tool 07 — Panchang (used by PanchangVishesh, Hora, Tithi tools)
// → panchangService already handles this; expose a convenience wrapper
getPanchangForDate(date: Date, lat: number, lng: number): PanchangData

// Tool 10 — Nakshatra (convenience wrapper returning nakshatra + pada from profile)
getMoonNakshatra(profile: UserProfile): { nakshatraKey: string; nakshatraIndex: number; pada: number }

// Tool 11 — Eclipses
getEclipses(year: number): EclipseEvent[]
getEclipsePersonalImpact(eclipseDeg: number, profile: UserProfile): EclipseImpact[]

// Tool 12 — Ashtakavarga
calculateAshtakavarga(profile: UserProfile): AshtakavargaResult

// Tool 13 — Prashna
calculatePrashna(timestamp: Date, lat: number, lng: number): ChartData

// Tool 14 — (Hora via panchangService — no new engine method needed)

// Tool 15 — Graha Shanti (engine provides affliction detection)
getAfflictedGrahas(profile: UserProfile): AfflictedGraha[]
```

### Supporting types (add to `astrologyEngine.ts`)

```typescript
import type { UserProfile } from '../types';
import type { DashaTimeline } from './engine/dasha';
import type { VargaChart } from './engine/vargas';
import type { AshtakavargaResult } from './engine/ashtakavarga';
import type { GrahaPosition } from './engine/ephemeris';

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
  muntha: string;       // Sign where Muntha falls this year
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
  orb: number;           // degrees, how close to eclipse point
}

export interface AfflictedGraha {
  graha: string;
  reason: string;        // e.g. 'debilitated', 'combust', 'rahu_ketu_conjunction'
  severity: 'high' | 'medium' | 'low';
}
```

---

## Platform compatibility

The facade itself has no React Native / Expo imports. Each engine module is
also pure TypeScript, so the full engine works on Web, iOS, and Android.

---

## Backward compatibility validation checklist

- [ ] `astrologyEngine.toJulianDay` produces the same result as the old function
- [ ] `astrologyEngine.calcSunLongitude` produces the same result (within 0.01°)
- [ ] `astrologyEngine.calcMoonLongitude` produces the same result (within 0.1°)
- [ ] `astrologyEngine.tropicalToVedic` produces the same result (within 0.05°)
- [ ] `astrologyEngine.calculateChart` now returns 9 planets instead of 2
- [ ] `astrologyEngine.calculateKundli(profile)` returns the same `ChartData` as `calculateChart` with profile fields extracted
- [ ] `astrologyEngine.calculateKundliMilan(profileA, profileB)` returns an `AshtakootResult` identical to calling `engine/ashtakoot.calculateAshtakoot` directly
- [ ] `astrologyEngine.getMoonSign` still works unchanged
- [ ] `astrologyEngine.getSunSign` still works unchanged
- [ ] `astrologyEngine.getNakshatra` still works unchanged
- [ ] `kundli.ts`, `compatibility.ts`, `panchang.ts`, `horoscope.ts` all compile without errors
- [ ] `npx tsc --noEmit` passes with zero errors after applying A01–A08 in sequence

# Prompt A01 — Ephemeris Core

## Phase
A — Engine Rework

## Task

Create `mobile/src/services/engine/ephemeris.ts` — the lowest-level astronomical
primitives that every other engine module depends on. This file has no imports
from any other engine module; it is pure mathematics.

---

## Context

### What it replaces

The current `astrologyEngine.ts` calculates only Sun and Moon positions and hard-codes
the Lahiri ayanamsa constant without annual drift correction beyond a linear term.
This module replaces and extends those calculations to cover all 9 Vedic grahas,
a more accurate Lahiri ayanamsa, and well-structured primitives.

### What exists today (current `astrologyEngine.ts` functions to supersede)

| Old function | New location |
|---|---|
| `toJulianDay(date)` | `ephemeris.toJulianDay(date)` |
| `getAyanamsha(jd)` *(private)* | `ephemeris.getLahiriAyanamsa(jd)` |
| `norm(angle)` *(private)* | `ephemeris.norm(angle)` |
| `calcSunLongitude(jd)` | `ephemeris.getSunLongitude(jd)` |
| `calcMoonLongitude(jd)` | `ephemeris.getMoonLongitude(jd)` |
| *(missing)* | `ephemeris.getMarsLongitude(jd)` |
| *(missing)* | `ephemeris.getMercuryLongitude(jd)` |
| *(missing)* | `ephemeris.getJupiterLongitude(jd)` |
| *(missing)* | `ephemeris.getVenusLongitude(jd)` |
| *(missing)* | `ephemeris.getSaturnLongitude(jd)` |
| *(missing)* | `ephemeris.getRahuLongitude(jd)` — mean node |
| *(missing)* | `ephemeris.getKetuLongitude(jd)` — mean node + 180° |
| `tropicalToVedic(lon, jd)` | `ephemeris.siderealLongitude(tropicalLon, jd)` |

---

## File to create: `mobile/src/services/engine/ephemeris.ts`

### Exports required

```
// Types
export interface GrahaPosition {
  graha: string;          // 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' |
                          //  'venus' | 'saturn' | 'rahu' | 'ketu'
  tropicalLon: number;    // degrees 0–360 (tropical)
  siderealLon: number;    // degrees 0–360 (sidereal / Lahiri)
  isRetrograde: boolean;  // true when daily motion is negative
}

// Primitives
export function toJulianDay(date: Date): number
export function norm(angle: number): number
export function getLahiriAyanamsa(jd: number): number

// Individual graha longitudes (tropical)
export function getSunLongitude(jd: number): number
export function getMoonLongitude(jd: number): number
export function getMarsLongitude(jd: number): number
export function getMercuryLongitude(jd: number): number
export function getJupiterLongitude(jd: number): number
export function getVenusLongitude(jd: number): number
export function getSaturnLongitude(jd: number): number
export function getRahuLongitude(jd: number): number   // mean North Node
export function getKetuLongitude(jd: number): number   // mean South Node = Rahu + 180

// Convenience
export function siderealLongitude(tropicalLon: number, jd: number): number
export function getAllGrahaPositions(jd: number): GrahaPosition[]
```

---

## Calculation specs

### `toJulianDay(date)`
Use Meeus "Astronomical Algorithms" Chapter 7. The input `date` is always UTC.

### `getLahiriAyanamsa(jd)`
Use the Lahiri (Chitrapaksha) ayanamsa formula:
- Epoch: J2000.0 (JD 2451545.0)
- Value at J2000.0: **23.85045°**
- Annual precession rate: **0.013956° per Julian year** (50.2°/century)
- This supersedes the old constants `AYANAMSHA_2000 = 23.853` and `AYANAMSHA_RATE = 0.01396`.

### `getSunLongitude(jd)` and `getMoonLongitude(jd)`
Keep the Meeus simplified formulas already in `astrologyEngine.ts` — they are
accurate to within 0.5° which is sufficient for Vedic chart work.

### Outer planets (Mars, Jupiter, Saturn) — mean longitude approximations
Use Meeus Table 32.a mean element series for each planet. The formula structure is:
```
L = L0 + L1 * T  (degrees)
```
where `T = (jd - 2451545.0) / 36525` (Julian centuries from J2000.0).

Mean element constants (from Meeus Ch. 31–32, low-precision series):

| Graha | L0 (°) | L1 (°/century) |
|-------|-------:|--------------:|
| Mars | 355.433 | 19140.299 |
| Jupiter | 34.351 | 3034.906 |
| Saturn | 50.077 | 1222.114 |
| Venus | 181.979 | 58517.816 |
| Mercury | 252.251 | 149472.675 |

These mean longitudes are approximate (error ≤ 2°). For Vedic chart work at
the level of rashi and nakshatra assignment, this is acceptable.

### `getRahuLongitude(jd)` — mean North Node
```
Rahu = 125.0445 - 1934.1362 * T   (degrees, tropical)
```
where `T` is Julian centuries from J2000.0.

### `getKetuLongitude(jd)`
```
Ketu = norm(getRahuLongitude(jd) + 180)
```

### Retrograde detection
A graha is retrograde when its daily motion (longitude at `jd+0.5` minus longitude
at `jd-0.5`) is negative after normalization.

### `siderealLongitude(tropicalLon, jd)`
```
return norm(tropicalLon - getLahiriAyanamsa(jd))
```

### `getAllGrahaPositions(jd)`
Returns a `GrahaPosition[]` of all 9 grahas in this order:
`sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu`

---

## Platform compatibility

This file has **zero imports from React Native, Expo, or any mobile-specific library**.
It must work identically on Web, iOS, and Android.

---

## Validation checklist

- [ ] `toJulianDay(new Date('2000-01-01T12:00:00Z'))` returns `2451545.0` (±0.001)
- [ ] `getLahiriAyanamsa(2451545.0)` returns approximately `23.85` (±0.01)
- [ ] `getSunLongitude` and `getMoonLongitude` match existing `astrologyEngine.ts` to within 0.1° for the same JD
- [ ] `getAllGrahaPositions(jd)` returns exactly 9 entries with keys matching the `GrahaPosition.graha` string type
- [ ] `siderealLongitude` equals old `tropicalToVedic` to within 0.05° (difference due to ayanamsa constant improvement)
- [ ] All longitudes are in range [0, 360)
- [ ] `isRetrograde` is `false` for Sun (never retrograde) and `true` for Rahu (always retrograde in mean motion)
- [ ] File has no React Native or Expo imports — compiles in a plain Node.js environment

# Prompt A02 — Houses & Lagna

## Phase
A — Engine Rework

## Task

Create `mobile/src/services/engine/houses.ts` — the Vedic house system module.
Computes GMST, Local Sidereal Time, the Ascendant (Lagna), and 12 Whole Sign
house cusps. Assigns each graha to its house number.

---

## Context

### Depends on
- `engine/ephemeris.ts` (A01) — `norm`, `getLahiriAyanamsa`, `GrahaPosition`

### What it replaces in the current codebase

| Old function | New location |
|---|---|
| `calcGMST(jd)` *(private in astrologyEngine.ts)* | `houses.calcGMST(jd)` |
| `calcAscendant(jd, lat, lng)` *(private)* | `houses.calcAscendant(jd, lat, lng)` |
| House array in `calculateChart()` | `houses.getWholeSignCusps(lagnaLon)` |
| Planet-to-house assignment in `calculateChart()` | `houses.assignHouse(planetLon, lagnaLon)` |

---

## File to create: `mobile/src/services/engine/houses.ts`

### Imports
```typescript
import { norm, getLahiriAyanamsa, GrahaPosition } from './ephemeris';
```

### Exports required

```typescript
export interface HouseData {
  lagnaLon: number;           // Sidereal Lagna longitude (degrees, 0–360)
  lagnaSign: string;          // Rashi name of Lagna (e.g. "Scorpio")
  lagnaSignIndex: number;     // 0–11 (Aries=0 … Pisces=11)
  cusps: number[];            // 12 sidereal cusp longitudes [house1, house2, … house12]
}

export function calcGMST(jd: number): number
export function calcAscendant(jd: number, latDeg: number, lngDeg: number): number
export function getVedicLagna(jd: number, latDeg: number, lngDeg: number): HouseData
export function assignHouse(planetSiderealLon: number, lagnaLon: number): number
export function assignHouses(planets: GrahaPosition[], lagnaLon: number): GrahaPosition[]
```

---

## Calculation specs

### `calcGMST(jd)`
Greenwich Mean Sidereal Time in degrees.
Use the Meeus Chapter 12 formula:
```
T = (jd - 2451545.0) / 36525
θ0 = 280.46061837
   + 360.98564736629 * (jd - 2451545.0)
   + 0.000387933 * T²
   - T³ / 38710000
return norm(θ0)
```

### `calcAscendant(jd, latDeg, lngDeg)`
Tropical Ascendant via Local Sidereal Time:
```
obliquity ε = 23.4393 - 0.013 * T   (degrees)
LST = norm(GMST + lngDeg)            (degrees)
lstRad = LST * π/180
latRad = latDeg * π/180
y = cos(lstRad)
x = -(sin(lstRad) * cos(ε) + tan(latRad) * sin(ε))
asc = atan2(y, x) * 180/π
return norm(asc)
```

### `getVedicLagna(jd, latDeg, lngDeg)`
1. Call `calcAscendant(jd, latDeg, lngDeg)` → tropical Lagna
2. Call `siderealLongitude(tropicalLagna, jd)` → sidereal Lagna
3. Derive `lagnaSignIndex = Math.floor(siderealLagna / 30) % 12`
4. Derive `lagnaSign` from `RASHI_NAMES[lagnaSignIndex]`
5. Build `cusps`: Whole Sign — each cusp is `norm(lagnaSignIndex * 30 + i * 30)` for i=0…11

```
RASHI_NAMES = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]
```

### `assignHouse(planetSiderealLon, lagnaLon)`
Whole Sign system:
```
offset = norm(planetSiderealLon - (Math.floor(lagnaLon / 30) * 30))
return Math.floor(offset / 30) + 1   // 1–12
```

### `assignHouses(planets, lagnaLon)`
Return the same array with each `GrahaPosition` extended by a `house: number` field.
(Extend `GrahaPosition` interface in `ephemeris.ts` or use intersection type here.)

---

## Platform compatibility

No React Native / Expo imports. Works identically on Web, iOS, Android.

---

## Validation checklist

- [ ] `calcGMST(2451545.0)` (J2000.0) ≈ 280.46° (±0.01)
- [ ] `getVedicLagna` returns `cusps` array of length 12
- [ ] Whole Sign: `cusps[0]` equals `lagnaSignIndex * 30` (i.e. start of Lagna sign)
- [ ] `assignHouse` returns a value in range 1–12 for any valid planet longitude
- [ ] Lagna and planet houses sum consistently: Moon in same sign as Lagna → house 1
- [ ] TypeScript compiles without errors after import from `./ephemeris`

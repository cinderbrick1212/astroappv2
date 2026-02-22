# Prompt A07 — Yogas, Varga Charts & Ashtakavarga

## Phase
A — Engine Rework

## Task

Create three new files in `mobile/src/services/engine/`:
1. `yogas.ts` — Yoga and Dosha detection from a natal chart
2. `vargas.ts` — Divisional chart computation (D9, D10, D12, D3, D7)
3. `ashtakavarga.ts` — Full 8×12 individual grids and Sarva Ashtakavarga totals

All three are new capabilities with no equivalent in the current codebase.

---

## Context

### Depends on
- `engine/ephemeris.ts` (A01) — `norm`, `GrahaPosition`
- `engine/houses.ts` (A02) — `HouseData`, `assignHouse`
- `engine/nakshatra.ts` (A03) — `getNakshatraIndex`

---

## File 1: `mobile/src/services/engine/yogas.ts`

### Exports required

```typescript
export type YogaQuality = 'benefic' | 'malefic' | 'neutral';
export type YogaCategory =
  | 'raja' | 'dhana' | 'pancha_mahapurusha' | 'dosha' | 'other';

export interface DetectedYoga {
  key: string;           // unique identifier, e.g. 'gajakesari'
  name: string;          // English name
  nameHindi: string;
  quality: YogaQuality;
  category: YogaCategory;
  formingCondition: string;  // human-readable condition that was met
}

export function detectYogas(
  planets: GrahaPosition[],
  houses: HouseData,
  nakshatraIndex: number
): DetectedYoga[]
```

### Yogas to detect (minimum set)

| Key | Name | Condition |
|-----|------|-----------|
| `gajakesari` | Gajakesari Yoga | Jupiter in kendras (1,4,7,10) from Moon |
| `budhaditya` | Budhaditya Yoga | Sun and Mercury in same sign |
| `chandra_mangal` | Chandra Mangal Yoga | Moon and Mars in same sign |
| `pancha_mahapurusha_mars` | Ruchaka Yoga | Mars in own/exalted sign in kendra |
| `pancha_mahapurusha_mercury` | Bhadra Yoga | Mercury in own/exalted sign in kendra |
| `pancha_mahapurusha_jupiter` | Hamsa Yoga | Jupiter in own/exalted sign in kendra |
| `pancha_mahapurusha_venus` | Malavya Yoga | Venus in own/exalted sign in kendra |
| `pancha_mahapurusha_saturn` | Shasha Yoga | Saturn in own/exalted sign in kendra |
| `mangal_dosha` | Mangal Dosha | Mars in 1,2,4,7,8,12 from Lagna |
| `kaal_sarpa` | Kaal Sarpa Dosha | All 7 grahas hemmed between Rahu and Ketu |
| `kemadrum` | Kemadrum Dosha | No planet in 2nd or 12th from Moon |
| `voshi` | Voshi Yoga | Planet (except Moon) in 12th from Sun |
| `veshi` | Veshi Yoga | Planet (except Moon) in 2nd from Sun |

Kendra houses for Pancha Mahapurusha = houses 1, 4, 7, 10 from Lagna.

Own/exalted sign reference:
```
{ mars: {own:[0,7], exalted:9}, mercury: {own:[2,5], exalted:5},
  jupiter: {own:[8,11], exalted:3}, venus: {own:[1,6], exalted:11},
  saturn: {own:[9,10], exalted:6} }
```
(using rashi index 0–11)

---

## File 2: `mobile/src/services/engine/vargas.ts`

### Exports required

```typescript
export interface VargaPosition {
  graha: string;
  siderealLon: number;       // original
  vargaLon: number;          // longitude within the divisional chart
  vargaSign: string;         // rashi name in this Varga
  vargaSignIndex: number;    // 0–11
  isVargottama?: boolean;    // same sign in D1 and D9 (only valid for D9)
}

export interface VargaChart {
  divisor: number;           // 9 for D9, 10 for D10, etc.
  name: string;              // 'Navamsa' | 'Dashamsha' | 'Dwadashamsha' | 'Drekkana' | 'Saptamsha'
  nameHindi: string;
  lagna: VargaPosition;
  planets: VargaPosition[];
}

export function calculateVarga(
  planets: GrahaPosition[],
  lagnaLon: number,
  divisor: 3 | 7 | 9 | 10 | 12
): VargaChart
```

### Varga longitude formula
For any sidereal longitude `lon` and divisor `n`:
```
rashiIndex = Math.floor(lon / 30)
posWithinRashi = lon % 30
segmentSize = 30 / n
segmentIndex = Math.floor(posWithinRashi / segmentSize)
```

**D9 (Navamsa)** uses a traditional starting-sign table per element:
- Fire rashis (Aries, Leo, Sagittarius): Navamsa starts from Aries
- Earth rashis (Taurus, Virgo, Capricorn): Navamsa starts from Capricorn
- Air rashis (Gemini, Libra, Aquarius): Navamsa starts from Libra
- Water rashis (Cancer, Scorpio, Pisces): Navamsa starts from Cancer

```
vargaSignIndex = (startSignForElement + segmentIndex) % 12
```

**Vargottama** (D9 only): a planet is Vargottama when its D1 rashi index
equals its D9 vargaSignIndex.

**D10, D12, D3, D7** use the simpler sequential formula:
```
vargaSignIndex = (rashiIndex * n + segmentIndex) % 12
```

### Varga name table
```
{ 3: {name:'Drekkana', hindi:'द्रेक्काण'},
  7: {name:'Saptamsha', hindi:'सप्तांश'},
  9: {name:'Navamsa', hindi:'नवांश'},
  10: {name:'Dashamsha', hindi:'दशांश'},
  12: {name:'Dwadashamsha', hindi:'द्वादशांश'} }
```

---

## File 3: `mobile/src/services/engine/ashtakavarga.ts`

### Exports required

```typescript
export interface IndividualAshtakavarga {
  graha: string;           // contributing planet ('sun'|'moon'|…|'lagna')
  points: number[];        // 12 values (0 or 1) for signs 1–12
}

export interface AshtakavargaResult {
  individual: IndividualAshtakavarga[];   // 8 rows (7 planets + lagna)
  sarva: number[];                        // 12 totals (sum of all 8 rows per sign), range 0–8 with simplified tables; 0–56 with full Parashari tables
  savByHouse: Record<number, number>;     // house number (1–12) → SAV score
}

export function calculateAshtakavarga(
  planets: GrahaPosition[],
  lagnaLon: number
): AshtakavargaResult
```

### Calculation approach

Ashtakavarga uses traditional contribution tables for each of the 8 contributors
(Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna) — each contributes a
benefic point (1) or nothing (0) to specific signs relative to its own position.

The traditional contribution tables per graha are large (8 × 12 relative position
offsets). Use the classical Parashari Ashtakavarga tables:

**Sun's contribution points** (relative sign offsets from Sun's position that get
a benefic point):
```
Sun: [1,2,4,7,8,9,10,11]   (sign offsets 1-based relative to Sun)
Moon: [3,6,10,11]
Mars: [1,2,4,7,8,9,10,11]
Mercury: [5,6,9,11,12]
Jupiter: [5,6,9,11]
Venus: [8,11,12]
Saturn: [1,2,4,7,8,9,10,11]
Lagna: [3,4,6,10,11,12]
```

(Full Parashari tables have different offset lists per contributing planet per
graha. For the initial rework, use the simplified version above and note in
comments that the full tables should be expanded in a future iteration.)

For each contributor, set `points[signIndex] = 1` for each offset in its list
(where `signIndex = (contributorSignIndex + offset - 1) % 12`).

SAV totals: `sarva[i] = sum of individual[*].points[i]` for all 8 contributors.

---

## Platform compatibility

No React Native / Expo imports. Works identically on Web, iOS, Android.

---

## Validation checklist

### yogas.ts
- [ ] `detectYogas` returns `DetectedYoga[]` (may be empty — never throws)
- [ ] Gajakesari Yoga detected when Jupiter is in house 1, 4, 7, or 10 from Moon
- [ ] Kaal Sarpa Dosha detected only when ALL 7 non-nodal planets are between Rahu and Ketu
- [ ] All returned keys are unique within a single call

### vargas.ts
- [ ] `calculateVarga` returns a `VargaChart` for each of divisors 3, 7, 9, 10, 12
- [ ] D9 Vargottama flag: a planet at 0° Aries (rashi 0, segment 0) → D9 also Aries → `isVargottama: true`
- [ ] All `vargaSignIndex` values are in range 0–11

### ashtakavarga.ts
- [ ] `individual` array has exactly 8 entries
- [ ] Each `individual.points` array has exactly 12 values, all 0 or 1
- [ ] `sarva` array has exactly 12 values, each in range 0–8 (simplified tables) — expand to full Parashari tables before running D12 to achieve the traditional 0–56 range
- [ ] Sum of all `sarva` values = sum of all individual points (cross-check)

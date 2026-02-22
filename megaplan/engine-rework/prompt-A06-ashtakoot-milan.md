# Prompt A06 — Ashtakoot Milan & Mangal Dosha

## Phase
A — Engine Rework

## Task

Create `mobile/src/services/engine/ashtakoot.ts` — extract and improve the
Ashtakoot Guna Milan algorithm from the existing `compatibility.ts`, add
Mangal Dosha detection, and expose a clean typed API.

---

## Context

### Depends on
- `engine/ephemeris.ts` (A01) — `norm`
- `engine/nakshatra.ts` (A03) — `getNakshatraIndex`

### What it replaces

The existing `compatibility.ts` contains all 8 Koot functions but they are not
exported individually, the metadata tables are private, and there is no Mangal
Dosha check. This module extracts and re-exports everything cleanly.

---

## File to create: `mobile/src/services/engine/ashtakoot.ts`

### Exports required

```typescript
export interface KootScore {
  koot: string;           // 'varna' | 'vashya' | 'tara' | 'yoni' |
                          //  'graha_maitri' | 'gana' | 'bhakoot' | 'nadi'
  kootHindi: string;
  scored: number;
  max: number;
}

export interface MangalDoshaResult {
  hasDosha: boolean;
  affectedHouses: number[];   // Which houses Mars occupies that trigger the dosha
  severity: 'full' | 'partial' | 'none';
  cancellation: boolean;      // Whether a standard cancellation condition applies
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

// Individual Koot functions (all exported so tests can verify them independently)
export function calcVarna(boyRashiIdx: number, girlRashiIdx: number): number
export function calcVashya(boyRashiIdx: number, girlRashiIdx: number): number
export function calcTara(boyNakIdx: number, girlNakIdx: number): number
export function calcYoni(boyNakIdx: number, girlNakIdx: number): number
export function calcGrahaMaitri(boyRashiIdx: number, girlRashiIdx: number): number
export function calcGana(boyNakIdx: number, girlNakIdx: number): number
export function calcBhakoot(boyRashiIdx: number, girlRashiIdx: number): number
export function calcNadi(boyNakIdx: number, girlNakIdx: number): number

// Mangal Dosha
export function calcMangalDosha(marsHouse: number, lagnaRashiIdx: number): MangalDoshaResult

// Full Milan
export function calculateAshtakoot(
  moonLonA: number,   // Person A Moon sidereal longitude
  moonLonB: number,   // Person B Moon sidereal longitude
  marsHouseA: number, // Person A Mars house (1–12); pass 0 if Mars not calculated
  marsHouseB: number,
  lagnaIdxA: number,  // Person A lagna rashi index
  lagnaIdxB: number
): AshtakootResult
```

---

## Data tables

All 8 koot tables come from the existing `compatibility.ts`. Copy them verbatim:

- `NAKSHATRA_LORDS` — 27 entries
- `NAKSHATRA_GANA` — 27 entries (0=Deva, 1=Manushya, 2=Rakshasa)
- `NAKSHATRA_NADI` — 27 entries (0=Aadi, 1=Madhya, 2=Antya)
- `NAKSHATRA_YONI` — 27 entries (14 animal pairs)
- `YONI_COMPAT` — 14×14 matrix
- `RASHI_VARNA` — 12 entries
- `RASHI_VASHYA` — 12 entries
- `RASHI_LORDS` — 12 entries
- `PLANET_FRIEND` — friendship table

### Koot name lookup

```typescript
const KOOT_HINDI: Record<string, string> = {
  varna: 'वर्ण', vashya: 'वश्य', tara: 'तारा', yoni: 'योनि',
  graha_maitri: 'ग्रह मैत्री', gana: 'गण', bhakoot: 'भकूट', nadi: 'नाड़ी'
}
```

### Verdict thresholds (consistent with `megaplan/tool-rework/prompt-D02-kundli-milan.md`)

| Score | Verdict | Hindi |
|-------|---------|-------|
| ≥ 28 | excellent | उत्तम |
| 21–27 | good | शुभ |
| 18–20 | acceptable | सामान्य |
| < 18 | inauspicious | अशुभ |

---

## Mangal Dosha

### Houses that trigger Mangal Dosha
Mars in houses: **1, 2, 4, 7, 8, 12** from Lagna.

```typescript
const MANGAL_DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];
```

### Severity
- `'full'`: Mars in 1st, 7th, or 8th house
- `'partial'`: Mars in 2nd, 4th, or 12th house
- `'none'`: Mars not in any dosha house

### Standard cancellation conditions (checked via `lagnaRashiIdx`)
Mangal Dosha is cancelled when Lagna is Aries (0), Scorpio (7), or Capricorn (9)
(Mars-ruled or Mars-exalted Lagnas reduce the dosha).

---

## Backward compatibility

The existing `compatibilityService.calculateCompatibility(date1, date2)` in
`compatibility.ts` must continue to work. After this prompt is applied, update
`compatibility.ts` to delegate its internal koot functions to this module:
```typescript
import { calculateAshtakoot } from './engine/ashtakoot';
```
The public interface of `compatibilityService` must not change.

---

## Platform compatibility

No React Native / Expo imports. Works identically on Web, iOS, Android.

---

## Validation checklist

- [ ] All 8 Koot functions produce the same scores as the existing `compatibility.ts` for the same inputs
- [ ] `calcNadi` returns 0 when both nakshatras are in the same Nadi, 8 otherwise
- [ ] `calcBhakoot` returns 0 for the inauspicious 6–8, 5–9, 12–2 intervals
- [ ] `calculateAshtakoot` total score equals the sum of all 8 koot scores
- [ ] `MangalDoshaResult.hasDosha` is `true` when Mars is in house 1 and `false` when Mars is in house 3
- [ ] Verdict threshold boundaries: score 18 → `'acceptable'`, score 27 → `'good'`, score 28 → `'excellent'`
- [ ] `compatibilityService.calculateCompatibility` still works after the delegation change

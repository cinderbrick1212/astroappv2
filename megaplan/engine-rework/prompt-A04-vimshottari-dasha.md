# Prompt A04 — Vimshottari Dasha

## Phase
A — Engine Rework

## Task

Create `mobile/src/services/engine/dasha.ts` — the complete Vimshottari Dasha
calculator. Produces the full 120-year sequence of Mahadashas with exact dates,
nested Antardashas, and the Pratyantardasha level for the current period.

---

## Context

### Depends on
- `engine/ephemeris.ts` (A01) — `norm`
- `engine/nakshatra.ts` (A03) — `NAKSHATRA_LORDS`, `getNakshatraIndex`, `getNakshatraStartDeg`

### What it replaces

| Old location | New location |
|---|---|
| `getCurrentDasha()` in `kundli.ts` | `dasha.buildDashaSequence()` + `dasha.getCurrentMahadasha()` |
| `DASHA_YEARS` in `kundli.ts` | `dasha.DASHA_YEARS` (exported) |
| `NAKSHATRA_LORDS_CYCLE` in `kundli.ts` | `nakshatra.NAKSHATRA_LORDS` (A03) |

The old implementation only returns the current Mahadasha lord and its end year.
This module returns the complete timeline with exact start/end dates.

---

## File to create: `mobile/src/services/engine/dasha.ts`

### Exports required

```typescript
export const DASHA_YEARS: Record<string, number>   // 9 lords → years

export interface DashaPeriod {
  lord: string;           // e.g. 'Venus'
  lordHindi: string;      // e.g. 'शुक्र'
  durationYears: number;  // total years this Mahadasha lasts
  startDate: Date;        // exact calendar start date
  endDate: Date;          // exact calendar end date
  isCurrent: boolean;     // true if today falls within this period
}

export interface AntardashaPeriod {
  mahaLord: string;
  antarLord: string;
  antarLordHindi: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface PratyantarPeriod {
  mahaLord: string;
  antarLord: string;
  pratyantarLord: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface DashaTimeline {
  sequence: DashaPeriod[];            // All 9 Mahadashas in chronological order
  currentMahadasha: DashaPeriod;
  currentAntardasha: AntardashaPeriod;
  currentPratyantardasha: PratyantarPeriod;
  antardashas: AntardashaPeriod[];    // All Antardashas within current Mahadasha
  pratyantars: PratyantarPeriod[];    // All Pratyantars within current Antardasha
}

export function buildDashaSequence(
  birthDate: Date,
  moonSiderealLon: number
): DashaPeriod[]

export function getDashaTimeline(
  birthDate: Date,
  moonSiderealLon: number,
  referenceDate?: Date   // defaults to today
): DashaTimeline
```

---

## Calculation specs

### `DASHA_YEARS`
```typescript
{
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
}
```

### `DASHA_LORDS_HINDI`
```typescript
{
  Ketu: 'केतु', Venus: 'शुक्र', Sun: 'सूर्य', Moon: 'चंद्र',
  Mars: 'मंगल', Rahu: 'राहु', Jupiter: 'बृहस्पति',
  Saturn: 'शनि', Mercury: 'बुध'
}
```

### Starting Dasha balance calculation
The fraction of the first Dasha already elapsed at birth is determined by
how far the Moon has traveled through its birth nakshatra:

```
nakIndex = getNakshatraIndex(moonSiderealLon)
startDeg = getNakshatraStartDeg(nakIndex)
endDeg   = startDeg + 13.3333
degreeWithin = norm(moonSiderealLon) - startDeg
fractionElapsed = degreeWithin / 13.3333   // 0.0 – 1.0

lordIndex = nakIndex % 9                   // index into 9-lord cycle
firstLord = NAKSHATRA_LORDS[lordIndex]
firstDuration = DASHA_YEARS[firstLord]
remainingYears = firstDuration * (1 - fractionElapsed)
```

The first `DashaPeriod` starts at `birthDate` and ends at
`birthDate + remainingYears`.

### Building the sequence
After the first (partial) Dasha, the remaining 8 Dashas follow in the
9-lord cycle order starting from `(lordIndex + 1) % 9`, each for their
full `DASHA_YEARS` duration. The sequence wraps around — after Mercury
comes Ketu again. A full 120-year cycle covers all 9 lords.

### Antardasha calculation
Each Mahadasha of `M` years is divided into 9 Antardashas.
Antardasha for sub-lord `S` within Mahadasha of lord `M`:
```
antarDuration = (DASHA_YEARS[S] / 120) * DASHA_YEARS[M]  years
```
The Antardasha sub-period order starts with `M` itself and follows the
9-lord cycle: `[M, next, next+1, …]` for 9 lords.

### Pratyantardasha calculation
Same proportional formula applied one level deeper:
```
pratyantarDuration = (DASHA_YEARS[P] / 120) * antarDuration  years
```

### Date precision
Use `Date` objects; represent fractional years as milliseconds:
```
MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000
endDate = new Date(startDate.getTime() + durationYears * MS_PER_YEAR)
```

---

## Platform compatibility

No React Native / Expo imports. Works identically on Web, iOS, Android.

---

## Validation checklist

- [ ] `buildDashaSequence` returns exactly 9 `DashaPeriod` entries
- [ ] Sum of all `durationYears` in the sequence equals 120 years (± floating point)
- [ ] `sequence[0].startDate` equals `birthDate`
- [ ] `sequence[8].endDate` ≈ `birthDate + 120 years`
- [ ] `currentMahadasha.isCurrent` is `true` and all others are `false`
- [ ] All Antardasha durations within a Mahadasha sum to exactly the Mahadasha duration
- [ ] `getDashaTimeline` with a test birth date (1990-01-15, Moon in Rohini) returns Moon Mahadasha as the starting lord
- [ ] `currentAntardasha` and `currentPratyantardasha` both have `isCurrent === true`

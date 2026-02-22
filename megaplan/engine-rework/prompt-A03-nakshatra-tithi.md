# Prompt A03 — Nakshatra, Tithi & Panchang Yoga

## Phase
A — Engine Rework

## Task

Create `mobile/src/services/engine/nakshatra.ts` — all Nakshatra computations,
Pada derivation, Tithi calculation, Panchang Yoga, and Karana.

---

## Context

### Depends on
- `engine/ephemeris.ts` (A01) — `norm`

### What it replaces / extends

| Old location | New location |
|---|---|
| `NAKSHATRA_NAMES` array in `astrologyEngine.ts` | `nakshatra.NAKSHATRA_NAMES` (exported) |
| `getNakshatra(moonLon)` in `astrologyEngine.ts` | `nakshatra.getNakshatraName(moonLon)` |
| `getNakshatraIndex(moonLon)` | `nakshatra.getNakshatraIndex(moonLon)` |
| Tithi calc in `panchangService` | `nakshatra.getTithiIndex(sunSid, moonSid)` |
| Yoga calc in `panchangService` | `nakshatra.getPanchangYogaIndex(sunSid, moonSid)` |
| Karana calc in `panchangService` | `nakshatra.getKaranaIndex(sunSid, moonSid)` |
| *(missing)* | `nakshatra.getNakshatraPada(moonLon)` |
| *(missing)* | `nakshatra.getNakshatraStartDeg(index)` |

---

## File to create: `mobile/src/services/engine/nakshatra.ts`

### Exports required

```typescript
export const NAKSHATRA_NAMES: string[]   // 27 names (index 0 = Ashwini)
export const TITHI_NAMES: string[]       // 30 names
export const PANCHANG_YOGA_NAMES: string[] // 27 names
export const KARANA_NAMES: string[]      // 11 names

export interface NakshatraResult {
  index: number;        // 0–26
  name: string;
  nameHindi: string;
  pada: number;         // 1–4
  ruler: string;        // Dasha lord planet name
  startDeg: number;     // sidereal degree where this nakshatra starts (0–360)
  endDeg: number;
  degreeWithin: number; // Moon's degree within the nakshatra (0–13.333)
}

export function getNakshatraIndex(moonSiderealLon: number): number
export function getNakshatraName(moonSiderealLon: number): string
export function getNakshatraPada(moonSiderealLon: number): number
export function getNakshatraResult(moonSiderealLon: number): NakshatraResult
export function getNakshatraStartDeg(index: number): number
export function getTithiIndex(sunSiderealLon: number, moonSiderealLon: number): number
export function getTithiName(sunSiderealLon: number, moonSiderealLon: number): string
export function getPanchangYogaIndex(sunSiderealLon: number, moonSiderealLon: number): number
export function getPanchangYogaName(sunSiderealLon: number, moonSiderealLon: number): string
export function getKaranaIndex(sunSiderealLon: number, moonSiderealLon: number): number
export function getKaranaName(sunSiderealLon: number, moonSiderealLon: number): string
```

---

## Data tables

### `NAKSHATRA_NAMES` (27 entries in order)
```
Ashwini, Bharani, Krittika, Rohini, Mrigashira, Ardra,
Punarvasu, Pushya, Ashlesha, Magha, Purva Phalguni, Uttara Phalguni,
Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshtha,
Mula, Purva Ashadha, Uttara Ashadha, Shravana, Dhanishtha,
Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, Revati
```

### `NAKSHATRA_NAMES_HINDI` (27 entries — parallel array)
```
अश्विनी, भरणी, कृत्तिका, रोहिणी, मृगशिरा, आर्द्रा,
पुनर्वसु, पुष्य, आश्लेषा, मघा, पूर्व फाल्गुनी, उत्तर फाल्गुनी,
हस्त, चित्रा, स्वाति, विशाखा, अनुराधा, ज्येष्ठा,
मूल, पूर्व आषाढ़ा, उत्तर आषाढ़ा, श्रवण, धनिष्ठा,
शतभिषा, पूर्व भाद्रपद, उत्तर भाद्रपद, रेवती
```

### Nakshatra dasha lords (9-lord cycle repeated 3×, index 0 = Ashwini → Ketu)
```
NAKSHATRA_LORDS = [
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'
]
```

### `TITHI_NAMES` (30 entries)
Tithis 1–15: Shukla Paksha (Pratipada through Purnima)
Tithis 16–30: Krishna Paksha (Pratipada(K) through Amavasya)
Use the exact names from the existing `panchangService.ts` `TITHI_NAMES` array.

### `PANCHANG_YOGA_NAMES` (27 entries)
Use the exact names from the existing `panchangService.ts` `YOGA_NAMES` array.

### `KARANA_NAMES` (11 entries)
Use the exact names from the existing `panchangService.ts` `KARANA_NAMES` array.

---

## Calculation specs

### Nakshatra index
```
index = Math.floor(norm(moonSiderealLon) * 27 / 360) % 27
```

### Pada (quarter)
Each nakshatra spans 13°20' (= 800'). Each pada = 3°20' (= 200').
```
degreeWithin = norm(moonSiderealLon) - getNakshatraStartDeg(index)
pada = Math.floor(degreeWithin / (13.333 / 4)) + 1   // 1–4
```

### Nakshatra start degree
```
startDeg = index * (360 / 27)   // = index * 13.3333...
```

### Tithi index
```
moonSunDiff = norm(moonSiderealLon - sunSiderealLon)
tithiIndex = Math.floor(moonSunDiff / 12) % 30
```

### Panchang Yoga index
```
yogaIndex = Math.floor(norm(sunSiderealLon + moonSiderealLon) / (360 / 27)) % 27
```

### Karana index
```
karanaIndex = Math.floor(norm(moonSiderealLon - sunSiderealLon) / 6) % 11
```

---

## Platform compatibility

No React Native / Expo imports. Works identically on Web, iOS, Android.

---

## Validation checklist

- [ ] `getNakshatraIndex` matches existing `astrologyEngine.getNakshatraIndex` for the same Moon longitude
- [ ] `getNakshatraPada` returns 1–4 for any valid Moon longitude
- [ ] `NAKSHATRA_LORDS[0]` = `'Ketu'` (Ashwini) and `NAKSHATRA_LORDS[3]` = `'Moon'` (Rohini)
- [ ] `getTithiIndex` matches the existing `panchangService` tithi calculation for the same sun/moon longitudes
- [ ] `TITHI_NAMES.length` === 30
- [ ] `PANCHANG_YOGA_NAMES.length` === 27
- [ ] `KARANA_NAMES.length` === 11
- [ ] `getNakshatraStartDeg(0)` === 0, `getNakshatraStartDeg(26)` ≈ 346.67

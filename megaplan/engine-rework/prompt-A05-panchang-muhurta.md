# Prompt A05 — Panchang & Muhurta

## Phase
A — Engine Rework

## Task

Create `mobile/src/services/engine/panchang.ts` — accurate sunrise/sunset,
inauspicious period timings (Rahu Kaal, Gulika Kaal, Yamghant), the full
24-Hora Vedic planetary hour schedule, Abhijit Muhurta, and a basic
Muhurta quality scorer.

---

## Context

### Depends on
- `engine/ephemeris.ts` (A01) — `norm`, `getLahiriAyanamsa`
- `engine/nakshatra.ts` (A03) — `getTithiIndex`, `getNakshatraIndex`

### What it replaces / extends

| Old location | New location |
|---|---|
| `calcSunriseSunset(jd, lat)` in `panchangService.ts` | `panchang.getSunriseSunset(jd, latDeg)` |
| `RAHU_KAAL_SLOTS` + Rahu Kaal calc | `panchang.getRahuKaal(date, sunriseMin, sunsetMin)` |
| *(missing)* | `panchang.getGulikaKaal(date, sunriseMin, sunsetMin)` |
| *(missing)* | `panchang.getYamghant(date, sunriseMin, sunsetMin)` |
| *(missing)* | `panchang.getHoraSchedule(date, sunriseMin, sunsetMin)` |
| *(missing)* | `panchang.getAbhijitMuhurta(sunriseMin, sunsetMin)` |
| *(missing)* | `panchang.scoreMuhurta(date, tithiIndex, nakshatraIndex, activity)` |

---

## File to create: `mobile/src/services/engine/panchang.ts`

### Exports required

```typescript
export interface SunriseSunset {
  sunriseMin: number;    // minutes past midnight (local)
  sunsetMin: number;
  sunriseFmt: string;    // "6:12 AM"
  sunsetFmt: string;
  dayLengthMin: number;
}

export interface TimeWindow {
  startMin: number;
  endMin: number;
  startFmt: string;
  endFmt: string;
}

export interface HoraSlot {
  slotNumber: number;    // 1–24
  lord: string;          // planet name
  lordHindi: string;
  startMin: number;
  endMin: number;
  startFmt: string;
  endFmt: string;
  isDaytime: boolean;
}

export type MuhurtaActivity =
  | 'marriage' | 'business' | 'property' | 'travel'
  | 'surgery' | 'naming' | 'education' | 'job';

export interface MuhurtaScore {
  activity: MuhurtaActivity;
  score: number;           // 0–10
  quality: 'excellent' | 'good' | 'acceptable' | 'avoid';
  reasons: string[];       // Why this score (which elements qualify/disqualify)
}

export function getSunriseSunset(jd: number, latDeg: number): SunriseSunset
export function formatMinutes(minutesPastMidnight: number): string
export function getRahuKaal(date: Date, sunrise: SunriseSunset): TimeWindow
export function getGulikaKaal(date: Date, sunrise: SunriseSunset): TimeWindow
export function getYamghant(date: Date, sunrise: SunriseSunset): TimeWindow
export function getAbhijitMuhurta(sunrise: SunriseSunset): TimeWindow
export function getHoraSchedule(date: Date, sunrise: SunriseSunset): HoraSlot[]
export function scoreMuhurta(
  date: Date,
  tithiIndex: number,
  nakshatraIndex: number,
  activity: MuhurtaActivity
): MuhurtaScore
```

---

## Calculation specs

### `getSunriseSunset(jd, latDeg)`
Use the same hour-angle formula as the existing `panchangService.ts`:
```
T = (jd - 2451545.0) / 36525
sunLon = (280.46646 + 36000.76983 * T) * π/180
obliquity = (23.439 - 0.00013 * T) * π/180
declination = asin(sin(obliquity) * sin(sunLon))
latRad = latDeg * π/180
cosH = -tan(latRad) * tan(declination)
H_deg = acos(cosH) * 180/π
halfDayMin = (H_deg / 15) * 60
sunriseMin = round(720 - halfDayMin)
sunsetMin  = round(720 + halfDayMin)
```

### Inauspicious period slot indices (by weekday, 0=Sunday)

| Period | Sun | Mon | Tue | Wed | Thu | Fri | Sat |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Rahu Kaal | 8 | 2 | 7 | 5 | 6 | 4 | 3 |
| Gulika Kaal | 6 | 5 | 4 | 3 | 2 | 1 | 7 |
| Yamghant | 4 | 8 | 6 | 7 | 5 | 3 | 1 |

Each slot is `dayLengthMin / 8` wide. Slot n starts at
`sunriseMin + (slot - 1) * (dayLengthMin / 8)`.

### `getAbhijitMuhurta(sunrise)`
The Abhijit Muhurta is the middle 48 minutes of the day:
```
midday = (sunriseMin + sunsetMin) / 2
startMin = midday - 24
endMin   = midday + 24
```

### `getHoraSchedule(date, sunrise)`
The Chaldean 7-planet sequence starting for each weekday:

| Day | Hour 1 lord |
|-----|------------|
| Sunday | Sun |
| Monday | Moon |
| Tuesday | Mars |
| Wednesday | Mercury |
| Thursday | Jupiter |
| Friday | Venus |
| Saturday | Saturn |

The sequence continues: Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars→(repeat).
Day Horas (hours 1–12) are each `dayLengthMin / 12` minutes long.
Night Horas (hours 13–24) are each `(1440 - dayLengthMin) / 12` minutes long.

Return all 24 slots with `isDaytime: true` for slots 1–12.

Hora lord Hindi names:
```
{ Sun:'सूर्य', Moon:'चंद्र', Mars:'मंगल', Mercury:'बुध',
  Jupiter:'बृहस्पति', Venus:'शुक्र', Saturn:'शनि' }
```

### `scoreMuhurta(date, tithiIndex, nakshatraIndex, activity)`

Score is built from these Vedic rules (store lookup tables in `panchang.ts`):

| Check | Pass | Points |
|-------|------|-------:|
| Tithi is not Rikta (4,8,14 = indices 3,7,13 in 0-based) | ✓ | +2 |
| Nakshatra is in activity's `bestNakshatras` list | ✓ | +3 |
| Weekday is in activity's `bestDays` list | ✓ | +2 |
| Nakshatra is NOT in activity's `avoidNakshatras` | ✓ | +2 |
| Not on Amavasya or Purnima when activity is 'surgery' | ✓ | +1 |

Max score = 10. Quality thresholds:
- 8–10: `'excellent'`
- 6–7: `'good'`
- 4–5: `'acceptable'`
- 0–3: `'avoid'`

Activity lookup tables (minimum set — expand in `data/muhurta.ts` content file):

| Activity | Best nakshatras (indices 0-based) | Best days | Avoid nakshatras |
|----------|-----------------------------------|-----------|-----------------|
| marriage | 3,6,7,12,21 (Rohini,Punarvasu,Pushya,Hasta,Shravana) | Mon,Wed,Thu,Fri | 0,17,18 |
| business | 7 (Pushya) | Wed,Thu,Fri | 17 |
| property | 3,7,12 | Mon,Wed,Fri | 18 |
| travel | 3,4,6,12,21 | Mon,Wed,Thu | 0,17 |
| surgery | 0,2,11,12 | Tue,Sat | 7,14 (Pushya,Chitra — Full/New Moon check) |
| naming | 6,7,3,12 | Mon,Wed,Thu | 17 |
| education | 4,7,12,21 | Wed | 18 |
| job | 7,12,20 | Sun,Thu | 17 |

---

## Platform compatibility

No React Native / Expo imports. Works identically on Web, iOS, Android.

---

## Validation checklist

- [ ] `getSunriseSunset` output matches existing `panchangService` sunrise/sunset to within 1 minute for same inputs
- [ ] Rahu Kaal slot indices match the existing `RAHU_KAAL_SLOTS` array for all 7 weekdays
- [ ] Gulika and Yamghant slot tables are distinct from Rahu Kaal
- [ ] `getHoraSchedule` returns exactly 24 slots; slots 1–12 are daytime
- [ ] Day 1 hora lord matches the weekday ruler (Sunday → Sun as Hour 1)
- [ ] `getAbhijitMuhurta` window is centered on solar noon (midpoint of sunrise+sunset)
- [ ] `scoreMuhurta` score is always in range 0–10
- [ ] `scoreMuhurta('business', Pushya nakshatra, Wednesday)` returns `quality: 'excellent'`

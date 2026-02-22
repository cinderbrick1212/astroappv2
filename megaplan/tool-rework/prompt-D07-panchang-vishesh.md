# Plan 07 — Panchang Vishesh (Extended Daily Panchang)

## Tradition
Vedic / Jyotish — Pancha Anga (five limbs): Tithi, Vara, Nakshatra, Yoga, Karana.
Includes Rahu Kaal, Gulika Kaal, Abhijit Muhurta, and sunrise/sunset times.

## Platforms
Web · iOS · Android

## Integration with #34
Extends the basic `PanchangScreen` from #34 prompt 14 with deeper divinatory content.
New route: `PanchangVishesh`. The basic Panchang card in ToolsScreen links here.

---

## What this tool does

Provides the complete Vedic calendar for any selected date at the user's location.
Goes beyond the basic Panchang card already in the app — adds full Tithi descriptions,
Nakshatra auspiciousness, Yoga nature, Karana meaning, Inauspicious period timings,
and daily planetary hora schedule.

---

## Inputs

| Field | Used for |
|-------|---------|
| Selected date | Default: today; user can navigate to any date |
| `birth_place` / current location | Sunrise/sunset times vary by location; Rahu Kaal depends on this |

---

## Content layer — what `contentService.getPanchangContent(date, lat, lng)` must return

| Content block | Description |
|---------------|-------------|
| `dateHeader` | Full Vedic date — Samvat year, month, paksha, tithi number |
| `tithiCard` | Tithi name (Hindi + English), nature (Nanda/Bhadra/Jaya/Rikta/Purna), auspiciousness, favored and avoided activities |
| `nakshatraCard` | Daily nakshatra, ruling planet, nature, brief divinatory note |
| `yogaCard` | Panchang Yoga name, auspicious/inauspicious nature, brief meaning |
| `karanaCard` | Karana name, nature, brief meaning |
| `sunMoon` | Sunrise, sunset, moonrise, moonset times |
| `inauspiciousPeriods` | Rahu Kaal, Gulika Kaal, Yamghant — start/end times |
| `auspiciousPeriods` | Abhijit Muhurta — start/end time and what it's good for |
| `horaSchedule[]` | All 24 Vedic Horas for the day — planet ruler, start time, end time, best activity |
| `specialEvents` | Any festival, Ekadashi, Amavasya, Purnima, or Sankranti falling on this date |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/PanchangVisheshScreen.tsx` | Main screen with date navigation |
| `components/PanchangDatePicker.tsx` | Arrow-based date navigator with month/year display |
| `components/InauspiciousTimesCard.tsx` | Rahu Kaal + Gulika Kaal displayed as time-bar chips |
| `components/HoraScheduleList.tsx` | Scrollable list of 24 Horas with planet icon and activity hint |
| `components/SpecialEventBanner.tsx` | Shown only on festival/Ekadashi/special days |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `panchangService` | `calculatePanchang(date, lat, lng)` | All five Panchang limbs + inauspicious times |
| `contentService` | `getPanchangContent(date, lat, lng)` | Tithi/Nakshatra/Yoga/Karana descriptions and activity guidance |
| `analytics` | `panchangViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Date navigator → 5 limb cards (Tithi, Vara, Nakshatra, Yoga, Karana) → times grid → Hora list
- **Web/Tablet**: Two columns — left: 5 limb cards + times; right: Hora schedule + special events

---

## Key UI rules (from #34 theme)

- Auspicious elements: `primaryContainer` chip/card
- Inauspicious periods (Rahu Kaal etc.): `errorContainer` chip with clock icon
- Abhijit Muhurta: `secondaryContainer` highlighted card
- Festival/special day banner: full-width `elevated` card at top
- Date navigator: Paper `IconButton` arrows with `Text` headline date center

---

## Validation checklist

- [ ] All 5 Panchang limbs displayed with Hindi + English names
- [ ] Tithi shows nature (Nanda/Bhadra/etc.) and favored/avoided activities from content service
- [ ] Rahu Kaal, Gulika Kaal, Yamghant times accurately calculated for user's location
- [ ] Abhijit Muhurta shown as auspicious window
- [ ] Full 24-hora schedule displayed with planet ruler and activity hint
- [ ] Date navigation works forward and backward
- [ ] Special festival/Ekadashi banner appears on relevant dates
- [ ] All descriptive text from `contentService` — no inline strings

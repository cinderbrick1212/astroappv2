# Plan 09 — Tithi & Chandra (Moon Phase & Lunar Calendar)

## Tradition
Vedic / Jyotish — Tithi (lunar day), Paksha (fortnight), Purnima/Amavasya cycles,
and the Moon's daily nakshatra transit. Standalone tool — does not require birth data.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `TithiChandra`.

---

## What this tool does

Displays the current Tithi, Moon phase, Moon's nakshatra, and paksha (fortnight)
with a visual animated moon graphic. Provides a monthly lunar calendar view
and divinatory guidance for the current lunar day's energy.

---

## Inputs

| Field | Used for |
|-------|---------|
| Selected date | Default: today; user can navigate by month |
| Location (optional) | Moonrise/moonset times |
| `name` (optional) | Personalised if user is logged in; generic if not |

---

## Content layer — what `contentService.getTithiContent(date, lat, lng)` must return

| Content block | Description |
|---------------|-------------|
| `tithiCard` | Tithi number (1–30), name (Hindi + English), paksha (Shukla/Krishna), nature, auspiciousness level |
| `tithiGuidance` | What this Tithi favors and what to avoid — 2–3 sentences |
| `moonNakshatra` | Moon's current nakshatra with brief divinatory note |
| `moonPhaseVisual` | Phase name (Amavasya / Pratipada / … / Purnima), illumination %, icon key |
| `moonTimes` | Moonrise and moonset for the location |
| `monthlyCalendar[]` | 30 Tithis of the current lunar month — name, paksha, auspiciousness flag |
| `specialDayCard` | If today is Ekadashi, Purnima, Amavasya, Pradosh, or Sankranti — prominent special card with significance and practice |
| `fastingGuidance` | Fasting recommendation for the Tithi (e.g., Ekadashi fast, Amavasya Pitru Tarpan) |

### 30 Tithis reference (stored in content data)

Tithis 1–15: Shukla Paksha (waxing) — Pratipada through Purnima
Tithis 16–30: Krishna Paksha (waning) — Pratipada through Amavasya
Rikta Tithis (4th, 8th, 14th) — inauspicious for new starts
Purna Tithis (5th, 10th, 15th/Purnima) — auspicious, full energy

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/TithiChandraScreen.tsx` | Main screen |
| `components/MoonPhaseVisual.tsx` | Animated SVG moon sphere showing current phase (react-native-svg) |
| `components/LunarCalendarGrid.tsx` | Month-view grid of 30 Tithis with phase icons |
| `components/SpecialDayCard.tsx` | Prominent card for Ekadashi / Purnima / Amavasya / festivals |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `panchangService` | `calculatePanchang(date, lat, lng)` | Current Tithi, Moon nakshatra, phase |
| `contentService` | `getTithiContent(date, lat, lng)` | Tithi descriptions, guidance, fasting info |
| `analytics` | `tithiViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Moon phase visual → Tithi card → Moon nakshatra → guidance → monthly calendar → special day card
- **Web/Tablet**: Moon visual large left; Tithi + nakshatra + guidance right; calendar full-width below

---

## Key UI rules (from #34 theme)

- Shukla Paksha (waxing): `primaryContainer` background tone
- Krishna Paksha (waning): `surfaceVariant` background tone
- Rikta (inauspicious) Tithis in calendar: `errorContainer` dot
- Purna (auspicious) Tithis: `primaryContainer` dot
- Special day card (Purnima/Amavasya/Ekadashi): `elevated` Card with icon
- Moon visual: SVG animation — do not use third-party moon animation libraries

---

## Validation checklist

- [ ] Tithi correctly calculated for today's date using Vedic (sidereal) Moon position
- [ ] Shukla vs Krishna Paksha correctly identified
- [ ] Moon phase visual accurately represents current illumination
- [ ] Tithi name shown in both Hindi and English
- [ ] Tithi guidance (favored/avoided activities) from `contentService` — no inline strings
- [ ] Monthly lunar calendar shows all 30 Tithis with auspiciousness indicators
- [ ] Ekadashi, Purnima, Amavasya, Pradosh — special day card auto-shown when applicable
- [ ] Fasting guidance shown where relevant
- [ ] Tool works without user being logged in (does not require birth data)

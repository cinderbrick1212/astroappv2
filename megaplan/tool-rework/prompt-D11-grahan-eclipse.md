# Plan 11 — Grahan (Eclipse Calculator)

## Tradition
Vedic / Jyotish — Surya Grahan (Solar Eclipse) and Chandra Grahan (Lunar Eclipse)
as major karmic and collective events. Eclipse impact on personal chart analyzed
by proximity of eclipse degree to natal planets.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). Standalone — does not
require birth data for the eclipse calendar view; personalized impact requires birth data.

---

## What this tool does

Shows upcoming and past solar and lunar eclipses with their Vedic significance,
the Rashi and Nakshatra where they fall, and a personalized impact analysis
showing which natal planets (if any) are within orb of the eclipse degree.

---

## Inputs

| Field | Used for |
|-------|---------|
| Selected year | Default: current year |
| `birth_date`, `birth_time`, `birth_place` (optional) | Personal impact analysis |
| `name` (optional) | Personalised impact reading if logged in |

---

## Content layer — what `contentService.getGrahanContent(year, profile?)` must return

| Content block | Description |
|---------------|-------------|
| `yearSummary` | How many eclipses this year, which signs they activate — 2 sentences |
| `eclipseList[]` | Each eclipse — type, date/time (IST), duration, visibility from India, Rashi, Nakshatra |
| Per eclipse `vedaShastra` | Vedic significance of this eclipse's Rashi/Nakshatra placement — 2–3 sentences |
| Per eclipse `doAndDont` | What to do and avoid on the eclipse day (fasting, bathing, worship) |
| `personalImpact[]` | (Requires birth data) Each natal planet within 5° of eclipse degree — prediction + remedy |
| `sutak` | Sutak period start time (4/12 prahars before depending on eclipse type) |
| `remedyCard` | Eclipse Graha Shanti — eclipse-day mantra, donation, and ritual |

### Eclipse types and their Vedic significance (stored in content data)

| Type | Vedic name | Karmic significance |
|------|-----------|-------------------|
| Total Solar | Khanda Surya Grahan | Strongest; new karmic chapter |
| Annular Solar | Kanthi Surya Grahan | Significant; incomplete resolution |
| Partial Solar | Ansha Surya Grahan | Moderate; partial shift |
| Total Lunar | Khanda Chandra Grahan | Emotional culmination; release |
| Penumbral Lunar | Chhaya Chandra Grahan | Subtle; internal reflection |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/GrahanScreen.tsx` | Main screen |
| `components/EclipseCard.tsx` | Per-eclipse card — type, date, rashi/nakshatra, Vedic significance |
| `components/EclipseImpactCard.tsx` | Shows personal natal planets hit by eclipse (requires birth data) |
| `components/SutakTimerCard.tsx` | Countdown to Sutak start + eclipse time |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `getEclipses(year)` | List of eclipses for the year with dates and sidereal degrees |
| `astrologyEngine` | `getEclipsePersonalImpact(eclipseDeg, profile)` | Which natal planets are within orb |
| `contentService` | `getGrahanContent(year, profile?)` | Eclipse descriptions, Vedic shastra, personal impact readings |
| `analytics` | `grahanViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Year selector → eclipse list (cards) → personal impact section
- **Web/Tablet**: Eclipse list left; selected eclipse detail + personal impact right

---

## Key UI rules (from megaplan theme)

- Solar eclipse cards: `errorContainer` background (Sun is covered = danger/intensity)
- Lunar eclipse cards: `surfaceVariant` background (Moon dims = emotional release)
- Personal impact (natal planet hit): `errorContainer` chip per affected planet
- Sutak timer: `errorContainer` card with countdown — shown prominently on eclipse day
- Do/Don't guidance: benefic actions `primaryContainer`, avoid actions `errorContainer`

---

## Validation checklist

- [ ] Eclipses calculated in sidereal degrees; Rashi and Nakshatra shown in Vedic terms
- [ ] IST timing shown by default; user can toggle timezone
- [ ] Sutak period correctly calculated (12 prahars for solar, 4 for lunar)
- [ ] Personal impact section shown only when user is logged in with birth data
- [ ] Natal planets within 5° of eclipse degree highlighted with prediction from content service
- [ ] Do/don't guidance for eclipse day sourced from content service — no inline strings
- [ ] Tool usable without login (shows eclipse list and Vedic significance; hides personal impact)

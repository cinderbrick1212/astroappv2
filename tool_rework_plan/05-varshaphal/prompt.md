# Plan 05 — Varshaphal (Annual Chart / Solar Return)

## Tradition
Vedic / Jyotish — Varshaphal (annual horoscope), cast for the exact moment the Sun
returns to its natal sidereal longitude each year, at the user's current location.

## Platforms
Web · iOS · Android

## Integration with #34
Depends on #34 prompts 01 (theme) and 08 (ToolsScreen). New route: `Varshaphal`.
Depends on Tool 01 (Janma Kundli) for natal chart reference.

---

## What this tool does

Calculates and displays the user's Varshaphal — the Vedic annual chart for the
current year. Shows the annual Lagna (Varsha Lagna), Muntha position, planetary
placements for the year, and a 12-month divinatory forecast broken into quarters.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised year forecast ("Priya, आपका वार्षिक फल…") |
| `birth_date`, `birth_time`, `birth_place` | Natal Sun longitude as reference point |
| Current location (optional) | Solar return is calculated for current location by default; user can change it |

---

## Content layer — what `contentService.getVarshaphalContent(profile, year)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + year + annual theme in one sentence |
| `annualReturnDate` | Exact date and time of Solar Return this year |
| `varshaLagna` | Annual Ascendant sign — interpretation for the year's overall outlook |
| `munthaCard` | Muntha sign and house — what area of life is most activated this year |
| `yearSummary` | 2–3 paragraph overall prediction for the year |
| `quarterForecasts[]` | 4 quarters (3 months each) — each with a theme and brief prediction |
| `annualYogas[]` | Significant Varsha yogas found in the annual chart |
| `remedyCard` | Annual Graha Shanti recommendation based on most afflicted annual planet |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/VarshaphalScreen.tsx` | Main screen |
| `components/VarshaphalWheel.tsx` | North Indian square chart for the annual chart (reuses KundliWheel logic) |
| `components/QuarterForecastCard.tsx` | Reusable card for each of the 4 quarters |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `calculateVarshaphal(profile, year)` | Computes annual solar return chart (sidereal) |
| `contentService` | `getVarshaphalContent(profile, year)` | Assembles annual forecast text |
| `analytics` | `varshaphalViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Annual wheel → Varsha Lagna + Muntha chips → year summary → 4 quarter cards → remedy
- **Web/Tablet**: Annual wheel left, year summary + chips right; quarter cards in 2×2 grid

---

## Key UI rules (from #34 theme)

- Annual Lagna chip: `primaryContainer`
- Muntha chip: `secondaryContainer`
- Quarter cards: Q1/Q2 above fold; Q3/Q4 below; each uses `elevated` Card
- Remedy card: `secondaryContainer` background

---

## Validation checklist

- [ ] Solar return calculated for the exact moment Sun returns to natal sidereal degree
- [ ] Chart is sidereal (Lahiri) — same ayanamsa as natal chart
- [ ] Varsha Lagna and Muntha displayed with content-service-sourced interpretations
- [ ] Year summary and all quarter predictions from `contentService` — no inline strings
- [ ] Annual Yogas section shown only when yogas are detected
- [ ] Location for return can default to birth place with optional current-location override
- [ ] Web: two-column layout with wheel left, text right

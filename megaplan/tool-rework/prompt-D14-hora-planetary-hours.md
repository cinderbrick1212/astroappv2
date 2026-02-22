# Plan 14 — Hora (Vedic Planetary Hours)

## Tradition
Vedic / Jyotish — Hora: each day and night is divided into 12 unequal hours
(based on actual sunrise/sunset). Each hour is ruled by one of the 7 classical
planets in the Chaldean sequence. The day's first Hora lord = the day's ruling planet.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `Hora`.
Standalone — does not require birth data (though name used for personalisation).

---

## What this tool does

Shows the current Vedic Hora (planetary hour) and all 24 Horas for the day,
with the ruling planet, the activity each Hora favors, and a live countdown
to the end of the current Hora. Includes a quick-reference activity guide.

---

## Inputs

| Field | Used for |
|-------|---------|
| Current location | Sunrise/sunset → exact Hora lengths for this location |
| `name` (optional) | Personalised "Best Hora for you today" if natal chart available |
| Selected date | Default: today; can browse to any date |

---

## Content layer — what `contentService.getHoraContent(date, lat, lng)` must return

| Content block | Description |
|---------------|-------------|
| `currentHora` | Ruling planet, start time, end time, remaining duration, primary activity |
| `currentHoraGuidance` | 1–2 sentence divinatory note for the current Hora |
| `dayHoras[]` | All 24 Horas — planet, start time, end time, best activity, quality (benefic/malefic/neutral) |
| `activityQuickRef` | For each of 7 planets — 2–3 best activities during that planet's Hora |
| `dayRuler` | Today's weekday planet (Sun=Sunday, Moon=Monday, etc.) and what it means for the day overall |

### Chaldean Hora sequence (stored in content data — determines planet order)

Day Horas start at sunrise: Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars → (repeat)
The starting planet for Hour 1 is determined by the day of the week.

### Activity guide per planet (stored in content data)

| Planet | Best Hora activities |
|--------|---------------------|
| Sun | Leadership decisions, government dealings, health treatments, visibility |
| Moon | Family matters, emotional conversations, travel, intuitive work |
| Mars | Exercise, surgery, conflict resolution, bold actions |
| Mercury | Writing, studying, contracts, communication, travel booking |
| Jupiter | Teaching, worship, charitable acts, expansion, legal matters |
| Venus | Romance, beauty, art, music, social events, creative work |
| Saturn | Long-term planning, discipline, research, karmic duties, farming |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/HoraScreen.tsx` | Main screen |
| `components/CurrentHoraBanner.tsx` | Large card showing current Hora planet, countdown, and activity |
| `components/HoraTimeline.tsx` | Vertical scrollable list of all 24 Horas; current one highlighted |
| `components/HoraActivityGuide.tsx` | Quick reference: 7 planet cards with best activities |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `panchangService` | `getSunriseSunset(date, lat, lng)` | Exact sunrise/sunset for Hora division |
| `contentService` | `getHoraContent(date, lat, lng)` | All 24 Horas with planet, times, activities |
| `analytics` | `horaViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Current Hora banner (large, prominent) → day Hora timeline scroll → activity quick-ref
- **Web/Tablet**: Current Hora banner full-width top; timeline left, activity guide right

---

## Key UI rules (from #34 theme)

- Current Hora: `elevated` Card with `primary` border, large planet glyph, live countdown
- Benefic planet Horas (Sun, Moon, Jupiter, Venus, Mercury): `primaryContainer` in timeline
- Malefic planet Horas (Saturn, Mars): `errorContainer` in timeline
- Countdown timer: `Text` with `displaySmall` variant
- Activity guide: 7 `outlined` Cards in a grid (3 columns mobile, 4 columns web)

---

## Validation checklist

- [ ] Hora times calculated from actual sunrise/sunset for the user's location (not fixed 60-min hours)
- [ ] Current Hora correctly identified based on system time
- [ ] Live countdown to end of current Hora updates every minute
- [ ] All 24 Horas shown in chronological order; current one visually distinct
- [ ] Activity guidance for each Hora sourced from `contentService` — no inline strings
- [ ] Day Hora ruler identified and shown with a brief day-energy note
- [ ] Works without login
- [ ] Date navigation works for planning future days

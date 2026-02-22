# Plan 03 — Vimshottari Dasha (Planetary Period Timeline)

## Tradition
Vedic / Jyotish — Vimshottari Dasha system (120-year cycle), Mahadasha → Antardasha → Pratyantardasha.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `Dasha`.

---

## What this tool does

Displays the user's complete Vimshottari Dasha timeline — the primary Vedic predictive
and timing system. Shows past, current, and future Mahadashas with their Antardashas
(sub-periods), divinatory predictions for each active period, and recommended
spiritual practices for the current Dasha lord.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised predictions ("Priya, आपकी शनि महादशा…") |
| `birth_date`, `birth_time`, `birth_place` | Exact Moon nakshatra → Dasha starting balance calculation |

---

## Content layer — what `contentService.getDashaContent(profile)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + current Dasha lord in a personalised opening sentence |
| `currentMahadasha` | Lord name (Hindi + English), start date, end date, remaining time, divinatory prediction paragraph |
| `currentAntardasha` | Sub-lord, start/end dates, combined lord interpretation |
| `dashaTimeline[]` | All 9 Mahadashas in chronological order — lord, start year, end year, duration, brief keyword |
| `spiritualPractice` | Recommended mantra, fasting, and worship for current Dasha lord |
| `nextMahadasha` | Preview of the upcoming Mahadasha with preparation advice |

### Dasha duration reference (stored in content data)

| Graha | Years |
|-------|------:|
| Ketu | 7 |
| Venus | 20 |
| Sun | 6 |
| Moon | 10 |
| Mars | 7 |
| Rahu | 18 |
| Jupiter | 16 |
| Saturn | 19 |
| Mercury | 17 |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/DashaScreen.tsx` | Main screen |
| `components/DashaTimeline.tsx` | Horizontal scrollable timeline — past (dimmed) / current (highlighted) / future |
| `components/AntardashaList.tsx` | Expandable list of Antardashas within selected Mahadasha |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `calculateDasha(profile)` | Computes full 120-year Dasha sequence from birth nakshatra |
| `contentService` | `getDashaContent(profile)` | Assembles predictions and spiritual practice text |
| `analytics` | `dashaViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Current Dasha card at top → Antardasha list → horizontal timeline scroll → spiritual practice card
- **Web/Tablet**: Timeline spans full width; current + antardasha cards in two columns above it

---

## Key UI rules (from megaplan theme)

- Current Mahadasha period: `elevated` Card with `primary` accent
- Past Dashas: `surfaceVariant` dimmed styling
- Future Dashas: outlined Card
- Timeline uses `ProgressBar` within the current period to show elapsed fraction
- Spiritual practice card: `secondaryContainer` background

---

## Validation checklist

- [ ] Dasha starting balance correctly calculated from birth nakshatra degree
- [ ] All 9 Mahadashas shown in correct sequence with accurate years
- [ ] Current Mahadasha AND Antardasha both displayed with remaining time
- [ ] Each Dasha has a divinatory prediction paragraph from content service — no inline strings
- [ ] Name used in personalised greeting
- [ ] Timeline scrollable; current period visually distinct
- [ ] Spiritual practice card changes based on current Dasha lord
- [ ] Web: full-width timeline bar with period markers

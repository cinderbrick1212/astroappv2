# Plan 02 — Kundli Milan (Ashtakoot Compatibility)

## Tradition
Vedic / Jyotish — Ashtakoot Guna Milan, 36-point scoring system, Mangal Dosha analysis.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen).
Replaces the existing `CompatibilityScreen` from `frontend-rework/prompt-C13` with full Ashtakoot Milan.

---

## What this tool does

Compares two people's Vedic birth charts using the classical Indian 8-attribute
compatibility system (36 Guna Milan). Produces a structured match score,
attribute-by-attribute verdict, Mangal Dosha check for both parties,
and a divinatory marriage recommendation with Graha Shanti remedies when needed.

---

## Inputs

### Person A — auto-loaded from logged-in user profile
| Field | Used for |
|-------|---------|
| `name` | "Your" side of the comparison |
| `birth_date`, `birth_time`, `birth_place` | Moon nakshatra calculation for all 8 Koots |

### Person B — entered manually on this screen
| Field | Input type |
|-------|-----------|
| `name` | Text field |
| `birth_date` | `DatePickerInput` (react-native-paper-dates) |
| `birth_time` | `TimePickerModal` (react-native-paper-dates) |
| `birth_place` | City search via `locationService` autocomplete |

---

## Content layer — what `contentService.getMilanContent(profileA, profileB)` must return

All verdicts, descriptions, and recommendations come from the content service.

| Content block | Description |
|---------------|-------------|
| `totalScore` | Number 0–36 |
| `verdictLabel` | उत्तम / शुभ / सामान्य / अशुभ (from score threshold table) |
| `verdictDescription` | 2–3 sentence traditional recommendation paragraph |
| `kootRows[]` | Each of 8 Koots — Sanskrit name, English name, max points, scored, one-line verdict |
| `mangalDoshaA` | Person A — present/absent, affected houses, remedy if present |
| `mangalDoshaB` | Person B — present/absent, affected houses, remedy if present |
| `remedyCard` | Graha Shanti recommendations when score < 18 |
| `placementsA` | Person A's Rashi, Nakshatra, Lagna (for side-by-side display) |
| `placementsB` | Person B's Rashi, Nakshatra, Lagna |

### Ashtakoot scoring thresholds (stored in content data, not in service logic)

| Score | Verdict (English) | Verdict (Hindi) | Remedy needed? |
|-------|--------------------|-----------------|:--------------:|
| ≥ 28 | Excellent | उत्तम | No |
| 21–27 | Good | शुभ | No |
| 18–20 | Acceptable | सामान्य | Optional |
| < 18 | Inauspicious | अशुभ | Yes |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/KundliMilanScreen.tsx` | Main screen — Person B form + results layout |
| `components/MilanScoreCard.tsx` | Large score display with color-coded verdict chip |
| `components/AshtakootTable.tsx` | DataTable of 8 Koots with scored/max columns |
| `components/MangalDoshaCard.tsx` | Mangal Dosha status for both persons |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `calculateKundliMilan(profileA, profileB)` | Computes all 8 Koot scores |
| `contentService` | `getMilanContent(profileA, profileB)` | Assembles personalised verdicts and remedies |
| `locationService` | `searchCities(query)` | Person B city autocomplete |
| `analytics` | `compatibilityViewed()` | Fires on mount |

---

## Layout (responsive)

- **Mobile**: Single column — form → score card → Koot table → Mangal Dosha → remedy
- **Web/Tablet** (≥ 768 px): Person A placements left / Person B placements right; score + table below

---

## Key UI rules (from megaplan theme)

- Total score: `displaySmall` typography, color-coded — `primary` ≥ 28, `secondary` 21–27, `error` < 18
- Koot table: full-marks rows use `primaryContainer`; zero-point rows use `errorContainer`
- Mangal Dosha present: `errorContainer` chip with affected house list
- Remedy card: `secondaryContainer` background; only shown when score < 18

---

## Validation checklist

- [ ] Person A auto-loaded; no re-entry required
- [ ] Person B form uses `react-native-paper-dates` pickers — no custom date/time pickers
- [ ] All 8 Koots listed with Sanskrit name, English name, max points, scored, verdict
- [ ] Total score color changes by threshold — no hardcoded colors
- [ ] Mangal Dosha check shown for both persons independently
- [ ] Remedy card only appears when score < 18
- [ ] All text (verdicts, descriptions, remedies) sourced from `contentService`
- [ ] Web ≥ 768 px: two-column placement comparison layout
- [ ] `analytics.compatibilityViewed()` called once on mount

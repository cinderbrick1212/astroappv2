# Plan 15 — Graha Shanti (Remedies)

## Tradition
Vedic / Jyotish — Graha Shanti: the science of planetary propitiation through
gemstones (Ratna), mantras, yantras, fasting (Upvaas), charity (Daan), and
deity worship. Remedies are prescribed based on the natal chart's afflictions.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `GrahaShanti`.
Depends on Tool 01 (Janma Kundli) for afflicted planet detection.
Remedy snippets appear in every tool screen (Tools 01–12); this screen is the
dedicated deep-dive where users can explore and understand all their remedies.

---

## What this tool does

Provides a complete, personalised Graha Shanti prescription based on the user's
Janma Kundli. Identifies which grahas need propitiation and why, then lists
the full remedy for each — gemstone details, beej mantra with pronunciation,
yantra, charity, fasting, deity worship, and auspicious colours.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised prescription ("Priya, आपके लिए ग्रह शांति उपाय…") |
| `birth_date`, `birth_time`, `birth_place` | Identifies debilitated, combust, or afflicted planets |

---

## Content layer — what `contentService.getGrahaShanti(profile)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + overall chart summary (how many planets need propitiation) |
| `chartHealthSummary` | 2–3 sentence overview of the chart's strongest and most challenging grahas |
| `remedyCards[]` | One card per graha that needs propitiation — see per-remedy structure below |
| `priorityRemedy` | The single most important remedy to start with — with reasoning |
| `generalPractices` | Universal daily practices recommended for everyone (not planet-specific) |

### Per-remedy card structure (all text from content data, looked up by graha key)

| Field | Example |
|-------|---------|
| Graha name (Hindi + English) | शनि / Saturn |
| Why propitiation needed | "Saturn is debilitated in your 7th house and aspects Mars, causing relationship delays." |
| Primary gemstone | Blue Sapphire (Neelam) |
| Gemstone details | Weight, metal, finger, day/time to wear, mantra while wearing |
| Beej mantra | "ॐ शं शनैश्चराय नमः" |
| Mantra count | 108 times / 19,000 times for full Anushthana |
| Best day and time | Saturday, sunrise |
| Yantra | Shani Yantra — how to install and worship |
| Charity | Black sesame, iron, dark blue cloth — on Saturdays |
| Fasting | Saturday fast — what to eat and avoid |
| Deity | Shani Dev, Hanuman Ji |
| Auspicious colour | Dark blue, black, violet |
| Food offering | Sesame laddoos, black urad dal |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/GrahaShantScreen.tsx` | Main screen |
| `components/RemedyCard.tsx` | Full remedy card per afflicted graha (expandable) |
| `components/MantraCard.tsx` | Mantra display with Devanagari text + transliteration + count |
| `components/GemstoneCard.tsx` | Gemstone with wearing instructions |
| `components/CharityCard.tsx` | Charity + fasting + deity in one compact card |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `getAfflictedGrahas(profile)` | Returns list of grahas needing propitiation + reason |
| `contentService` | `getGrahaShanti(profile)` | Full personalised remedy prescription |
| `analytics` | `grahaShantViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Priority remedy banner → remedy cards (expandable accordion per graha) → general practices
- **Web/Tablet**: Priority remedy left; all remedy cards in 2-column grid right

---

## Key UI rules (from megaplan theme)

- Priority remedy banner: `elevated` Card with `primary` border
- Each graha remedy card: `outlined`, collapsible via Paper `List.Accordion`
- Mantra text: Devanagari in `titleMedium`; transliteration in `bodySmall` italic below
- Gemstone card: `secondaryContainer` background
- Charity card: `surfaceVariant` background

---

## Validation checklist

- [ ] Afflicted planets identified from actual chart data — not hardcoded per user
- [ ] Why propitiation is needed explained in plain language from content service
- [ ] Every remedy card includes all fields: gemstone, mantra, yantra, charity, fasting, deity, colour
- [ ] Mantra shown in both Devanagari script and Roman transliteration
- [ ] Priority remedy banner clearly identifies the single most important remedy
- [ ] General practices section shown for all users regardless of chart
- [ ] All remedy text sourced from content data keyed by graha — no inline strings in JSX
- [ ] Works gracefully if no planets are afflicted (shows general wellness practices only)

# Plan 10 — Nakshatra Vishesh (Deep Nakshatra Analysis)

## Tradition
Vedic / Jyotish — 27 Nakshatras (lunar mansions), 4 Padas each, ruling planet,
deity, symbol, gana, Yoni, Nadi — the complete nakshatra profile.

## Platforms
Web · iOS · Android

## Integration with #34
Depends on #34 prompts 01 (theme) and 08 (ToolsScreen). New route: `NakshatraVishesh`.
Depends on Tool 01 (birth nakshatra comes from Janma Kundli).

---

## What this tool does

Provides a deep divinatory reading of the user's birth nakshatra (janma nakshatra —
the nakshatra the Moon occupied at birth). Covers all four Padas, the deity and
symbol, psychological nature, compatible and incompatible nakshatras, career
affinities, relationship patterns, spiritual purpose, and personalised remedies.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised reading ("Priya, आपका जन्म नक्षत्र रोहिणी है…") |
| `birth_date`, `birth_time`, `birth_place` | Exact Moon longitude → nakshatra + pada |

---

## Content layer — what `contentService.getNakshatraContent(profile)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + nakshatra name + ruling planet in a personalised opener |
| `nakshatraCard` | Name (Hindi + English), number (1–27), ruling planet, deity, symbol, element, gana |
| `padaCard` | Which of the 4 padas (quarters) the Moon occupies + specific pada interpretation |
| `psychologicalProfile` | 3–4 sentence deep character reading based on this nakshatra |
| `lifeThemeCard` | The soul's primary theme and dharmic purpose for this nakshatra |
| `careerAffinities[]` | Fields/professions naturally aligned with this nakshatra's energy |
| `relationshipPattern` | How this nakshatra typically behaves in relationships |
| `compatibilityHighlights` | Top 3 compatible nakshatras and why; top 2 incompatible and why |
| `spiritualPractice` | Deity to worship, mantra, sacred day |
| `remedyCard` | Gemstone and mantra specific to this nakshatra's ruling planet |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/NakshatraScreen.tsx` | Main screen |
| `components/NakshatraWheel.tsx` | SVG circle of 27 nakshatras with birth nakshatra highlighted |
| `components/PadaDiagram.tsx` | Visual showing which of 4 padas is active |
| `components/CompatibilityChips.tsx` | Compatible (primary) and incompatible (error) nakshatra chips |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `getMoonNakshatra(profile)` | Birth Moon longitude → nakshatra key + pada number |
| `contentService` | `getNakshatraContent(profile)` | Full personalised nakshatra reading |
| `analytics` | `nakshatraViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Nakshatra wheel → pada diagram → psychological profile → life theme → career → relationship → compatibility → remedy
- **Web/Tablet**: Wheel + pada diagram left; all reading cards right in scrollable column

---

## Key UI rules (from #34 theme)

- Birth nakshatra segment on wheel: `primary` fill color
- Pada indicator: 4-segment visual with active pada in `primary`, others in `surfaceVariant`
- Compatible nakshatra chips: `primaryContainer`
- Incompatible nakshatra chips: `errorContainer`
- Deity and mantra card: `secondaryContainer` background with spiritual icon

---

## Validation checklist

- [ ] Birth nakshatra derived from exact Moon sidereal degree using Lahiri ayanamsa
- [ ] Correct pada (1–4) identified and displayed
- [ ] Psychological profile paragraph sourced from `contentService` — no inline strings
- [ ] All 27 nakshatras visible on the wheel; birth one highlighted
- [ ] Compatible and incompatible nakshatras shown with brief explanation from content service
- [ ] Career affinities listed as chips or a bulleted list
- [ ] Spiritual practice and remedy card always shown
- [ ] Name used in personalised greeting

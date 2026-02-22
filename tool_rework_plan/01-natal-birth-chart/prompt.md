# Plan 01 — Janma Kundli (Full Birth Chart)

## Tradition
Vedic / Jyotish — sidereal zodiac (Lahiri ayanamsa), Whole Sign houses, nine grahas + Rahu/Ketu.

## Platforms
Web · iOS · Android

## Integration with #34
Depends on `extensive_frontend_rework` prompts 01 (MD3 theme) and 08 (ToolsScreen hub).
Replaces the lightweight `KundliScreen` from prompt 12 of #34 with the full Janma Kundli.

---

## What this tool does

Displays the user's full Vedic birth chart — the foundational Jyotish tool.
Every other tool in this plan derives from or links back to the Janma Kundli.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised greeting ("Priya, आपकी कुंडली…") |
| `birth_date` | Planetary longitude calculation via Swiss Ephemeris |
| `birth_time` | Lagna (Ascendant), accurate house cusps, exact nakshatra pada |
| `birth_place` | Geographic latitude/longitude for house calculation |
| `timezone` | UTC conversion for accurate sidereal positions |

---

## Content layer — what `contentService.getKundliContent(profile)` must return

All display text is assembled by the content service from the user's computed chart.
No screen renders a string that is not sourced from the content service.

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + lagna + rashi in one personalised sentence |
| `lagnaCard` | Lagna sign name (Hindi + English), interpretation paragraph, body-part governed |
| `rashiCard` | Moon sign interpretation, emotional nature summary |
| `nakshatraCard` | Birth nakshatra name, ruling planet, symbol, Moon interpretation, Dasha start |
| `dashaCard` | Current Mahadasha lord, Antardasha, remaining time, divinatory prediction paragraph |
| `yogaCards[]` | Each detected Rajayoga or Dosha — name (Hindi + English), quality, description, remedy if malefic |
| `planetCards[]` | Per planet — sign, house, dignity (exalted/debilitated/own), brief interpretation |
| `remedyCards[]` | Per afflicted graha — gemstone, mantra, charity, fasting day |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/JanmaKundliScreen.tsx` | Main screen — orchestrates layout, calls content service |
| `components/KundliWheel.tsx` | North Indian square SVG chart (react-native-svg) |
| `components/PlanetDetailDialog.tsx` | Tap a planet → Paper Dialog with full interpretation |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `calculateKundli(profile)` | Computes all planetary positions (sidereal/Lahiri) |
| `contentService` | `getKundliContent(profile)` | Assembles personalised text from data library |
| `analytics` | `kundliViewed()` | Fires on mount |

---

## Layout (responsive)

- **Mobile** (< 768 px): Single column — KundliWheel full-width → chips → cards stacked
- **Web/Tablet** (≥ 768 px): Two columns — KundliWheel left, planet DataTable right; cards below full-width

---

## Key UI rules (from #34 theme)

- All colors from `useTheme().colors.*` — no hex values
- North Indian square wheel: Lagna cell border uses `theme.colors.primary`
- Benefic planets: `theme.colors.primary`; Malefic planets: `theme.colors.error`
- Yogas: benefic → `primaryContainer` chip; malefic → `errorContainer` chip
- Remedy cards: `secondaryContainer` background

---

## Validation checklist

- [ ] Chart is always sidereal (Lahiri) and Whole Sign — no user-facing toggle
- [ ] All display text sourced from `contentService` — zero hardcoded strings in JSX
- [ ] Name used in greeting; DOB + time used for all calculations
- [ ] KundliWheel renders on Web, iOS, and Android without layout overflow
- [ ] Tapping a planet opens `PlanetDetailDialog` with interpretation from content service
- [ ] Dasha card shows lord, antardasha, remaining time, and a divinatory prediction
- [ ] Yoga cards only appear when yogas are detected
- [ ] Remedy cards shown for each afflicted graha
- [ ] Missing birth details shows empty state prompting user to complete Profile
- [ ] Two-column layout on web ≥ 768 px

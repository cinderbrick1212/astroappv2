# Tool Rework Plan — AstroAppV2

**Date:** February 2026
**Platforms:** Web · iOS · Android
**Purpose:** Fragment the tool rework into 16 self-contained, one-shot-executable GitHub Copilot prompts — one per astrology tool — organized by dependency order. Every prompt builds on the MD3 theme and navigation established in the [Extensive Frontend Rework (#34)](../extensive_frontend_rework/README.md).

---

## Platform Targets

Every tool screen in this plan must run correctly on all three platforms:

| Platform | Key constraints |
|----------|----------------|
| **iOS** | Safe-area insets, `KeyboardAvoidingView` with `behavior="padding"`, Apple HIG touch targets (44 × 44 pt min) |
| **Android** | `KeyboardAvoidingView` with `behavior="height"`, Material 3 ripple feedback, back-gesture handling |
| **Web** | Responsive container max-width (768 px tablet / 1280 px desktop), `overflow-y: scroll` instead of `FlatList`/`ScrollView` on large viewports, hover states on interactive elements |

Use `Platform.OS` guards only where behavior genuinely differs. Prefer Paper components that already adapt across platforms (e.g., `Menu`, `Dialog`, `Portal`) over any custom native-only solution.

---

## Integration with #34 Frontend Rework

This plan **extends** the `extensive_frontend_rework` sequence. The frontend rework (prompts 01–16) must be **fully completed first**:

| Frontend Rework | What it sets up |
|----------------|----------------|
| Prompt 01 | `md3Theme.ts` — all tool screens consume `useTheme().colors.*` |
| Prompt 02 | `MainNavigator` with Paper `BottomNavigation` — the Tools tab already exists |
| Prompt 08 | `ToolsScreen.tsx` — the hub screen that links to every tool sub-screen |

Once the frontend rework is complete, apply the tool prompts in the order below. Each tool prompt adds or replaces **one tool screen** (and its service layer) without touching any other file.

---

## Guiding Rules (apply to every tool prompt)

1. **Only `react-native-paper` components** for all UI — `Card`, `DataTable`, `Chip`, `List`, `Button`, `FAB`, `Dialog`, `ProgressBar`, `SegmentedButtons`, `TextInput`.
2. **All colors from `useTheme().colors.*`** — no hardcoded hex values anywhere.
3. **All existing hooks, services, navigation, analytics, and i18n preserved verbatim** — only the UI layer changes or is added fresh.
4. **Swiss Ephemeris via `astrologyEngine` service** for every calculation — no third-party calculation API calls that are not already wired up.
5. **Platform-adaptive layout**: use `useWindowDimensions()` to switch between single-column mobile (< 768 px) and two-column web/tablet (≥ 768 px) layouts where appropriate.
6. Every screen ends with an **explicit validation checklist** covering iOS, Android, and web.
7. **No new packages** required — existing `react-native-paper ^5.15`, `react-native-paper-dates ^0.23`, and `react-native-svg ^15` are sufficient.

---

## Execution Order

| # | Folder | Tool Screen Created / Reworked | Depends On |
|---|--------|-------------------------------|-----------|
| 01 | `01-natal-birth-chart/` | `NatalChartScreen.tsx` + `NatalChartWheel` SVG component | #34 prompts 01–08 |
| 02 | `02-synastry-compatibility/` | `SynastryScreen.tsx` + bi-wheel SVG overlay | Tool 01 |
| 03 | `03-transit-calculator/` | `TransitsScreen.tsx` + `TransitTimeline` component | Tool 01 |
| 04 | `04-solar-return/` | `SolarReturnScreen.tsx` | Tool 01 |
| 05 | `05-secondary-progressions/` | `ProgressionsScreen.tsx` | Tool 01 |
| 06 | `06-solar-arc-directions/` | `SolarArcScreen.tsx` | Tool 01 |
| 07 | `07-composite-davison-charts/` | `CompositeChartScreen.tsx` | Tools 01–02 |
| 08 | `08-astrocartography/` | `AstrocartographyScreen.tsx` + SVG world map | Tool 01 |
| 09 | `09-moon-phase-calculator/` | `MoonPhaseScreen.tsx` + animated phase SVG | — (standalone) |
| 10 | `10-lunar-return/` | `LunarReturnScreen.tsx` | Tool 01 |
| 11 | `11-eclipse-calculator/` | `EclipseScreen.tsx` + eclipse calendar grid | — (standalone) |
| 12 | `12-asteroid-calculator/` | `AsteroidScreen.tsx` + asteroid search | Tool 01 |
| 13 | `13-arabic-parts-lots/` | `ArabicPartsScreen.tsx` | Tool 01 |
| 14 | `14-planetary-hours/` | `PlanetaryHoursScreen.tsx` | — (standalone) |
| 15 | `15-numerology/` | `NumerologyScreen.tsx` | — (standalone) |
| 16 | `16-daily-horoscope/` | `DailyHoroscopeScreen.tsx` + push-notification config | #34 prompts 06–07, Tool 03 |

---

## How to use with GitHub Copilot

1. Ensure all 16 prompts from `extensive_frontend_rework/` are applied and passing on all three platforms.
2. Open the relevant source file (or create a new one) in VS Code.
3. Open the corresponding prompt file from this folder.
4. Copy the entire contents.
5. Open GitHub Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`).
6. Paste the prompt and confirm.
7. Review the diff — logic must be identical, only UI and new service wiring should change.
8. Run `cd mobile && npx expo start --web` (web) and `npx expo start` (iOS/Android) to verify the screen renders without errors on all platforms.

---

## Source documents used

| Document | Key insights consumed |
|----------|----------------------|
| `tool_analysis/README.md` | Inputs, outputs, calculation pipeline, platform comparisons for all 16 tools |
| `tool_analysis/calculation_methods.md` | Swiss Ephemeris, house systems, Vedic techniques, aspect calculations |
| `tool_analysis/text_content_analysis.md` | Interpretation depth tiers, writing styles, content length targets |
| `tool_analysis/visual_design_analysis.md` | Chart wheel design, color coding, animation patterns, glyph rendering, touch target sizing |
| `market_analysis/` | Competitor feature gaps; monetization strategy |
| `extensive_frontend_rework/README.md` | MD3 theme, navigation, Paper component rules |
| `md3_frontend_remake_plan.md` | Overall MD3 migration strategy |

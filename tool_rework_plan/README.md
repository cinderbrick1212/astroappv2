# Tool Rework Plan — AstroAppV2

**Date:** February 2026
**Platforms:** Web · iOS · Android
**Tradition:** Vedic / Jyotish (Indian divinatory astrology)
**Purpose:** Fragment the tool rework into 16 self-contained, one-shot-executable GitHub Copilot prompts — one per Jyotish tool — organized by dependency order. Every prompt builds on the MD3 theme and navigation established in the [Extensive Frontend Rework (#34)](../extensive_frontend_rework/README.md).

---

## Philosophical Foundation

All tools in this plan are rooted in **Vedic/Jyotish astrology as a system of divination**:

| Principle | Implementation |
|-----------|---------------|
| **Sidereal zodiac** | Lahiri ayanamsa (default for all charts; currently ~23°51' in 2026) |
| **Whole Sign houses** | Default house system; Rashi = house in Vedic context |
| **Nine grahas** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn + Rahu & Ketu (lunar nodes) |
| **Nakshatra system** | 27 nakshatras of 13°20' each; Moon nakshatra is the primary placement |
| **Vimshottari Dasha** | Primary timing/prediction system; 120-year cycle by Moon's natal nakshatra |
| **Divination first** | Every screen surfaces predictions, interpretations, and remedies — not just raw data |
| **Remedies (Graha Shanti)** | Gemstone, mantra, yantra, and donation recommendations woven into every chart screen |

---

## Platform Targets

Every tool screen must run correctly on all three platforms:

| Platform | Key constraints |
|----------|----------------|
| **iOS** | Safe-area insets, `KeyboardAvoidingView behavior="padding"`, Apple HIG touch targets (44 × 44 pt min) |
| **Android** | `KeyboardAvoidingView behavior="height"`, Material 3 ripple feedback, back-gesture handling |
| **Web** | Responsive container max-width (768 px tablet / 1280 px desktop), two-column layout on wide viewports, hover states on interactive elements |

Use `Platform.OS` guards only where behavior genuinely differs. Prefer Paper components that already adapt across platforms (`Menu`, `Dialog`, `Portal`).

---

## Integration with #34 Frontend Rework

This plan **extends** the `extensive_frontend_rework` sequence. Prompts 01–16 of the frontend rework must be **fully completed first**:

| Frontend Rework | What it sets up |
|----------------|----------------|
| Prompt 01 | `md3Theme.ts` — all tool screens consume `useTheme().colors.*` |
| Prompt 02 | `MainNavigator` with Paper `BottomNavigation` — the Tools tab already exists |
| Prompt 08 | `ToolsScreen.tsx` — the hub screen that links to every tool sub-screen |
| Prompt 12 | `KundliScreen.tsx` — existing Kundli Lite screen; Tool 01 replaces it with the full Janma Kundli |

Once the frontend rework is complete, apply the tool prompts in dependency order below.

---

## Guiding Rules (apply to every tool prompt)

1. **Only `react-native-paper` components** for all UI — `Card`, `DataTable`, `Chip`, `List`, `Button`, `FAB`, `Dialog`, `ProgressBar`, `SegmentedButtons`, `TextInput`.
2. **All colors from `useTheme().colors.*`** — no hardcoded hex values anywhere.
3. **All existing hooks, services, navigation, analytics, and i18n preserved verbatim** — only the UI layer changes or is added fresh.
4. **Swiss Ephemeris via `astrologyEngine` service** for every calculation with **sidereal / Lahiri ayanamsa as the default** — never tropical by default.
5. **Platform-adaptive layout**: `useWindowDimensions()` to switch between single-column mobile (< 768 px) and two-column web/tablet (≥ 768 px).
6. **Divination layer required**: every chart screen must include an interpretation card and a Graha Shanti (remedies) card — not raw numbers alone.
7. Every prompt ends with an **explicit validation checklist** covering iOS, Android, and web.
8. **No new packages** required — `react-native-paper ^5.15`, `react-native-paper-dates ^0.23`, and `react-native-svg ^15` are sufficient.

---

## Content Layer

All display text (interpretations, predictions, remedies, descriptions) is driven by
**DOB + birth time + name** — not hardcoded. See [`CONTENT_LAYER_PLAN.md`](CONTENT_LAYER_PLAN.md)
for the full architecture.

The key principle: every string a user reads is assembled by `ContentService` from
structured data files, keyed to the user's computed chart. Screens receive
`PersonalizedContent` objects and render — they contain zero inline text.

```
name + DOB + birth time + place  →  astrologyEngine  →  ContentService  →  PersonalizedContent  →  Screen
```

---



| # | Folder | Tool Screen | Vedic Name | Depends On |
|---|--------|-------------|-----------|-----------|
| 01 | `01-natal-birth-chart/` | `JanmaKundliScreen.tsx` + `KundliWheel` SVG | Janma Kundli | #34 prompts 01–08 |
| 02 | `02-kundli-milan/` | `KundliMilanScreen.tsx` | Kundli Milan (Ashtakoot) | Tool 01 |
| 03 | `03-vimshottari-dasha/` | `DashaScreen.tsx` + Dasha timeline | Vimshottari Dasha | Tool 01 |
| 04 | `04-gochar-transits/` | `GocharScreen.tsx` + Sade Sati indicator | Gochar | Tool 01 |
| 05 | `05-varshaphal/` | `VarshaphalScreen.tsx` | Varshaphal (Annual Chart) | Tool 01 |
| 06 | `06-navamsa-varga-charts/` | `VargaChartsScreen.tsx` + D9/D10 wheels | Navamsa & Varga | Tool 01 |
| 07 | `07-panchang-vishesh/` | `PanchangVisheshScreen.tsx` | Panchang Vishesh | #34 prompt 14 |
| 08 | `08-muhurta/` | `MuhurtaScreen.tsx` + auspicious window finder | Muhurta | Tool 07 |
| 09 | `09-tithi-chandra/` | `TithiChandraScreen.tsx` + animated moon | Tithi & Chandra | — standalone |
| 10 | `10-nakshatra-vishesh/` | `NakshatraScreen.tsx` + pada analysis | Nakshatra Vishesh | Tool 01 |
| 11 | `11-grahan-eclipse/` | `GrahanScreen.tsx` + eclipse calendar | Grahan | — standalone |
| 12 | `12-ashtakavarga/` | `AshtakavargaScreen.tsx` + SAV grid | Ashtakavarga | Tool 01 |
| 13 | `13-prashna-horary/` | `PrashnaScreen.tsx` + question chart | Prashna | Tool 01 |
| 14 | `14-hora-planetary-hours/` | `HoraScreen.tsx` + live hora indicator | Hora | — standalone |
| 15 | `15-graha-shanti-remedies/` | `GrahaShantiremediesScreen.tsx` | Graha Shanti | Tool 01 |
| 16 | `16-dainik-rashifal/` | `DainikRashifalScreen.tsx` + notification config | Dainik Rashifal | #34 prompts 06–07, Tool 04 |

---

## How to use with GitHub Copilot

1. Ensure all 16 prompts from `extensive_frontend_rework/` are applied and verified on all three platforms.
2. Open the relevant source file (or create a new file) in VS Code.
3. Open the prompt file from the corresponding subfolder.
4. Copy the entire contents of the prompt.
5. Open GitHub Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`).
6. Paste the prompt and confirm.
7. Review the diff — logic must be identical, only UI and new service wiring should change.
8. Verify on all platforms: `npx expo start --web`, `npx expo run:ios`, `npx expo run:android`.

---

## Source documents used

| Document | Key insights consumed |
|----------|----------------------|
| `tool_analysis/README.md` | Inputs, outputs, calculation pipeline for all 16 tools |
| `tool_analysis/calculation_methods.md` | Lahiri ayanamsa, Whole Sign houses, Vimshottari Dasha, Navamsa, Ashtakavarga, Nakshatra system |
| `tool_analysis/text_content_analysis.md` | Interpretation depth tiers; Vedic divinatory writing style |
| `tool_analysis/visual_design_analysis.md` | Chart wheel design, element color coding, animation patterns, touch target standards |
| `market_analysis/` | Indian competitor feature gaps (Astrotalk, mPanchang, AstroSage); monetization strategy |
| `extensive_frontend_rework/README.md` | MD3 theme tokens, navigation, Paper component rules |
| `md3_frontend_remake_plan.md` | Overall MD3 migration strategy |

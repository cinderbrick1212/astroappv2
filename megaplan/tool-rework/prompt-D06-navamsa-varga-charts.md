# Plan 06 — Navamsa & Varga Charts (Divisional Charts)

## Tradition
Vedic / Jyotish — Shodashavarga (16 divisional charts). Priority order: D1 (Rashi),
D9 (Navamsa), D10 (Dashamsha), D12 (Dwadashamsha), D3 (Drekkana), D7 (Saptamsha).

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `VargaCharts`.
Depends on Tool 01 (Janma Kundli) — Varga charts are sub-divisions of the natal chart.

---

## What this tool does

Displays the user's divisional charts. The Navamsa (D9) is the most important
after the Rashi (D1) — it reveals the soul's deeper nature, marriage potential,
and spiritual destiny. The Dashamsha (D10) reveals career and public life.
Each chart is rendered as a North Indian square wheel with a divinatory reading.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised reading |
| `birth_date`, `birth_time`, `birth_place` | All Varga charts require precise birth time — even 2 minutes alters D9 |

---

## Divisional charts to include

| Chart | Division | Primary use |
|-------|:--------:|------------|
| D9 — Navamsa | 9 | Marriage, soul nature, spiritual path — most important Varga |
| D10 — Dashamsha | 10 | Career, profession, public reputation |
| D12 — Dwadashamsha | 12 | Parents, ancestry, karmic inheritance |
| D3 — Drekkana | 3 | Siblings, courage, short journeys |
| D7 — Saptamsha | 7 | Children, creativity, legacy |

---

## Content layer — what `contentService.getVargaContent(profile, chartType)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Chart name and what it reveals about the user |
| `vargaLagna` | Lagna in this divisional chart + interpretation |
| `planetPositions[]` | Planet → sign (in this Varga) → brief dignity note |
| `chartReading` | 2–3 paragraph divinatory interpretation specific to this Varga's domain |
| `vargottamaList[]` | Planets that are Vargottama (same sign in D1 and D9) — highlighted as especially strong |
| `remedyCard` | Relevant Graha Shanti for the most afflicted planet in this Varga |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/VargaChartsScreen.tsx` | Main screen with chart selector |
| `components/KundliWheel.tsx` | Reused from Tool 01 — renders any North Indian square chart |
| `components/VargottamaChip.tsx` | Highlights planets that are Vargottama |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `calculateVargaChart(profile, divisor)` | Computes D9/D10/D12/D3/D7 planetary positions |
| `contentService` | `getVargaContent(profile, chartType)` | Assembles chart-specific interpretation |
| `analytics` | `vargaChartsViewed(chartType)` | Fires on chart selection |

---

## Layout

- **Mobile**: `SegmentedButtons` tab selector (D9 / D10 / D12 / D3 / D7) → selected wheel → planet positions → chart reading
- **Web/Tablet**: Chart selector top; wheel left, planet list + reading right

---

## Key UI rules (from megaplan theme)

- Active chart tab: `SegmentedButtons` from react-native-paper
- Vargottama planets: `primaryContainer` Chip with star icon
- Chart reading card: `elevated` with `titleMedium` heading matching chart domain
- Afflicted planet remedies: `errorContainer` chips

---

## Validation checklist

- [ ] D9 is the default chart shown on open
- [ ] All Varga charts calculated from exact birth time using sidereal (Lahiri)
- [ ] Vargottama planets (same sign in D1 and D9) highlighted prominently
- [ ] Chart reading paragraph sourced from `contentService` — specific to D9 vs D10 vs D12, etc.
- [ ] Switching chart tabs recalculates and re-renders without full screen reload
- [ ] Birth-time sensitivity warning shown (e.g., "Varga charts require accurate birth time")
- [ ] Remedy card updates for the selected chart's afflicted planet

# Plan 12 — Ashtakavarga (Planetary Strength Grid)

## Tradition
Vedic / Jyotish — Ashtakavarga system: each planet contributes benefic points (0 or 1)
to each of the 12 signs, producing an 8×12 grid (8 contributors including Lagna × 12 signs).
The Sarva Ashtakavarga (SAV) totals per sign predict overall life strength in each house.

## Platforms
Web · iOS · Android

## Integration with #34
Depends on #34 prompts 01 (theme) and 08 (ToolsScreen). New route: `Ashtakavarga`.
Depends on Tool 01 (requires full natal chart).

---

## What this tool does

Displays the user's complete Ashtakavarga grid and the Sarva (total) Ashtakavarga.
The SAV score per house indicates strength in that life area — career, marriage,
health, wealth, etc. Provides divinatory interpretation of the highest and lowest
scoring houses.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised reading |
| `birth_date`, `birth_time`, `birth_place` | All planetary positions for the full 8×12 grid |

---

## Content layer — what `contentService.getAshtakavargaContent(profile)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + strongest and weakest house summary |
| `savGrid[]` | 12 houses with their SAV totals (0–56) |
| `savInterpretation[]` | Per house — SAV score, strength rating, divinatory reading for that life area |
| `strongestHouses` | Top 3 houses by SAV score with brief prosperity prediction |
| `weakestHouses` | Bottom 3 houses by SAV score with remedial suggestion |
| `planetGrids[]` | Per planet — its individual Ashtakavarga row (12 scores) with brief note on transit timing |
| `transitTip` | Which houses currently have planets transiting — SAV score informs transit strength |
| `remedyCard` | Remedy for the planet with the weakest individual Ashtakavarga |

### SAV score thresholds (stored in content data)

| Score | Rating |
|-------|--------|
| 30–56 | Strong (शक्तिशाली) |
| 25–29 | Moderate (सामान्य) |
| 0–24 | Weak (निर्बल) — remedy recommended |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/AshtakavargaScreen.tsx` | Main screen |
| `components/SavGrid.tsx` | 12-cell grid showing SAV totals — color-coded by strength |
| `components/PlanetAshtakavargaRow.tsx` | Expandable row showing a single planet's 12 scores |
| `components/HouseStrengthCard.tsx` | Strongest/weakest house interpretation card |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `calculateAshtakavarga(profile)` | Full 8×12 grid + SAV totals |
| `contentService` | `getAshtakavargaContent(profile)` | House strength interpretations and transit tips |
| `analytics` | `ashtakavargaViewed()` | Fires on mount |

---

## Layout

- **Mobile**: SAV grid (compact 12-cell) → strongest/weakest house cards → planet-by-planet accordion
- **Web/Tablet**: Full 8×12 grid table left; interpretation cards right

---

## Key UI rules (from #34 theme)

- SAV ≥ 30 cells: `primaryContainer` fill in grid
- SAV 25–29 cells: `secondaryContainer` fill
- SAV < 25 cells: `errorContainer` fill
- Grid uses `DataTable` on web (full 8×12); compact 12-cell SAV strip on mobile
- House strength cards: color matches SAV rating

---

## Validation checklist

- [ ] All 8 contributors calculated (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn + Lagna)
- [ ] SAV totals per sign add up correctly (max 56)
- [ ] Each house SAV total shown with color-coded strength rating
- [ ] Interpretation for each house sourced from `contentService` — no inline strings
- [ ] Strongest and weakest 3 houses highlighted with predictions
- [ ] Transit tip updates when current planetary positions are applied to SAV
- [ ] Web: full 8×12 DataTable; Mobile: SAV strip + expandable planet rows

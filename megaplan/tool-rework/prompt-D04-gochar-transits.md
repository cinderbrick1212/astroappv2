# Plan 04 — Gochar (Current Planetary Transits)

## Tradition
Vedic / Jyotish — Gochar (transit of planets over natal positions), Sade Sati,
Ashtama Shani, and Jupiter transit (Guru Gochar) as primary timing indicators.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `Gochar`.
Feeds prediction content into the daily feed (Tool 16 — Dainik Rashifal).

---

## What this tool does

Shows current real-time planetary positions (updated daily) overlaid on the user's
natal chart. Highlights significant Vedic transits — especially Sade Sati (Saturn
over natal Moon ± 1 sign), Ashtama Shani (Saturn in 8th from Moon), and Jupiter's
annual transit — with personalised divinatory predictions.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised predictions |
| `birth_date`, `birth_time`, `birth_place` | Natal chart for transit overlay |

### Live ephemeris data (from `astrologyEngine.getCurrentPositions()`)
Current sidereal longitudes of all 9 grahas — refreshed daily.

---

## Content layer — what `contentService.getGocharContent(profile, today)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + most significant active transit in one sentence |
| `sadeSatiStatus` | Active / Not active; if active: which phase (rising/peak/setting), prediction paragraph |
| `ashtamaShaniStatus` | Active / Not active; prediction if active |
| `guruGocharCard` | Jupiter's current sign, transit over which natal house, prediction |
| `activeTransits[]` | Each significant current transit — transiting graha, natal planet/house aspected, orb, prediction |
| `transitCalendar[]` | Next 3 months — upcoming exact transit dates with brief labels |
| `remedyCard` | Remedies for the most challenging active transit |

### Sade Sati phases (stored in content data, not logic)

| Phase | Condition | Nature |
|-------|-----------|--------|
| Rising (Utharayana) | Saturn in sign before natal Moon | Preparatory; financial caution |
| Peak (Madhyama) | Saturn exactly on natal Moon sign | Most intense; inner transformation |
| Setting (Astama) | Saturn in sign after natal Moon | Resolution; rebuilding |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/GocharScreen.tsx` | Main screen |
| `components/GocharBiWheel.tsx` | SVG bi-wheel — inner natal, outer current transits |
| `components/TransitCard.tsx` | Reusable card per active transit with planet icons and prediction |
| `components/SadeSatiBanner.tsx` | Prominent banner shown only when Sade Sati is active |
| `components/TransitCalendar.tsx` | 3-month calendar grid with transit annotations |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `getCurrentPositions()` | Live sidereal planet positions |
| `astrologyEngine` | `calculateGochar(profile, today)` | Transit-over-natal analysis |
| `contentService` | `getGocharContent(profile, today)` | Personalised transit predictions |
| `analytics` | `gocharViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Sade Sati banner (if active) → bi-wheel → active transit cards → 3-month calendar
- **Web/Tablet**: Bi-wheel and active transit list side-by-side; calendar full-width below

---

## Key UI rules (from #34 theme)

- Sade Sati banner: `errorContainer` background — highly visible when active
- Benefic transit cards: `primaryContainer`; malefic: `errorContainer`
- Bi-wheel: inner natal ring muted, outer transit ring in `primary` color
- Calendar annotations: color-coded by planet (from `theme.colors.*` tokens only)

---

## Validation checklist

- [ ] Current planet positions are sidereal (Lahiri) — not tropical
- [ ] Sade Sati correctly detected from Saturn's current sign vs natal Moon sign
- [ ] Sade Sati banner shown prominently when active; hidden when not
- [ ] Each active transit card shows transiting graha, natal house, orb, and prediction from content service
- [ ] Transit calendar shows next 3 months of significant exact transit dates
- [ ] All prediction text sourced from `contentService` — no hardcoded strings in JSX
- [ ] Bi-wheel renders on Web, iOS, Android without overflow
- [ ] Remedies shown for most challenging active transit

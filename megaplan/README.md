# AstroAppV2 — Mega Rework Plan

**Date:** February 2026
**Platforms:** Web · iOS · Android
**Tradition:** Vedic / Jyotish (Indian divinatory astrology — sidereal Lahiri, Whole Sign)
**Purpose:** One master execution plan that integrates the AstrologyEngine rework,
the Storage system rework, the MD3 Frontend Rework (#34), and the 16 Jyotish Tool
Rework Plan into a single, numbered, sequentially executable sequence of GitHub
Copilot prompts.

---

## Guiding Rules (apply to every prompt in this megaplan)

These rules extend the ones from the frontend rework and apply to all four phases:

1. **Only `react-native-paper` components** — no raw `TouchableOpacity` wrappers,
   no custom `StyleSheet` cards.
2. **All colors from `useTheme().colors.*`** — zero hardcoded hex values in any
   component.
3. **All calculations are sidereal (Lahiri ayanamsa)** — the engine never returns
   tropical longitudes to the UI layer; conversion happens inside the engine.
4. **No hardcoded user-facing strings in screens or services** — all display text
   comes from `ContentService` (see `CONTENT_LAYER_PLAN.md`).
5. **Platform-adaptive, not platform-specific** — use `Platform.OS` guards only
   where behavior genuinely differs; prefer Paper/Expo components that handle
   all three platforms natively.
6. **Storage is always typed** — every key is a member of the `StorageKeys` enum;
   every cached value has a known TypeScript interface.
7. **Every existing hook, service call, navigation route, analytics event, and
   i18n key is preserved verbatim** unless the prompt explicitly says to replace it.
8. **Each prompt is self-contained and executable in a single Copilot pass** —
   it supplies the current file content, the exact required changes, and a
   validation checklist.

---

## Four-Phase Architecture

```
Phase A — Engine Rework  (8 prompts)
  mobile/src/services/engine/
    ephemeris.ts       ← A01
    houses.ts          ← A02
    nakshatra.ts       ← A03
    dasha.ts           ← A04
    panchang.ts        ← A05
    ashtakoot.ts       ← A06
    yogas.ts           ← A07 (part 1)
    vargas.ts          ← A07 (part 2)
    ashtakavarga.ts    ← A07 (part 3)
  mobile/src/services/astrologyEngine.ts  ← A08 (unified public API)

Phase B — Storage Rework  (3 prompts)
  mobile/src/utils/storageTypes.ts   ← B01
  mobile/src/utils/chartCache.ts     ← B02
  mobile/src/utils/storage.ts        ← B03 (updated)

Phase C — Frontend Rework  (16 prompts)
  frontend-rework/prompt-C01 … prompt-C16

Phase D — Tool Rework  (16 prompts)
  tool-rework/prompt-D01 … prompt-D16
```

**Dependency order: A → B → C → D**
Phase A and B can be worked in parallel (engine has no UI dependency).
Phase C must wait for B (screens read from storage).
Phase D must wait for C (tools build on the MD3 UI shell).

---

## Master Execution Table

| # | Phase | Prompt file | What it does | Touches |
|---|-------|-------------|-------------|---------|
| A01 | Engine | `engine-rework/prompt-A01-ephemeris-core.md` | Create `engine/ephemeris.ts` — JD conversion, Lahiri ayanamsa, tropical longitudes for all 9 grahas | New file |
| A02 | Engine | `engine-rework/prompt-A02-houses-lagna.md` | Create `engine/houses.ts` — GMST, LST, Whole Sign Ascendant, 12 house cusps | New file |
| A03 | Engine | `engine-rework/prompt-A03-nakshatra-tithi.md` | Create `engine/nakshatra.ts` — 27 nakshatras, 4 padas, Tithi, Panchang Yoga, Karana | New file |
| A04 | Engine | `engine-rework/prompt-A04-vimshottari-dasha.md` | Create `engine/dasha.ts` — full 120-year Dasha sequence, Mahadasha + Antardasha + Pratyantardasha | New file |
| A05 | Engine | `engine-rework/prompt-A05-panchang-muhurta.md` | Create `engine/panchang.ts` — sunrise/sunset, Rahu Kaal, Gulika, Hora schedule, Muhurta scorer | New file |
| A06 | Engine | `engine-rework/prompt-A06-ashtakoot-milan.md` | Create `engine/ashtakoot.ts` — all 8 Koot scoring functions + Mangal Dosha | New file |
| A07 | Engine | `engine-rework/prompt-A07-yogas-vargas-ashtakavarga.md` | Create `engine/yogas.ts`, `engine/vargas.ts`, `engine/ashtakavarga.ts` | 3 new files |
| A08 | Engine | `engine-rework/prompt-A08-engine-index.md` | Rewrite `services/astrologyEngine.ts` as thin public API over Phase A modules; deprecate old functions | Update file |
| B01 | Storage | `storage-rework/prompt-B01-storage-types.md` | Create `utils/storageTypes.ts` — typed `StorageKeys` enum, `CacheEntry<T>`, TTL constants | New file |
| B02 | Storage | `storage-rework/prompt-B02-chart-cache.md` | Create `utils/chartCache.ts` — platform-adaptive caching (AsyncStorage mobile / localStorage web) with TTL, invalidation, per-user keys | New file |
| B03 | Storage | `storage-rework/prompt-B03-content-cache.md` | Update `utils/storage.ts` — add typed wrappers, feed/Rashifal cache with stale-while-revalidate, Prashna history | Update file |
| C01 | Frontend | `frontend-rework/prompt-C01-theme-setup.md` | Create MD3 theme file; update `App.tsx` | `theme/md3Theme.ts`, `App.tsx` |
| C02 | Frontend | `frontend-rework/prompt-C02-navigation.md` | Replace bottom tab navigator with Paper `BottomNavigation` | `navigation/MainNavigator.tsx` |
| C03 | Frontend | `frontend-rework/prompt-C03-login-screen.md` | Rewrite `LoginScreen.tsx` | `screens/LoginScreen.tsx` |
| C04 | Frontend | `frontend-rework/prompt-C04-onboarding-part-a.md` | Rewrite `OnboardingScreen.tsx` steps 0–2 | `screens/OnboardingScreen.tsx` |
| C05 | Frontend | `frontend-rework/prompt-C05-onboarding-part-b.md` | Rewrite `OnboardingScreen.tsx` steps 3–4 + outer shell | `screens/OnboardingScreen.tsx` |
| C06 | Frontend | `frontend-rework/prompt-C06-daily-feed-screen.md` | Rewrite `DailyFeedScreen.tsx` | `screens/DailyFeedScreen.tsx` |
| C07 | Frontend | `frontend-rework/prompt-C07-feed-components.md` | Rewrite `FeedItemCard`, `AdCard`, `RemedyCard` | `components/` |
| C08 | Frontend | `frontend-rework/prompt-C08-tools-screen.md` | Rewrite `ToolsScreen.tsx` | `screens/ToolsScreen.tsx` |
| C09 | Frontend | `frontend-rework/prompt-C09-home-screen.md` | Rewrite `HomeScreen.tsx` | `screens/HomeScreen.tsx` |
| C10 | Frontend | `frontend-rework/prompt-C10-profile-part-a.md` | Rewrite `ProfileScreen.tsx` — main view | `screens/ProfileScreen.tsx` |
| C11 | Frontend | `frontend-rework/prompt-C11-profile-part-b.md` | Rewrite `ProfileScreen.tsx` — edit-details modal | `screens/ProfileScreen.tsx` |
| C12 | Frontend | `frontend-rework/prompt-C12-kundli-screen.md` | Rewrite `KundliScreen.tsx` | `screens/KundliScreen.tsx` |
| C13 | Frontend | `frontend-rework/prompt-C13-compatibility-screen.md` | Rewrite `CompatibilityScreen.tsx` | `screens/CompatibilityScreen.tsx` |
| C14 | Frontend | `frontend-rework/prompt-C14-panchang-screen.md` | Rewrite `PanchangScreen.tsx` | `screens/PanchangScreen.tsx` |
| C15 | Frontend | `frontend-rework/prompt-C15-blog-screens.md` | Rewrite `BlogListScreen.tsx` + `BlogPostScreen.tsx` | `screens/Blog*.tsx` |
| C16 | Frontend | `frontend-rework/prompt-C16-service-screens.md` | Rewrite `AskQuestionScreen`, `BookCallScreen`, `RequestReportScreen` | `screens/` |
| D01 | Tools | `tool-rework/prompt-D01-natal-birth-chart.md` | Create `JanmaKundliScreen.tsx` + `KundliWheel` SVG | New files |
| D02 | Tools | `tool-rework/prompt-D02-kundli-milan.md` | Create `KundliMilanScreen.tsx` | New file |
| D03 | Tools | `tool-rework/prompt-D03-vimshottari-dasha.md` | Create `DashaScreen.tsx` + Dasha timeline | New files |
| D04 | Tools | `tool-rework/prompt-D04-gochar-transits.md` | Create `GocharScreen.tsx` + Sade Sati indicator | New files |
| D05 | Tools | `tool-rework/prompt-D05-varshaphal.md` | Create `VarshaphalScreen.tsx` | New file |
| D06 | Tools | `tool-rework/prompt-D06-navamsa-varga-charts.md` | Create `VargaChartsScreen.tsx` + D9/D10 wheels | New files |
| D07 | Tools | `tool-rework/prompt-D07-panchang-vishesh.md` | Create `PanchangVisheshScreen.tsx` | New file |
| D08 | Tools | `tool-rework/prompt-D08-muhurta.md` | Create `MuhurtaScreen.tsx` + auspicious window finder | New files |
| D09 | Tools | `tool-rework/prompt-D09-tithi-chandra.md` | Create `TithiChandraScreen.tsx` + animated moon | New files |
| D10 | Tools | `tool-rework/prompt-D10-nakshatra-vishesh.md` | Create `NakshatraScreen.tsx` + pada analysis | New files |
| D11 | Tools | `tool-rework/prompt-D11-grahan-eclipse.md` | Create `GrahanScreen.tsx` + eclipse calendar | New files |
| D12 | Tools | `tool-rework/prompt-D12-ashtakavarga.md` | Create `AshtakavargaScreen.tsx` + SAV grid | New files |
| D13 | Tools | `tool-rework/prompt-D13-prashna-horary.md` | Create `PrashnaScreen.tsx` + question chart | New files |
| D14 | Tools | `tool-rework/prompt-D14-hora-planetary-hours.md` | Create `HoraScreen.tsx` + live hora indicator | New files |
| D15 | Tools | `tool-rework/prompt-D15-graha-shanti-remedies.md` | Create `GrahaShantScreen.tsx` | New file |
| D16 | Tools | `tool-rework/prompt-D16-dainik-rashifal.md` | Create `DainikRashifalScreen.tsx` + notification config | New files |

---

## Phase A — Engine Rework Detail

### Why rework the engine?

The current `astrologyEngine.ts` is a single 240-line file that:
- Only calculates Sun and Moon positions (7 grahas missing: Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
- Has a simplified Dasha calculator (only Mahadasha — no Antardasha or Pratyantardasha)
- Has no Yoga detection
- Has no Varga chart support (D9, D10, D12, D3, D7)
- Has no Ashtakavarga grid
- Has no Prashna chart capability
- Mixes calculation concerns with lookup tables

The rework splits the engine into focused modules while keeping the same public API
surface so existing screens are not broken.

### New module responsibilities

| Module | Single responsibility |
|--------|----------------------|
| `engine/ephemeris.ts` | Astronomical primitives: Julian Day, ayanamsa, tropical positions for all 9 grahas, normalize angle |
| `engine/houses.ts` | Local Sidereal Time, Ascendant, 12 Whole Sign house cusps, planet-to-house assignment |
| `engine/nakshatra.ts` | Nakshatra index, pada, sidereal degree range per nakshatra, Tithi index, Panchang Yoga, Karana |
| `engine/dasha.ts` | Vimshottari Dasha sequence, Mahadasha balance from nakshatra degree, Antardasha, Pratyantardasha |
| `engine/panchang.ts` | Sunrise/sunset, Rahu Kaal, Gulika Kaal, Yamghant, Hora schedule, Abhijit Muhurta, basic Muhurta scoring |
| `engine/ashtakoot.ts` | All 8 Koot functions (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) + Mangal Dosha |
| `engine/yogas.ts` | Detection of Rajayogas, Dhana Yogas, Pancha Mahapurusha Yogas, key Doshas (Mangal, Kaal Sarpa, Kemadrum) |
| `engine/vargas.ts` | Divisional chart computation: D9 (Navamsa), D10 (Dashamsha), D12 (Dwadashamsha), D3, D7; Vargottama detection |
| `engine/ashtakavarga.ts` | 8×12 individual Ashtakavarga grids + Sarva Ashtakavarga totals per sign |

### Backward compatibility contract (A08)

`astrologyEngine.ts` keeps every method that existing screens call:
- `toJulianDay(date)` — delegates to `ephemeris.toJulianDay`
- `calcSunLongitude(jd)` — delegates to `ephemeris.getSunLongitude`
- `calcMoonLongitude(jd)` — delegates to `ephemeris.getMoonLongitude`
- `tropicalToVedic(lon, jd)` — delegates to `ephemeris.siderealLongitude`
- `calculateChart(date, lat, lng, tz)` — expanded to include all 9 grahas
- `getZodiacSign(lon)` — unchanged
- `getMoonSign(date)` — unchanged
- `getSunSign(date)` — unchanged
- `getNakshatra(moonLon)` — delegates to `nakshatra.getNakshatraName`
- `getNakshatraIndex(moonLon)` — delegates to `nakshatra.getNakshatraIndex`
- `getRashiIndex(lon)` — unchanged

New methods added in A08 (used by Phase D tool prompts):
- `calculateDasha(profile)` — full timeline via `dasha` module
- `calculateGochar(profile, date)` — transit-over-natal analysis
- `calculateVarshaphal(profile, year)` — annual solar return
- `calculateVargaChart(profile, divisor)` — any divisional chart
- `calculateAshtakavarga(profile)` — full 8×12 grid + SAV
- `calculatePrashna(timestamp, lat, lng)` — horary chart
- `getEclipses(year)` — solar and lunar eclipses for the year
- `getCurrentPositions()` — live sidereal planet positions for today

---

## Phase B — Storage Rework Detail

### Why rework storage?

The current `storage.ts` is a thin AsyncStorage wrapper with:
- Untyped `get<T>(key: string)` — key is an unvalidated string
- No TTL (time-to-live) on any cached data — Kundli can be stale forever
- No platform adaptation — `AsyncStorage` is not available on web; the web build silently fails
- No per-user cache isolation — if a user logs out, another user's chart appears
- No Prashna history storage structure
- No versioning — schema changes break existing caches silently

### Storage rework architecture

```
storageTypes.ts
  StorageKeys enum            ← typed; compile-error if key is misspelled
  CacheEntry<T> interface     ← { data: T, storedAt: number, version: number }
  TTL constants               ← KUNDLI_TTL_MS, FEED_TTL_MS, PANCHANG_TTL_MS …
  CACHE_VERSION constant      ← increment to auto-invalidate all caches on schema change

chartCache.ts
  getPlatformStorage()        ← AsyncStorage on mobile, localStorage adapter on web
  getCachedChart(userId, key) ← reads, checks TTL + version, returns null if stale
  setCachedChart(userId, key, data) ← writes with timestamp + version
  clearUserCache(userId)      ← called on logout to wipe per-user data
  clearAllCaches()            ← called on CACHE_VERSION bump

storage.ts  (updated)
  All existing methods unchanged
  New: getTyped<K extends StorageKeys>()   ← compile-safe typed getter
  New: setTyped<K extends StorageKeys>()   ← compile-safe typed setter
  New: savePrashnaHistory(entry)           ← append to local Prashna history list
  New: getPrashnaHistory()                 ← returns last 20 Prashna entries
  New: getFeedCache() / setFeedCache()     ← stale-while-revalidate feed caching
```

### Platform-adaptive storage

| Platform | Storage backend | Notes |
|----------|----------------|-------|
| iOS / Android | `@react-native-async-storage/async-storage` | Existing dependency |
| Web | `localStorage` adapter wrapped in the same interface | No new dependency needed; `window.localStorage` is synchronous — adapter makes it async-compatible |

The `getPlatformStorage()` factory in `chartCache.ts` returns the right backend.
All callers use the same `getCachedChart` / `setCachedChart` API regardless of platform.

---

## Phase C — Frontend Rework

See `frontend-rework/` for the complete 16-prompt sequence (C01–C16).

**Execute after Phase B is complete.** Key dependency: C01 (theme setup) and C02
(navigation) use the storage system but do not depend on engine changes.
C12 (KundliScreen), C13 (CompatibilityScreen), and C14 (PanchangScreen) call
`kundliService`, `compatibilityService`, and `panchangService` — all of which
will be using the new Phase A engine modules by the time Phase C runs.

---

## Phase D — Tool Rework

See `tool-rework/` for the complete 16-prompt sequence (D01–D16).

**Execute after Phase C is complete.** Every tool screen:
- Uses the MD3 theme from C01
- Uses the BottomNavigation from C02 (Tools tab already exists)
- Uses the new engine methods from A08 (`calculateDasha`, `calculateGochar`, etc.)
- Uses the typed storage from B01–B03 for caching
- Uses `ContentService` from `CONTENT_LAYER_PLAN.md` for all display text

---

## Platform Validation Checklist (run after each phase)

### After Phase A (Engine)
- [ ] `cd mobile && npx tsc --noEmit` — zero TypeScript errors across all engine modules
- [ ] All 9 grahas returned in `calculateChart()` output
- [ ] Sun and Moon longitudes match old engine output to within 0.1° for a test date (1990-01-01 12:00 UTC, 77.2°E 28.6°N)
- [ ] Vimshottari Dasha sequence sums to 120 years exactly
- [ ] Ashtakavarga SAV totals per sign never exceed 56

### After Phase B (Storage)
- [ ] `cd mobile && npx expo start --web` — no `AsyncStorage` import errors on web
- [ ] `cd mobile && npx expo start --ios` — Kundli cache hits after first calculation
- [ ] Per-user cache isolation: clearing `userId` from cache removes only that user's data
- [ ] Prashna history stores and retrieves correctly on all 3 platforms

### After Phase C (Frontend)
- [ ] `cd mobile && npx expo start` compiles without errors (iOS + Android + Web)
- [ ] All screens use `useTheme().colors.*` — grep for hardcoded hex values returns zero hits
- [ ] Navigation uses Paper `BottomNavigation` — no `@react-navigation/bottom-tabs` tab icons
- [ ] Responsive layout: web ≥ 768 px shows two-column layout on Kundli, Compatibility, Panchang screens

### After Phase D (Tools)
- [ ] All 16 tool screens navigate correctly from ToolsScreen hub
- [ ] All tool screens work on Web, iOS, Android — no platform-specific crashes
- [ ] Sade Sati banner appears for a test profile with Saturn on natal Moon sign
- [ ] Dasha timeline sums correctly and highlights current Mahadasha
- [ ] All display text sourced from `ContentService` — `grep -r 'hardcoded\|TODO\|FIXME'` returns zero hits in screen files

---

## Directory Map After All Four Phases

```
mobile/src/
├── services/
│   ├── engine/                    ← Phase A (new)
│   │   ├── ephemeris.ts
│   │   ├── houses.ts
│   │   ├── nakshatra.ts
│   │   ├── dasha.ts
│   │   ├── panchang.ts
│   │   ├── ashtakoot.ts
│   │   ├── yogas.ts
│   │   ├── vargas.ts
│   │   └── ashtakavarga.ts
│   ├── astrologyEngine.ts         ← A08: updated public API
│   ├── kundli.ts                  ← updated to use engine/
│   ├── compatibility.ts           ← updated to use engine/ashtakoot
│   ├── panchang.ts                ← updated to use engine/panchang
│   └── horoscope.ts               ← updated to use contentService
│
├── utils/
│   ├── storageTypes.ts            ← Phase B01 (new)
│   ├── chartCache.ts              ← Phase B02 (new)
│   └── storage.ts                 ← Phase B03 (updated)
│
├── data/                          ← content library (CONTENT_LAYER_PLAN.md)
│   ├── types.ts
│   ├── grahas.ts
│   ├── rashi.ts
│   ├── nakshatras.ts
│   ├── yogas.ts
│   ├── dashas.ts
│   ├── remedies.ts
│   ├── ashtakoot.ts
│   ├── panchang.ts
│   ├── muhurta.ts
│   ├── rashifal.ts
│   ├── contentService.ts          ← new (CONTENT_LAYER_PLAN.md)
│   └── index.ts
│
├── theme/
│   └── md3Theme.ts                ← Phase C01
│
├── navigation/
│   ├── RootNavigator.tsx          ← unchanged
│   ├── AuthNavigator.tsx          ← unchanged
│   └── MainNavigator.tsx          ← Phase C02 (updated)
│
├── screens/                       ← Phase C03–C16 + Phase D01–D16
│   ├── LoginScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── DailyFeedScreen.tsx
│   ├── ToolsScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── KundliScreen.tsx           ← replaced by JanmaKundliScreen (D01)
│   ├── CompatibilityScreen.tsx    ← replaced by KundliMilanScreen (D02)
│   ├── PanchangScreen.tsx         ← extended by PanchangVisheshScreen (D07)
│   ├── DashaScreen.tsx            ← D03 (new)
│   ├── GocharScreen.tsx           ← D04 (new)
│   ├── VarshaphalScreen.tsx       ← D05 (new)
│   ├── VargaChartsScreen.tsx      ← D06 (new)
│   ├── MuhurtaScreen.tsx          ← D08 (new)
│   ├── TithiChandraScreen.tsx     ← D09 (new)
│   ├── NakshatraScreen.tsx        ← D10 (new)
│   ├── GrahanScreen.tsx           ← D11 (new)
│   ├── AshtakavargaScreen.tsx     ← D12 (new)
│   ├── PrashnaScreen.tsx          ← D13 (new)
│   ├── HoraScreen.tsx             ← D14 (new)
│   ├── GrahaShantScreen.tsx       ← D15 (new)
│   ├── DainikRashifalScreen.tsx   ← D16 (new)
│   ├── AskQuestionScreen.tsx
│   ├── BookCallScreen.tsx
│   ├── RequestReportScreen.tsx
│   ├── BlogListScreen.tsx
│   └── BlogPostScreen.tsx
│
└── components/
    ├── KundliWheel.tsx            ← D01 (new, reused by D05, D06, D13)
    ├── PlanetDetailDialog.tsx     ← D01
    ├── MilanScoreCard.tsx         ← D02
    ├── AshtakootTable.tsx         ← D02
    ├── DashaTimeline.tsx          ← D03
    ├── GocharBiWheel.tsx          ← D04
    ├── SadeSatiBanner.tsx         ← D04
    ├── MoonPhaseVisual.tsx        ← D09
    ├── NakshatraWheel.tsx         ← D10
    ├── SavGrid.tsx                ← D12
    ├── CurrentHoraBanner.tsx      ← D14
    ├── RemedyCard.tsx             ← existing (updated)
    ├── FeedItemCard.tsx           ← C07
    ├── AdCard.tsx                 ← C07
    ├── LoadingSkeleton.tsx        ← unchanged
    └── OfflineBanner.tsx          ← unchanged
```

# Material Design 3 Frontend Remake Plan — AstroAppV2

**Date:** February 2026  
**Scope:** Complete frontend redesign of the React Native (Expo) mobile app using Material Design 3  
**Source Analysis:** frontend.md, backend.md, tool_analysis/*, market_analysis/*, visual_design_analysis.md  

---

## Part 1 — 10 Possible MD3 Remake Options

Each option below describes a distinct design direction. All 10 remain fully within MD3 constraints using `react-native-paper` and `react-native-paper-dates`.

---

### Option 1 — Cosmic Dark MD3

**Core idea:** Deep-space dark theme using MD3's dark color scheme. Primary seed color: deep violet `#4A148C` → MD3 generates a full dark tonal palette with purple surfaces, on-surface golds, and tonal containers that evoke a premium night-sky aesthetic.

**MD3 color roles (dark scheme):**
- `primary`: `#D0BCFF` (light purple tint on dark — Material You auto-generated)
- `onPrimary`: `#381E72`
- `primaryContainer`: `#4F378B`
- `surface`: `#1C1B1F`
- `surfaceVariant`: `#49454F`

**Best for:** Serious daily users, premium positioning. Matches the "cosmic premium" trend (Pattern, Sanctuary, Co-Star dark). Avoids the clinical coldness of pure Co-Star black.

**Risk:** Dark OLED-heavy UI can feel heavy for light-use contexts; content-heavy feed screens may feel claustrophobic.

---

### Option 2 — Warm Light Material You

**Core idea:** Light scheme seeded from a warm saffron-gold `#FF8F00`. MD3 Material You generates a warm amber-cream tonal surface system. All cards feel warm and grounded — echoing the Chani App earthy aesthetic but inside a strict MD3 framework.

**MD3 color roles (light scheme):**
- `primary`: `#7B5800`
- `onPrimary`: `#FFFFFF`
- `primaryContainer`: `#FFDEAE`
- `surface`: `#FFFBFF`
- `surfaceVariant`: `#EDE1CF`

**Best for:** South Asian diaspora users, the "warm spiritual" demographic. Aligns with Vedic/traditional content. Feels human and approachable.

**Risk:** Less differentiating in the global market; saffron palette may read as "dated Indian app" to urban/Western audiences.

---

### Option 3 — Vedic Terracotta MD3

**Core idea:** Seed color terracotta `#C4622D`. MD3 generates warm orange-brown tonal palettes. Leans into the Vedic/Jyotish art tradition — terracotta is the color of temple gopurams, ritual lamps, and sindoor. Feels culturally rooted yet modern.

**MD3 color roles (light scheme):**
- `primary`: `#8C3A1A`
- `primaryContainer`: `#FFDBCC`
- `secondary`: `#765848`
- `secondaryContainer`: `#FFDBC9`
- `surface`: `#FFFBFF`
- `tertiary`: `#5D6200` (olive/khaki as accent — suggesting dhruva/earth)

**Best for:** India-first launch, traditional astrology users, Panchang-heavy users. Strongest resonance with AstroSage's audience but with dramatically better design.

**Risk:** Warm-only palette limits differentiation in a market dominated by dark/cosmic aesthetics.

---

### Option 4 — Dynamic Color (Material You Full)

**Core idea:** Enable Android 12+ Dynamic Color extraction from the user's device wallpaper. The app color system adapts to the user's chosen wallpaper. On iOS (where Dynamic Color is unavailable), fall back to Option 1 (Cosmic Dark). This is the most "Android-native" MD3 experience possible.

**Implementation:** Use `react-native-paper`'s `MD3LightTheme` / `MD3DarkTheme` with `useDynamicColorScheme()` from `react-native-dynamic-color-scheme` or `@pchmn/expo-material3-theme`.

**Best for:** Android-first users who deeply appreciate Material You. Creates a sense of ownership — "the app feels like mine." Strong for Google Play featured potential.

**Risk:** Visual inconsistency between devices (app looks completely different on different wallpapers). Brand identity is diluted. Complex QA. iOS users get a static experience.

---

### Option 5 — Dual-Mode Adaptive MD3

**Core idea:** First-class support for both light and dark modes, with a carefully crafted MD3 theme for each. Light mode: clean purple/cream for daily feed and tools. Dark mode: cosmic deep purple for immersive kundli viewing and night reading. Uses the same seed color `#6750A4` (MD3's own default purple) for both light and dark schemes, ensuring perfect tonal harmony.

**Light scheme:** `surface: #FFFBFE`, `primary: #6750A4`  
**Dark scheme:** `surface: #1C1B1F`, `primary: #D0BCFF`

**User control:** Toggle in ProfileScreen settings (or auto-follow system setting).

**Best for:** Maximum user satisfaction. Meets users where they are. Every major competitor (Co-Star, Pattern, Sanctuary) offers dark mode.

**Risk:** Double the design QA work. Must test every screen in both modes. Slightly more complex theme architecture.

---

### Option 6 — Minimalist Editorial MD3

**Core idea:** Inspired by Co-Star's editorial minimal approach, but within MD3. Use neutral/monochrome seed color `#625B71` (MD3 gray-violet) to generate muted tonal surfaces. Typography becomes the primary visual element. Large headline text, generous whitespace, minimal surface decoration. MD3 components used at their most stripped-down.

**Key constraints:** No heavy gradients, no star-field backgrounds, no ornate card shadows. Let the content breathe. Whitespace = premium signal.

**MD3 differentiation from Co-Star:** MD3's rounded corners, tonal containers, and elevation system provide subtle depth without decoration. Co-Star is truly flat; this is MD3-minimal.

**Best for:** Design-conscious users aged 22–30, Co-Star migrants who want more depth in a similarly clean aesthetic.

**Risk:** May not differentiate sufficiently from Co-Star. May feel "cold" or "generic" to users expecting astrological warmth.

---

### Option 7 — Wellness Card-First MD3

**Core idea:** Every piece of content is a first-class MD3 Card. The feed is entirely card-based with MD3 `Card.Cover`, `Card.Content`, `Card.Actions`. Elevated card surfaces on a soft neutral background. Primary color: calm sage/dusty teal `#006B5F` (earthy wellness tone). Inspired by Sanctuary and wellness apps.

**MD3 color roles:**
- `primary`: `#006B5F`
- `primaryContainer`: `#76F8E3`
- `surface`: `#FAFDFC`
- `secondary`: `#4A6360` (muted teal)
- `tertiary`: `#4E5F7C` (dusty indigo for astrological depth)

**Key interaction:** Every card has a smooth MD3 ripple on press, expanding to a Bottom Sheet for progressive disclosure.

**Best for:** Wellness crossover audience. Astrology-as-self-care positioning. Sanctuary App's audience.

**Risk:** Teal/wellness palette may feel generic or overly similar to health apps. Loses the "cosmic" identity that differentiates astrology apps.

---

### Option 8 — Chart-First SVG MD3

**Core idea:** The kundli chart wheel is the visual hero of the app. MD3 provides the structural frame; all screens "orbit" the chart. Home screen shows a live mini-chart as the hero element. Navigation flows feel like zooming in and out of the chart.

**Visual treatment:** SVG chart rendered using `react-native-svg` with MD3's tonal palette applied to chart sectors (fire/earth/air/water mapped to MD3 `tertiaryContainer`, `secondaryContainer`, etc.). The chart is always present — either as a full-screen modal or as a persistent mini-chip in the header.

**Best for:** Power users, intermediate practitioners, Vedic diaspora audience who care about accurate chart rendering. This is how TimePassages wins.

**Risk:** Chart rendering is computationally expensive; complex SVG on older devices may lag. Overwhelming for casual users.

---

### Option 9 — Progressive Disclosure Bottom Sheet MD3

**Core idea:** Heavy use of MD3 `BottomSheet` (via `react-native-paper`'s `Modal` + custom implementation or `@gorhom/bottom-sheet`) as the primary navigation/disclosure pattern. Summary cards on the main screen; tap to expand a bottom sheet for details. No full-screen modals except for Kundli.

**MD3 patterns used:**
- `NavigationBar` (bottom, 4 tabs)
- `BottomSheet` for all progressive disclosure (horoscope details, panchang details, compatibility breakdown)
- `FAB` (Floating Action Button) for primary action on each screen
- `Chip` rows for category filters and tool selection
- `SearchBar` on the Feed for content discovery

**Best for:** One-handed mobile use. Reduces navigation depth. Feels native to Android UX conventions. Matches MD3's design philosophy precisely.

**Risk:** Android-centric patterns may feel unusual on iOS (where sheets are less common as primary nav). Bottom sheets stacked multiple levels deep can confuse users.

---

### Option 10 — Navigation-Redesigned MD3 with Navigation Drawer

**Core idea:** Replace the current 4-tab bottom bar with a hybrid navigation system: `NavigationBar` (bottom) for primary tabs, plus an MD3 `NavigationDrawer` for power-user destinations (Blog, Premium Services, Report History, Settings, Language). The drawer surfaces deeper features without cluttering the main UI.

**Primary navigation:**
- `NavigationBar` (bottom): Feed | Tools | Home | Profile (4 tabs — same as current)

**Secondary navigation (drawer swipe from left):**
- Blog
- Premium Services
- My Reports
- Compatibility History
- Settings
- Help/About

**Best for:** Power users who need more screens accessible. Allows the app to grow feature-set without cluttering the bottom bar.

**Risk:** Drawer pattern is less discoverable than bottom tabs, especially for new users. iOS users may not know to swipe from the left edge. Increases navigation complexity.

---

## Part 2 — Recommended Approach and Expansive Plan

**Recommended combination:** Options 1 + 5 + 9 — **"Cosmic Dual-Mode MD3 with Progressive Disclosure"**

This combination delivers:
- Premium cosmic identity (Option 1 dark mode as default)
- Full light/dark adaptability (Option 5) for maximum user satisfaction
- MD3-native UX patterns heavy on Bottom Sheets (Option 9) for progressive disclosure
- Clean alignment with Material Design 3 component guidelines throughout

---

## Section 1 — MD3 Theme Specification

### 1.1 Seed Color

**Primary seed:** `#4A148C` (deep violet — the existing brand primary in `colors.ts`)

MD3's `argbFromHex` → TonalPalette generates the following complete color system.

### 1.2 Light Scheme (Material You — Light)

```
primary:              #6750A4   (violet — buttons, FABs, active nav)
onPrimary:            #FFFFFF
primaryContainer:     #EADDFF   (pale lavender — selected chips, card tints)
onPrimaryContainer:   #21005D

secondary:            #FF8F00   (amber-gold — accents, badges, streaks)
onSecondary:          #FFFFFF
secondaryContainer:   #FFE0B2   (pale amber — unselected items, subtle CTAs)
onSecondaryContainer: #3E1F00

tertiary:             #B5274E   (deep rose — error, warning, urgent states)
onTertiary:           #FFFFFF
tertiaryContainer:    #FFD9E2
onTertiaryContainer:  #3E001D

error:                #B3261E
onError:              #FFFFFF
errorContainer:       #F9DEDC
onErrorContainer:     #410E0B

background:           #FFFBFE   (warm white — page background)
onBackground:         #1C1B1F
surface:              #FFFBFE
onSurface:            #1C1B1F
surfaceVariant:       #E7E0EC   (lavender-tinted cards)
onSurfaceVariant:     #49454F
surfaceContainerHighest: #E6E0E9
surfaceContainerHigh: #ECE6F0
surfaceContainer:     #F3EDF7
surfaceContainerLow:  #F7F2FA
surfaceContainerLowest: #FFFFFF

outline:              #79747E
outlineVariant:       #CAC4D0
inverseSurface:       #313033
inverseOnSurface:     #F4EFF4
inversePrimary:       #D0BCFF
shadow:               #000000
scrim:                #000000
```

### 1.3 Dark Scheme (Material You — Dark, default)

```
primary:              #D0BCFF   (light purple — primary actions on dark)
onPrimary:            #381E72
primaryContainer:     #4F378B   (deep container — selected chips)
onPrimaryContainer:   #EADDFF

secondary:            #FFB74D   (warm gold — streaks, accents, premium badges)
onSecondary:          #3E2800
secondaryContainer:   #573700
onSecondaryContainer: #FFDEAE

tertiary:             #EFB8C8   (soft rose)
onTertiary:           #492532
tertiaryContainer:    #633B48
onTertiaryContainer:  #FFD9E2

error:                #F2B8B5
onError:              #601410
errorContainer:       #8C1D18
onErrorContainer:     #F9DEDC

background:           #1C1B1F   (near-black — deep cosmic base)
onBackground:         #E6E1E5
surface:              #1C1B1F
onSurface:            #E6E1E5
surfaceVariant:       #49454F   (dark charcoal cards)
onSurfaceVariant:     #CAC4D0
surfaceContainerHighest: #36343B
surfaceContainerHigh: #2B2930
surfaceContainer:     #211F26
surfaceContainerLow:  #1D1B20
surfaceContainerLowest: #0F0D13  (almost pure black — OLED screens)

outline:              #938F99
outlineVariant:       #49454F
inverseSurface:       #E6E1E5
inverseOnSurface:     #313033
inversePrimary:       #6750A4
shadow:               #000000
scrim:                #000000
```

### 1.4 Astrological Planet Color Overlays

These supplement the MD3 scheme and are used for planet glyphs, chart sector fills, and badge accents only — never as surface or background colors.

```typescript
export const planetColors = {
  sun:      '#FFD700',  // Gold
  moon:     '#E0E0E0',  // Silver-gray
  mars:     '#EF5350',  // Warm red
  mercury:  '#66BB6A',  // Green
  jupiter:  '#FFA726',  // Orange-amber
  venus:    '#EC407A',  // Deep rose
  saturn:   '#546E7A',  // Blue-gray
  rahu:     '#7E57C2',  // Mid-purple
  ketu:     '#8D6E63',  // Earth brown
  ascendant:'#FFEE58',  // Bright yellow-gold
};

export const elementColors = {
  fire:  '#FFCDD2',  // Warm red light (Aries, Leo, Sagittarius)
  earth: '#C8E6C9',  // Sage green light (Taurus, Virgo, Capricorn)
  air:   '#FFF9C4',  // Pale yellow light (Gemini, Libra, Aquarius)
  water: '#BBDEFB',  // Cool blue light (Cancer, Scorpio, Pisces)
};
```

---

## Section 2 — Typography System

MD3 defines 15 type roles across 5 scales. Map all existing app text to these roles strictly.

### 2.1 MD3 Type Scale Mapping

```typescript
import { MD3TypescaleKey } from 'react-native-paper';

// Type scale assignment for AstroAppV2
const typeScale = {
  // DISPLAY — Hero text, large chart numbers
  displayLarge:  { font: 'Fraunces_700Bold', size: 57, tracking: -0.25 },
  displayMedium: { font: 'Fraunces_600SemiBold', size: 45, tracking: 0 },
  displaySmall:  { font: 'Fraunces_500Medium', size: 36, tracking: 0 },

  // HEADLINE — Screen titles, section headers
  headlineLarge:  { font: 'Fraunces_600SemiBold', size: 32, tracking: 0 },
  headlineMedium: { font: 'Fraunces_500Medium', size: 28, tracking: 0 },
  headlineSmall:  { font: 'Fraunces_500Medium', size: 24, tracking: 0 },

  // TITLE — Card titles, modal headers
  titleLarge:  { font: 'NotoSans_500Medium', size: 22, tracking: 0 },
  titleMedium: { font: 'NotoSans_500Medium', size: 16, tracking: 0.15 },
  titleSmall:  { font: 'NotoSans_500Medium', size: 14, tracking: 0.1 },

  // LABEL — Chips, navigation labels, metadata
  labelLarge:  { font: 'NotoSans_500Medium', size: 14, tracking: 0.1 },
  labelMedium: { font: 'NotoSans_500Medium', size: 12, tracking: 0.5 },
  labelSmall:  { font: 'NotoSans_500Medium', size: 11, tracking: 0.5 },

  // BODY — Interpretive text, horoscope text, blog content
  bodyLarge:  { font: 'NotoSans_400Regular', size: 16, tracking: 0.5 },
  bodyMedium: { font: 'NotoSans_400Regular', size: 14, tracking: 0.25 },
  bodySmall:  { font: 'NotoSans_400Regular', size: 12, tracking: 0.4 },
};
```

**Font rationale:**
- **Fraunces** (display/headline): A Google Font — optical size variable serif, "wonky" and characterful. Evokes the literary quality of Co-Star/Pattern without being generic. Free, bundled via `expo-google-fonts`.
- **Noto Sans** (title/label/body): Google's universal legibility workhorse. Excellent Hindi/Devanagari support for multilingual (future). Free via `expo-google-fonts`.
- **Alternative for body text:** `Literata` (Google Font serif designed for reading) — for horoscope interpretations and blog post body text only, to add warmth and reading comfort.

### 2.2 Font Setup (Expo)

```bash
npx expo install @expo-google-fonts/fraunces @expo-google-fonts/noto-sans expo-font
```

```typescript
// App.tsx
import { useFonts, Fraunces_400Regular, Fraunces_500Medium, 
         Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { NotoSans_400Regular, NotoSans_500Medium, 
         NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
```

---

## Section 3 — MD3 Component Mapping

### 3.1 Current Component → MD3 Component Translation

| Current Pattern | MD3 Replacement | `react-native-paper` Component |
|---|---|---|
| Custom card with shadow | Elevated Card (level 1) | `<Card mode="elevated">` |
| Custom card flat | Filled Card | `<Card mode="contained">` |
| Custom card border | Outlined Card | `<Card mode="outlined">` |
| Primary action button | Filled Button | `<Button mode="contained">` |
| Secondary action button | Tonal Button | `<Button mode="contained-tonal">` |
| Destructive/cancel button | Outlined Button | `<Button mode="outlined">` |
| Text-only action | Text Button | `<Button mode="text">` |
| Category filters (pill row) | Filter Chips | `<Chip mode="flat" selected={...}>` |
| Large FAB (main CTA) | FAB Extended | `<FAB extended icon="..." label="...">` |
| Small FAB | FAB | `<FAB icon="...">` |
| Input field | Filled Text Field | `<TextInput mode="flat">` |
| Input field (prominent) | Outlined Text Field | `<TextInput mode="outlined">` |
| Date/time picker | Paper Dates | `react-native-paper-dates` — `DatePickerModal`, `TimePickerModal` |
| Top bar with back | Top App Bar (Small) | `<Appbar.Header>` + `<Appbar.BackAction>` |
| Top bar with actions | Top App Bar (Medium) | `<Appbar.Header mode="medium">` |
| Bottom tabs | Navigation Bar | `<BottomNavigation>` |
| Alert dialog | Basic Dialog | `<Dialog>` + `<Dialog.Content>` |
| Confirmation dialog | Dialog with Actions | `<Dialog>` + `<Dialog.Actions>` |
| Full-screen modal | Full-screen Dialog | Custom with `<Portal>` + `<Modal>` |
| Bottom sheet | Bottom Sheet (custom) | `@gorhom/bottom-sheet` + MD3 surface styling |
| Toggle switch | Switch | `<Switch>` |
| Checkbox | Checkbox | `<Checkbox.Item>` |
| Radio group | Radio Button | `<RadioButton.Group>` |
| Avatar/initials | Avatar | `<Avatar.Text>` |
| Loading skeleton | Activity Indicator | `<ActivityIndicator>` |
| Badge/pill | Badge | `<Badge>` |
| Divider | Divider | `<Divider>` |
| Snackbar notification | Snackbar | `<Snackbar>` |
| Score display (circular) | Custom SVG + MD3 colors | `react-native-svg` + scheme colors |
| Planet glyph | Custom SVG icons | SVG from asset bundle |
| Progress bar | Progress Bar | `<ProgressBar>` |
| Segmented selector (Email/Phone) | Segmented Buttons | `<SegmentedButtons>` |
| Section list header | List.Subheader | `<List.Subheader>` |
| Settings items | List Item | `<List.Item>` |
| Expandable section | Accordion | `<List.Accordion>` |
| Search field | Search Bar | `<Searchbar>` |
| Tags/labels | Assist Chips | `<Chip icon="...">` |

### 3.2 New MD3 Components with No Current Equivalent

| MD3 Component | Use Case in AstroAppV2 |
|---|---|
| `<Banner>` | Onboarding prompts ("Add birth details to personalize your feed") |
| `<Tooltip>` | Tap-to-learn on planet glyphs and astrological terms |
| `<NavigationDrawer>` | Future: power-user features (Settings, Blog, History) |
| `<CarouselItem>` | Onboarding screens, zodiac sign education cards |
| `<NavigationRail>` | Tablet/landscape layout (future) |

---

## Section 4 — Navigation Architecture (MD3 Updated)

### 4.1 Bottom Navigation Bar (MD3 `BottomNavigation`)

Replace the current React Navigation `BottomTabNavigator` with `react-native-paper`'s `BottomNavigation` component to get full MD3 styling including the indicator pill animation.

```typescript
// src/navigation/MainNavigator.tsx
import { BottomNavigation } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const renderScene = BottomNavigation.SceneMap({
  feed: DailyFeedScreen,
  tools: ToolsScreen,
  home: HomeScreen,
  profile: ProfileScreen,
});

// Tab configuration
const routes = [
  { key: 'feed',    title: 'Today',   focusedIcon: 'calendar-today',   unfocusedIcon: 'calendar-today-outline' },
  { key: 'tools',   title: 'Tools',   focusedIcon: 'compass',          unfocusedIcon: 'compass-outline' },
  { key: 'home',    title: 'Home',    focusedIcon: 'home',             unfocusedIcon: 'home-outline' },
  { key: 'profile', title: 'Profile', focusedIcon: 'account-circle',   unfocusedIcon: 'account-circle-outline' },
];
```

**MD3 Navigation Bar behavior:**
- Active tab shows a filled pill indicator (the MD3 active indicator pattern)
- Active tab label is always visible
- Inactive tab labels are always visible (MD3 spec — no label-hide on inactive)
- Icon size: 24dp; label: `labelSmall` (11sp)
- Height: 80dp (including bottom safe area inset)

### 4.2 Top App Bar Variants

Each screen uses the appropriate MD3 Top App Bar variant:

| Screen | App Bar Type | Title Style | Actions |
|---|---|---|---|
| DailyFeedScreen | Center-Aligned Small | Greeting + date | Notification bell |
| ToolsScreen | Small | "Tools" | None |
| HomeScreen | Small (hidden on scroll) | None (title in content) | None |
| ProfileScreen | Small | "Profile" | Edit icon |
| KundliScreen (modal) | Small | "Your Kundli" | Close + Share |
| CompatibilityScreen (modal) | Small | "Compatibility" | Close |
| BlogListScreen | Medium (shows image) | "Explore" | Search |
| BlogPostScreen | Large (image hero, collapses) | Post title | Share |
| PanchangScreen (modal) | Small | Today's date | Close |
| AskQuestionScreen | Small | "Ask a Question" | Close |
| BookCallScreen | Small | "Book a Call" | Close |
| RequestReportScreen | Small | "Request Report" | Close |
| LoginScreen | None | — | — |
| OnboardingScreen | None | — | — |

---

## Section 5 — Screen-by-Screen MD3 Redesign

### 5.1 LoginScreen

**Current issues:** Custom styled inputs and buttons that don't follow MD3 component hierarchy.

**MD3 redesign:**

```
┌─────────────────────────────────┐
│                                 │
│      [App Logo SVG — 80dp]     │
│    Fraunces 600 · 28sp · center│
│       "AstroApp" headline       │
│                                 │
│    "Your cosmic companion"      │
│     bodyMedium · onSurface      │
│                                 │
│  ┌──────────────────────────┐  │
│  │ SegmentedButtons         │  │
│  │  [Email]  |  [Phone]     │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ TextInput (outlined)     │  │
│  │  label="Email address"   │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ TextInput (outlined)     │  │
│  │  label="Password"        │  │
│  │  right=<secureEntry eye> │  │
│  └──────────────────────────┘  │
│                                 │
│     "Forgot password?" (Text)   │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Button (contained)       │  │
│  │      "Sign In"           │  │
│  └──────────────────────────┘  │
│                                 │
│  ─────────── or ───────────    │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Button (outlined)        │  │
│  │  icon="google"  Google   │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Button (text)            │  │
│  │  "Continue as Guest"     │  │
│  └──────────────────────────┘  │
│                                 │
│     "New here? Register" (Text) │
└─────────────────────────────────┘
```

**MD3 components:** `SegmentedButtons`, `TextInput (outlined)`, `Button (contained)`, `Button (outlined)`, `Button (text)`, `HelperText`

**Theme application:** Light surface (`surface: #FFFBFE`), logo uses `primary` color tint, error states use `error` role automatically via `react-native-paper`.

---

### 5.2 OnboardingScreen (Birth Details)

**Current issues:** Custom picker dialogs not using react-native-paper-dates.

**MD3 redesign — 4-step wizard with MD3 components:**

**Step indicator:** `ProgressBar` (0.25, 0.5, 0.75, 1.0) at top of screen

**Step 1 — Name:**
- `Text` headline: "What's your name?" (headlineMedium, Fraunces)
- `TextInput (outlined)` label="Your name"
- `Button (contained)` → "Next"

**Step 2 — Birth Date:**
- `Text` headline: "When were you born?" (headlineMedium)
- `Button (contained-tonal)` icon="calendar" → Opens `DatePickerModal` from `react-native-paper-dates`
- Selected date displayed as `Chip (flat)`
- `Button (contained)` → "Next"

**Step 3 — Birth Time:**
- `Text` headline: "What time were you born?" (headlineMedium)
- `Button (contained-tonal)` icon="clock-outline" → Opens `TimePickerModal` from `react-native-paper-dates`
- `Checkbox.Item` label="I don't know my birth time" → disables time, uses noon default
- `HelperText` explains accuracy impact when "don't know" is checked
- `Button (contained)` → "Next"

**Step 4 — Birth Place:**
- `Text` headline: "Where were you born?" (headlineMedium)
- `Searchbar` with autocomplete (Google Places API)
- `List.Item` for each autocomplete result
- `Button (contained)` → "Complete Setup"

**Loading state between Step 4 and Feed:**
- Full screen `surface` color with centered `ActivityIndicator (large)`
- `Text` bodyMedium: "Calculating your chart..."
- Subtle star particle animation via `react-native-reanimated` (100 dots, slow drift)

---

### 5.3 DailyFeedScreen (Feed Tab)

**Current issues:** Custom header component, inconsistent card styles, no MD3 ripple effects.

**MD3 redesign:**

**Top App Bar (Center-Aligned Small):**
```
[☰ Drawer (future)]  "Saturday, Feb 22"  [🔔 icon]
```
- `Appbar.Header` mode="center-aligned"
- Uses `surfaceContainer` background (slightly elevated from `surface`)
- Notification bell: `Appbar.Action icon="bell-outline"`

**Feed Header Card (replaces custom FeedHeader):**
```
┌─────────────────────────────────────────────┐
│  "Good morning, Priya"        🔥 5 day streak│
│   headlineMedium · Fraunces                 │
│   primaryContainer background               │
└─────────────────────────────────────────────┘
```
- `Card (contained)` with `primaryContainer` background
- Streak: `Chip icon="fire"` with `secondaryContainer` fill

**Daily Horoscope Card:**
```
┌─────────────────────────────────────────────┐
│  ♏ Scorpio Sun · Today's Horoscope   [>]    │
│  titleMedium                                │
│  ─────────────────────────────────────────  │
│  "This is a strong day for career           │
│   initiatives. Mercury's trine..."          │
│   bodyMedium · max 3 lines (expandable)     │
│  ─────────────────────────────────────────  │
│  [Lucky: 7]  [Color: Gold ●]  [Time: 2pm]   │
│   Chips row (assist chips)                  │
│  ─────────────────────────────────────────  │
│        [View Full Reading →]                │
│         Button (text)                       │
└─────────────────────────────────────────────┘
```
- `Card (elevated, level 1)` 
- Horoscope text: `bodyMedium` with `Text.numberOfLines={3}` + "Read More" expansion
- Lucky factors: `Chip` row with `icon="numeric-7"`, `icon="circle"` (colored), `icon="clock-outline"`
- Expansion via `Animated.View` height animation

**Today's Focus Card:**
```
┌─────────────────────────────────────────────┐
│  💼 Career Focus Today                       │
│  titleMedium · onPrimaryContainer            │
│  primaryContainer background                 │
│                                             │
│  "Today favors bold professional moves.     │
│   Take initiative."                         │
│   bodyMedium                                │
└─────────────────────────────────────────────┘
```
- `Card (contained)` with `primaryContainer` background fill

**Feed Items (from Strapi):**
Each Strapi feed item type renders a different MD3 card variant:
- **Astro Tip**: `Card (elevated, level 1)` with icon `<Avatar.Icon size={40}>`
- **Blog Preview**: `Card (elevated, level 1)` with `Card.Cover` image
- **Fun Fact**: `Card (contained)` with `secondaryContainer` fill
- **Transit Update**: `Card (outlined)` with `tertiary` border accent
- **Remedy of Day**: `Card (contained)` with `tertiaryContainer` fill

**Ad Cards:**
- `Card (outlined)` with `outline` border
- `Chip` label="Sponsored" in top-right corner of card
- `Badge` overlaid on chip

**Pull-to-Refresh:** Native `RefreshControl` with MD3 `primary` color spinner.

**Infinite Scroll:** `ActivityIndicator` at bottom of list while loading next page.

---

### 5.4 ToolsScreen (Tools Tab)

**Current issues:** Grid/list inconsistency, no clear MD3 card hierarchy.

**MD3 redesign:**

**Section: Daily Tools** — Horizontal scroll of compact cards
```
[Daily Panchang] [Today's Focus] [Lucky Factors]
  Card(outlined)   Card(contained)  Card(outlined)
  48×96dp each    tonal fill        48×96dp
```

**Section: Personal Tools** — Full-width cards with MD3 structure
```
┌──────────────────────────────────────────────┐
│  [Kundli Lite Icon]  Kundli Lite       [>]   │
│   Avatar.Icon(40)    titleMedium             │
│                      "Your birth chart       │
│                       snapshot"              │
│                      bodySmall               │
└──────────────────────────────────────────────┘
```
- `Card (elevated, level 1)` with `List.Item` inside for consistent touch area
- Each tool card: full-width, left icon (MD3 `Avatar.Icon`), title + description, trailing chevron

**Section: Premium Services** — Full-width outlined cards with pricing
```
┌──────────────────────────────────────────────┐
│  [❓ Icon]  Ask a Question                   │
│             "Get expert answer in 24h"       │
│             ────────────────────────         │
│             [Ask Now  ₹49 →]                 │
│              Button(contained)               │
└──────────────────────────────────────────────┘
```
- `Card (outlined)` with `Card.Actions` for CTA
- Price displayed as `Chip` with `secondaryContainer` fill

---

### 5.5 HomeScreen (Home/Dashboard Tab)

**Current issues:** Duplicate content from Feed, unclear hierarchy.

**MD3 redesign:**

Remove content duplication. Home tab becomes the **action hub** — not a content scroll.

```
TOP SECTION
──────────────────────────────────────────────
[Avatar.Text]  "Hello, Priya!"    [Edit icon]
               "Scorpio · Moon in Capricorn"
               labelMedium · onSurfaceVariant
──────────────────────────────────────────────

QUICK ACTIONS (2×2 grid of Medium FABs)
┌──────────────┐  ┌──────────────┐
│  Kundli      │  │  Compat.     │
│  FAB(medium) │  │  FAB(medium) │
│  icon=chart  │  │  icon=heart  │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  Panchang    │  │  Daily Feed  │
│  FAB(medium) │  │  FAB(medium) │
│  icon=sun    │  │  icon=list   │
└──────────────┘  └──────────────┘

PREMIUM SERVICES
Card (elevated) with 3 List.Items:
  [?] Ask a Question · ₹49      [→]
  [📊] Request Report · ₹499   [→]
  [📞] Book a Call · ₹999       [→]

RECENT ACTIVITY (if available)
Card (outlined):
  "Last checked: Riya (28/36 ✨)"  [View →]
```

**Key MD3 patterns used:**
- `Avatar.Text` for user initials (prominent placement)
- `FAB` medium × 4 in a 2×2 grid using `StyleSheet.create` flex grid
- `Card (elevated)` for services
- `List.Item` within card for service options
- `Card (outlined)` for recent activity

---

### 5.6 ProfileScreen (Profile Tab)

**Current issues:** Custom section design, inconsistent with MD3 list patterns.

**MD3 redesign:**

```
TOP APP BAR: "Profile"  [Edit pencil action]

PROFILE HEADER Card (elevated):
┌──────────────────────────────────────────────┐
│  [Avatar.Text "PR" — 64dp, primary]          │
│  "Priya Sharma"  headlineSmall               │
│  "priya@email.com"  bodyMedium               │
│  [FREE TIER chip] or [PREMIUM ✨ chip]       │
└──────────────────────────────────────────────┘

BIRTH DETAILS Card (outlined):
  List.Subheader: "Birth Details"
  List.Item: "Date of Birth" · "March 15, 1990"
  List.Item: "Time of Birth" · "11:30 AM"
  List.Item: "Place of Birth" · "Mumbai, India"
  ─────────────────────────────────────────────
  Button (contained-tonal) icon="pencil" "Edit Details"

SETTINGS Card (outlined):
  List.Subheader: "Preferences"
  List.Item: "Language" · trailing SegmentedButtons EN|HI
  List.Item: "Notifications" · trailing Switch
  List.Item: "Theme" · trailing SegmentedButtons 🌙|☀️|Auto
  
  List.Subheader: "Account"
  List.Item: "Privacy Policy"  trailing="chevron-right"
  List.Item: "Terms of Service" trailing="chevron-right"
  Divider
  List.Item: "Sign Out" · textColor=error · trailing="logout"
```

**MD3 components:** `Avatar.Text`, `Chip`, `List.Subheader`, `List.Item`, `Switch`, `SegmentedButtons`, `Button (contained-tonal)`, `Divider`

---

### 5.7 KundliScreen (Full-Screen Modal)

**Current issues:** Custom dark modal, no MD3 component structure.

**MD3 redesign:**

**Top App Bar (Small):**
`[← Close]  "Your Kundli"  [Share icon]`

**Section 1 — Key Summary (3 Chips + summary text):**
```
[Lagna: Scorpio ♏] [Rashi: Cancer ♋] [Nakshatra: Ashwini]
 Chip(assist)       Chip(assist)       Chip(assist)
 icon=zodiac-sign   icon=moon          icon=star
```
Under chips: `Card (contained)` with `primaryContainer` fill showing 2 key insights in `bodyMedium`.

**Section 2 — Planet Positions (DataTable):**
```
┌────────────────────────────────────────────────┐
│ Planet   │ House │ Sign        │ Degrees        │
│──────────│───────│─────────────│────────────────│
│ ☉ Sun    │   1   │ ♏ Scorpio   │ 23° 15'        │
│ ☽ Moon   │   9   │ ♋ Cancer    │ 11° 42'        │
│ ...      │       │             │                │
└────────────────────────────────────────────────┘
```
- `DataTable` component from `react-native-paper`
- `DataTable.Header`, `DataTable.Row`, `DataTable.Cell`
- Planet glyphs rendered as SVG icons (16×16dp) with planet-specific colors from `planetColors`
- Retrograde planets: italic cell text + `(R)` label

**Section 3 — Dasha Timeline:**
```
┌────────────────────────────────────────────────┐
│ Current Period             titleMedium          │
│ Saturn Mahadasha (until 2031)                  │
│ ████████████████████░░░░░░  ProgressBar 67%    │
│                                                 │
│ Sub-period: Jupiter Antardasha                  │
│ ████████░░░░░░░░░░░░░░░░░░  ProgressBar 35%    │
└────────────────────────────────────────────────┘
```
- `Card (outlined)` containing `ProgressBar` components
- `ProgressBar` color uses `primary`

**Bottom Action Bar:**
```
[Get Detailed Report ₹499]   [Share Kundli ↑]
  Button (contained)            Button (outlined)
```

---

### 5.8 CompatibilityScreen (Modal)

**Current issues:** Custom form inputs, no MD3 dialog/bottom-sheet for results.

**MD3 redesign:**

**Input section:**
```
TextInput (outlined) label="Partner's name (optional)"
Button (contained-tonal) icon="calendar" "Select Birth Date"
  → Opens DatePickerModal (react-native-paper-dates)
Button (contained) "Check Compatibility"
```

**Results section (slides up as Bottom Sheet after calculation):**

**Score display:**
```
┌─────────────────────────────────────────┐
│         28/36                           │
│   displayMedium · primary               │
│         ★ Good Match ★                 │
│         titleLarge                      │
│  ─────────────────────────────────────  │
│  Strengths:                             │
│  [✓ Emotional harmony] [✓ Shared values]│
│   Chips (assist, green-tinted)          │
│  ─────────────────────────────────────  │
│  Caution:                               │
│  [⚠ Communication needs work]           │
│   Chip (assist, amber-tinted)           │
│  ─────────────────────────────────────  │
│  "Focus on patience and understanding"  │
│   bodyMedium · onSurfaceVariant         │
└─────────────────────────────────────────┘
```

**Progressive disclosure — "View Breakdown" expands `List.Accordion`:**
```
List.Accordion "Ashtakoot Breakdown"
  List.Item "Varna (Temperament)"   right="1/1 ✓"
  List.Item "Vashya (Attraction)"   right="2/2 ✓"
  List.Item "Tara (Star score)"     right="2/3"
  List.Item "Yoni (Nature)"         right="2/4"
  List.Item "Graha Maitri"          right="4/5 ✓"
  List.Item "Gana (Temperament)"    right="5/6 ✓"
  List.Item "Bhakoot (Signs)"       right="7/7 ✓"
  List.Item "Nadi (Energy)"         right="5/8"
```

---

### 5.9 PanchangScreen (Modal)

**Current issues:** Dense layout without clear visual hierarchy.

**MD3 redesign:**

**Today's date as hero headline:**
```
"Sunday, 22 February 2026"
headlineLarge · Fraunces · center
```

**Key Panchang data — 3 Filled Chips with icons:**
```
[🌙 Panchami] [⭐ Rohini Nakshatra] [⛔ 07:30–09:00 Rahu Kaal]
   Chip             Chip                   Chip (errorContainer)
```

**Details in Card accordion rows:**
```
Card (outlined):
  List.Item "Tithi"      value="Panchami (5th Lunar Day)"
  Divider
  List.Item "Nakshatra"  value="Rohini • Taurus"
  Divider
  List.Item "Yoga"       value="Siddhi"
  Divider
  List.Item "Karana"     value="Vishti (Bhadra)"
  Divider
  List.Item "Sunrise"    value="07:12 AM" icon="weather-sunny"
  List.Item "Sunset"     value="06:44 PM" icon="weather-sunset"
  
Card (outlined):
  List.Subheader "Auspicious Times (Muhurta)"
  List.Item "Education"   value="10:30 AM – 12:00 PM"
  List.Item "Business"    value="2:00 PM – 3:30 PM"
  List.Item "Travel"      value="After 4:00 PM"
```

---

### 5.10 BlogListScreen

**Current issues:** Non-MD3 category pills, inconsistent card sizes.

**MD3 redesign:**

**Top App Bar (Medium):** Title "Explore" + `Searchbar` visible on scroll

**Category filters:** Horizontal `ScrollView` of `FilterChip` components
```
[All ✓] [Horoscopes] [Numerology] [Vastu] [Relationships] [Wellness]
 Chip(selected) Chip    Chip          Chip      Chip            Chip
```

**Blog post cards:** `Card (elevated, level 1)` with `Card.Cover` image
```
┌─────────────────────────────────────────┐
│  [Card.Cover — 16:9 ratio image]        │
│  ─────────────────────────────────────  │
│  Card.Content:                          │
│    titleMedium: "Post title"            │
│    bodySmall:   "2-line excerpt..."     │
│    Chip: [Relationships] + "Mar 15"     │
└─────────────────────────────────────────┘
```

---

### 5.11 Service Request Screens (Ask/Call/Report)

All three service screens (AskQuestionScreen, BookCallScreen, RequestReportScreen) use a consistent MD3 layout:

**Pattern:**
1. `Card (elevated)` hero card describing the service with `primaryContainer` background
2. `TextInput (outlined)` or `DatePickerModal` for user input
3. Price displayed as `Text` (displaySmall, `primary` color)
4. `Button (contained)` CTA: "Submit Request"
5. Success state: `Snackbar` with success message + `Icon (check-circle)` in `primary` color

---

## Section 6 — Animation & Motion Guidelines

### 6.1 MD3 Motion Tokens

MD3 defines standardized easing curves and duration tokens. Use these consistently:

```typescript
export const motion = {
  // Easing curves (MD3 standard)
  emphasizedDecelerate: Easing.bezier(0.05, 0.7, 0.1, 1.0),
  emphasized:           Easing.bezier(0.2, 0.0, 0.0, 1.0),
  emphasizedAccelerate: Easing.bezier(0.3, 0.0, 0.8, 0.15),
  standard:             Easing.bezier(0.2, 0.0, 0.0, 1.0),
  standardDecelerate:   Easing.bezier(0.0, 0.0, 0.0, 1.0),
  standardAccelerate:   Easing.bezier(0.3, 0.0, 1.0, 1.0),

  // Duration tokens (ms)
  short1: 50, short2: 100, short3: 150, short4: 200,
  medium1: 250, medium2: 300, medium3: 350, medium4: 400,
  long1: 450, long2: 500, long3: 550, long4: 600,
  extraLong1: 700, extraLong2: 800, extraLong3: 900, extraLong4: 1000,
};
```

### 6.2 Screen Transitions

**Stack navigation:** MD3 recommends **container transform** for screen pushes (expand from touch origin). With React Navigation, approximate this using:
```typescript
// react-navigation CardStyleInterpolators
CardStyleInterpolators.forFadeFromCenter  // for modals
CardStyleInterpolators.forHorizontalIOS   // for stack pushes (close to MD3)
```

### 6.3 Chart Rendering Animation (KundliScreen)

Sequential SVG draw animation for the kundli chart wheel:
1. Circle outline fades in (200ms, `medium1`)
2. 12 house spoke lines draw radially outward (staggered 50ms each, `short4`)
3. Sign sector background fills fade in by element group (300ms each)
4. Planet glyphs scale in from center (staggered 80ms each, `emphasized` easing)
5. Aspect lines draw from planet to planet last (100ms per line, sequential)

**Implementation:** `react-native-reanimated` + `react-native-svg` with `AnimatedCircle`, `AnimatedPath`, `AnimatedG`.

### 6.4 Feed Card Entry Animation

Cards entering the viewport for the first time:
```typescript
// Fade + slight translateY upward on mount
opacity: Animated.Value(0 → 1, duration: 300, easing: standard)
translateY: Animated.Value(16 → 0, duration: 300, easing: standard)
```

### 6.5 Compatibility Score Reveal

Animated counter from 0 to final score over 800ms (`long2`, `emphasized` easing), followed by color fill animation on the circular score indicator.

### 6.6 Streak Flame Animation

`🔥` streak chip: subtle `scale: 1.0 → 1.1 → 1.0` breathing pulse every 3 seconds using `react-native-reanimated` `withRepeat` + `withTiming`.

---

## Section 7 — Icon System

### 7.1 Navigation Icons

Use **Material Community Icons** (already in React Native ecosystem, covers all astrological symbols needed):

| Location | Icon | MD Community Icon name |
|---|---|---|
| Feed tab | Calendar Today | `calendar-today` |
| Tools tab | Compass | `compass` |
| Home tab | Home | `home` |
| Profile tab | Person | `account-circle` |
| Kundli | Chart Wheel | `chart-donut` |
| Compatibility | Heart + Link | `heart-multiple` |
| Panchang | Sun | `white-balance-sunny` |
| Blog | Book Open | `book-open-variant` |
| Ask Question | Help Circle | `help-circle-outline` |
| Book Call | Phone Circle | `phone-in-talk-outline` |
| Request Report | File Chart | `file-chart-outline` |

### 7.2 Planet Glyphs

Use custom SVG icons bundled with the app (`assets/icons/planets/`). Each planet has:
- Filled variant (active state, colored with `planetColors`)
- Outlined variant (inactive state, `onSurfaceVariant` color)
- Minimum touch target: 48×48dp (per MD3 spec)

### 7.3 Zodiac Sign Icons

12 zodiac SVG icons (`assets/icons/zodiac/`):
- Style: Thin geometric line art (not Unicode characters — too inconsistent across platforms)
- Each sign includes element indicator in corner: fire/earth/air/water dot
- Size range: 16dp (inline chip) to 48dp (card hero icon)

---

## Section 8 — State & Theme Provider Architecture

### 8.1 ThemeProvider Setup

```typescript
// src/context/ThemeContext.tsx
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

const cosmicDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    secondary: '#FFB74D',
    // ... full dark scheme from Section 1.3
  },
};

const warmLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#FF8F00',
    // ... full light scheme from Section 1.2
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // dark as default
  const theme = isDark ? cosmicDarkTheme : warmLightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={adaptNavigationTheme({ reactNavigationDark: isDark, materialTheme: theme })}>
        {children}
      </NavigationContainer>
    </PaperProvider>
  );
};
```

### 8.2 Using Theme in Components

```typescript
// Correct pattern — always use useTheme() hook
import { useTheme } from 'react-native-paper';

const MyCard: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.surfaceContainerHigh }}>
      <Text style={{ color: theme.colors.onSurface, ...theme.fonts.titleMedium }}>
        Title Text
      </Text>
    </View>
  );
};
```

**Rule:** Never hardcode color hex values in component stylesheets. Always reference `theme.colors.*` and `theme.fonts.*`. This ensures both light and dark modes render correctly automatically.

---

## Section 9 — Accessibility Compliance

### 9.1 Touch Targets

All interactive elements must meet MD3's minimum 48×48dp touch target:

```typescript
// Minimum touch target wrapper (use on small interactive elements)
const TouchTargetWrapper: React.FC<{ children: React.ReactNode; onPress: () => void }> = ({ children, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{ minWidth: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center' }}
    accessibilityRole="button"
  >
    {children}
  </Pressable>
);
```

### 9.2 Color Contrast

All text-on-surface combinations in both light and dark MD3 schemes automatically exceed WCAG AA (4.5:1) when using the correct `on*` color roles:
- `onSurface` on `surface` ≥ 7:1 (WCAG AAA)
- `onPrimary` on `primary` ≥ 4.5:1 (WCAG AA)
- `onPrimaryContainer` on `primaryContainer` ≥ 4.5:1 (WCAG AA)

Verify planet color overlays separately — these are custom and not MD3-validated.

### 9.3 Screen Reader Support

- All `Chip` components: include `accessibilityLabel` with full text
- Chart wheel SVG: Each planet `<G>` element gets `accessibilityLabel="Sun in Scorpio, 23 degrees, House 1"`
- Score display: `accessibilityLabel="Compatibility score: 28 out of 36. Good match."`
- All `Icon` buttons: include `accessibilityLabel`

### 9.4 Dynamic Type Support

Use `Text` from `react-native-paper` throughout, not RN's `Text`. Paper's `Text` respects the system accessibility font scale automatically.

---

## Section 10 — Implementation Phases

### Phase 1 — Theme Foundation (Week 1)

**Deliverables:**
- [ ] Install and configure `react-native-paper` latest (5.x) with full MD3 mode
- [ ] Install `react-native-paper-dates` latest
- [ ] Install `@expo-google-fonts/fraunces` and `@expo-google-fonts/noto-sans`
- [ ] Create `src/theme/md3Theme.ts` with full light + dark color schemes (Sections 1.2, 1.3)
- [ ] Create `src/theme/motionTokens.ts` (Section 6.1)
- [ ] Update `src/theme/colors.ts` to export `planetColors` and `elementColors`
- [ ] Create `src/context/ThemeContext.tsx` with `ThemeProvider` (Section 8.1)
- [ ] Wrap `App.tsx` with `ThemeProvider` and `PaperProvider`
- [ ] Set dark mode as default; light mode togglable from profile
- [ ] Test both themes render without crash on iOS and Android simulators

**Files to modify:**
- `mobile/App.tsx`
- `mobile/src/theme/colors.ts`
- `mobile/src/context/ThemeContext.tsx` (new)
- `mobile/src/theme/md3Theme.ts` (new)
- `mobile/package.json` (new deps)

---

### Phase 2 — Navigation & Global Components (Week 2)

**Deliverables:**
- [ ] Replace current `BottomTabNavigator` with `react-native-paper`'s `BottomNavigation` (Section 4.1)
- [ ] Update all `Appbar.Header` configurations per screen table (Section 4.2)
- [ ] Create SVG icon set for planets and zodiac signs (`assets/icons/`)
- [ ] Build `TouchTargetWrapper` component (Section 9.1)
- [ ] Implement `LoadingSkeleton` using MD3 `ActivityIndicator` and `surfaceVariant` pulsing animation
- [ ] Update `ErrorBoundary` to use MD3 `Card`, `Button`, and `Text` components
- [ ] Test navigation between all tabs
- [ ] Test deep linking and modal stacks

**Files to modify:**
- `mobile/src/navigation/MainNavigator.tsx`
- `mobile/src/navigation/RootNavigator.tsx`
- `mobile/src/components/` (update all components)
- `mobile/assets/icons/` (new directory with SVG icons)

---

### Phase 3 — Auth & Onboarding Screens (Week 2–3)

**Deliverables:**
- [ ] Rebuild `LoginScreen` per Section 5.1 spec
- [ ] Rebuild `OnboardingScreen` per Section 5.2 spec (4-step wizard)
- [ ] Replace all custom date/time pickers with `react-native-paper-dates`
- [ ] `ProgressBar` step indicator on onboarding
- [ ] Chart calculation loading animation (star particles + `ActivityIndicator`)
- [ ] Test auth flow end-to-end (email, phone, Google OAuth)
- [ ] Test form validation displays correctly using `HelperText`
- [ ] Test `DatePickerModal` on iOS and Android

---

### Phase 4 — Feed Screen (Week 3)

**Deliverables:**
- [ ] Rebuild `DailyFeedScreen` per Section 5.3 spec
- [ ] MD3 `Card` variants for each feed item type
- [ ] Greeting + streak header `Card (contained)` with `primaryContainer`
- [ ] Horoscope card with `Text.numberOfLines` expansion
- [ ] Lucky factors `Chip` row
- [ ] Today's Focus `Card (contained)` with `primaryContainer` fill
- [ ] Ad card with "Sponsored" `Badge` overlay
- [ ] Feed entry animation (fade + translateY, Section 6.4)
- [ ] Pull-to-refresh with MD3 `primary` color spinner
- [ ] Infinite scroll with `ActivityIndicator` footer

---

### Phase 5 — Tools, Home, Profile Screens (Week 4)

**Deliverables:**
- [ ] Rebuild `ToolsScreen` per Section 5.4 spec
- [ ] Rebuild `HomeScreen` per Section 5.5 spec (FAB grid, no feed duplication)
- [ ] Rebuild `ProfileScreen` per Section 5.6 spec
- [ ] `List.Item` + `Switch` for notification and theme toggles
- [ ] `SegmentedButtons` for language picker (EN | HI)
- [ ] `Avatar.Text` for user initials
- [ ] Premium/Free tier `Chip` in profile header
- [ ] Edit birth details `DatePickerModal` (react-native-paper-dates) flow

---

### Phase 6 — Astrology Tool Modals (Week 4–5)

**Deliverables:**
- [ ] Rebuild `KundliScreen` per Section 5.7 spec
- [ ] `DataTable` for planet positions with SVG planet glyphs
- [ ] Chart wheel SVG with MD3-colored sector fills
- [ ] Chart rendering animation (Section 6.3)
- [ ] `ProgressBar` for Dasha timeline
- [ ] Rebuild `CompatibilityScreen` per Section 5.8 spec
- [ ] Score reveal animation (Section 6.5)
- [ ] `List.Accordion` for Ashtakoot breakdown
- [ ] Rebuild `PanchangScreen` per Section 5.9 spec
- [ ] `FilterChip` rows for key Panchang data
- [ ] Rebuild `BlogListScreen` per Section 5.10 spec
- [ ] `FilterChip` category row + `Card (elevated)` blog cards with `Card.Cover`
- [ ] Rebuild service request screens per Section 5.11 spec

---

### Phase 7 — Polish & Accessibility (Week 5–6)

**Deliverables:**
- [ ] Audit all screens for 48dp touch targets (Section 9.1)
- [ ] Add `accessibilityLabel` to all interactive elements (Section 9.3)
- [ ] Add `accessibilityLabel` to chart SVG elements (Section 9.3)
- [ ] Verify WCAG AA contrast for all custom planet/element colors
- [ ] Test with TalkBack (Android) and VoiceOver (iOS)
- [ ] Implement `react-native-paper`'s `Tooltip` for astrological term explanations
- [ ] Add streak flame breathing animation (Section 6.6)
- [ ] Performance audit — chart SVG render time < 2s on mid-range device
- [ ] Snapshot tests for all rebuilt screens
- [ ] Full regression test on iOS 17 + Android 12 simulators

---

## Section 11 — Package Dependencies Summary

### New Dependencies Required

```json
{
  "dependencies": {
    "react-native-paper": "^5.12.3",
    "react-native-paper-dates": "^0.22.1",
    "@expo-google-fonts/fraunces": "^0.2.3",
    "@expo-google-fonts/noto-sans": "^0.2.3",
    "expo-font": "^12.0.10",
    "react-native-svg": "^15.2.0",
    "react-native-reanimated": "^3.9.0",
    "@gorhom/bottom-sheet": "^4.6.3",
    "react-native-vector-icons": "^10.1.0",
    "@pchmn/expo-material3-theme": "^1.3.5"
  }
}
```

### Packages Already Present (keep as-is)

- `react-navigation` / `@react-navigation/native` — retained for stack/modal navigation
- `@tanstack/react-query` — retained for server state
- `firebase` — retained for auth
- `axios` — retained for API calls
- `@react-native-async-storage/async-storage` — retained for persistence

### Packages to Remove

- Any custom UI kit imports that duplicate react-native-paper functionality
- Any custom date/time picker implementations (replace with react-native-paper-dates)

---

## Section 12 — Design Principles Summary (MD3 Enforcement)

The following are hard rules for this remake, consistent with the frontend.md spec and MD3 guidelines:

1. **No custom pickers.** All date and time inputs use `react-native-paper-dates` exclusively — `DatePickerModal` and `TimePickerModal`. No exceptions.

2. **No hardcoded colors.** All colors reference `theme.colors.*` from `useTheme()`. Planet and element colors from `planetColors`/`elementColors` are the only hex exceptions, used only for decorative/astrological indicators.

3. **No custom shadow implementations.** Use MD3 elevation levels (0–5) via Card's `elevation` prop. Do not use custom `shadowColor`/`shadowOffset` StyleSheet properties.

4. **No custom button components.** All touchable actions use `Button` (4 modes: contained, contained-tonal, outlined, text), `FAB`, `IconButton`, or `Chip`. No custom `TouchableOpacity` button wrappers.

5. **MD3 component over native RN component.** Prefer `react-native-paper`'s `Text`, `TextInput`, `Switch`, `Checkbox`, `RadioButton`, `Divider`, `ActivityIndicator` over React Native's built-in equivalents in all cases.

6. **Consistent shape system.** MD3 uses rounded corners throughout. All `Card` components use default MD3 shape tokens (12dp corner radius for medium surfaces). Do not override border radius to create "more custom" shapes.

7. **Progressive disclosure via Bottom Sheets.** All detail views (horoscope full reading, panchang details, compatibility breakdown, blog categories) open as Bottom Sheets via `@gorhom/bottom-sheet` with MD3 surface colors — not as full-screen modal screens.

8. **Maximum 3 primary cards per screen.** As specified in frontend.md design principles. Never add a 4th prominent card to a single screen view.

---

*AstroAppV2 Frontend Remake Plan — February 2026*  
*Based on: frontend.md · backend.md · tool_analysis/ · market_analysis/ · visual_design_analysis.md*

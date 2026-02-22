# Visual Design Analysis — Astrology Apps & Websites

**Date:** February 2026
**Purpose:** Document visual design patterns, animation strategies, photography styles, UI layouts, and chart rendering across major astrology platforms

---

## 1. Color Palette Analysis

### 1.1 Cosmic / Dark Theme (Dominant Modern Trend)

The most popular aesthetic across serious modern astrology apps — dark backgrounds evoking the night sky, creating an immersive and premium feel.

**Co-Star (Pure Minimalist Dark):**
- Background: Pure black `#000000`
- Primary text: Pure white `#FFFFFF`
- Secondary text: Mid gray `#888888`
- Accent: None — strictly black and white; no color anywhere
- Emotional tone: Sophisticated, editorial, mysterious, luxury print-magazine feel
- Design language: Anti-decorative; information as aesthetic

**Pattern (Premium Dark Navy):**
- Background: Very dark navy `#0A0A1A`
- Primary text: Off-white `#F5F5F0`
- Accent: Pale gold `#C9A84C`
- Gradient: Deep purple `#3D1A78` to dark navy `#0A0A1A` on key screens
- Emotional tone: Psychological depth, premium, introspective, therapeutic

**Sanctuary (Midnight Wellness Blue):**
- Background: Deep midnight blue `#0D1B2A`
- Text: Warm white `#FAF7F2`
- Primary accent: Gold `#D4AF37`
- Secondary accent: Rose gold `#B76E79`
- Tertiary: Dusty purple `#6B5B8B`
- Emotional tone: Spiritual wellness, spa luxury, feminine premium

**Nebula (Friendly Deep Space):**
- Background: Deep space purple `#1A0A2E`
- Text: White `#FFFFFF`
- Primary gradient: Purple `#6B35A2` → Indigo `#2C3E8C`
- Accent: Gold `#FFD700`, coral pink `#FF6B8A`
- Star particles: Subtle white dots with opacity variation
- Emotional tone: Friendly, accessible, pop cosmic

---

### 1.2 Earthy / Artisan Theme

**Chani App (Feminist Earthy):**
- Background: Warm cream `#F5EFE0`
- Primary text: Dark brown `#2C1A0E`
- Primary accent: Terracotta `#C4622D`
- Secondary accent: Sage green `#7A9E7E`
- Tertiary: Dusty gold `#C9A84C`
- Texture: Subtle paper/linen grain overlay on backgrounds
- Emotional tone: Feminist, handcrafted, earthy, grounded, book-like

**Moonly App (Forest + Moon):**
- Background: Deep forest green `#1A2C1E` (dark mode) OR cream `#FAF6EF` (light mode)
- Text: Warm white (dark) or dark brown (light)
- Primary accent: Luna gold `#E8C84A`
- Secondary: Soft sage `#8FAD88`
- Emotional tone: Natural, ritualistic, cyclical, grounded in nature

---

### 1.3 Functional / Professional Theme

**Astro.com (Academic Web):**
- Background: White `#FFFFFF`
- Text: Black `#000000`
- Primary accent: Navy blue `#1A3A6B`
- Link color: Standard blue `#0000CC`
- Chart element colors: Red (fire), Green (earth), Yellow (air), Blue (water)
- Emotional tone: Academic, authoritative, trustworthy, functional-first
- Assessment: Visually very dated (Web 1.0/2.0 era); trusted because of content, not design

**AstroSeek (Information-Dense):**
- Background: Light gray `#F8F8F8` or white `#FFFFFF`
- Navigation accent: Deep blue `#1A3A6B`, dark green `#2D5A27`
- Chart colors: Standard astrological element palette
- Assessment: Dense information; prioritizes data over aesthetics; power-user focused

**Cafe Astrology (Approachable Web):**
- Background: White with soft yellow/peach accent sidebar `#FFF8F0`
- Standard web colors throughout; no intentional color system
- Assessment: Approachable but generic; feels like 2005-era personal website

---

## 2. Chart Wheel Visual Design

### 2.1 Astro.com Chart Wheel — "The Professional Standard"

**Visual Elements:**
- Circular wheel with three concentric rings
- **Outermost ring:** 12 zodiac sign sectors (each 30°) with glyphs centered in each sector
- **Middle ring:** Degree markings (tick marks every 1°, labeled every 5°)
- **Inner section:** House numbers (1–12) in each pie slice
- **Center:** Aspect lines connecting planets across the center of the wheel
- **Planet positions:** Glyphs placed on the wheel perimeter at their exact degree

**Color Coding:**
- Fire signs (Aries, Leo, Sagittarius): Light red/salmon background sectors
- Earth signs (Taurus, Virgo, Capricorn): Light green background sectors
- Air signs (Gemini, Libra, Aquarius): Light yellow background sectors
- Water signs (Cancer, Scorpio, Pisces): Light blue background sectors
- Aspect lines:
  - Trines (120°): Blue
  - Sextiles (60°): Light blue or green
  - Squares (90°): Red
  - Oppositions (180°): Red
  - Conjunctions (0°): Dark green or black

**Assessment:** Comprehensive and information-rich; visually dated but deeply familiar to practitioners; functional gold standard

---

### 2.2 TimePassages Chart Wheel — "Industry Best-Looking"

**Visual Elements:**
- Rich full-color wheel with gemstone quality palette
- **Sign sector backgrounds:** Deep jewel tones by element
  - Fire: Deep crimson `#8B0000` with warm gold glyph
  - Earth: Forest green `#2D5A27` with silver glyph
  - Air: Royal purple `#4B0082` with white glyph
  - Water: Deep ocean blue `#003366` with silver glyph
- **Planet glyphs:** Larger, more ornate; custom-designed typeface
- **Aspect lines:** Multiple colors with varying line weights; dotted for minor aspects
- **Outer ring:** Ornate zodiac illustration style (optional skin)
- **Drop shadows and gradients** on planetary glyph badges

**Animation:** Chart wheel "draws itself" over ~2 seconds — spokes draw outward, signs fill with color, planets fly in along the wheel arc to their final positions

**Assessment:** Most visually impressive chart wheel in the mobile market; used as benchmark for quality

---

### 2.3 Co-Star Chart Wheel — "The Anti-Design Design"

**Visual Elements:**
- Pure white thin hairlines on pure black background
- No color coding anywhere — all elements treated with equal monochrome weight
- No filled sectors — only bare outline circles and lines
- Very thin aspect lines (1px) across the center
- Small, simple planet glyphs (custom geometric sans-serif style)
- Degree numbers minimal and small
- Reads like a technical blueprint or architectural drawing

**Assessment:** Deliberately anti-decorative; the absence of color IS the design choice; immediately recognizable as Co-Star; communicates seriousness and modernity; beloved by design community

---

### 2.4 AstroSeek Chart Wheel — "Configurable Functional"

**Visual Elements:**
- Medium complexity; functional with standard astrological color coding
- Multiple style options in settings panel: "Modern", "Classic", "Colorful", "Dark"
- Element color coding (lighter version of traditional colors)
- Planet images mode: Actual NASA planetary photos in circular clips (optional)
- Classic vs. modern glyph style selector

**Assessment:** Best customizability of free web tools; not beautiful but very practical for practitioners

---

### 2.5 Astro Gold Chart Wheel — "Professional Export Quality"

**Visual Elements:**
- Multiple complete theme templates: "Classic," "Modern," "Cosmic," "Traditional Medieval"
- Fully customizable: colors, line weights, font sizes, glyph styles, background colors
- Outer ring can show transiting planet positions simultaneously
- Secondary ring: Navamsa or other divisional chart overlay (optional)

**Export quality:** SVG (scalable vector), PDF, PNG at configurable DPI for print use

---

## 3. Planet & Sign Symbols (Glyphs)

### 3.1 Standard Astrological Glyphs — Unicode Reference

**Planet Glyphs:**

| Planet | Standard Glyph | Unicode | Notes |
|--------|:--------------:|:-------:|-------|
| Sun | ☉ | U+2609 | Circle with center dot |
| Moon | ☽ | U+263D | Crescent |
| Mercury | ☿ | U+263F | Circle + cross + horns |
| Venus | ♀ | U+2640 | Circle + cross below |
| Mars | ♂ | U+2642 | Circle + arrow |
| Jupiter | ♃ | U+2643 | Figure 4 variant |
| Saturn | ♄ | U+2644 | Cross + sickle |
| Uranus | ♅ | U+2645 | Multiple variants exist |
| Neptune | ♆ | U+2646 | Trident variant |
| Pluto | ♇ | U+2647 | Multiple variants used |
| Chiron | ⚷ | U+26B7 | Key shape |
| North Node | ☊ | U+260A | Horseshoe up |
| South Node | ☋ | U+260B | Horseshoe down |

**Zodiac Sign Glyphs:**

| Sign | Glyph | Unicode | Element |
|------|:-----:|:-------:|:-------:|
| Aries | ♈ | U+2648 | Fire |
| Taurus | ♉ | U+2649 | Earth |
| Gemini | ♊ | U+264A | Air |
| Cancer | ♋ | U+264B | Water |
| Leo | ♌ | U+264C | Fire |
| Virgo | ♍ | U+264D | Earth |
| Libra | ♎ | U+264E | Air |
| Scorpio | ♏ | U+264F | Water |
| Sagittarius | ♐ | U+2650 | Fire |
| Capricorn | ♑ | U+2651 | Earth |
| Aquarius | ♒ | U+2652 | Air |
| Pisces | ♓ | U+2653 | Water |

### 3.2 Glyph Rendering Approaches

| Method | Description | Pros | Cons |
|--------|-------------|------|------|
| **Unicode text glyphs** | Render using system fonts | Simple; no loading; resolution-independent | Inconsistent across fonts/platforms |
| **SVG icon sets** | Custom-designed vector glyphs | Brand-consistent; scalable; sharp | Design cost; loading overhead |
| **Custom font files** | Astrological symbol fonts (e.g., Astro Fonts) | Beautiful; full control | Font loading; licensing |
| **Image sprites** | PNG sprite sheets | Simple | Poor scaling; not Retina-friendly |

**Industry trend:** SVG icon sets are the modern standard for app-quality glyph rendering (Co-Star, TimePassages both use custom SVG glyph libraries)

### 3.3 Modern Glyph Redesign Trend

Several newer platforms have redesigned traditional planet glyphs to be:
- **More gender-neutral:** Removing ♂ Mars and ♀ Venus "male/female" associations in non-astrological contexts
- **Cleaner geometric forms:** Thicker stroke weights for mobile legibility at small sizes (minimum 16×16px)
- **Consistent design language:** All glyphs share same visual style, weight, and proportion

---

## 4. Animation Patterns

### 4.1 Loading / Intro Animations

**Co-Star:**
- Philosophy: Minimal — only simple text fade-ins
- No elaborate loading animation; brand identity is defined by what it refuses to do
- Loading state: Thin white progress line at top of screen

**TimePassages:**
- Chart "draws itself" with animated SVG path drawing over ~2 seconds
- Spokes appear first (radial lines from center), then sign sectors fade in, then planets "fly" along arc to position
- Satisfying and tactile; reinforces quality perception

**Moonly App (best loading animation in astrology space):**
- 3D rotating moon sphere as primary loading animation
- Real-time sphere with Phong shading or ray-cast light source
- Ambient glow around the moon pulses in a breath-like rhythm (1 cycle = ~4 seconds)
- Background: Deep space with slow star field drift

**Nebula:**
- Star field particle system on splash screen (JavaScript canvas; ~200 particles; slow drift)
- Constellation line-drawing animation (dots appear first, then lines draw between them)
- Purple/gold color scheme

**Sanctuary:**
- Gentle parallax star layers on onboarding screens (3 layers at different velocities)
- Candle-flicker style warm glow behind logo
- "Breathing" scale animation on circular elements

---

### 4.2 Chart Rendering Animations

**Standard industry pattern (TimePassages, AstroSeek with JS):**
1. Empty circle outline appears
2. 12 house spokes draw outward from center (radial, 200ms each staggered)
3. Sign sector backgrounds fill in with color (opacity fade, 300ms)
4. Planet glyphs "fly in" along the wheel arc from a central starting point to final positions
5. Aspect lines draw last between planets (sequential draw, 100ms per line)

**Co-Star:**
- No chart rendering animation — chart appears instantaneously
- Philosophical choice: Speed communicates trustworthiness; unnecessary decoration is visual noise

**Cafe Astrology / Astro.com:**
- Server-side rendered static images (PNG)
- No animation — chart is a static image embedded in the page

---

### 4.3 Screen Transition Animations

**Co-Star:**
- Standard iOS slide transitions between screens
- Clean horizontal push/pop on navigation stack
- No custom transitions; native feel prioritized

**Pattern:**
- Vertical scroll reveals personality sections progressively
- Text and card elements fade in as user scrolls (intersection observer + CSS opacity transitions)
- "Timing" view: Smooth horizontal timeline scrubbing (touch drag response)
- Modal overlays: Soft fade + scale up from center

**Sanctuary:**
- Card-flip animation for daily reading card reveal (CSS 3D transform, ~400ms)
- Soft scale + blur background on modal opens
- Gentle easing (ease-out-cubic) on all transitions

**Chani App:**
- Warm, slightly slower transitions (300–400ms) creating a considered, unhurried pace
- Page transitions feel like turning pages of a quality book

---

### 4.4 Data Visualization Animations

**Element / Modality Balance Charts (found in AstroSeek, TimePassages, many apps):**
- Animated donut/pie chart showing Fire/Earth/Air/Water distribution in natal chart
- Animated on mount using SVG stroke-dasharray animation
- Example: Chart with 4 Fire planets → Fire sector animates to 40% of circle

**Transit Timeline (TimePassages):**
- Horizontal progress bar for each active transit
- Animated fill showing how far through the transit arc you currently are
- Example: "Jupiter trine natal Venus: 67% complete" → bar fills to 67%

**Moon Phase Animations:**
- **Moonly:** Real-time 3D sphere with light source position based on current moon phase angle
- **Most apps:** Static image cycling through 8 phase icons
- **Co-Star:** Simple crescent/circle/dark icon; no animation

---

### 4.5 Background / Ambient Animations

**Star field particle systems (most common background animation in astrology apps):**
- Typically 100–500 small white dots with varying sizes and opacities
- Slow drift velocity (2–5px per second) in random directions
- Some implementations use parallax: stars in different layers drift at different speeds
- Created with: HTML Canvas, CSS animation, React Native Reanimated, or Skia

**Nebula / Aurora Effects:**
- Slow-shifting color gradients (purple/green/blue/indigo)
- CSS gradient animation: `background: linear-gradient(45deg, #1a0a2e, #6b35a2)` animating over 8–15 seconds
- Used by: Nebula app background, Sanctuary onboarding, many wellness-astrology apps

**Pulsing Glow Effects:**
- Radial gradient with animated opacity/size
- Used around moon imagery, planet icons, or key UI elements
- Creates "alive" feeling; subtle but meaningful

---

## 5. Photography & Illustration Styles

### 5.1 Photography Categories

**Cosmic / Space Photography:**
- NASA Hubble/Webb images of nebulae, galaxies (Creative Commons / NASA public domain)
- Used as: Hero backgrounds, section dividers, article thumbnail images
- Most common on: Horoscope.com, Astrology.com, content-heavy sites
- Style: Deep purple/blue/gold star fields; rich cosmic textures

**Symbolic / Mystical Photography:**
- Candles, crystals, tarot cards, incense, hands holding mystical objects
- Used by: Sanctuary app, wellness-crossover sites, spiritual influencers
- Style: Low-key warm lighting, slightly desaturated, warm tones
- Model photography: Hands only (universally relatable) OR diverse faces in golden-hour light

**Constellation / Night Sky Photography:**
- Long-exposure photography with visible star trails
- Zodiac constellation outlines overlaid on actual night sky photos
- Used for: Horoscope hero images, educational articles, sign-specific content

**Architecture / Ancient Monuments:**
- Stonehenge, Pyramids of Giza, ancient Greek temples, observatories
- Used sparingly: Conveys ancient wisdom, timelessness, authenticity
- Risk: Can feel cliché if overused

### 5.2 Illustration Styles

**Classical / Medieval Astrological Illustrations:**
- Woodcut-style imagery referencing 16th–17th century celestial maps
- Vintage zodiac figures (Virgil's Maiden as Virgo, centaur-archer as Sagittarius, etc.)
- Engraving-style celestial sphere maps (Johannes Hevelius, Andreas Cellarius style)
- Used by: Cafe Astrology section headers, Astro.com design elements, educational contexts
- Emotional tone: Historical authority, gravitas, timelessness

**Modern Flat / Geometric Illustration:**
- Clean vector zodiac sign redesigns with contemporary geometric interpretation
- Constellation line-art with minimalist dot-and-line execution
- Popular for: App store screenshots, onboarding slides, social media graphics
- Style: 2D with subtle drop shadows; max 4–5 color palette

**Gouache / Watercolor Illustration:**
- Soft, painterly zodiac sign paintings
- Humanistic, approachable, warm
- Used by: Chani App (core brand aesthetic); many independent astrologers on Instagram
- Colors: Muted earthy palette with metallic gold accents
- Often commissioned from indie illustrators (Becca Reitz, Bijou Karman styles)

**3D Render / CGI:**
- Photo-realistic planet renders (Saturn rings, Jupiter storms, etc.)
- Celestial sphere 3D models with ecliptic plane visualization
- Used for: App loading screens, promotional material, app store screenshots
- Production cost: High; typically purchased from stock (Shutterstock 3D section)

**Tarot-Inspired Card Illustration:**
- Art Nouveau line art style (Mucha, Klimt influences)
- Full-bleed botanical and celestial motif designs
- Used by: Sanctuary app (card reveal interaction), astrology-tarot hybrid apps
- Often metallic foil effects simulated in digital design

---

## 6. Typography Analysis

### 6.1 Platform-by-Platform Font Choices

**Co-Star:**
- **Display/heading:** GT America (Brandon Grotesque variant; modern grotesque sans-serif)
- **Body text:** GT Super (editorial serif — evokes premium print publications)
- **Label text:** GT America Condensed (all-caps labels)
- **Style impression:** Magazine editorial; Times New Roman-era authority mixed with modern Swiss precision
- **Line height:** Very generous (1.8–2.0 for body text); large font sizes; everything breathes

**Pattern:**
- **All UI:** Custom sans-serif (visually similar to Helvetica Neue Light)
- **Label headers:** All-caps small tracking
- **Body:** Mid-weight, excellent readability at 14–16pt
- **Style impression:** Clinical precision with warmth; feels like a well-designed health app

**Chani App:**
- **Display:** Custom humanist serif (evokes quality book typography)
- **Body:** Transitional serif (similar to Georgia or Freight Text)
- **Style impression:** Quality paperback book; feminist academic; warm and literary
- **Colors:** Dark text on cream; no glowing digital elements; deliberately anti-screen

**Astro.com:**
- **Primary:** Arial / Helvetica (system sans-serif; no brand font investment)
- **Body text:** Times New Roman (legacy HTML default)
- **Assessment:** Entirely functional; zero typographic design; trusted because of content

**TimePassages:**
- **Mobile:** San Francisco (iOS) / Roboto (Android) — native system fonts
- **Chart text:** Custom-rendered SVG text for crisp glyph display at any size
- **Philosophy:** Let the chart be the design star; clean system fonts don't compete

### 6.2 Typography Best Practices for Astrology Apps

1. **Serif fonts for interpretive text** → Feel authoritative, literary, worth reading slowly
2. **Sans-serif for UI labels and navigation** → Clean, scannable, modern
3. **Large sizes for planetary positions** (24–32pt) → Instantly scannable key data
4. **Generous line height** (1.6–1.8) for long-form reading content → Comfortable for extended reading
5. **High contrast minimum** → WCAG AA requires 4.5:1 for normal text; WCAG AAA 7:1 — dark theme apps must be careful
6. **Minimum 16pt for body text** on mobile → Avoids browser/system zoom triggers on iOS

---

## 7. Mobile vs. Desktop Layout Patterns

### 7.1 Desktop Layouts (Astro.com, AstroSeek, Cafe Astrology)

**Standard 3-column layout:**
- **Left sidebar (200–280px):** Navigation, chart type controls, house system selector, user account
- **Center main content (500–700px):** Large chart wheel + title/date information
- **Right column OR below chart:** Interpretation text, planet positions table, aspect grid
- **Header:** Logo, user account dropdown, chart search
- **Footer:** Legal, newsletter signup, affiliate links

**Chart wheel dimensions:** Typically 600×600px or 700×700px at desktop — takes up most of center column

### 7.2 Mobile Layout Patterns (Co-Star, TimePassages, Pattern)

**Co-Star Mobile:**
- Full-screen black background on all screens
- **Bottom navigation bar:** 5 icons — Chart, Today, Planets, Friends, Profile
- **Chart screen:** Wheel centered, fills ~60% of viewport height
- **Below chart:** Scrollable list of planets with sign/house; each is tappable
- **Planet tap → slide-up panel:** Short interpretation text for that placement
- **Horizontal swipe:** Compatibility view with connected friends

**TimePassages Mobile:**
- **Top navigation tabs:** Chart type selector (Natal / Transits / Progression)
- **Main area:** Full-color chart wheel fills ~70% of screen
- **Bottom drawer (collapsed by default):** Tap-to-expand shows planet details table
- **Long-press planet on wheel:** Pops inline tooltip with placement description
- **Both portrait and landscape modes** fully supported

**Pattern Mobile:**
- **No chart wheel visible on main screen** (intentionally hidden)
- **Cards-based layout:** Vertical stack of swipeable cards
- Each card = one theme, personality section, or timing insight
- **Deep scroll:** Full content revealed by scrolling down through cards
- **Bottom tabs:** You, [Named people comparisons], World, Profile

### 7.3 Onboarding / Birth Data Input Flow

**Standard 4-screen pattern across most apps:**

```
Screen 1: "What's your name?"
  → Text input (optional but personalizing)

Screen 2: "When were you born?"
  → Date picker (Day / Month / Year scrollers or calendar)

Screen 3: "What time were you born?"
  → Time picker (HH:MM with AM/PM) + "I don't know my birth time" option
  → I don't know → Use noon OR sunrise OR explain accuracy impact

Screen 4: "Where were you born?"
  → Search field with autocomplete (city names, flags for country context)
  → Google Places API or proprietary atlas
  → Real-time validation of place name

Screen 5: Loading / Chart Calculation (~2–4 seconds)
  → Atmospheric animation (star field, breathing moon, etc.)
  → Creates anticipation before the chart reveal

Screen 6: Chart Reveal
  → Dramatic first-view of the user's natal chart
  → Animated wheel render
  → "Welcome, [Name]" with Sun/Moon/Rising summary
```

**Co-Star approach:**
- Fully minimal text on black; 4 screens total; fastest onboarding in the category
- No illustrations; no color; just questions — establishes brand voice immediately

**Pattern approach:**
- Framing statement first: *"This is not about predictions. It's about patterns."*
- Intentionally removes zodiac sign labels during data entry (reduces cognitive bias)
- Feels like a thoughtful intake process, not an entertainment app

---

## 8. Accessibility Considerations Observed in the Wild

### Touch Target Sizes

| Platform | Planet Glyph Visual Size | Touch Target Size | Accessible? |
|----------|:------------------------:|:-----------------:|:-----------:|
| Co-Star | ~18×18px | ~44×44px (invisible expanded hitbox) | ✅ WCAG |
| TimePassages | ~22×22px | ~44×44px | ✅ WCAG |
| AstroSeek (web) | ~14×14px | 14×14px | ❌ Too small |
| Astro.com (web) | ~14×14px | 14×14px | ❌ Too small |

**Apple Human Interface Guidelines:** Minimum 44×44pt touch targets
**Google Material Design:** Minimum 48×48dp touch targets

### Color Contrast Compliance

- **Dark theme apps (Co-Star, Pattern):** White text on black = 21:1 ratio — far exceeds WCAG AAA (7:1)
- **Light theme web (Astro.com, Cafe Astrology):** Navy on white = ~13:1 — exceeds WCAG AAA
- **Risk areas:** Gray text on dark gray backgrounds (common in disabled states, secondary info) — often fails WCAG AA

### Screen Reader / Accessibility

- **Most astrology apps have poor screen reader support** for the chart wheel
- Chart wheel is typically SVG or Canvas — invisible to screen readers unless ARIA labels are added to each planetary position
- **Best practice identified:** Co-Star's planet list view is screen-reader accessible even though the chart wheel is not

---

*Report compiled by AstroAppV2 Research Team — February 2026*

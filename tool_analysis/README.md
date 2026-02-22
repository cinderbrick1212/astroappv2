# Astrology Tool Analysis Report

**Date:** February 2026
**Purpose:** Deep analysis of every major astrology calculation tool — how they work, what they output, and how they are presented across top platforms

---

## Table of Contents

1. [Natal / Birth Chart Calculator](#1-natal--birth-chart-calculator)
2. [Synastry / Compatibility Calculator](#2-synastry--compatibility-calculator)
3. [Transit Calculator](#3-transit-calculator)
4. [Solar Return Calculator](#4-solar-return-calculator)
5. [Secondary Progressions Calculator](#5-secondary-progressions-calculator)
6. [Solar Arc Directions](#6-solar-arc-directions)
7. [Composite & Davison Charts](#7-composite--davison-charts)
8. [Astrocartography (Locational Astrology)](#8-astrocartography-locational-astrology)
9. [Moon Phase Calculator](#9-moon-phase-calculator)
10. [Lunar Return Calculator](#10-lunar-return-calculator)
11. [Eclipse Calculator](#11-eclipse-calculator)
12. [Asteroid Calculator](#12-asteroid-calculator)
13. [Arabic Parts / Lots](#13-arabic-parts--lots)
14. [Planetary Hours Calculator](#14-planetary-hours-calculator)
15. [Numerology Calculator](#15-numerology-calculator)
16. [Daily Horoscope Generator](#16-daily-horoscope-generator)

---

## 1. Natal / Birth Chart Calculator

### What It Is

The foundational astrology tool. Calculates the positions of the Sun, Moon, and all planets at the exact moment and location of a person's birth, then maps them onto a circular "wheel" chart divided into 12 houses and 12 zodiac signs.

### Required Inputs

| Input | Format | Notes |
|-------|--------|-------|
| Date of Birth | Day/Month/Year | Gregorian calendar |
| Time of Birth | HH:MM (24hr or AM/PM) | Critical for house positions and Ascendant; "unknown time" uses noon default |
| Place of Birth | City/Country OR Latitude/Longitude | Geocoded to coordinates and historical time zone |

### What Gets Calculated

**10 traditional planets:**
Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto

**Key chart angles:**
Ascendant (ASC / Rising sign), Midheaven (MC), Descendant (DSC), Imum Coeli (IC)

**Lunar nodes:**
North Node (True or Mean), South Node

**Common additional points:**
Chiron, Black Moon Lilith (Mean or True), Part of Fortune, Vertex

**Optional extended points:**
100+ named asteroids, fixed stars, Arabic Parts, hypothetical planets (Transpluto, Vulcan)

### Calculation Pipeline

1. **Julian Day Number** is computed from birth date/time after converting local time to UTC
2. **Heliocentric coordinates** of each planet are retrieved from the ephemeris (Swiss Ephemeris uses JPL DE431 data)
3. Coordinates are converted from heliocentric to **geocentric** (Earth-centered) perspective
4. **Ecliptic longitude** is extracted — this is the zodiac degree (0–359°)
5. **Tropical zodiac:** 0° Aries is anchored to the Vernal Equinox (precession-adjusted each year)
6. **House cusps** are calculated using the selected house system algorithm (Placidus, Whole Sign, etc.)
7. **Aspects** are calculated as angular distances between every pair of planets/points

### Output: Chart Wheel (Visual)

**Standard visual elements found across all platforms:**

- Circular wheel divided into 12 pie slices (houses numbered 1–12)
- Outer ring shows 30° zodiac sign divisions with glyphs (♈♉♊♋♌♍♎♏♐♑♒♓)
- Planet glyphs placed at their exact degree position around the wheel perimeter
- Aspect lines connecting planets across the center (colored or styled by aspect type)
- Degree notation adjacent to each planet (e.g., "☉ 14°32' ♏")
- Retrograde indicator: small "℞" or "Rx" next to retrograde planet glyphs

**Color coding approaches by platform:**

| Platform | Sign Sectors | Aspect Lines | Background |
|----------|-------------|-------------|------------|
| Astro.com | Fire=red, Earth=green, Air=yellow, Water=blue | Blue=harmonious, Red=tense | White |
| TimePassages | Jewel tones by element (deep crimson, forest green, royal purple, ocean blue) | Multi-color by type | Dark |
| Co-Star | None (no color) | White thin lines only | Black |
| Cafe Astrology | Light element colors | Red/green/blue by type | White |
| AstroSeek | Element colors (lighter) | Standard colors | Light gray |

### Output: Planet Positions Table

Most platforms display a structured table alongside the wheel:

```
Planet   | Sign        | Degree   | House | Retrograde?
---------|-------------|----------|-------|------------
Sun      | Scorpio     | 14°32'   | 3rd   | Direct
Moon     | Capricorn   | 07°18'   | 5th   | Direct
Mercury  | Scorpio     | 28°45'   | 4th   | ℞ Retrograde
Venus    | Libra       | 03°12'   | 2nd   | Direct
Mars     | Leo         | 22°55'   | 12th  | Direct
Jupiter  | Aries       | 11°08'   | 8th   | Direct
Saturn   | Pisces      | 05°40'   | 7th   | ℞ Retrograde
Uranus   | Taurus      | 19°24'   | 9th   | ℞ Retrograde
Neptune  | Pisces      | 27°06'   | 7th   | Direct
Pluto    | Capricorn   | 28°33'   | 5th   | Direct
```

### Output: Aspect Grid

A triangular matrix grid showing all planet-to-planet aspects:

| Aspect | Angle | Symbol | Color |
|--------|-------|--------|-------|
| Conjunction | 0° | ☌ | Dark green/black |
| Opposition | 180° | ☍ | Red |
| Trine | 120° | △ | Blue or green |
| Square | 90° | □ | Red |
| Sextile | 60° | ✶ | Blue |
| Quincunx/Inconjunct | 150° | ⚻ | Orange or dotted |
| Semi-sextile | 30° | ⚺ | Light green |
| Semi-square | 45° | ∠ | Dark orange |

### Interpretation Text: Style Comparison by Platform

**Astro.com (Liz Greene psychological style — ~300–500 words per placement):**
> *"Sun in Scorpio in the 3rd House: The solar principle operates through the depths of Scorpio's waters, seeking to transform surface-level communication into vehicles for profound truth. There is an instinctive mistrust of the superficial in all its forms, and a compulsive need to strip away pretense and discover what lies beneath the words that people offer on the surface..."*

**Co-Star (cryptic / short — 1–3 sentences):**
> *"Your Scorpio sun makes you magnetic and intense. You want to get to the bottom of things."*

**Cafe Astrology (encyclopedia style — 80–200 words):**
> *"Sun in Scorpio: Determined, forceful, emotional, intuitive, powerful, passionate, exciting, and magnetic. At their best: a fascinating, fearless researcher of life's mysteries. At their worst: obsessive, jealous, manipulative."*

**Pattern (psychological, jargon-free — 2–4 paragraphs):**
> *"You approach life as a series of investigations. You're drawn to understanding the 'why' behind every interaction, and you have an uncanny ability to sense what people aren't saying. This intensity can be magnetic to others, but it can also be exhausting — both for you and for them."*

---

## 2. Synastry / Compatibility Calculator

### What It Is

Compares two people's natal charts to analyze relationship dynamics. The core technique overlays Chart A on top of Chart B to identify inter-chart aspects — for example, Person A's Venus conjunct Person B's Mars.

### Required Inputs

- Complete birth data for Person A (date, time, place)
- Complete birth data for Person B (date, time, place)
- Birth time is especially important for accurate house overlays

### What Gets Calculated

- All inter-chart aspects (A's planets to B's planets): typically ~100 aspects analyzed
- A's planets falling in B's natal houses (and vice versa)
- Composite midpoints (if composite chart is also requested)
- Venus/Mars aspects (romantic and sexual attraction indicators)
- Sun/Moon aspects (fundamental compatibility indicators)
- Saturn aspects (karmic, longevity, and restriction indicators)
- North Node aspects (soul-growth connection indicators)

### Output Formats

**Bi-Wheel Chart:**
- Two concentric chart wheels; inner ring = one person, outer ring = other
- Aspect lines drawn between the two sets of planets
- Different line colors or styles for each person's planets
- Standard on: Astro.com, AstroSeek, TimePassages

**Side-by-Side Comparison (Co-Star style):**
- Two separate minimalist charts displayed adjacently
- "Areas of life" color-highlighted where connection or friction exists
- Focuses on experience rather than technical data

**Compatibility Score/Rating System (Astrology.com, Horoscope.com):**
- "Compatibility Score: 78%" calculated by weighting key aspects
- Bar charts for Communication, Romance, Friendship, Longevity
- Often criticized by serious astrologers as oversimplistic
- Effective for casual engagement; low accuracy for nuanced analysis

**Aspect Table:**
```
Aspect      | Person A   | Person B   | Orb  | Quality
------------|------------|------------|------|-------------------
Conjunction | A: Venus   | B: Mars    | 2°   | Strong attraction
Square      | A: Saturn  | B: Moon    | 1.5° | Emotional restriction
Trine       | A: Sun     | B: Jupiter | 3°   | Mutual expansion
Opposition  | A: Mercury | B: Mercury | 4°   | Different communication
```

### Interpretation Text Examples

**Astro.com (composite chart / professional reports):**
Long-form PDF reports; 30–80 pages; written by professional astrologers; covers every significant inter-chart aspect

**Co-Star (relationship comparison):**
> *"You challenge each other in ways that can feel exhausting. [Name]'s Saturn squares your Venus — love rationed through structure."*

**Pattern (narrative relationship reading):**
> *"With [Name], there's an immediate magnetic pull. They activate parts of you that you often keep hidden. This can be exhilarating but also destabilizing — they reflect back things about yourself you haven't fully integrated."*

---

## 3. Transit Calculator

### What It Is

Shows the current (real-time) positions of the planets and how they form aspects to a person's natal chart. The primary tool for timing, predicting upcoming themes, and understanding current life influences.

### What Gets Calculated

- Current planetary positions (from live ephemeris — updated daily or in real-time)
- Aspects from current transiting planets to natal planets (within configurable orbs)
- Duration of each transit: ingress date → exact date → egress date
- Whether transit is applying (moving toward exact) or separating (moving away)
- Retrograde periods and their impact on active transits

### Output Formats

**Bi-Wheel Transit Chart:**
- Inner wheel: natal chart (fixed reference)
- Outer wheel: current planet positions
- Lines connect transiting planets to natal planets they are aspecting
- Standard on: Astro.com, AstroSeek, TimePassages

**Calendar View (Astro.com):**
- Month grid calendar showing when each significant transit is active
- Color-coded by planet or aspect type
- Click any date to see all active transits for that day
- Excellent for planning; popular with practitioners

**Timeline / Gantt View (TimePassages):**
- Horizontal bars showing full duration of each active transit
- Multiple transits stacked to show "traffic jam" periods of high activity
- Progress indicator showing where in the transit you currently are
- Best visualization format for seeing the big picture

**Daily List (Co-Star):**
- Push notification: *"Mercury is in your 12th house. You're having trouble saying what you mean."*
- App screen: Simple one-sentence per active transit
- Designed for quick daily check rather than deep analysis

---

## 4. Solar Return Calculator

### What It Is

Calculates a new birth chart for the exact moment the Sun returns to its natal zodiac degree each year (approximately on one's birthday, but can vary by up to 24 hours). Acts as a "forecast chart" for the coming 12 months.

### Inputs Required

- Natal chart data (DOB, TOB, POB)
- Location where the person will be on their birthday (can differ from birth city)

### What Gets Calculated

- Exact Solar Return date and time (precise to the minute; can differ from birth date)
- Full new chart wheel for that exact moment and chosen location
- Solar Return Ascendant, SR planets in houses, SR house cusps
- Overlay comparison with natal chart
- SR planet positions relative to natal house cusps

### Unique Feature: Solar Return Location Optimization

Several platforms (AstroSeek, Astrodienst) allow users to:
- See the Solar Return Ascendant sign for every city on Earth
- Find locations that produce the most favorable SR chart
- This drives "birthday travel" — people fly to specific cities to optimize their SR chart
- Premium feature on some platforms ($15–30/report); free on AstroSeek

### Platforms Offering Solar Return

| Platform | Available | Price | Location Choice | Notes |
|----------|:---------:|-------|:---------------:|-------|
| Astro.com | ✅ | Free | ✅ | Multiple locations comparison |
| AstroSeek | ✅ | Free | ✅ | Best free implementation; relocation map |
| Cafe Astrology | ✅ | Free | Limited | Birth location only |
| TimePassages | ✅ | Premium | ✅ | Beautiful chart rendering |
| Co-Star | ❌ | — | — | Not offered |
| Astro Gold | ✅ | Included | ✅ | Full professional |

---

## 5. Secondary Progressions Calculator

### What It Is

A symbolic forecasting technique where each day after birth equals one year of life (the "day for a year" method). To see chart conditions at age 35, the program calculates planetary positions 35 days after birth.

### Secondary Progressed Points Tracked

| Point | Movement Rate | Significance |
|-------|--------------|-------------|
| Progressed Sun | ~1° per year | Core identity evolution; sign change = major life shift (~30 years each) |
| Progressed Moon | ~1° per month; full cycle ~27 years | Most personal timing tool; new/full progressed moon = major emotional chapter |
| Progressed Ascendant | Changes sign ~every 20 years | How you present yourself to the world shifts |
| Progressed Mercury | Slower than natal (sometimes stationary) | Communication and thought style evolution |
| Progressed Venus | Slow; occasionally stations/retrogrades | Love nature and aesthetic values evolving |
| Progressed Mars | Very slow | Drive and assertion style; station = major energetic shift |

### Progressed Moon Phases

The Progressed Moon moving through 8 phases (New → Crescent → First Quarter → Gibbous → Full → Disseminating → Last Quarter → Balsamic) creates an approximately 27-year personal cycle.

- **Progressed Full Moon:** Most significant; often coincides with major life culminations
- **Progressed New Moon:** New beginning cycle; internal shift in priorities
- Most detailed implementation: **Astro.com** and **AstroSeek** (both free)

---

## 6. Solar Arc Directions

### What It Is

All chart points advance at the same uniform rate as the Progressed Sun (approximately 1° per year). Unlike Secondary Progressions where each planet moves at its own speed, Solar Arc moves all factors together — a simpler, more dramatic forecasting tool.

### Key Properties

- **Orb:** A Solar Arc direction within ±1° of exact is considered highly significant
- **Timing:** 1° = approximately 1 year; 0.1° = approximately 1 month
- **Event-oriented:** Often more dramatically tied to concrete life events than progressions
- **The "Rule of 1°":** When a Solar Arc planet hits a natal planet, it's within 1° orb for about 1 year

### Platforms Offering Solar Arc

- **Astro.com** — Free, part of Extended Chart Selection
- **AstroSeek** — Free
- **TimePassages** — Premium
- **Astro Gold / Solar Fire** — Full-featured, professional grade

---

## 7. Composite & Davison Charts

### Composite Chart (Midpoint Method)

- Each composite planet = the midpoint between the two persons' same planets
- Example: If Person A's Sun is at 10° Aries and Person B's is at 20° Aries, the Composite Sun = 15° Aries
- Represents "the relationship itself" as its own entity with its own needs and personality
- **Composite Ascendant** = the relationship's public face and persona
- Most widely used relationship synthesis chart in Western astrology

### Davison Chart (Time-Space Midpoint)

- Cast for the midpoint date/time AND the midpoint geographic location between the two birth data points
- Produces an actual historical date and real location — a unique property
- Example: Person A born 1990-03-15 in New York; Person B born 1992-09-22 in London → Davison chart date is approximately 1991-06-20 at midpoint coordinates
- Considered by some practitioners as more "alive" and dynamic than composite
- Less commonly offered by platforms (Astro.com and AstroSeek both provide it)

### Composite vs. Davison: When to Use Which

| Method | Best For | Orbs | Transits to It |
|--------|---------|------|----------------|
| Composite | Understanding relationship dynamics | Standard | Yes, meaningful |
| Davison | Timing relationship milestones | Standard | Yes, very meaningful |

---

## 8. Astrocartography (Locational Astrology)

### What It Is

Maps the entire Earth's surface with lines showing exactly where each natal planet would be on the Ascendant, Descendant, Midheaven (MC), or IC at the exact birth time. Moving to a location near a planetary line activates that planet's themes in your life.

### How It Works

1. For each degree of longitude (360° around Earth), calculate what sign and degree would be rising at the moment of birth
2. Find where each of the 10 planets would be exactly on the eastern horizon (AC line), western horizon (DC line), overhead (MC line), or underfoot (IC line) at birth
3. Plot these as curved lines across a world map (Robinson or Mercator projection)
4. **Parans:** Where two different planetary lines cross (intersection zones) — considered double-strength activation zones

### Line Types and Meanings

| Line Type | Position | General Meaning |
|-----------|---------|-----------------|
| AC (Ascendant) | Planet rising on eastern horizon | Personal expression, identity, how you're seen |
| DC (Descendant) | Planet setting on western horizon | Relationships, partnerships, what you attract |
| MC (Midheaven) | Planet at highest point overhead | Career, public life, reputation |
| IC (Imum Coeli) | Planet at lowest point below | Home, roots, private life, inner world |

### Standard Planet Line Colors

| Planet | Line Color (Standard) |
|--------|-----------------------|
| Sun | Yellow/Gold |
| Moon | Silver/White |
| Mercury | Orange |
| Venus | Green |
| Mars | Red |
| Jupiter | Royal Blue |
| Saturn | Dark Brown |
| Uranus | Cyan/Teal |
| Neptune | Sea Blue |
| Pluto | Dark Red/Maroon |

### Pricing Across Platforms

| Platform | Available | Price | Map Type | Notes |
|----------|:---------:|-------|----------|-------|
| **AstroSeek** | ✅ | **Free** | Interactive | Best free option; fully interactive |
| Astro.com | ✅ | Free | Static image | High quality; printable |
| Kepler/Sirius | ✅ | Included | Full professional | Industry gold standard |
| Astro Gold | ✅ | Included | Good | Mobile professional option |
| Various report sites | ✅ | $30–$80/report | PDF | Over-priced given free alternatives |

---

## 9. Moon Phase Calculator

### What It Is

Determines the current lunar phase and maps the complete cycle from New Moon through Full Moon for any date, plus natal moon phase (the phase the moon was in at birth).

### Lunar Phase Cycle (29.5-day synodic cycle)

| Phase | Approximate Day | Illumination | Astrological Theme |
|-------|----------------|:------------:|-------------------|
| New Moon | Day 0 | 0% | New beginnings, intentions, planting seeds |
| Waxing Crescent | Day 3–7 | 1–49% | Growth, building, momentum |
| First Quarter | Day 7 | ~50% | Action, crisis, decisions |
| Waxing Gibbous | Day 10–14 | 50–99% | Refinement, preparation, anticipation |
| Full Moon | Day 15 | 100% | Culmination, realization, illumination |
| Waning Gibbous | Day 17–21 | 99–50% | Sharing, distributing, wisdom |
| Last Quarter | Day 22 | ~50% | Release, re-evaluation, letting go |
| Balsamic / Waning Crescent | Day 25–29 | 49–1% | Rest, surrender, composting |

### Output Formats

- **Visual animated sphere:** Moonly app shows 3D rotating moon with real lighting
- **Phase icon set:** 8 static images cycling; most common approach
- **Calendar grid:** Month view with phase icon for each day; many utility apps
- **Percentage illuminated:** Numerical; used by astronomy apps
- **Natal moon phase:** "You were born under a Waxing Gibbous Moon — you are a seeker of completion"

### Best Implementations

- **Moonly App:** 3D animated sphere — most visually impressive in the market
- **TimePassages:** Moon phase integrated into daily transit view
- **Astro.com:** Moon phase shown on each chart + eclipse tables
- **Apple Weather / most phones:** Basic moon phase shown in weather widget (competing for casual attention)

---

## 10. Lunar Return Calculator

Similar to the Solar Return but for the Moon returning to its natal zodiac degree (every ~27.3 days — the sidereal lunar month).

- **Frequency:** Monthly forecast tool (12–13 charts per year)
- **Use:** Short-term emotional and domestic themes for the coming month
- **Less commonly offered** than Solar Return
- **Available free:** AstroSeek, Astro.com (Extended Chart Selection)
- **Premium:** TimePassages app

---

## 11. Eclipse Calculator

### What It Is

Calculates all solar and lunar eclipses for a given date range, and optionally how they interact with a person's natal chart.

### Eclipse Types

| Type | Occurs When | Duration | Astrological Significance |
|------|------------|---------|--------------------------|
| Total Solar Eclipse | New Moon, Earth in full umbra | Up to 7 min | Most powerful; new cycle; profound change |
| Annular Solar Eclipse | New Moon, Moon too far for total | Up to 12 min | New cycle; "ring of fire" visual |
| Partial Solar Eclipse | New Moon, partial shadow | Hours | Moderate; partial shift |
| Total Lunar Eclipse | Full Moon, full earth shadow | Up to 1.5 hr | Culmination; release; highly visible |
| Penumbral Lunar Eclipse | Full Moon, partial earth shadow | Hours | Subtle; mild influence |

### How Eclipse Charts Are Used

- Eclipse zodiac degree is noted; natal planets within 0–3° of that degree = major life impact for the coming 6 months
- Eclipse season = 2-week window around each eclipse; heightened sensitivity
- Eclipse cycles: Saros cycle (~18 years, 11 days); eclipses recur at same degree every Saros cycle

### Platforms

- **Astro.com:** Comprehensive eclipse listing with world maps showing path of totality
- **AstroSeek:** Free eclipse calendar with natal chart overlay
- **NASA's eclipse site:** Highest accuracy for times and geographic paths

---

## 12. Asteroid Calculator

### What It Is

Calculates positions of named asteroids beyond the traditional 10 planets. Adds nuance and specificity to chart analysis, particularly for relationship, healing, and vocational themes.

### Commonly Included Asteroids

| Asteroid | Catalog # | Discovered | Core Themes |
|----------|:---------:|:----------:|-------------|
| Chiron | 2060 | 1977 | Wounds and healing; the wounded healer archetype |
| Juno | 3 | 1804 | Marriage, committed partnerships, equality |
| Pallas Athena | 2 | 1802 | Wisdom, strategy, pattern recognition, crafts |
| Vesta | 4 | 1807 | Devotion, sacred work, focus, sexuality as sacred |
| Ceres | 1 | 1801 | Nurturing, food, seasons, grief, mother-child bonds |
| Eris | 136199 | 2005 | Disruption, discord, shadow of competition |
| Sedna | 90377 | 2003 | Isolation, betrayal, evolutionary leap |

### Extended Asteroid Libraries

**AstroSeek** offers the most extensive free asteroid support:
- Search by asteroid NAME to find any of thousands of named asteroids
- "Asteroid named after you" feature: Search your name to see if there's an asteroid (e.g., Asteroid Linda #2018, Asteroid Paris #3317)
- Chart any 100+ asteroids simultaneously on one wheel overlay

### Platforms by Asteroid Depth

| Platform | # Asteroids | Name Search | Chart Overlay |
|----------|:-----------:|:-----------:|:-------------:|
| AstroSeek | 100,000+ | ✅ | ✅ Up to 100 at once |
| Astro.com | ~100 standard | Limited | ✅ Extended chart |
| Kepler/Sirius | Full catalog | ✅ | ✅ |
| Co-Star | 0 (none) | ❌ | ❌ |
| TimePassages | ~10 major | ❌ | Limited |

---

## 13. Arabic Parts / Lots

### What They Are

Mathematical points calculated from three chart factors added/subtracted together. Originated in Hellenistic and Medieval Arabic astrology. The most commonly used is the Part of Fortune.

### Most Common Arabic Parts

| Arabic Part | Day Chart Formula | Night Chart Formula | Themes |
|-------------|-----------------|-------------------|--------|
| **Part of Fortune** | ASC + Moon − Sun | ASC + Sun − Moon | Material luck, body, prosperity |
| Part of Spirit | ASC + Sun − Moon | ASC + Moon − Sun | Soul path, destiny |
| Part of Love | ASC + Venus − Sun | ASC + Venus − Sun | Romantic love |
| Part of Marriage | ASC + 7th cusp − Venus | same | Partnership, marriage timing |
| Part of Vocation | ASC + Saturn − Sun | same | Career, life purpose |
| Part of Illness | ASC + Saturn − Mars | same | Health vulnerabilities |

### Platforms Offering Arabic Parts

- **AstroSeek:** Most extensive — 40+ Arabic Parts, all with formulas shown (best free option)
- **Astro.com:** Part of Fortune as standard; others via Extended Chart Selection
- **Professional software (Kepler, Solar Fire, Astro Gold):** Full library of 100+ Parts

---

## 14. Planetary Hours Calculator

### What It Is

An ancient Chaldean timing system dividing each day and night into 12 "hours" each (not equal to clock hours — they vary by sunrise/sunset times). Each "hour" is ruled by one of the seven classical planets in a specific sequence.

### The Chaldean Sequence

Day hours begin at sunrise: Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars → (repeats)

### How It Works

1. Calculate today's sunrise and sunset times for the user's location
2. Divide daylight into 12 equal parts → each = one "planetary hour"
3. Divide nighttime into 12 equal parts → each = one "planetary hour"
4. Assign planet rulership based on the day of week and Chaldean sequence

### Practical Uses

| Activity | Best Planetary Hour |
|---------|-------------------|
| New business, leadership, visibility | Sun hour |
| Romance, beauty, artistic work | Venus hour |
| Communication, writing, travel | Mercury hour |
| Family, intuition, emotional matters | Moon hour |
| Discipline, long-term work, karmic matters | Saturn hour |
| Expansion, teaching, legal matters, luck | Jupiter hour |
| Action, conflict, surgery, competition | Mars hour |

### Platforms

- **AstroSeek:** Best free implementation with current-hour highlight and full day schedule
- Various dedicated planetary hours apps (simple utility tools, many free)
- **Vedic astrology apps** often include a similar system (Hora)

---

## 15. Numerology Calculator

### What It Is

Calculates numerological numbers derived from the full birth name and date of birth. Related to astrology in the mystical tradition but uses a completely different mathematical system.

### Core Numbers Calculated

| Number | Calculation Method | Core Meaning |
|--------|------------------|-------------|
| **Life Path Number** | Sum all digits of full birth date; reduce to 1–9 (or 11, 22, 33 master numbers) | Core life theme, soul's journey |
| **Expression / Destiny Number** | Assign numbers to all letters in full birth name; sum and reduce | Natural talents, life purpose |
| **Soul Urge / Heart's Desire** | Assign numbers to vowels in full birth name | Inner motivation, what the soul craves |
| **Personality Number** | Assign numbers to consonants in birth name | How others perceive you; outer mask |
| **Birthday Number** | Day of birth (not reduced) | Special talent or gift |
| **Personal Year Number** | Current year + birth month + birth day; sum and reduce | Theme for the current calendar year |

### Letter-Number Assignment (Pythagorean System)

```
A=1  B=2  C=3  D=4  E=5  F=6  G=7  H=8  I=9
J=1  K=2  L=3  M=4  N=5  O=6  P=7  Q=8  R=9
S=1  T=2  U=3  V=4  W=5  X=6  Y=7  Z=8
```

### Platforms Offering Numerology

- **Cafe Astrology:** Good free numerology section alongside astrology tools
- **Astrology.com:** Numerology prominently featured (cross-promotion with parent Keen brand)
- **Numerology.com:** Dedicated platform; premium reports ($20–50)
- **Various Vedic apps:** Vedic numerology (different system — based on birth number and destiny number only)

---

## 16. Daily Horoscope Generator

### How Daily Horoscopes Are Generated: Three Methods

**Method 1: Human-Written / Pre-Scheduled (Traditional)**
- Astrologers write weekly or monthly content in advance
- Content is date-queued and published automatically
- Based on transits of slow-moving planets (Jupiter, Saturn, outer planets) through each Sun sign
- Example platforms: Cafe Astrology, Horoscope.com, many magazine sites
- Quality: Medium — written in advance, not truly personalized, but grounded in real transits
- Cost to produce: High (professional astrologers; ongoing writing schedule)

**Method 2: Template + Natal Chart Calculation (Algorithmic)**
- Real-time transit calculation against user's personal natal chart
- Software generates text by filling in templates: "Transit [PLANET] [ASPECT] your natal [PLANET] in [SIGN] in your [HOUSE] house..."
- ML/NLP layer may improve natural language output
- Example platforms: Co-Star, TimePassages
- Quality: Higher personalization (uses your actual chart); can feel mechanical or repetitive
- Sample output: *"Pluto is making an exact sextile to your natal Moon. A subconscious shift is happening that you may not yet be aware of."*

**Method 3: LLM / Generative AI (Emerging — 2023–2026)**
- Full GPT-4 or similar LLM integration with chart data provided as context
- User can ask follow-up questions conversationally
- RAG (Retrieval Augmented Generation) pattern: LLM constrained to actual chart data
- Example platforms: Nebula, Astrovera (emerging)
- Quality: Highest natural language quality; context-aware; but requires careful grounding to avoid hallucinations
- Sample output: *"Looking at your chart today, Venus is forming a trine to your natal Jupiter in Sagittarius in your 9th house. This is an invitation to expand your perspective through connection — reach out to someone from a different background than your own, or revisit a dream that involves travel or learning."*

### Sun-Sign vs. Rising-Sign Horoscopes

The industry shifted from Sun-sign to Rising-sign horoscopes as the professional standard:

- **Why Rising sign is more accurate:** Your Rising sign is your 1st house cusp. When horoscope says "Aries season activates your money sector," this is only literally true for Aries Rising (where Taurus rules the 2nd house of money)
- **Who offers Rising-sign horoscopes:** Co-Star, Cafe Astrology, most modern platforms, professional astrologers
- **Who still uses Sun-sign only:** Horoscope.com, tabloid horoscopes, newspaper columns — designed for casual audiences who don't know their rising sign

---

*Report compiled by AstroAppV2 Research Team — February 2026*

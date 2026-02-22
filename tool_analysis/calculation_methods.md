# Astrology Calculation Methods — Technical Deep Dive

**Date:** February 2026
**Purpose:** Document the mathematical and astronomical foundations behind astrology calculation tools, including ephemeris sources, house systems, zodiac systems, and Vedic-specific techniques

---

## 1. Ephemeris Sources

An **ephemeris** is a table (or database) of pre-calculated planetary positions over time. All astrology software must obtain planetary positions from one of these sources.

### 1.1 Swiss Ephemeris (SE)

- **Developer:** Astrodienst AG (creators of Astro.com), originally developed 1995–1997 by Dieter Koch and Alois Treindl
- **Data source:** NASA/JPL DE431 (and earlier DE406) planetary orbital data
- **Coverage:** 10,800 BCE to 16,800 CE (27,000+ year range)
- **Accuracy:** Sub-arcsecond precision (better than 0.001°)
- **License:** Dual-licensed (AGPL open-source license; commercial license available for proprietary apps)
- **Website:** https://www.astro.com/swisseph/
- **Used by:** Astro.com, AstroSeek, TimePassages, most serious astrology software worldwide
- **Language bindings:** C (native), Python (pyswisseph), JavaScript (swisseph npm package), Java, PHP, Ruby
- **Status:** De facto industry standard; any serious calculation platform uses this

### 1.2 JPL Horizons (NASA)

- **Developer:** NASA Jet Propulsion Laboratory
- **Web API:** https://ssd.jpl.nasa.gov/horizons/ (free, public)
- **Underlying data:** DE430/DE431/DE440 planetary ephemerides
- **Precision:** Highest available anywhere (used for spacecraft navigation and mission planning)
- **Used in astrology:** Primarily for validation, research, or when SE is unavailable
- **Limitation for astrology:** No built-in house system calculation; returns raw heliocentric/barycentric positions; requires additional transformation to geocentric ecliptic coordinates

### 1.3 Moshier Ephemeris

- **Developer:** Stephen L. Moshier (open-source researcher)
- **Accuracy:** Slightly lower than Swiss Ephemeris (valid to ~arcsecond level)
- **License:** Completely free, no restrictions
- **Advantage:** Fully self-contained; no external dependencies; good for embedded devices
- **Used by:** Some open-source astrology projects; educational implementations
- **Coverage:** ~3000 BCE to 3000 CE

### 1.4 Printed Ephemerides (Legacy Reference)

Pre-digital era astrologers used annually published printed almanacs:
- **Raphael's Ephemeris** (UK, oldest continuous publication)
- **ACS American Ephemeris** (US standard)
- **Rosicrucian Ephemeris**

Still published annually for traditional practitioners; not used in any digital calculations.

---

## 2. House Systems

The 12 astrological houses divide the local sky into sectors from the observer's location. The **house system** determines where the house boundaries (cusps) fall.

### The Core Mathematical Problem

The zodiac is a 360° circle measured along the **ecliptic** (the plane of Earth's orbit / Sun's apparent annual path). Houses need to be measured relative to the observer's local horizon and meridian. Converting between the ecliptic coordinate system and the horizon/meridian coordinate system while accounting for Earth's axial tilt (23.5°) and the observer's latitude creates many mathematically valid approaches — hence the many competing house systems.

---

### 2.1 Placidus

- **Method:** Time-based; divides the **semi-arc** (the time it takes a point on the ecliptic to travel from horizon to meridian) into three equal thirds
- **Latitude limitation:** Works correctly only between ~±66° latitude; produces **infinite cusps** at higher latitudes (northern Canada, Scandinavia, Alaska — some zodiac degrees never rise above the horizon at these latitudes)
- **Default for:** Astro.com, Co-Star, Cafe Astrology, Astrology.com, and most Western astrology apps
- **Historical origin:** Developed by Italian monk Placidus de Titis (1603–1668)
- **Current popularity:** Used by approximately 65–70% of Western astrologers
- **Calculation:** RAMC (Right Ascension of MC) is found first; each intermediate cusp angle is solved iteratively

### 2.2 Whole Sign Houses

- **Method:** Each house = exactly one complete zodiac sign; the 1st house = the entire sign containing the Ascendant (from 0° to 30° of that sign)
- **Key property:** Completely eliminates the latitude problem — works everywhere on Earth
- **Difference from other systems:** The Midheaven (MC) is NOT the 10th house cusp — it floats independently as a sensitive point that can fall in the 8th, 9th, 10th, or 11th house
- **Calculation:** Trivially simple — just identify the ASC sign; each subsequent house is the next sign
- **Historical:** Oldest known house system; used throughout Hellenistic (Greek) period (100 BCE–600 CE)
- **Revival:** Strongly promoted by Chris Brennan, Demetra George, and the Hellenistic revival movement
- **Current popularity:** Fastest growing — approximately 20% of Western astrologers now use this
- **Used by:** Chani App (CHANI Nicholas is a prominent Whole Sign advocate)
- **Advantage:** Planets in a house are unambiguous; no intercepted signs possible

### 2.3 Equal House

- **Method:** The Ascendant = 1st house cusp; each subsequent house cusp = Ascendant degree + 30°, 60°, 90°, etc.
- **Key difference from Whole Sign:** The Ascendant's exact degree (not just the sign) is used, so houses don't align with sign boundaries
- **MC treatment:** The MC is a floating sensitive point (like in Whole Sign), NOT automatically the 10th house cusp
- **Latitude limitation:** None — works at all latitudes including polar
- **Used by:** Strong tradition in UK astrology; many European practitioners; Theosophical tradition
- **Calculation:** Simplest mathematical house calculation after Whole Sign

### 2.4 Koch (Birthplace House System)

- **Method:** Projects house cusps onto the ecliptic via the observer's birth latitude using an oblique ascension method
- **Key property:** House cusps vary more based on exact birth latitude than in Placidus — more "personalized" to location
- **Latitude limitation:** Also fails at polar latitudes (worse than Placidus — unreliable above ~55°)
- **Historical:** Developed by Walter Koch and Th. Spielberger in 1960s Germany
- **Used by:** Popular among German-speaking astrologers; some traditional practitioners; **Astro.com offers as an option**

### 2.5 Campanus

- **Method:** Divides the **Prime Vertical** (the great circle passing through East, Zenith, West, and Nadir) into 12 equal 30° arcs; then projects these divisions onto the ecliptic
- **Geometric elegance:** Each house represents an equal solid angle from the observer's position
- **Used by:** Relatively rare; Dan Rudhyar (humanistic astrology founder) advocated strongly for it
- **Modern use:** Niche community of Campanus practitioners
- **Latitude limitation:** Works at most latitudes but distorted near poles

### 2.6 Regiomontanus

- **Method:** Divides the **celestial equator** (not the ecliptic or prime vertical) into equal 30° arcs; projects divisions onto the ecliptic along great circles through the North and South poles
- **Historical use:** Used in Medieval and Renaissance astrology; reportedly used by Nostradamus
- **Horary astrology:** Still preferred by many horary practitioners for its historical authority
- **Used by:** Small but dedicated community, especially in traditional/horary astrology

### 2.7 Porphyry

- **Method:** Trisects the arc between the four angles (ASC, IC, DSC, MC) to create 12 house cusps
- **Simplicity:** Only slightly more complex than Whole Sign calculation
- **Historical:** Used by Porphyry of Tyre (3rd century CE) — oldest systematic house division after Whole Sign
- **Latitude limitation:** None
- **Used by:** Practitioners interested in simpler traditional methods

### House System Comparison Table

| System | Works at Polar Lat. | MC = 10th Cusp? | Equal Houses? | Historical Era | Trending |
|--------|:-------------------:|:---------------:|:-------------:|---------------|:--------:|
| Placidus | ❌ >66° fails | ✅ Yes | ❌ No | 17th century | Stable dominant (~70%) |
| Whole Sign | ✅ Yes | ❌ No (floats) | Sign-sized | Ancient (Hellenistic) | Rising fast (~20%) |
| Equal House | ✅ Yes | ❌ No (floats) | ✅ Yes (from ASC) | Medieval | Stable (~10%) |
| Koch | ❌ >55° fails | ✅ Yes | ❌ No | 1960s | Declining |
| Campanus | Limited | ✅ Yes | ❌ No | 13th century | Niche |
| Regiomontanus | Limited | ✅ Yes | ❌ No | 15th century | Horary niche |
| Porphyry | ✅ Yes | ✅ Yes | ❌ No | 3rd century | Rare |

---

## 3. Zodiac Systems

### 3.1 Tropical Zodiac (Used by All Western Astrology Platforms)

- **0° Aries definition:** The exact position of the Sun at the **Vernal Equinox** (Spring Equinox in the Northern Hemisphere; approximately March 20–21 each year)
- **Key property:** Entirely tied to Earth's **seasonal cycle** and axial tilt, NOT to actual star/constellation positions
- **Precession:** Earth's axis wobbles in a 26,000-year cycle (axial precession). This means the Vernal Equinox point drifts through the actual constellations at approximately 1° every 72 years
- **Current offset:** The tropical 0° Aries point is approximately 23–24° earlier in the sky than the actual Aries constellation (as of 2026)
- **Philosophical basis:** Tropical zodiac advocates argue astrology is about Earth's seasons and human experience on Earth, not arbitrary stellar positions
- **Used by:** ALL mainstream Western astrology platforms: Astro.com, Co-Star, Cafe Astrology, Horoscope.com, TimePassages, Pattern, Sanctuary, Chani App

### 3.2 Sidereal Zodiac

- **0° Aries definition:** Anchored to actual star positions, corrected for precession each year
- **Key property:** Tied to **constellations** in the actual sky; adjusts for Earth's axial precession
- **Correction factor:** The **Ayanamsa** — the angular difference between tropical and sidereal 0° Aries (currently ~23°50' in 2026)
- **Multiple ayanamsas:** Different schools use different correction values:

| Ayanamsa | Value (2026 approx.) | Origin | Used By |
|----------|---------------------|--------|---------|
| **Lahiri (Chitrapaksha)** | ~23°51' | Official India govt standard | Most Vedic astrologers worldwide |
| Raman | ~22°22' | B.V. Raman tradition | Some Indian practitioners |
| Krishnamurti (KP) | ~23°51' (similar to Lahiri) | KP astrology system | KP astrology practitioners |
| True Citra | Variable (anchors Spica to 0° Libra exactly) | Spica-based | Precision-oriented practitioners |
| Fagan-Bradley | ~24°02' | Cyril Fagan (Western sidereal) | Very rare Western sidereal users |

### 3.3 Vedic / Jyotish Astrology

Vedic astrology is a complete system that differs from Western astrology in multiple fundamental ways:

**Zodiac:** Sidereal (almost universally Lahiri ayanamsa in India)

**House System:** Primarily Whole Sign houses (called "Sign houses" or "Rashi chart" in Vedic context)

**Ascendant:** Called **Lagna** (ལག་ན in Sanskrit)

**Planets:**
- Traditional Vedic uses only 7 planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
- Plus the two lunar nodes: **Rahu** (North Node) and **Ketu** (South Node) — treated as planets
- Uranus, Neptune, Pluto are used by some modern Vedic astrologers but considered non-traditional

**Aspects (Drishti):** Fundamentally different from Western aspects:
- All planets aspect the 7th house from themselves (opposition — same as Western)
- **Mars** additionally aspects the 4th and 8th houses from itself (special aspects)
- **Jupiter** additionally aspects the 5th and 9th houses (special aspects — considered very benefic)
- **Saturn** additionally aspects the 3rd and 10th houses (special aspects)
- No trine, sextile, or square aspects (beyond the 7th house aspect) in traditional Vedic

**Divisional Charts (Vargas):** Unique to Vedic — sub-charts dividing the zodiac into finer divisions:

| Divisional Chart | Division | Houses Each | Primary Use |
|-----------------|----------|:-----------:|-------------|
| D1 (Rashi) | 1 | 30° | Main natal chart |
| D2 (Hora) | 2 | 15° | Wealth and finances |
| D3 (Drekkana) | 3 | 10° | Siblings, courage |
| D9 (Navamsa) | 9 | 3°20' | **Marriage**, soul path, dharma |
| D10 (Dashamsha) | 10 | 3° | Career, professional life |
| D12 (Dvadashamsha) | 12 | 2°30' | Parents, ancestry |
| D27 (Saptavimshamsha) | 27 | 1°06' | Strength, longevity |
| D60 (Shashtiamsha) | 60 | 30' | Karma, past life |

---

## 4. Aspect Calculations

### Standard Western Aspects and Default Orbs

| Aspect | Angle | Symbol | Default Orb (major planets) | Quality |
|--------|------:|:------:|:---------------------------:|---------|
| Conjunction | 0° | ☌ | ±8–10° | Fusion, intensity, amplification |
| Opposition | 180° | ☍ | ±8–10° | Tension, polarity, awareness |
| Trine | 120° | △ | ±6–8° | Harmony, flow, natural talent |
| Square | 90° | □ | ±6–8° | Challenge, friction, action-forcing |
| Sextile | 60° | ✶ | ±4–6° | Opportunity, cooperation |
| Quincunx/Inconjunct | 150° | ⚻ | ±2–3° | Adjustment, unease, integration |
| Semi-square | 45° | ∠ | ±1–2° | Minor friction, irritation |
| Sesqui-square | 135° | ⊏⊐ | ±1–2° | Minor friction, build-up |
| Semi-sextile | 30° | ⚺ | ±1–2° | Minor opportunity |
| Quintile | 72° | Q | ±1° | Talent, creativity, special gifts |
| Bi-quintile | 144° | bQ | ±1° | Talent expression, creative output |

### Applying vs. Separating Aspects

- **Applying:** The faster-moving planet is moving toward the exact aspect angle (aspect not yet exact; influence building)
- **Separating:** The faster-moving planet has passed the exact aspect and is moving away (influence waning)
- Critical distinction in **horary astrology** ("Will the event happen?") and **electional astrology** (choosing auspicious timing)
- Most software shows applying/separating status with an indicator arrow or "App."/"Sep." label

### Orb Variations by Platform

| Platform | Major Aspect Orbs | Strict or Loose | Customizable? |
|----------|-----------------:|:---------------:|:-------------:|
| Astro.com | 10° Sun/Moon, 8° other | Loose | ✅ Fully |
| Co-Star | ~6° major aspects | Moderate | ❌ |
| AstroSeek | Configurable (default 8°) | Moderate | ✅ |
| TimePassages | 8° (adjustable in premium) | Moderate | ✅ Premium |
| Traditional/Vedic | Usually 0° (full strength or none) | Very strict | N/A |

### Vedic Aspect System (Drishti)

Vedic aspects work fundamentally differently — planets cast aspects by **house count** from their position, not by angular degree:

- **Full (100%) Drishti:** All planets aspect the 7th house from themselves
- **¾ (75%) Drishti:** Jupiter to 5th and 9th; Saturn to 3rd and 10th; Mars to 4th and 8th
- There are no "orbs" in the traditional sense — the aspect is full strength throughout the entire sign it falls in

---

## 5. Coordinate System Conversions

### Input: Geographic Coordinates

1. User enters city name → **geocoded** to decimal latitude/longitude (Google Places API or dedicated atlas)
2. Local birth time → converted to **UTC (Universal Time)** using the historical time zone offset for that location on that date
3. **Historical DST rules** applied (many countries changed summer time rules repeatedly)
4. **Local Mean Time (LMT)** used for pre-1880s births (before standardized time zones)

### From UTC to Planetary Positions

1. **Julian Day Number (JDN):** Continuous count of days since January 1, 4713 BCE noon (Julian calendar)
   ```
   JDN = 367×Y − INT(7×(Y+INT((M+9)/12))/4) + INT(275×M/9) + D + 1721013.5 + UT/24
   ```

2. **Delta T (ΔT) correction:** Compensates for Earth's irregular rotation rate (slowing over millennia)
   - Current ΔT ≈ 70–72 seconds (2026)
   - Ephemeris calculations use Terrestrial Dynamical Time (TDT) = UT + ΔT

3. **Swiss Ephemeris lookup:** Given JDN in TDT, SE returns heliocentric ecliptic coordinates for each planet

4. **Heliocentric → Geocentric conversion:** Subtract Earth's position vector; account for aberration and nutation

5. **Ecliptic longitude extraction:** This is the "zodiac degree" (0–359.9999°)

6. **Tropical correction:** Already included in SE by default (vernal equinox = 0°)

7. **House calculation:** Given RAMC (Right Ascension of MC) and geographic latitude, calculate cusps using house system algorithm

8. **RAMC calculation:**
   ```
   RAMC = Greenwich Sidereal Time (GST) + geographic longitude (in hours)
   GST = function of Julian Day Number (polynomial formula)
   ```

### Retrograde Calculation

A planet is **retrograde** when its apparent motion along the ecliptic is backward (decreasing ecliptic longitude) from Earth's perspective:

- **Direct:** d(ecliptic_longitude)/dt > 0 (moving forward through signs)
- **Retrograde:** d(ecliptic_longitude)/dt < 0 (moving backward through signs)
- **Stationary:** d(ecliptic_longitude)/dt ≈ 0 (appears to stop; highly significant astrologically)

**Physical cause:** Differential orbital velocities. As Earth "overtakes" an outer planet in its orbit, that planet appears to move backward for weeks to months. Inner planets (Mercury, Venus) retrograde when they pass between Earth and the Sun.

---

## 6. Time Zone Handling and Historical Atlas

This is one of the most error-prone aspects of birth chart calculation. A 1-hour error in birth time can shift the Ascendant by up to 15° and change all house cusps dramatically.

### Common Historical Time Zone Pitfalls

| Issue | Example | Impact |
|-------|---------|--------|
| **World War DST changes** | UK operated "Double Summer Time" (+2 UTC) during WWII | Charts off by 1 hour if not corrected |
| **Russia permanent standard time** | Russia abolished DST in 2014 | Pre/post charts differ by 1 hour |
| **US DST law changes** | Energy Policy Act 2005 extended US DST by 4 weeks | Births in March/April/Oct/Nov affected |
| **Historical time zone establishment** | Many countries only standardized clocks in 1880–1920 | Pre-standard births need LMT calculation |
| **India single time zone** | IST = UTC+5:30 since 1947 (unusual half-hour offset) | Requires careful handling |
| **Historical colonial time zones** | Many African/Asian countries changed TZ at independence | Complex historical atlas required |

### Atlas Quality Comparison

| Platform | Atlas Source | Historical TZ Depth | Accuracy Rating |
|----------|-------------|:-------------------:|:---------------:|
| **Astro.com** | Proprietary (AstroAtlas / Steinbrecher) | Excellent — pre-1900 LMT | ⭐⭐⭐⭐⭐ |
| AstroSeek | Custom + ACS data | Very good | ⭐⭐⭐⭐ |
| TimePassages | ACS/Astrodienst licensed | Good | ⭐⭐⭐⭐ |
| Astro Gold | ACS Atlas | Good | ⭐⭐⭐⭐ |
| Co-Star | Google Places API | Basic (post-1970 only) | ⭐⭐⭐ |
| Most apps | Google Maps API | Limited historical | ⭐⭐⭐ |

**Best practice:** For accuracy on births before 1970, always use Astro.com or AstroSeek rather than apps relying on Google's time zone API.

---

## 7. Vedic-Specific Calculation Systems

### 7.1 Vimshottari Dasha System

The primary Vedic timing system. Life is divided into a series of planetary periods totaling exactly 120 years.

**Planetary Periods:**

| Planet | Period Duration | Ruling Nakshatras |
|--------|:--------------:|-------------------|
| Ketu (South Node) | 7 years | Ashwini, Magha, Mula |
| Venus | 20 years | Bharani, Purva Phalguni, Purva Ashadha |
| Sun | 6 years | Krittika, Uttara Phalguni, Uttara Ashadha |
| Moon | 10 years | Rohini, Hasta, Shravana |
| Mars | 7 years | Mrigashira*, Chitra*, Dhanishtha* |
| Rahu (North Node) | 18 years | Ardra, Svati, Shatabhisha |
| Jupiter | 16 years | Punarvasu, Vishakha, Purva Bhadrapada |
| Saturn | 19 years | Pushya, Anuradha, Uttara Bhadrapada |
| Mercury | 17 years | Ashlesha, Jyeshtha, Revati |

*Each nakshatra is 13°20' wide; Mars, Venus, etc. share rulership of nakshatras with other planets (3 nakshatras per planet × 9 planets = 27 nakshatras total)

**How Starting Point Is Calculated:**
1. Find the Moon's natal nakshatra (which of the 27 nakshatras the Moon occupies)
2. That nakshatra's ruling planet = the first Mahadasha (major period)
3. Fraction elapsed = (degrees traveled in current nakshatra / 13°20') × period length in years
4. This gives the exact remaining balance of the first period at birth

**Sub-periods (Antardashas):**
Each Mahadasha is further divided into Antardashas (sub-periods) in the same planetary sequence, proportionally scaled. Then further into Pratyantardashas (sub-sub-periods), and so on to 5 levels of precision.

### 7.2 Navamsa (D9) Chart

The most important divisional chart. Each zodiac sign (30°) is divided into 9 equal parts of 3°20' each = 108 total navamsa divisions.

**Mapping rule:**
- Fire signs (Aries, Leo, Sagittarius): Navamsas begin at Aries
- Earth signs (Taurus, Virgo, Capricorn): Navamsas begin at Capricorn
- Air signs (Gemini, Libra, Aquarius): Navamsas begin at Libra
- Water signs (Cancer, Scorpio, Pisces): Navamsas begin at Cancer

**Uses:**
- Quality of marriage and spouse
- Strength of planets (a planet at the same sign in both D1 and D9 = "Vargottama" — considered very strong)
- Soul-level purpose and dharma

### 7.3 Ashtakavarga System

A system of scoring each planet's transit strength based on its relationship to all other natal planets.

**How it works:**
1. Each planet assigns +1 (bindhu) or 0 to each of the 12 signs based on its house distance from that sign
2. Each planet creates its own Ashtakavarga table (8 possible sources × 12 signs)
3. Each sign in each planet's Ashtakavarga scores 0–8 points
4. **SAV (Sarvashtakavarga):** All 7 planet Ashtakavargas summed → each sign gets a score 0–56
5. Signs with 25+ SAV points are favorable; 30+ are excellent; 20 or below are challenging

**Application:** A planet transiting a sign with high Ashtakavarga points performs well; transiting a low-point sign struggles — regardless of the sign's inherent nature.

### 7.4 Nakshatra System

The zodiac is divided into 27 (sometimes 28) **nakshatras** (lunar mansions) of 13°20' each.

Each nakshatra has:
- A ruling planet (one of the 9 Vedic planets)
- A ruling deity
- A symbol
- Gender (male/female)
- Caste (Brahmin, Kshatriya, etc. — used for muhurta/timing)
- Quality (Fixed, Moveable, Mixed, etc.)

**The Moon's natal nakshatra** is the single most important factor in Vedic chart analysis — more than the Moon's sign in many traditional texts.

---

*Report compiled by AstroAppV2 Research Team — February 2026*

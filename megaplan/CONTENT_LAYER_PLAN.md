# Content Layer Plan — `mobile/src/data/`

## Core principle

**No string that a user reads should be written inside a screen or component.**

Every interpretation, prediction, remedy, yoga description, nakshatra reading,
Tithi guidance, and Dasha forecast must live in a structured data file.
A single `ContentService` reads the user's DOB, birth time, and name,
computes their chart via `astrologyEngine`, and returns fully assembled
`PersonalizedContent` objects that screens render without any inline text.

---

## The flow

```
User Profile
  name + DOB + birth time + birth place
          │
          ▼
  astrologyEngine.calculate*(profile)
  ── computes: Lagna, Rashi, Nakshatra, Dasha lord,
               Yogas, planet positions, afflictions ──
          │
          ▼
  ContentService.get*Content(profile, ...)
  ── looks up: grahas.ts → rashi.ts → nakshatras.ts
               yogas.ts → dashas.ts → remedies.ts
               ashtakoot.ts → panchang.ts → rashifal.ts ──
  ── assembles: personalised paragraphs using name,
                computed placements, and active periods ──
          │
          ▼
  PersonalizedContent object
  { greeting, predictionCards[], remedyCards[], ... }
          │
          ▼
  Screen renders — zero hardcoded strings in JSX
```

---

## Files to create in `mobile/src/data/`

### Static content libraries (the text library — edit to change any wording)

| File | Contents | Who edits it |
|------|----------|-------------|
| `grahas.ts` | 9 planets — name, glyph, nature, karakas, brief/standard/deep interpretation, when-strong/when-afflicted | Content team / astrologer |
| `rashi.ts` | 12 signs — name, element, ruler, lagna interpretation, rashi interpretation | Content team |
| `nakshatras.ts` | 27 nakshatras — name, ruler, deity, symbol, moon interpretation, lagna interpretation, compatibility | Content team |
| `yogas.ts` | Rajayogas + Doshas — name, forming condition, quality, description, divination, remedy | Content team |
| `dashas.ts` | 9 Mahadasha lords — duration, period theme, positive, challenging, divination, spiritual practice | Content team |
| `remedies.ts` | Per graha — gemstone, mantra (Devanagari + transliteration), yantra, charity, fasting, deity, colour | Content team |
| `ashtakoot.ts` | 8 Koots — scoring tables, verdict thresholds (28+/21-27/18-20/<18), descriptions | Content team |
| `panchang.ts` | 30 Tithis, 27 Panchang Yogas, 11 Karanas — name, nature, auspiciousness, favored/avoided activities | Content team |
| `muhurta.ts` | 8+ activity types — best Tithis, best nakshatras, best days, avoid conditions, brief guidance | Content team |
| `rashifal.ts` | 12 Rashis × 7 weekday predictions + Dasha modifiers (9) + Gochar modifiers — assembled by ContentService | Content team |
| `types.ts` | TypeScript interfaces for all content types AND all `PersonalizedContent` output types | Developer |

### The content engine (the only file screens ever import)

| File | Role |
|------|------|
| `contentService.ts` | Takes `(profile, ...)` → calls `astrologyEngine` → looks up data files → returns `PersonalizedContent` |
| `index.ts` | Single barrel export — screens import only from `'../data'` |

---

## ContentService methods (one per tool)

| Method | Inputs | Returns |
|--------|--------|---------|
| `getKundliContent(profile)` | User profile | `PersonalizedKundliContent` |
| `getMilanContent(profileA, profileB)` | Two profiles | `PersonalizedMilanContent` |
| `getDashaContent(profile)` | User profile | `PersonalizedDashaContent` |
| `getGocharContent(profile, today)` | Profile + date | `PersonalizedGocharContent` |
| `getVarshaphalContent(profile, year)` | Profile + year | `PersonalizedVarshaphalContent` |
| `getVargaContent(profile, chartType)` | Profile + D9/D10/D12… | `PersonalizedVargaContent` |
| `getPanchangContent(date, lat, lng)` | Date + location | `PanchangContent` |
| `getMuhurtaContent(activity, range, lat, lng)` | Activity + dates + location | `MuhurtaContent` |
| `getTithiContent(date, lat, lng)` | Date + location | `TithiContent` |
| `getNakshatraContent(profile)` | User profile | `PersonalizedNakshatraContent` |
| `getGrahanContent(year, profile?)` | Year + optional profile | `GrahanContent` |
| `getAshtakavargaContent(profile)` | User profile | `PersonalizedAshtakavargaContent` |
| `getPrashnaContent(question, category, chart)` | Question + moment chart | `PrashnaContent` |
| `getHoraContent(date, lat, lng)` | Date + location | `HoraContent` |
| `getGrahaShanti(profile)` | User profile | `PersonalizedRemedyContent` |
| `getDainikRashifal(profile, today)` | Profile + date | `PersonalizedRashifalContent` |

---

## PersonalizedContent output types (what screens receive)

Each `Personalized*Content` type contains only display-ready strings and structured data.
Screens never compute anything — they only render what `ContentService` returns.

### Example: PersonalizedKundliContent

```
{
  greeting: string                  // "Priya, आपकी कुंडली दर्शाती है…"
  lagnaCard: {
    title: string                   // "वृश्चिक लग्न (Scorpio Ascendant)"
    description: string             // From rashi.ts lagnaInterpretation
    bodyPart: string                // "Reproductive organs and spine"
  }
  rashiCard: { title, description }
  nakshatraCard: { title, rulerName, symbol, description, dashaStart }
  dashaCard: {
    lord: string
    antardasha: string
    endYear: number
    remaining: string
    prediction: string              // From dashas.ts divination
    spiritualPractice: string
  }
  yogaCards: Array<{
    name: string
    nameHindi: string
    quality: 'benefic' | 'malefic'
    description: string             // From yogas.ts
    remedy?: string
  }>
  planetCards: Array<{ planet, sign, house, dignity, brief }>
  remedyCards: Array<{ graha, gemstone, mantra, charity, day }>
}
```

---

## How to edit content

To change any wording a user sees:

1. Open the relevant file in `mobile/src/data/`
2. Find the entry by its `key` field (e.g., `key: 'saturn'` in `dashas.ts`)
3. Edit the text fields (`brief`, `standard`, `deep`, `divination`, etc.)
4. Save — no component changes needed

To add a new Yoga or Dosha:
- Add an entry to `yogas.ts` following the `YogaContent` interface
- Add detection logic to `astrologyEngine.detectYogas()`
- `ContentService` will automatically include it in `yogaCards[]`

To change a remedy:
- Edit the entry in `remedies.ts` for the relevant `graha` key
- All tool screens that show remedy snippets will update automatically

---

## Content editor guide

Every text field follows a length convention:

| Field name | Max length | Where it appears |
|------------|:----------:|-----------------|
| `brief` | 1 sentence | Chips, list items, notification text |
| `standard` | 2–3 sentences | Card previews, summary sections |
| `deep` | 4–6 sentences | Detail dialogs, full readings |
| `divination` | 3–5 sentences | Prediction cards, daily feed |
| `interpretation` | 4–6 sentences | Screen-level readings |

Write in a tone that is:
- **Confident but not alarming** — even difficult placements have a constructive framing
- **Vedic but accessible** — use Sanskrit terms with English in parentheses on first use
- **Second person** — address the user directly ("You carry…", "आपकी…")
- **Specific** — name the planet, sign, house; avoid vague generalities

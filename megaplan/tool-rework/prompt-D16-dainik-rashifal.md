# Plan 16 — Dainik Rashifal (Daily Vedic Horoscope)

## Tradition
Vedic / Jyotish — Dainik Rashifal: daily horoscope based on Moon's transit through
the user's natal Moon sign (Rashi), current Dasha lord, and active Gochar transits.
Rising sign (Lagna) used where available for more accurate house-specific predictions.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme), C06 (DailyFeedScreen), and C07 (FeedComponents).
New route: `DainikRashifal`. Also feeds content into the main daily feed (prompt 06).
Depends on Tool 03 (Dasha) and Tool 04 (Gochar) for enriched daily predictions.

---

## What this tool does

Provides the user's personalised daily Vedic horoscope — driven by:
1. Their natal Moon sign (Rashi) — primary daily indicator
2. Their natal Lagna (Ascendant) — house-specific predictions
3. Current Dasha lord — the background tone for this life period
4. Active Gochar — today's planetary transits over their chart

This makes the Rashifal unique per user, not a generic Sun-sign horoscope.

---

## Inputs (from user profile)

| Field | Used for |
|-------|---------|
| `name` | Personalised greeting ("Priya, आज का राशिफल…") |
| `birth_date`, `birth_time`, `birth_place` | Natal Rashi (Moon sign), Lagna, and Dasha lord |
| Today's date | Current Moon transit + Gochar positions |

---

## Content layer — what `contentService.getDainikRashifal(profile, today)` must return

| Content block | Description |
|---------------|-------------|
| `greeting` | Name + Rashi name + today's date in a personalised opener |
| `overallRating` | 1–5 star day rating based on Gochar + Dasha compatibility |
| `dailyPrediction` | 3–4 sentence prediction specific to this person's Rashi + Lagna + active Dasha |
| `areasOfFocus[]` | 3–4 life areas highlighted today (e.g., Career, Relationships, Finance, Health) — each with a one-line guidance |
| `luckyFactors` | Lucky number, lucky color, lucky time window — derived from Rashi + current Nakshatra |
| `moonTransitNote` | Brief note on where the Moon is today and how it affects this Rashi |
| `dashaNote` | One sentence on how the current Dasha lord colors today's energy |
| `remedyOfDay` | Single daily remedy — one action, mantra, or offering for today |
| `tomorrowPreview` | Brief 1-sentence preview of tomorrow's energy (teaser) |

### Why this is NOT generic Sun-sign content

All prediction paragraphs are assembled by combining:
- The Rashi's base daily text (from the rashifal content library — 7 weekday variations × 12 signs)
- Modifier phrases based on active Dasha lord (9 possible modifiers)
- Modifier phrases based on most significant Gochar transit today
- The result is hundreds of unique daily combinations per Rashi

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/DainikRashifalScreen.tsx` | Full-screen daily horoscope with all blocks |
| `components/OverallRatingBar.tsx` | 1–5 star / 5-bar visual day rating |
| `components/AreaFocusChip.tsx` | Chips for Career / Health / Relationships / Finance |
| `components/LuckyFactorsCard.tsx` | Lucky number, color, time in a compact 3-chip row |
| `components/RemedyOfDayCard.tsx` | Reuse existing `RemedyCard` component from `frontend-rework/prompt-C07` |

---

## Push notification integration

- Daily notification at user-configured time (default 08:00 local time)
- Notification text: `"{name}, आज का राशिफल तैयार है — {rashi} राशि: {overallRating}⭐ {oneLineSummary}"`
- Uses existing `useNotifications` hook and `notifications` service from the app
- User can configure time and on/off in Profile settings

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `getCurrentPositions()` | Today's Gochar positions |
| `astrologyEngine` | `calculateDasha(profile)` | Current Dasha lord |
| `contentService` | `getDainikRashifal(profile, today)` | Full assembled daily reading |
| `notifications` | `scheduleDailyRashifal(time)` | Push notification scheduling |
| `analytics` | `rashifalViewed()` | Fires on mount |

---

## Layout

- **Mobile**: Greeting → overall rating → daily prediction → areas of focus → lucky factors → moon transit note → dasha note → remedy → tomorrow preview
- **Web/Tablet**: Two-column — main prediction + rating left; lucky factors + moon note + remedy right

---

## Key UI rules (from megaplan theme)

- Overall rating: 5-bar `ProgressBar` or 5-star row using `primary` color
- Daily prediction: `elevated` Card — the dominant visual on screen
- Area of focus chips: `secondaryContainer`
- Lucky factors: `primaryContainer` chips in a row
- Remedy card: `secondaryContainer` background (matches `frontend-rework/prompt-C07` RemedyCard)
- Tomorrow preview: `outlined` card at bottom — teaser styling

---

## Validation checklist

- [ ] Prediction is personalised per user — Rashi + Lagna + Dasha lord all factor in
- [ ] Not generic Sun-sign text — each user with different Dasha/Gochar gets different prediction
- [ ] All prediction text assembled from content library + modifiers — no inline strings
- [ ] Lucky number, color, time differ by day and are consistent for the same inputs
- [ ] Moon transit note updated daily as Moon changes nakshatra every ~2.25 days
- [ ] Dasha note changes when Dasha lord changes (not daily — period-based)
- [ ] Push notification scheduled correctly using `useNotifications` hook
- [ ] User can configure notification time in Profile
- [ ] Rashifal card also appears in the main daily feed (DailyFeedScreen from `frontend-rework/prompt-C06`)

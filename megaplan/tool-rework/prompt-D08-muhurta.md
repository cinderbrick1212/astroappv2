# Plan 08 — Muhurta (Auspicious Timing Calculator)

## Tradition
Vedic / Jyotish — Muhurta Shastra: finding auspicious windows for specific activities
by analysing Tithi, Nakshatra, Yoga, Karana, Vara (weekday), Lagna, and avoiding
inauspicious periods (Rahu Kaal, Gulika, Durmuhurta).

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `Muhurta`.
Depends on Tool 07 (Panchang Vishesh) for daily Panchang data.

---

## What this tool does

Finds the best auspicious time window(s) for a specific activity — marriage,
business launch, property purchase, travel, surgery, naming ceremony, etc. —
within a user-selected date range (default: next 7 days).

---

## Inputs

| Field | Source |
|-------|--------|
| `name` | Personalised output ("Priya, आपके लिए शुभ मुहूर्त…") |
| Activity type | User selects from a list (see activity table below) |
| Date range | User picks start date (default: today) and end date (default: +7 days) |
| `birth_place` / current location | Sunrise/sunset for Rahu Kaal; optional Lagna matching |

### Activities supported (stored in content data)

| Activity | Hindi | Key requirements |
|----------|-------|-----------------|
| Marriage / Vivah | विवाह | Specific nakshatras, avoid Tuesdays/Saturdays |
| Business launch | व्यापार आरंभ | Pushya nakshatra preferred; avoid Rahu Kaal |
| Property purchase | गृह प्रवेश | Venus-ruled nakshatras; Taurus/Cancer Lagna |
| Travel | यात्रा | Avoid 8th/12th Moon; Pushya or Rohini preferred |
| Surgery / medical | चिकित्सा | Avoid Full/New Moon; avoid Mars-ruled nakshatras |
| Naming ceremony | नामकरण | Punarvasu, Pushya, Rohini, Hasta preferred |
| Education start | विद्यारम्भ | Mercury-ruled nakshatras; Wednesday |
| Job start | नौकरी | Sun/Jupiter hour; Sunday or Thursday |

---

## Content layer — what `contentService.getMuhurtaContent(activity, dateRange, lat, lng)` must return

| Content block | Description |
|---------------|-------------|
| `activityDescription` | What makes a Muhurta good for this activity — 2 sentence explanation |
| `muhurtaWindows[]` | Each auspicious window — date, start time, end time, quality score, which Panchang elements make it good |
| `bestWindow` | Single top recommendation with a full divinatory explanation |
| `avoidanceSummary` | Brief note on what to avoid for this activity |
| `remedyCard` | If no perfect window found in range — Graha Shanti to improve outcomes regardless of timing |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/MuhurtaScreen.tsx` | Main screen — activity selector + date range + results |
| `components/ActivitySelector.tsx` | Grid of activity Chips with icons |
| `components/MuhurtaWindowCard.tsx` | Each auspicious window — date, time range, quality indicator, explanation |
| `components/MuhurtaCalendar.tsx` | Month-view calendar with green dots on auspicious dates for selected activity |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `panchangService` | `calculatePanchang(date, lat, lng)` | Panchang for each day in range |
| `contentService` | `getMuhurtaContent(activity, dateRange, lat, lng)` | Evaluates each day, scores windows, returns ranked list |
| `analytics` | `muhurtaViewed(activity)` | Fires on activity selection |

---

## Layout

- **Mobile**: Activity selector (horizontal scroll chips) → date range picker → results list
- **Web/Tablet**: Activity grid (3 columns) left; calendar + results right

---

## Key UI rules (from #34 theme)

- Activity Chips: `secondaryContainer` unselected, `primary` filled when selected
- Best window card: `elevated` Card with `primary` left border accent
- Good windows: `primaryContainer`; marginal windows: `surfaceVariant`
- No good window found: `errorContainer` card with remedy suggestion
- Calendar: green dot (`primary` color) on auspicious dates

---

## Validation checklist

- [ ] Activity list covers at least the 8 activities in the table above
- [ ] Date range defaults to today + 7 days; user can extend up to 30 days
- [ ] Rahu Kaal, Gulika Kaal automatically excluded from all windows
- [ ] Each window shows which Panchang elements qualify it (Tithi + Nakshatra + Vara)
- [ ] Best window highlighted clearly with full explanation from content service
- [ ] If no window found: clear message + remedy card shown
- [ ] All activity descriptions and recommendations from `contentService` — no inline strings
- [ ] Calendar view shows dots on auspicious days

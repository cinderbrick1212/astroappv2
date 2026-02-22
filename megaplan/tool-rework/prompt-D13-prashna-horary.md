# Plan 13 — Prashna (Horary / Question Chart)

## Tradition
Vedic / Jyotish — Prashna Jyotish (horary astrology): a chart cast for the exact
moment a question is asked to answer that specific question. The querent's birth
data is not required — only the current moment and location matter.

## Platforms
Web · iOS · Android

## Integration with megaplan
Depends on `frontend-rework` prompts C01 (theme) and C08 (ToolsScreen). New route: `Prashna`.
Standalone — does not depend on Tools 01–12. Birth data optional for enhanced reading.

---

## What this tool does

Allows the user to ask a specific question and receive a Vedic Prashna chart cast
for the moment of asking. The chart is interpreted to answer the question through
Prashna Lagna, Moon's position, significators of the question's house, and
the Prashna Chakra technique.

---

## Inputs

| Field | Used for |
|-------|---------|
| `name` | Personalised reading |
| Question text | Determines which house and significators are relevant |
| Question category | User selects from a list — determines which house the question belongs to |
| Timestamp of asking | System time at the moment the user submits — the Prashna moment |
| Current location | Prashna Lagna calculation |

### Question categories (mapped to Vedic houses — stored in content data)

| Category | House | Key significator |
|----------|:-----:|-----------------|
| Self / health / body | 1st | Lagna lord |
| Wealth / finances | 2nd | 2nd lord |
| Siblings / communication | 3rd | 3rd lord |
| Property / home / mother | 4th | 4th lord |
| Children / creativity | 5th | 5th lord |
| Enemies / illness / debt | 6th | 6th lord |
| Marriage / partnerships | 7th | 7th lord |
| Hidden matters / transformation | 8th | 8th lord |
| Travel / spirituality / education | 9th | 9th lord |
| Career / reputation | 10th | 10th lord |
| Gains / wishes / friends | 11th | 11th lord |
| Losses / liberation / foreign | 12th | 12th lord |

---

## Content layer — what `contentService.getPrashnaContent(question, category, chart)` must return

| Content block | Description |
|---------------|-------------|
| `prashnaLagnaCard` | Lagna of the Prashna chart — what the chart's overall tone is |
| `moonCard` | Moon's sign, nakshatra, and house — emotional undercurrent of the question |
| `significatorCard` | Relevant house lord's condition — strong/weak, aspected, retrograde |
| `answerCard` | Primary divinatory answer — Yes / No / Conditional / Unclear — with reasoning |
| `timingCard` | If applicable — when the outcome may manifest (degrees to exact aspect) |
| `detailedReading` | 3–4 paragraph full Prashna reading using classical Vedic Prashna techniques |
| `remedyCard` | Action step or Graha Shanti recommended based on the chart's indication |

---

## Screens / components needed

| File | Purpose |
|------|---------|
| `screens/PrashnaScreen.tsx` | Main screen — question entry + category + result |
| `components/PrashnaWheel.tsx` | North Indian square chart for the Prashna moment (reuses KundliWheel) |
| `components/AnswerCard.tsx` | Prominent Yes/No/Conditional verdict with explanation |
| `components/PrashnaHistory.tsx` | List of past questions asked (stored locally) |

---

## Services called

| Service | Method | Purpose |
|---------|--------|---------|
| `astrologyEngine` | `calculatePrashna(timestamp, lat, lng)` | Chart for the exact moment of asking |
| `contentService` | `getPrashnaContent(question, category, chart)` | Full divinatory answer and reading |
| `storage` | `savePrashnaHistory(entry)` | Persist question + answer locally |
| `analytics` | `prashnaAsked(category)` | Fires on submission |

---

## Layout

- **Mobile**: Question input → category chips → submit → answer card → Prashna wheel → full reading
- **Web/Tablet**: Input form left; answer card + wheel + reading right

---

## Key UI rules (from megaplan theme)

- Answer verdict: "Yes" → `primaryContainer`; "No" → `errorContainer`; "Conditional" → `secondaryContainer`; "Unclear" → `surfaceVariant`
- Prashna wheel: same visual rules as Janma Kundli wheel
- Question category chips: `outlined` until selected, `filled` primary when active
- Past questions list: `outlined` Cards with question text + date + brief verdict

---

## Validation checklist

- [ ] Prashna chart cast at the exact system timestamp when user submits — not delayed
- [ ] Current location used for Lagna calculation
- [ ] Question category correctly maps to the relevant house and significator
- [ ] Answer verdict (Yes/No/Conditional/Unclear) shown prominently before the full reading
- [ ] Full reading sourced from `contentService` — no inline strings
- [ ] Past question history stored locally and viewable
- [ ] Works without birth data (Prashna is independent of natal chart)
- [ ] Name used in personalised reading if logged in

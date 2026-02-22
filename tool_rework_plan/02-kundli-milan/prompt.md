# Prompt 02 — Kundli Milan Screen (Ashtakoot Compatibility)

## Platforms
Web · iOS · Android

## Tradition
Vedic / Jyotish — Ashtakoot Guna Milan (8-attribute compatibility scoring), North Indian style.

## Task

Create `mobile/src/screens/KundliMilanScreen.tsx`.

This replaces the old `CompatibilityScreen.tsx` with a proper **Ashtakoot Kundli Milan** tool:
- Eight compatibility attributes scored from a maximum of 36 Gunas total
- Individual Koot (attribute) `DataTable` with name, max points, scored points, and a verdict
- Side-by-side key placements for both charts (Lagna, Rashi, Nakshatra, Dasha lord)
- Mangal Dosha check for both persons
- Divinatory verdict card with marriage recommendation and remedies

All calculation goes through `astrologyEngine.calculateKundliMilan()`.

---

## Context

**Depends on:** Tool 01 (JanmaKundliScreen and KundliWheel are already in place).

**Route:** Replace existing `Compatibility` route → `KundliMilan: undefined` in `AppStackParamList`.

**Preserved imports:**
```tsx
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import { useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```

---

## Platform-Specific Notes

| Platform | Behavior |
|----------|----------|
| iOS | `KeyboardAvoidingView behavior="padding"` around Person B input; safe-area insets |
| Android | `KeyboardAvoidingView behavior="height"`; ripple on DataTable rows |
| Web | Person B form in a `Dialog`; results page in two-column layout (Person A left / Person B right for placement cards); max-width 1280 px |

---

## Ashtakoot Scoring Table (from `tool_analysis/calculation_methods.md`)

| Koot | Max Points | What it measures |
|------|:----------:|-----------------|
| Varna | 1 | Spiritual compatibility |
| Vashya | 2 | Dominance & control |
| Tara | 3 | Destiny & health |
| Yoni | 4 | Physical & sexual compatibility |
| Graha Maitri | 5 | Mental compatibility |
| Gana | 6 | Temperament (Deva/Manav/Rakshasa) |
| Rashi (Bhakoot) | 7 | Family & financial prosperity |
| Nadi | 8 | Genetic compatibility & progeny |
| **Total** | **36** | |

Verdict thresholds (traditional):
- ≥ 28: Excellent match (उत्तम)
- 21–27: Good match (शुभ)
- 18–20: Acceptable (सामान्य)
- < 18: Inauspicious (अशुभ) — remedies required

---

## Required Implementation

```tsx
const KundliMilanScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { profile } = useUserProfile();

  // Person B state
  const [personBName, setPersonBName] = useState('');
  const [personBDate, setPersonBDate] = useState<Date | undefined>();
  const [personBTime, setPersonBTime] = useState('');
  const [personBPlace, setPersonBPlace] = useState('');
  const [personBCoords, setPersonBCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [milanData, setMilanData] = useState<ReturnType<typeof astrologyEngine.calculateKundliMilan> | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState(false);

  useEffect(() => { analytics.compatibilityViewed(); }, []);

  const handleCalculate = () => {
    if (!profile?.birth_date || !personBDate || !personBCoords) return;
    setCalculating(true);
    setCalcError(false);
    astrologyEngine
      .calculateKundliMilan(
        { date: new Date(profile.birth_date), time: profile.birth_time, latitude: profile.latitude, longitude: profile.longitude, timezone: profile.timezone },
        { date: personBDate, time: personBTime, latitude: personBCoords.lat, longitude: personBCoords.lng, timezone: 'Asia/Kolkata' }
      )
      .then(setMilanData)
      .catch(() => setCalcError(true))
      .finally(() => setCalculating(false));
  };

  // ── Render results ──
  // 1. Side-by-side placement Chips for Person A & B (Lagna, Rashi, Nakshatra, Dasha lord)
  // 2. Total Guna score displayed as a large Text with color:
  //    ≥28 → theme.colors.primary  |  21–27 → theme.colors.secondary  |  <18 → theme.colors.error
  // 3. Ashtakoot DataTable (8 rows: each Koot, max points, scored, verdict Chip)
  // 4. Mangal Dosha check Card for both persons with remedy if present
  // 5. Divinatory verdict Card: traditional recommendation paragraph + Graha Shanti upayas
};
```

### Total Guna Score display

```tsx
// Large centered score with color-coded verdict badge
<Card mode="elevated" elevation={2} style={[styles.card, { alignItems: 'center' }]}>
  <Card.Content style={{ alignItems: 'center', paddingVertical: 16 }}>
    <Text variant="displaySmall" style={{ color: scoreColor, fontWeight: '700' }}>
      {milanData.totalGunas} / 36
    </Text>
    <Chip
      mode="flat"
      style={{ backgroundColor: verdictBgColor, marginTop: 8 }}
      textStyle={{ color: verdictTextColor }}
    >
      {milanData.verdict} — {milanData.verdictHindi}
    </Chip>
  </Card.Content>
</Card>
```

### Mangal Dosha Card

```tsx
// Show one Card per person indicating Mangal Dosha presence/absence.
// If present: show affected houses as Chips with theme.colors.errorContainer background
// and recommended remedy (red coral gemstone / Mangal mantra / Tuesday fasting)
<Card mode="outlined" style={styles.card}>
  <Card.Title
    title="मंगल दोष विश्लेषण"
    left={props => <List.Icon {...props} icon="circle-slice-4" color={theme.colors.error} />}
  />
  <Card.Content>
    {/* Person A */}
    <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>
      {profile.name}: {milanData.mangalDoshaA.present ? 'मंगल दोष है' : 'मंगल दोष नहीं है'}
    </Text>
    {/* Person B */}
    <Text variant="labelMedium" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
      {personBName}: {milanData.mangalDoshaB.present ? 'मंगल दोष है' : 'मंगल दोष नहीं है'}
    </Text>
    {/* Remedy if both have Dosha or only one */}
    {(milanData.mangalDoshaA.present || milanData.mangalDoshaB.present) && (
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
        {milanData.mangalDosha.remedy}
      </Text>
    )}
  </Card.Content>
</Card>
```

---

## Validation

- [ ] Person A chart pre-loaded from `useUserProfile()` — no re-entry required.
- [ ] `DatePickerInput` + `TimePickerModal` from `react-native-paper-dates` used for Person B.
- [ ] `calculateKundliMilan()` called with both full Vedic birth data objects; sidereal default in service.
- [ ] Total Guna score displayed in large `displaySmall` text with color-coded verdict Chip.
- [ ] Ashtakoot `DataTable` shows all 8 Koots with max, scored, and verdict column.
- [ ] Verdict column uses `primaryContainer` for positive, `errorContainer` for zero/low scores.
- [ ] Mangal Dosha card visible for both persons with remedy text when applicable.
- [ ] Divinatory verdict card includes a traditional recommendation paragraph in both Hindi and English.
- [ ] Graha Shanti remedies shown when total score < 18.
- [ ] Web: Person B form opens in a `Dialog`; results in two-column layout ≥ 768 px.
- [ ] `analytics.compatibilityViewed()` called once on mount.
- [ ] No hardcoded colors.

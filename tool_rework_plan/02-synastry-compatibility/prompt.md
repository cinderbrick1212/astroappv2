# Prompt 02 — SynastryScreen MD3 Build

## Platforms
Web · iOS · Android

## Task

Create `mobile/src/screens/SynastryScreen.tsx`.
This screen accepts two people's birth data and renders a **bi-wheel SVG overlay** (Person A's natal wheel as the inner ring, Person B's as the outer ring) plus an inter-chart aspect table and a compatibility summary card.
All calculation must go through `astrologyEngine.calculateSynastry()`.

---

## Context

**Depends on:** Tool 01 (NatalChartScreen + `NatalChartWheel` component already exists).

**New route:** `Synastry: undefined` in `AppStackParamList`.

**Navigation entry point:** The existing `Compatibility` card in `ToolsScreen.tsx` should navigate to `Synastry` instead of the old `Compatibility` screen. Update that card's `screen` prop to `'Synastry'`.

**All preserved imports and logic:**
```tsx
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import { useWindowDimensions } from 'react-native';
```

---

## Platform-Specific Notes

| Platform | Behavior |
|----------|----------|
| iOS | Safe-area insets; `KeyboardAvoidingView behavior="padding"` around Person B input form |
| Android | `KeyboardAvoidingView behavior="height"`; ripple on tappable rows |
| Web | Two-column layout ≥ 768 px: bi-wheel left, aspect table right; Person B form in a Paper `Dialog` opened via FAB |

---

## Required Implementation

### Key structural decisions (based on `tool_analysis/README.md` §2)

- **Bi-wheel:** Inner ring = Person A (logged-in user's natal chart, pre-loaded). Outer ring = Person B (manually entered birth data). Render using `NatalChartWheel` as inner ring plus a second SVG ring overlay component `BiWheelOverlay.tsx`.
- **Inter-chart aspects table:** `DataTable` listing all A→B aspect pairs with aspect symbol, orb, and quality badge.
- **Compatibility summary:** `ProgressBar` chips for key dimensions: Romantic Attraction, Communication, Long-term Stability, Emotional Bond — each scored 0–100 by `astrologyEngine.calculateSynastry()`.
- **No compatibility "percentage score"** displayed as a single number (avoid the oversimplistic pattern noted in `tool_analysis/README.md` §2).

### Person B input form

Use Paper `TextInput` + `react-native-paper-dates` `DatePickerInput` + `TimePickerModal` for birth data. City search via existing `locationService` autocomplete.

### Screen skeleton

```tsx
const SynastryScreen: React.FC = () => {
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

  const [synastryData, setSynastryData] = useState<ReturnType<typeof astrologyEngine.calculateSynastry> | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => { analytics.synastryViewed(); }, []);

  const handleCalculate = () => {
    if (!profile?.birth_date || !personBDate || !personBCoords) return;
    setCalculating(true);
    setCalcError(false);
    astrologyEngine
      .calculateSynastry(
        { date: new Date(profile.birth_date), time: profile.birth_time, latitude: profile.latitude, longitude: profile.longitude, timezone: profile.timezone },
        { date: personBDate, time: personBTime, latitude: personBCoords.lat, longitude: personBCoords.lng, timezone: 'UTC' }
      )
      .then(data => { setSynastryData(data); setFormVisible(false); })
      .catch(() => setCalcError(true))
      .finally(() => setCalculating(false));
  };

  // ... render: form → bi-wheel + aspect table + compatibility cards
};
```

### Compatibility dimension cards

```tsx
// Render four Cards, one per compatibility dimension:
// { label: 'Romantic Attraction', score: synastryData.scores.romantic, icon: 'heart' }
// { label: 'Communication', score: synastryData.scores.communication, icon: 'chat' }
// { label: 'Long-term Stability', score: synastryData.scores.stability, icon: 'anchor' }
// { label: 'Emotional Bond', score: synastryData.scores.emotional, icon: 'hand-heart' }
// Each Card contains a ProgressBar with color theme.colors.primary
// DO NOT show a single aggregate "compatibility score" percentage
```

---

## Validation

- [ ] Person A (logged-in user) chart is pre-loaded; user only enters Person B data.
- [ ] `DatePickerInput` and `TimePickerModal` from `react-native-paper-dates` used for Person B birth date/time.
- [ ] `calculateSynastry()` called with both full birth data objects; no inline orbital math.
- [ ] Bi-wheel renders correctly on iOS, Android, and web without overflow.
- [ ] Inter-chart aspect table shows `DataTable` with planet pair, aspect symbol, orb, and applying/separating badge.
- [ ] Four compatibility dimension `ProgressBar` cards shown; no single aggregate score.
- [ ] `analytics.synastryViewed()` called once on mount.
- [ ] Web: form appears in a `Dialog`; results in two-column layout.
- [ ] No hardcoded colors.

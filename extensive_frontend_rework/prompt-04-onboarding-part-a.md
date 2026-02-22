# Prompt 04 — OnboardingScreen MD3 Rewrite (Part A: Step Renderers 0–2)

## Task

This is Part A of a two-part rewrite of `mobile/src/screens/OnboardingScreen.tsx`. Part A rewrites only the **step renderer functions for steps 0, 1, and 2** plus all necessary imports and type/constant definitions. Part B (prompt-05) completes steps 3–4 and the outer screen shell.

Work directly in `mobile/src/screens/OnboardingScreen.tsx`. Do **not** create a new file.

---

## Context

The current `OnboardingScreen.tsx` uses:
- Custom `TouchableOpacity`-based picker buttons (not Paper)
- Custom styled city chips
- Custom progress bar (a colored `View` with calculated width)
- Manual `StyleSheet` with hardcoded color references

**All existing logic must be preserved:**
- `OnboardingData` interface and all its fields
- `COMMON_CITIES` array
- `GENDERS` and `GENDER_ICONS` constants
- `step`, `data`, `error`, `datePickerVisible`, `timePickerVisible` state
- `next()`, `back()`, `finish()`, `selectCity()` functions
- `DatePickerModal` and `TimePickerModal` from `../components/` remain in place

---

## Required: Update the imports section

Replace all current imports with:

```tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Chip,
  Card,
  ProgressBar,
  SegmentedButtons,
  useTheme,
  List,
} from 'react-native-paper';
import { storage } from '../utils/storage';
import { dateHelpers } from '../utils/dateHelpers';
import DatePickerModal from '../components/DatePickerModal';
import TimePickerModal from '../components/TimePickerModal';
```

Keep `COMMON_CITIES`, `GENDERS`, `GENDER_ICONS`, `OnboardingData`, `Props`, and `LAST_STEP = 4` exactly as they are now.

---

## Required: Rewrite `renderStep()` cases 0, 1, and 2

Inside the `OnboardingScreen` component function, inside `renderStep()`, replace cases `0`, `1`, and `2` as follows. Leave cases `3` and `4` unchanged for now (Part B will replace them).

### Case 0 — Welcome screen

```tsx
case 0:
  return (
    <View style={styles.stepContainer}>
      <Text variant="displaySmall" style={[styles.centeredText, { color: theme.colors.primary }]}>
        ✦ AstroApp
      </Text>
      <Text variant="headlineSmall" style={[styles.centeredText, { color: theme.colors.onBackground, marginTop: 8 }]}>
        Welcome
      </Text>
      <Text
        variant="bodyLarge"
        style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginTop: 8, marginBottom: 32 }]}
      >
        Discover your cosmic blueprint with personalized Vedic astrology insights
      </Text>
      {[
        { icon: 'star-david', text: 'Personalized Kundli & Birth Chart' },
        { icon: 'heart-multiple', text: 'Ashtakoot Compatibility Matching' },
        { icon: 'calendar-today', text: 'Daily Panchang & Horoscope' },
        { icon: 'orbit', text: 'Mahadasha & Planet Insights' },
      ].map((f, i) => (
        <Card
          key={i}
          mode="outlined"
          style={[styles.featureCard, { borderColor: theme.colors.outlineVariant }]}
        >
          <Card.Title
            title={f.text}
            titleVariant="bodyLarge"
            left={props => (
              <List.Icon {...props} icon={f.icon} color={theme.colors.primary} />
            )}
          />
        </Card>
      ))}
    </View>
  );
```

### Case 1 — Name input

```tsx
case 1:
  return (
    <View style={styles.stepContainer}>
      <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.onBackground }]}>
        What's your name?
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
      >
        We'll personalize your experience
      </Text>
      <TextInput
        mode="outlined"
        label="Your name"
        value={data.name}
        onChangeText={v => setData(d => ({ ...d, name: v }))}
        autoFocus
        style={styles.inputFull}
        theme={theme}
        accessibilityLabel="Enter your name"
      />
    </View>
  );
```

### Case 2 — Birth date, time, and gender

```tsx
case 2:
  return (
    <View style={styles.stepContainer}>
      <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.onBackground }]}>
        Birth Date & Time
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
      >
        Accurate details are essential for precise calculations
      </Text>

      {/* Date picker trigger */}
      <Button
        mode="outlined"
        icon="calendar"
        onPress={() => setDatePickerVisible(true)}
        style={styles.pickerButton}
        contentStyle={styles.pickerButtonContent}
        accessibilityLabel="Select date of birth"
      >
        {data.birth_date || 'Select date of birth'}
      </Button>

      {/* Time picker trigger */}
      <Button
        mode="outlined"
        icon="clock-outline"
        onPress={() => setTimePickerVisible(true)}
        style={[styles.pickerButton, { marginTop: 12 }]}
        contentStyle={styles.pickerButtonContent}
        accessibilityLabel="Select time of birth"
      >
        {data.birth_time ? dateHelpers.formatTimeAmPm(data.birth_time) : 'Select time of birth'}
      </Button>

      {/* Gender segmented buttons */}
      <Text
        variant="labelLarge"
        style={[{ color: theme.colors.onSurface, marginTop: 20, marginBottom: 8, alignSelf: 'flex-start' }]}
      >
        Gender
      </Text>
      <SegmentedButtons
        value={data.gender}
        onValueChange={v => setData(d => ({ ...d, gender: v as typeof data.gender }))}
        buttons={GENDERS.map(g => ({
          value: g,
          label: `${GENDER_ICONS[g]} ${g.charAt(0).toUpperCase() + g.slice(1)}`,
          accessibilityLabel: g,
        }))}
        style={styles.inputFull}
        theme={theme}
      />
    </View>
  );
```

---

## Required: Minimal StyleSheet for Part A

Replace the existing `StyleSheet.create({...})` with the following. Part B will extend it.

```typescript
const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  centeredText: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  featureCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 8,
  },
  inputFull: {
    width: '100%',
    maxWidth: 400,
  },
  pickerButton: {
    width: '100%',
    maxWidth: 400,
  },
  pickerButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
});
```

---

## Important Notes

- Do **not** touch cases 3 and 4 of `renderStep()` yet — leave them as-is.
- Do **not** change `next()`, `back()`, `finish()`, `selectCity()`, or the outer return statement JSX yet.
- Do **not** change `DatePickerModal` or `TimePickerModal` usage.
- Add `const theme = useTheme();` at the top of the component function body if it is not already there.

Part B (prompt-05) will replace cases 3 and 4, the outer shell, and the progress bar.

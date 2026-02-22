# Prompt 14 — PanchangScreen MD3 Rewrite

## Task

Rewrite `mobile/src/screens/PanchangScreen.tsx` using Material Design 3 Paper components. All existing logic — panchang calculation, sunrise/sunset, Rahu Kaal, muhurat — must be preserved exactly.

---

## Context

**Current file:** `mobile/src/screens/PanchangScreen.tsx`

**All preserved imports and logic:**
```tsx
import { panchangService, PanchangData } from '../services/panchang';
import { useUserProfile } from '../hooks/useUserProfile';
```

The `panchang` constant, `lat`/`lon` derivation, and `dateStr` formatting remain unchanged.

---

## Required Implementation

Replace `PanchangScreen.tsx` completely with:

```tsx
import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';
import { panchangService, PanchangData } from '../services/panchang';
import { useUserProfile } from '../hooks/useUserProfile';

const PanchangScreen: React.FC = () => {
  const theme = useTheme();
  const { profile } = useUserProfile();
  const today = new Date();

  const lat = profile?.latitude ?? 28.6;
  const lon = profile?.longitude ?? 77.2;
  const panchang: PanchangData = panchangService.calculatePanchang(today, lat, lon);

  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Date hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}
          >
            {dateStr}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, textAlign: 'center', marginTop: 4 }}
          >
            {profile?.birth_place ? `📍 ${profile.birth_place}` : '📍 New Delhi (default)'}
          </Text>
        </Card.Content>
      </Card>

      {/* Key elements as Chips */}
      <View style={styles.chipRow}>
        <Chip
          icon="moon-waning-crescent"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Tithi: ${panchang.tithi}`}
        >
          {panchang.tithi}
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Nakshatra: ${panchang.nakshatra}`}
        >
          {panchang.nakshatra}
        </Chip>
        <Chip
          icon="alert"
          mode="flat"
          style={{ backgroundColor: theme.colors.errorContainer }}
          textStyle={{ color: theme.colors.onErrorContainer }}
          accessibilityLabel={`Rahu Kaal: ${panchang.rahuKaal.start} to ${panchang.rahuKaal.end}`}
        >
          Rahu {panchang.rahuKaal.start}–{panchang.rahuKaal.end}
        </Chip>
      </View>

      {/* Panchang Elements */}
      <List.Subheader style={{ color: theme.colors.primary }}>Panchang Elements</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        {[
          { label: 'Tithi',    value: panchang.tithi,    icon: 'moon-waning-crescent' },
          { label: 'Nakshatra',value: panchang.nakshatra, icon: 'star-four-points' },
          { label: 'Yoga',     value: panchang.yoga,     icon: 'sun-wireless-outline' },
          { label: 'Karana',   value: panchang.karana,   icon: 'rotate-360' },
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <List.Item
              title={item.value}
              description={item.label}
              left={props => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel={`${item.label}: ${item.value}`}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      {/* Sun Timings */}
      <List.Subheader style={{ color: theme.colors.primary }}>Sun Timings</List.Subheader>
      <View style={styles.timingsRow}>
        <Card
          mode="elevated"
          elevation={1}
          style={[styles.timingCard, { flex: 1 }]}
          accessibilityLabel={`Sunrise at ${panchang.sunrise}`}
        >
          <Card.Content style={styles.timingContent}>
            <Text variant="displaySmall" style={{ textAlign: 'center' }}>🌅</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }}>
              Sunrise
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 2 }}>
              {panchang.sunrise}
            </Text>
          </Card.Content>
        </Card>
        <Card
          mode="elevated"
          elevation={1}
          style={[styles.timingCard, { flex: 1, marginLeft: 8 }]}
          accessibilityLabel={`Sunset at ${panchang.sunset}`}
        >
          <Card.Content style={styles.timingContent}>
            <Text variant="displaySmall" style={{ textAlign: 'center' }}>🌇</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }}>
              Sunset
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 2 }}>
              {panchang.sunset}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Rahu Kaal */}
      <List.Subheader style={{ color: theme.colors.error }}>Rahu Kaal</List.Subheader>
      <Card
        mode="outlined"
        style={[styles.card, { borderColor: theme.colors.error }]}
        accessibilityLabel={`Rahu Kaal from ${panchang.rahuKaal.start} to ${panchang.rahuKaal.end}`}
      >
        <Card.Title
          title={`${panchang.rahuKaal.start} – ${panchang.rahuKaal.end}`}
          titleVariant="titleMedium"
          titleStyle={{ color: theme.colors.error }}
          subtitle="Avoid new ventures during this window."
          left={props => <List.Icon {...props} icon="alert-circle-outline" color={theme.colors.error} />}
        />
      </Card>

      {/* Auspicious Muhurats */}
      <List.Subheader style={{ color: theme.colors.primary }}>Auspicious Muhurats</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        {panchang.muhurat.map((m, i, arr) => (
          <React.Fragment key={m.activity}>
            <List.Item
              title={m.time}
              description={m.activity}
              left={props => <List.Icon {...props} icon="star-shooting" color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel={`${m.activity} at ${m.time}`}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    marginBottom: 0,
  },
  heroContent: {
    paddingVertical: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  timingsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  timingCard: {
    marginBottom: 0,
  },
  timingContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});

export default PanchangScreen;
```

---

## Validation

- Date hero card uses `primaryContainer` background.
- Rahu Kaal chip and card use `errorContainer` / `error` colors.
- Sun timings show as side-by-side elevated cards with emoji and time.
- Muhurat list renders all activities from `panchang.muhurat`.
- No hardcoded colors.

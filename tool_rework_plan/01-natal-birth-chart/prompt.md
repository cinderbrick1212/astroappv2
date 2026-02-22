# Prompt 01 — NatalChartScreen MD3 Build

## Platforms
Web · iOS · Android

## Task

Create `mobile/src/screens/NatalChartScreen.tsx` and a new reusable component `mobile/src/components/NatalChartWheel.tsx`.
This is the **foundational tool screen** — it displays the full Vedic/Western natal birth chart using a rendered SVG wheel, a planet-positions `DataTable`, and an aspect-grid `Card`.
All calculation logic must go through the existing `astrologyEngine` service; no inline math.

---

## Context

**Depends on:** `extensive_frontend_rework` prompts 01–08 (theme + ToolsScreen navigation).

**New route to add in `AppStackParamList` (types.ts):**
```ts
NatalChart: undefined;
```

**Navigation entry point:** Add a new `Card` in `ToolsScreen.tsx` (Personal Tools section):
```tsx
{ icon: 'chart-arc', label: 'Natal Chart', subtitle: 'Your full birth chart wheel', screen: 'NatalChart' }
```

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
| iOS | Safe-area padding via `useSafeAreaInsets()`; `ScrollView` with `bounces` |
| Android | Status-bar padding; ripple on tappable rows |
| Web | Two-column layout at ≥ 768 px: wheel left, data table right; max-width 1280 px centered |

---

## Required Implementation

### NatalChartWheel.tsx

```tsx
// mobile/src/components/NatalChartWheel.tsx
// SVG natal chart wheel rendered with react-native-svg.
// Props: { planets: PlanetPosition[]; houseCusps: number[]; size: number }
// - Outermost ring: 12 zodiac sign sectors (30° each), colored by element
//   (fire=primaryContainer, earth=secondaryContainer, air=tertiaryContainer, water=surfaceVariant)
// - Middle ring: degree tick marks every 10°
// - Inner sections: house numbers 1–12
// - Planet glyphs: Unicode symbols placed at their ecliptic longitude on the wheel perimeter
// - Aspect lines: colored line across the center for each major aspect
//   (trine=primary, square=error, sextile=secondary, conjunction=outline, opposition=error)
// - All colors resolved via useTheme().colors.*
// - Minimum planet glyph touch target: 44×44 pt (iOS/Android) / 40×40 px (web)
```

### NatalChartScreen.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Platform } from 'react-native';
import {
  Text, Card, Chip, List, Divider, DataTable,
  Button, ActivityIndicator, SegmentedButtons, useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import NatalChartWheel from '../components/NatalChartWheel';

// House system selector values must match astrologyEngine.calculateChart() options:
// 'placidus' | 'whole_sign' | 'equal'
// Default: 'whole_sign' (correct for Vedic / Indian context of this app)

const NatalChartScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { profile, isLoading } = useUserProfile();
  const [chartData, setChartData] = useState<ReturnType<typeof astrologyEngine.calculateChart> | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState(false);
  const [houseSystem, setHouseSystem] = useState<'placidus' | 'whole_sign' | 'equal'>('whole_sign');
  const [zodiac, setZodiac] = useState<'tropical' | 'sidereal'>('sidereal');

  useEffect(() => { analytics.natalChartViewed(); }, []);

  useEffect(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.latitude) return;
    setCalculating(true);
    setCalcError(false);
    astrologyEngine
      .calculateChart({
        date: new Date(profile.birth_date),
        time: profile.birth_time,
        latitude: profile.latitude,
        longitude: profile.longitude ?? 77.2,
        timezone: profile.timezone ?? 'Asia/Kolkata',
        houseSystem,
        zodiac,
      })
      .then(setChartData)
      .catch(() => setCalcError(true))
      .finally(() => setCalculating(false));
  }, [profile?.birth_date, profile?.birth_time, profile?.latitude, houseSystem, zodiac]);

  // ── Loading ──
  if (isLoading || calculating) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          {calculating ? 'Calculating chart…' : 'Loading profile…'}
        </Text>
      </View>
    );
  }

  // ── Error ──
  if (calcError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
          Calculation Error
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}>
          Could not calculate your chart. Please verify your birth details in Profile.
        </Text>
        <Button mode="contained" style={{ marginTop: 24 }} onPress={() => setCalcError(false)}>
          Retry
        </Button>
      </View>
    );
  }

  // ── Missing birth details ──
  const hasBirthDetails = !!(profile?.birth_date && profile?.birth_time && profile?.birth_place);
  if (!hasBirthDetails) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
          Birth Details Required
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}>
          Add your birth date, time, and place in Profile to view your natal chart.
        </Text>
      </View>
    );
  }

  if (!chartData) return null;

  const wheelSize = isWide ? Math.min(width * 0.45, 480) : width - 32;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24, maxWidth: isWide ? 1280 : undefined, alignSelf: isWide ? 'center' : undefined, width: '100%' }}
    >
      {/* ── Controls ── */}
      <View style={styles.controls}>
        <SegmentedButtons
          value={zodiac}
          onValueChange={v => setZodiac(v as typeof zodiac)}
          buttons={[
            { value: 'sidereal', label: 'Sidereal (Vedic)' },
            { value: 'tropical', label: 'Tropical (Western)' },
          ]}
          style={styles.segmented}
        />
        <SegmentedButtons
          value={houseSystem}
          onValueChange={v => setHouseSystem(v as typeof houseSystem)}
          buttons={[
            { value: 'whole_sign', label: 'Whole Sign' },
            { value: 'placidus', label: 'Placidus' },
            { value: 'equal', label: 'Equal' },
          ]}
          style={[styles.segmented, { marginTop: 8 }]}
        />
      </View>

      {/* ── Key Placements ── */}
      <View style={styles.chipRow}>
        {[
          { icon: 'arrow-up-bold-circle-outline', label: 'Lagna', value: chartData.lagna },
          { icon: 'moon-waning-crescent', label: 'Rashi', value: chartData.rashi },
          { icon: 'star-four-points', label: 'Nakshatra', value: chartData.nakshatra },
          { icon: 'white-balance-sunny', label: 'Sun', value: chartData.sunSign },
        ].map(item => (
          <Chip
            key={item.label}
            icon={item.icon}
            mode="flat"
            style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: theme.colors.onPrimaryContainer }}
            accessibilityLabel={`${item.label}: ${item.value}`}
          >
            {item.label}: {item.value}
          </Chip>
        ))}
      </View>

      {/* ── Chart Wheel + Planet Table (responsive layout) ── */}
      <View style={[styles.mainContent, isWide && styles.mainContentWide]}>
        {/* Wheel */}
        <Card mode="outlined" style={[styles.card, isWide && { flex: 1, marginRight: 8 }]}>
          <Card.Content style={styles.wheelContainer}>
            <NatalChartWheel
              planets={chartData.planets}
              houseCusps={chartData.houseCusps}
              size={wheelSize}
            />
          </Card.Content>
        </Card>

        {/* Planet Positions DataTable */}
        <Card mode="outlined" style={[styles.card, isWide && { flex: 1, marginLeft: 8 }]}>
          <List.Subheader style={{ color: theme.colors.primary }}>Planet Positions</List.Subheader>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Planet</DataTable.Title>
              <DataTable.Title>Sign</DataTable.Title>
              <DataTable.Title numeric>Deg</DataTable.Title>
              <DataTable.Title numeric>House</DataTable.Title>
            </DataTable.Header>
            {chartData.planets.map(p => (
              <DataTable.Row key={p.planet} accessibilityLabel={`${p.planet} in ${p.sign} at ${p.degree}° house ${p.house}${p.retrograde ? ' retrograde' : ''}`}>
                <DataTable.Cell>
                  <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                    {p.glyph} {p.planet}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="bodySmall">{p.sign}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {p.degree}°{p.retrograde ? ' ℞' : ''}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text variant="bodySmall">{p.house}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card>
      </View>

      {/* ── Aspect Grid ── */}
      <List.Subheader style={{ color: theme.colors.primary }}>Major Aspects</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          {chartData.aspects.map((asp, i) => (
            <View key={i} style={styles.aspectRow}>
              <Chip
                mode="flat"
                compact
                style={{ backgroundColor: theme.colors.secondaryContainer, marginRight: 6 }}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
                accessibilityLabel={`${asp.planet1} ${asp.type} ${asp.planet2}, orb ${asp.orb}°`}
              >
                {asp.planet1} {asp.symbol} {asp.planet2}
              </Chip>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {asp.orb}° orb
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  controls: { padding: 16 },
  segmented: { width: '100%' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  chip: { marginBottom: 4 },
  mainContent: { flexDirection: 'column' },
  mainContentWide: { flexDirection: 'row', paddingHorizontal: 16 },
  card: { marginHorizontal: 16, marginBottom: 8 },
  wheelContainer: { alignItems: 'center', paddingVertical: 8 },
  aspectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
});

export default NatalChartScreen;
```

---

## Validation

- [ ] Chart wheel SVG renders on iOS, Android, and web without layout overflow.
- [ ] Wheel size adapts: full-width on mobile, 45 % of viewport on web ≥ 768 px.
- [ ] Zodiac toggle (`Sidereal` / `Tropical`) triggers recalculation and wheel re-render.
- [ ] House system toggle (`Whole Sign` / `Placidus` / `Equal`) triggers recalculation.
- [ ] All planet glyphs and signs display correctly; retrograde shown as ℞.
- [ ] Aspect chips use `secondaryContainer` color token — no hardcoded colors.
- [ ] Missing-birth-details empty state shown when profile is incomplete.
- [ ] Error state shows retry `Button`.
- [ ] `analytics.natalChartViewed()` called exactly once on mount.
- [ ] Two-column layout shown on web ≥ 768 px; single-column on mobile.

# Prompt 01 — Janma Kundli Screen (Full Birth Chart)

## Platforms
Web · iOS · Android

## Tradition
Vedic / Jyotish — sidereal zodiac (Lahiri ayanamsa), Whole Sign houses, nine grahas + Rahu/Ketu.

## Task

Create `mobile/src/screens/JanmaKundliScreen.tsx` and a reusable component
`mobile/src/components/KundliWheel.tsx`.

This replaces the existing lightweight `KundliScreen.tsx` (from `extensive_frontend_rework` prompt 12)
with a full **Janma Kundli** screen: a North-Indian-style square chart wheel rendered in SVG,
a planet-positions `DataTable` (sidereal degrees, nakshatra, house, dignity),
current Mahadasha/Antardasha summary, and a **Graha Shanti** (remedies) card.

All calculation must go through `astrologyEngine.calculateKundli()` with
`zodiac: 'sidereal'` and `houseSystem: 'whole_sign'` as immutable defaults.

---

## Context

**Depends on:** `extensive_frontend_rework` prompts 01–08 (theme + ToolsScreen navigation).

**Route:** Replace `KundliScreen` route target with `JanmaKundli: undefined` in `AppStackParamList`.

**Preserved imports and logic:**
```tsx
import { useUserProfile } from '../hooks/useUserProfile';
import { kundliService, KundliData } from '../services/kundli';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import { useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```

---

## Platform-Specific Notes

| Platform | Behavior |
|----------|----------|
| iOS | Safe-area padding; scroll bounce; 44 × 44 pt minimum touch targets on planet cells |
| Android | Ripple feedback on tappable rows; status-bar color matches `theme.colors.surface` |
| Web | Two-column layout ≥ 768 px: square chart left, data table + interpretations right; max-width 1280 px centered |

---

## KundliWheel.tsx — North Indian Square Chart

```
// mobile/src/components/KundliWheel.tsx
// Props: { planets: VedicPlanet[]; houseCusps: number[]; size: number }
//
// Renders the classic North Indian (diamond/square) Kundli layout using react-native-svg:
//   - Outer square → divided into 12 rhombus/triangular house cells
//   - House 1 (Lagna) is always the top-center diamond
//   - Houses proceed clockwise: 1(top-center), 2(top-right), 3(right-top), 4(right-center) …
//   - Each house cell contains: house number + planet glyphs for planets in that house
//   - Sign number (1=Aries … 12=Pisces) shown in small text in each cell corner
//
// Colors:
//   - Lagna cell border: theme.colors.primary (highlighted)
//   - Planet glyphs: theme.colors.onSurface
//   - Benefic planets (Jupiter, Venus, Mercury, waxing Moon): theme.colors.primary
//   - Malefic planets (Saturn, Mars, Rahu, Ketu, Sun, waning Moon): theme.colors.error
//   - Cell background: theme.colors.surface
//   - Grid lines: theme.colors.outline
//
// Touch: tapping a planet glyph in the wheel triggers onPlanetPress(planetName) callback
// Minimum glyph touch target: 44×44 pt (iOS/Android) enforced via hitSlop
```

---

## Required Implementation — JanmaKundliScreen.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Platform } from 'react-native';
import {
  Text, Card, Chip, List, Divider, DataTable,
  Button, ActivityIndicator, Dialog, Portal, useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserProfile } from '../hooks/useUserProfile';
import { kundliService, KundliData } from '../services/kundli';
import { analytics } from '../services/analytics';
import KundliWheel from '../components/KundliWheel';

const JanmaKundliScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { profile, isLoading } = useUserProfile();
  const [kundli, setKundli] = useState<KundliData | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => { analytics.kundliViewed(); }, []);

  useEffect(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return;
    setCalculating(true);
    setCalcError(false);
    kundliService
      .calculateKundliAsync(
        new Date(profile.birth_date),
        profile.birth_time,
        { latitude: profile.latitude ?? 28.6, longitude: profile.longitude ?? 77.2 },
        profile.timezone ?? 'Asia/Kolkata'
        // zodiac: 'sidereal' and houseSystem: 'whole_sign' are hardcoded inside kundliService
      )
      .then(setKundli)
      .catch(() => setCalcError(true))
      .finally(() => setCalculating(false));
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

  const handlePlanetPress = (planetName: string) => {
    setSelectedPlanet(planetName);
    setDialogVisible(true);
  };

  // ── Loading ──
  if (isLoading || calculating) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          {calculating ? 'ग्रह स्थिति गणना हो रही है…' : 'Loading…'}
        </Text>
      </View>
    );
  }

  if (calcError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
          गणना में त्रुटि
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}>
          कुंडली गणना नहीं हो सकी। कृपया अपना जन्म विवरण जाँचें।
        </Text>
        <Button mode="contained" style={{ marginTop: 24 }} onPress={() => setCalcError(false)}>
          पुनः प्रयास करें
        </Button>
      </View>
    );
  }

  const hasBirthDetails = !!(profile?.birth_date && profile?.birth_time && profile?.birth_place);
  if (!hasBirthDetails) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
          जन्म विवरण आवश्यक है
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}>
          कुंडली देखने के लिए अपनी प्रोफ़ाइल में जन्म तिथि, समय और स्थान जोड़ें।
        </Text>
      </View>
    );
  }

  if (!kundli) return null;

  const wheelSize = isWide ? Math.min(width * 0.40, 440) : width - 48;

  const selectedPlanetData = selectedPlanet
    ? kundli.chartData.planets.find(p => p.planet === selectedPlanet)
    : null;

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
          maxWidth: isWide ? 1280 : undefined,
          alignSelf: isWide ? 'center' : undefined,
          width: '100%',
        }}
      >
        {/* ── Key Placements Chips ── */}
        <View style={styles.chipRow}>
          {[
            { icon: 'arrow-up-bold-circle-outline', label: 'लग्न', value: kundli.lagna },
            { icon: 'moon-waning-crescent',         label: 'राशि', value: kundli.rashi },
            { icon: 'star-four-points',              label: 'नक्षत्र', value: kundli.nakshatra },
            { icon: 'white-balance-sunny',           label: 'सूर्य', value: kundli.sunSign },
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

        {/* ── Wheel + Planet Table (responsive) ── */}
        <View style={[styles.mainContent, isWide && styles.mainContentWide]}>

          {/* North Indian Square Wheel */}
          <Card mode="outlined" style={[styles.card, isWide && { flex: 1, marginRight: 8 }]}>
            <Card.Content style={styles.wheelContainer}>
              <KundliWheel
                planets={kundli.chartData.planets}
                houseCusps={kundli.chartData.houseCusps}
                size={wheelSize}
                onPlanetPress={handlePlanetPress}
              />
            </Card.Content>
          </Card>

          {/* Planet Positions Table */}
          <Card mode="outlined" style={[styles.card, isWide && { flex: 1, marginLeft: 8 }]}>
            <List.Subheader style={{ color: theme.colors.primary }}>ग्रह स्थिति</List.Subheader>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>ग्रह</DataTable.Title>
                <DataTable.Title>राशि</DataTable.Title>
                <DataTable.Title>नक्षत्र</DataTable.Title>
                <DataTable.Title numeric>भाव</DataTable.Title>
              </DataTable.Header>
              {kundli.chartData.planets.map(p => (
                <DataTable.Row
                  key={p.planet}
                  onPress={() => handlePlanetPress(p.planet)}
                  accessibilityLabel={`${p.planet} ${p.sign} भाव ${p.house}${p.retrograde ? ' वक्री' : ''}`}
                >
                  <DataTable.Cell>
                    <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                      {p.glyph} {p.planet}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text variant="bodySmall">{p.sign}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {p.nakshatra ?? '—'}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text variant="bodySmall">
                      {p.house}{p.retrograde ? ' ℞' : ''}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card>
        </View>

        <Divider style={styles.divider} />

        {/* ── Current Mahadasha / Antardasha ── */}
        <List.Subheader style={{ color: theme.colors.primary }}>महादशा / अन्तर्दशा</List.Subheader>
        <Card mode="elevated" elevation={1} style={styles.card}>
          <Card.Title
            title={`${kundli.dasha.planet} महादशा`}
            subtitle={`समाप्ति: ${kundli.dasha.endYear} | अन्तर्दशा: ${kundli.dasha.antardasha}`}
            titleVariant="titleMedium"
            left={props => <List.Icon {...props} icon="orbit" color={theme.colors.primary} />}
          />
          <Card.Content>
            {/* Dasha interpretation — divinatory prediction */}
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
              {kundli.dasha.interpretation}
            </Text>
            <Chip
              icon="clock-outline"
              mode="flat"
              style={{ backgroundColor: theme.colors.secondaryContainer, alignSelf: 'flex-start' }}
              textStyle={{ color: theme.colors.onSecondaryContainer }}
              accessibilityLabel={`दशा शेष: ${kundli.dasha.remaining}`}
            >
              शेष: {kundli.dasha.remaining}
            </Chip>
          </Card.Content>
        </Card>

        {/* ── Yogas ── */}
        {kundli.yogas && kundli.yogas.length > 0 && (
          <>
            <List.Subheader style={{ color: theme.colors.primary }}>प्रमुख योग</List.Subheader>
            {kundli.yogas.map((yoga, i) => (
              <Card key={i} mode="outlined" style={styles.card}
                accessibilityLabel={`योग: ${yoga.name}`}>
                <Card.Title
                  title={yoga.name}
                  subtitle={yoga.quality === 'benefic' ? 'शुभ योग' : 'अशुभ योग'}
                  titleVariant="titleSmall"
                  left={props => (
                    <List.Icon
                      {...props}
                      icon={yoga.quality === 'benefic' ? 'star-circle' : 'alert-circle-outline'}
                      color={yoga.quality === 'benefic' ? theme.colors.primary : theme.colors.error}
                    />
                  )}
                />
                <Card.Content>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {yoga.description}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        {/* ── Graha Shanti Remedies ── */}
        <List.Subheader style={{ color: theme.colors.primary }}>ग्रह शांति उपाय</List.Subheader>
        <Card mode="outlined" style={styles.card} accessibilityLabel="ग्रह शांति उपाय">
          <Card.Content>
            {kundli.remedies.map((remedy, i) => (
              <View key={i} style={styles.remedyRow}>
                <List.Icon icon={remedy.icon} color={theme.colors.primary} style={styles.remedyIcon} />
                <View style={{ flex: 1 }}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>
                    {remedy.graha} — {remedy.type}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {remedy.description}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* ── Planet Detail Dialog ── */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{selectedPlanetData?.planet} — {selectedPlanetData?.sign}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {selectedPlanetData?.interpretation ?? 'विवरण उपलब्ध नहीं है।'}
            </Text>
            {selectedPlanetData?.retrograde && (
              <Chip icon="rotate-left" mode="flat"
                style={{ backgroundColor: theme.colors.errorContainer, marginTop: 8, alignSelf: 'flex-start' }}
                textStyle={{ color: theme.colors.onErrorContainer }}>
                वक्री (Retrograde)
              </Chip>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>बंद करें</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16, paddingBottom: 8 },
  chip: { marginBottom: 4 },
  mainContent: { flexDirection: 'column' },
  mainContentWide: { flexDirection: 'row', paddingHorizontal: 16 },
  card: { marginHorizontal: 16, marginBottom: 8 },
  wheelContainer: { alignItems: 'center', paddingVertical: 8 },
  divider: { marginVertical: 8, marginHorizontal: 16 },
  remedyRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  remedyIcon: { marginRight: 8, marginTop: 2 },
});

export default JanmaKundliScreen;
```

---

## Validation

- [ ] Sidereal zodiac (Lahiri) and Whole Sign houses are the only zodiac/house mode — no toggle exposed to the user.
- [ ] North Indian square wheel renders on iOS, Android, and web without overflow.
- [ ] Tapping a planet glyph in the wheel or a row in the DataTable opens the planet detail `Dialog`.
- [ ] Mahadasha card shows planet name, Antardasha, end year, remaining time, and a one-paragraph **divinatory interpretation**.
- [ ] Yogas section lists named Rajayogas/Doshas with benefic/malefic badge; omitted when `kundli.yogas` is empty.
- [ ] Graha Shanti remedies card shows gemstone, mantra, and donation recommendation for each afflicted graha.
- [ ] Loading state shows Devanagari loading text on Android/iOS; English fallback on web.
- [ ] Two-column layout on web ≥ 768 px; single column on mobile.
- [ ] `analytics.kundliViewed()` called once on mount.
- [ ] No hardcoded hex colors anywhere.

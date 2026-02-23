import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  DataTable,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { panchangService } from '../services/panchang';
import { analytics } from '../services/analytics';
import type { PanchangData } from '../services/panchang';

// Activity categories
const ACTIVITIES = [
  'Marriage', 'Travel', 'Business', 'Education',
  'Medical', 'Construction', 'Grihapravesh', 'Naming',
] as const;

type Activity = typeof ACTIVITIES[number];

// Favorable tithis by activity
const FAVORABLE_TITHIS: Record<Activity, string[]> = {
  Marriage: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Ekadashi', 'Trayodashi'],
  Travel: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Dwadashi', 'Trayodashi'],
  Business: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Trayodashi'],
  Education: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami'],
  Medical: ['Chaturthi', 'Shashthi', 'Ashtami', 'Navami', 'Ekadashi', 'Chaturdashi'],
  Construction: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Trayodashi'],
  Grihapravesh: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Dwadashi', 'Trayodashi'],
  Naming: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi'],
};

// Favorable nakshatras by activity
const FAVORABLE_NAKSHATRAS: Record<Activity, string[]> = {
  Marriage: ['Rohini', 'Mrigashirsha', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
  Travel: ['Ashwini', 'Mrigashirsha', 'Pushya', 'Hasta', 'Anuradha', 'Revati'],
  Business: ['Ashwini', 'Rohini', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana', 'Dhanishta', 'Revati'],
  Education: ['Ashwini', 'Rohini', 'Mrigashirsha', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana', 'Revati'],
  Medical: ['Ashwini', 'Pushya', 'Hasta', 'Anuradha', 'Shravana', 'Revati'],
  Construction: ['Rohini', 'Mrigashirsha', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Uttara Ashadha', 'Shravana', 'Dhanishta'],
  Grihapravesh: ['Rohini', 'Mrigashirsha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Uttara Bhadrapada', 'Revati'],
  Naming: ['Ashwini', 'Rohini', 'Mrigashirsha', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Swati', 'Shravana', 'Revati'],
};

type Verdict = 'Auspicious' | 'Neutral' | 'Inauspicious';

function evaluateAuspiciousness(
  panchang: PanchangData,
  activity: Activity
): { verdict: Verdict; reason: string } {
  const tithis = FAVORABLE_TITHIS[activity];
  const nakshatras = FAVORABLE_NAKSHATRAS[activity];
  const tithiMatch = tithis.some(t => panchang.tithi.includes(t));
  const nakshatraMatch = nakshatras.includes(panchang.nakshatra);

  if (tithiMatch && nakshatraMatch) {
    return { verdict: 'Auspicious', reason: `Both ${panchang.tithi} and ${panchang.nakshatra} are favorable for ${activity}.` };
  }
  if (tithiMatch || nakshatraMatch) {
    const favorable = tithiMatch ? `Tithi (${panchang.tithi})` : `Nakshatra (${panchang.nakshatra})`;
    const unfavorable = tithiMatch ? `Nakshatra (${panchang.nakshatra})` : `Tithi (${panchang.tithi})`;
    return { verdict: 'Neutral', reason: `${favorable} is favorable but ${unfavorable} is not ideal for ${activity}.` };
  }
  return { verdict: 'Inauspicious', reason: `Neither ${panchang.tithi} nor ${panchang.nakshatra} are favorable for ${activity} today.` };
}

const VERDICT_ICONS: Record<Verdict, string> = {
  Auspicious: 'check-circle',
  Neutral: 'minus-circle',
  Inauspicious: 'close-circle',
};

const MuhurtaScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    analytics.screenView('Muhurta');
  }, []);

  const lat = profile?.latitude ?? 28.6;
  const lng = profile?.longitude ?? 77.2;

  const panchang = useMemo<PanchangData | null>(() => {
    try {
      return panchangService.calculatePanchang(new Date(), lat, lng);
    } catch {
      return null;
    }
  }, [lat, lng]);

  const result = useMemo(() => {
    if (!panchang || !selectedActivity) return null;
    return evaluateAuspiciousness(panchang, selectedActivity);
  }, [panchang, selectedActivity]);

  const verdictColors: Record<Verdict, { bg: string; fg: string }> = {
    Auspicious: { bg: theme.colors.primaryContainer, fg: theme.colors.onPrimaryContainer },
    Neutral: { bg: theme.colors.secondaryContainer, fg: theme.colors.onSecondaryContainer },
    Inauspicious: { bg: theme.colors.errorContainer, fg: theme.colors.onErrorContainer },
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          Loading…
        </Text>
      </View>
    );
  }

  if (!panchang) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Today's Panchang Summary */}
      <List.Subheader style={{ color: theme.colors.primary }}>Today's Panchang</List.Subheader>
      <View style={styles.chipRow}>
        <Chip
          icon="calendar-today"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          {panchang.tithi}
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          {panchang.nakshatra}
        </Chip>
        <Chip
          icon="yoga"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          {panchang.yoga}
        </Chip>
      </View>

      <Divider style={{ marginVertical: 8 }} />

      {/* Activity Selector */}
      <List.Subheader style={{ color: theme.colors.primary }}>Select Activity</List.Subheader>
      <View style={styles.chipRow}>
        {ACTIVITIES.map(activity => (
          <Chip
            key={activity}
            mode={selectedActivity === activity ? 'flat' : 'outlined'}
            selected={selectedActivity === activity}
            onPress={() => setSelectedActivity(activity)}
            style={[
              styles.placementChip,
              selectedActivity === activity ? { backgroundColor: theme.colors.primary } : undefined,
            ]}
            textStyle={selectedActivity === activity ? { color: theme.colors.onPrimary } : { color: theme.colors.onSurface }}
          >
            {activity}
          </Chip>
        ))}
      </View>

      <Divider style={{ marginVertical: 8 }} />

      {/* Result Card */}
      {result && selectedActivity && (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Result for {selectedActivity}</List.Subheader>
          <Card
            mode="elevated"
            elevation={2}
            style={[styles.card, { backgroundColor: verdictColors[result.verdict].bg }]}
          >
            <Card.Title
              title={result.verdict}
              titleVariant="titleMedium"
              titleStyle={{ color: verdictColors[result.verdict].fg }}
              left={props => (
                <List.Icon
                  {...props}
                  icon={VERDICT_ICONS[result.verdict]}
                  color={verdictColors[result.verdict].fg}
                />
              )}
            />
            <Card.Content>
              <Text variant="bodyMedium" style={{ color: verdictColors[result.verdict].fg }}>
                {result.reason}
              </Text>
            </Card.Content>
          </Card>
        </>
      )}

      {!selectedActivity && (
        <Card mode="outlined" style={styles.card}>
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              Select an activity above to check auspiciousness for today.
            </Text>
          </Card.Content>
        </Card>
      )}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  placementChip: {
    marginBottom: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomPad: {
    height: 24,
  },
});

export default MuhurtaScreen;

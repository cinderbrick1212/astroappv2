import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { horoscopeService } from '../services/horoscope';
import { analytics } from '../services/analytics';
import { getDashaContent } from '../data';

const RATING_LABELS: Record<number, string> = {
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

const RATING_ICONS: Record<number, string> = {
  3: 'emoticon-neutral-outline',
  4: 'emoticon-happy-outline',
  5: 'emoticon-excited-outline',
};

const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const DainikRashifalScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    analytics.screenView('DainikRashifal');
  }, []);

  const chartInfo = useMemo(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      const chart = astrologyEngine.calculateKundli(profile);
      return { moonSign: chart.moonSign, nakshatra: chart.nakshatra };
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

  const horoscope = useMemo(() => {
    if (!chartInfo) return null;
    return horoscopeService.getDailyHoroscope(chartInfo.moonSign, date);
  }, [chartInfo, date]);

  const luckyFactors = useMemo(() => {
    if (!chartInfo) return null;
    return horoscopeService.getLuckyFactors(chartInfo.nakshatra, date);
  }, [chartInfo, date]);

  const dashaRemedy = useMemo(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      const dasha = astrologyEngine.calculateDasha(profile);
      return getDashaContent(dasha.currentMahadasha.lord.toLowerCase());
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

  const dailyRemedy = dashaRemedy?.spiritualPractice ?? 'Meditate for 10 minutes at sunrise for spiritual growth.';

  const goToPrevDay = () => {
    setDate(d => {
      const prev = new Date(d);
      prev.setDate(prev.getDate() - 1);
      return prev;
    });
  };

  const goToNextDay = () => {
    setDate(d => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const goToToday = () => setDate(new Date());

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

  // Missing birth details
  const hasBirthDetails = !!(profile?.birth_date && profile?.birth_time && profile?.birth_place);
  if (!hasBirthDetails) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
          Birth Details Required
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}
        >
          Add your birth date, time, and place in your Profile to view your daily horoscope.
        </Text>
      </View>
    );
  }

  if (!chartInfo || !horoscope || !luckyFactors) return null;

  const ratingLabel = RATING_LABELS[horoscope.rating] ?? 'Average';
  const ratingIcon = RATING_ICONS[horoscope.rating] ?? 'emoticon-neutral-outline';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Date Navigator */}
      <View style={styles.dateRow}>
        <Button
          mode="outlined"
          compact
          onPress={goToPrevDay}
          icon="chevron-left"
          accessibilityLabel="Previous day"
        >
          Prev
        </Button>
        <Button
          mode="text"
          compact
          onPress={goToToday}
          accessibilityLabel="Go to today"
        >
          Today
        </Button>
        <Button
          mode="outlined"
          compact
          onPress={goToNextDay}
          icon="chevron-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
          accessibilityLabel="Next day"
        >
          Next
        </Button>
      </View>

      {/* Hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}
          >
            {chartInfo.moonSign}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
          >
            {formatDate(date)}
          </Text>
        </Card.Content>
      </Card>

      {/* Overall Mood */}
      <View style={styles.chipRow}>
        <Chip
          icon={ratingIcon}
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Overall mood: ${ratingLabel}`}
        >
          Mood: {ratingLabel} ({horoscope.rating}/5)
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
        >
          {chartInfo.nakshatra}
        </Chip>
      </View>

      {/* Daily Prediction */}
      <List.Subheader style={{ color: theme.colors.primary }}>Daily Prediction</List.Subheader>
      <Card mode="elevated" elevation={1} style={styles.card}>
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, lineHeight: 22 }}>
            {horoscope.prediction}
          </Text>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Lucky Factors */}
      <List.Subheader style={{ color: theme.colors.primary }}>Lucky Factors</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          <View style={styles.chipRow}>
            <Chip
              icon="numeric"
              mode="flat"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ color: theme.colors.onPrimaryContainer }}
              accessibilityLabel={`Lucky number: ${luckyFactors.number}`}
            >
              Number: {luckyFactors.number}
            </Chip>
            <Chip
              icon="palette-outline"
              mode="flat"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ color: theme.colors.onPrimaryContainer }}
              accessibilityLabel={`Lucky color: ${luckyFactors.color}`}
            >
              Color: {luckyFactors.color}
            </Chip>
            <Chip
              icon="clock-outline"
              mode="flat"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ color: theme.colors.onPrimaryContainer }}
              accessibilityLabel={`Lucky time: ${luckyFactors.time}`}
            >
              Time: {luckyFactors.time}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Remedy of the Day */}
      <List.Subheader style={{ color: theme.colors.primary }}>Remedy of the Day</List.Subheader>
      <Card
        mode="elevated"
        elevation={1}
        style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}
      >
        <Card.Title
          title="Daily Recommendation"
          titleVariant="titleSmall"
          titleStyle={{ color: theme.colors.onSecondaryContainer }}
          left={props => <List.Icon {...props} icon="hands-pray" color={theme.colors.onSecondaryContainer} />}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
            {dailyRemedy}
          </Text>
        </Card.Content>
      </Card>

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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  bottomPad: {
    height: 24,
  },
});

export default DainikRashifalScreen;

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  Button,
  useTheme,
} from 'react-native-paper';
import { panchangService } from '../services/panchang';
import { useUserProfile } from '../hooks/useUserProfile';
import { analytics } from '../services/analytics';

// Tithi name → number (1-30) mapping
const TITHI_LIST: { name: string; number: number }[] = [
  { name: 'Pratipada', number: 1 },
  { name: 'Dwitiya', number: 2 },
  { name: 'Tritiya', number: 3 },
  { name: 'Chaturthi', number: 4 },
  { name: 'Panchami', number: 5 },
  { name: 'Shashthi', number: 6 },
  { name: 'Saptami', number: 7 },
  { name: 'Ashtami', number: 8 },
  { name: 'Navami', number: 9 },
  { name: 'Dashami', number: 10 },
  { name: 'Ekadashi', number: 11 },
  { name: 'Dwadashi', number: 12 },
  { name: 'Trayodashi', number: 13 },
  { name: 'Chaturdashi', number: 14 },
  { name: 'Purnima', number: 15 },
  { name: 'Pratipada', number: 16 },
  { name: 'Dwitiya', number: 17 },
  { name: 'Tritiya', number: 18 },
  { name: 'Chaturthi', number: 19 },
  { name: 'Panchami', number: 20 },
  { name: 'Shashthi', number: 21 },
  { name: 'Saptami', number: 22 },
  { name: 'Ashtami', number: 23 },
  { name: 'Navami', number: 24 },
  { name: 'Dashami', number: 25 },
  { name: 'Ekadashi', number: 26 },
  { name: 'Dwadashi', number: 27 },
  { name: 'Trayodashi', number: 28 },
  { name: 'Chaturdashi', number: 29 },
  { name: 'Amavasya', number: 30 },
];

const getMoonPhaseEmoji = (tithiNumber: number): { emoji: string; label: string } => {
  if (tithiNumber === 30) return { emoji: '🌑', label: 'New Moon' };
  if (tithiNumber <= 3) return { emoji: '🌒', label: 'Waxing Crescent' };
  if (tithiNumber <= 7) return { emoji: '🌓', label: 'First Quarter' };
  if (tithiNumber <= 11) return { emoji: '🌔', label: 'Waxing Gibbous' };
  if (tithiNumber === 15) return { emoji: '🌕', label: 'Full Moon' };
  if (tithiNumber <= 18) return { emoji: '🌖', label: 'Waning Gibbous' };
  if (tithiNumber <= 22) return { emoji: '🌗', label: 'Last Quarter' };
  return { emoji: '🌘', label: 'Waning Crescent' };
};

const getTithiNumber = (tithiName: string): number => {
  const normalized = tithiName.trim().split(/\s+/)[0];
  const match = TITHI_LIST.find(
    (t) => t.name.toLowerCase() === normalized.toLowerCase()
  );
  return match?.number ?? 1;
};

const getAuspiciousness = (tithiNumber: number): { level: string; description: string } => {
  if (tithiNumber === 11 || tithiNumber === 26)
    return { level: 'Highly Auspicious', description: 'Ekadashi — ideal for fasting, prayer, and spiritual practices.' };
  if (tithiNumber === 15)
    return { level: 'Auspicious', description: 'Purnima — full moon, excellent for charity and worship.' };
  if (tithiNumber === 30)
    return { level: 'Mixed', description: 'Amavasya — new moon, suitable for ancestor rituals (Pitru Tarpan).' };
  if ([2, 3, 5, 7, 10, 12, 13].includes(tithiNumber % 15 || 15))
    return { level: 'Auspicious', description: 'A favorable tithi for new ventures and important activities.' };
  return { level: 'Neutral', description: 'A regular tithi — proceed with routine activities.' };
};

const getUpcomingSpecialDays = (currentTithiNumber: number): { name: string; daysAway: number }[] => {
  const specials = [
    { name: 'Ekadashi (Shukla)', target: 11 },
    { name: 'Purnima', target: 15 },
    { name: 'Ekadashi (Krishna)', target: 26 },
    { name: 'Amavasya', target: 30 },
  ];
  return specials
    .map((s) => ({
      name: s.name,
      daysAway: s.target > currentTithiNumber
        ? s.target - currentTithiNumber
        : 30 - currentTithiNumber + s.target,
    }))
    .sort((a, b) => a.daysAway - b.daysAway);
};

const TithiChandraScreen: React.FC = () => {
  const theme = useTheme();
  const { profile } = useUserProfile();
  const [dateOffset, setDateOffset] = useState(0);

  useEffect(() => {
    analytics.screenView('TithiChandra');
  }, []);

  const date = new Date();
  date.setDate(date.getDate() + dateOffset);

  const lat = profile?.latitude ?? 28.6;
  const lon = profile?.longitude ?? 77.2;
  const panchang = panchangService.calculatePanchang(date, lat, lon);

  const tithiNumber = getTithiNumber(panchang.tithi);
  const paksha = tithiNumber <= 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const moonPhase = getMoonPhaseEmoji(tithiNumber);
  const auspiciousness = getAuspiciousness(tithiNumber);
  const upcomingSpecial = getUpcomingSpecialDays(tithiNumber);

  const dateStr = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Date Navigation */}
      <View style={styles.dateNav}>
        <Button
          mode="text"
          compact
          onPress={() => setDateOffset((d) => d - 1)}
          textColor={theme.colors.primary}
          accessibilityLabel="Previous day"
        >
          ‹ Prev
        </Button>
        <View style={styles.dateLabelContainer}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
            {dateStr}
          </Text>
          {dateOffset !== 0 && (
            <Button
              mode="text"
              compact
              onPress={() => setDateOffset(0)}
              textColor={theme.colors.primary}
            >
              Today
            </Button>
          )}
        </View>
        <Button
          mode="text"
          compact
          onPress={() => setDateOffset((d) => d + 1)}
          textColor={theme.colors.primary}
          accessibilityLabel="Next day"
        >
          Next ›
        </Button>
      </View>

      {/* Moon Phase Hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text variant="displayLarge" style={{ textAlign: 'center' }}>
            {moonPhase.emoji}
          </Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8 }}
          >
            {moonPhase.label}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
          >
            {paksha}
          </Text>
        </Card.Content>
      </Card>

      {/* Tithi Details */}
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
          icon="numeric"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Tithi number: ${tithiNumber}`}
        >
          Tithi #{tithiNumber}
        </Chip>
        <Chip
          icon="circle-half-full"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={paksha}
        >
          {paksha}
        </Chip>
      </View>

      {/* Auspiciousness */}
      <List.Subheader style={{ color: theme.colors.primary }}>Auspiciousness</List.Subheader>
      <Card
        mode="elevated"
        elevation={1}
        style={[
          styles.card,
          {
            backgroundColor:
              auspiciousness.level === 'Highly Auspicious'
                ? theme.colors.primaryContainer
                : auspiciousness.level === 'Mixed'
                  ? theme.colors.errorContainer
                  : theme.colors.secondaryContainer,
          },
        ]}
      >
        <Card.Title
          title={auspiciousness.level}
          titleVariant="titleMedium"
          titleStyle={{
            color:
              auspiciousness.level === 'Highly Auspicious'
                ? theme.colors.onPrimaryContainer
                : auspiciousness.level === 'Mixed'
                  ? theme.colors.onErrorContainer
                  : theme.colors.onSecondaryContainer,
          }}
          left={(props) => (
            <List.Icon
              {...props}
              icon={auspiciousness.level === 'Highly Auspicious' ? 'star' : 'information-outline'}
              color={
                auspiciousness.level === 'Highly Auspicious'
                  ? theme.colors.onPrimaryContainer
                  : auspiciousness.level === 'Mixed'
                    ? theme.colors.onErrorContainer
                    : theme.colors.onSecondaryContainer
              }
            />
          )}
        />
        <Card.Content>
          <Text
            variant="bodyMedium"
            style={{
              color:
                auspiciousness.level === 'Highly Auspicious'
                  ? theme.colors.onPrimaryContainer
                  : auspiciousness.level === 'Mixed'
                    ? theme.colors.onErrorContainer
                    : theme.colors.onSecondaryContainer,
            }}
          >
            {auspiciousness.description}
          </Text>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Upcoming Special Days */}
      <List.Subheader style={{ color: theme.colors.primary }}>Upcoming Special Days</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        {upcomingSpecial.map((day, i, arr) => (
          <React.Fragment key={day.name}>
            <List.Item
              title={day.name}
              description={`~${day.daysAway} tithi${day.daysAway !== 1 ? 's' : ''} away`}
              left={(props) => <List.Icon {...props} icon="calendar-star" color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel={`${day.name} in approximately ${day.daysAway} tithis`}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  dateLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  heroCard: {
    margin: 16,
    marginBottom: 0,
  },
  heroContent: {
    paddingVertical: 24,
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

export default TithiChandraScreen;

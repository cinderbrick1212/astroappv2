# Prompt 06 — DailyFeedScreen MD3 Rewrite

## Task

Rewrite `mobile/src/screens/DailyFeedScreen.tsx` using Material Design 3 Paper components. All existing logic — horoscope calculation, focus area derivation, feed fetching, analytics, pull-to-refresh, infinite scroll — must be preserved exactly.

---

## Context

**Current file:** `mobile/src/screens/DailyFeedScreen.tsx`

Current pain points:
- Manual `View`+`StyleSheet` cards with hardcoded `colors.*` references
- `FeedHeader` is a custom component — keep using it but it will be rewritten in Prompt 07
- `FeedItemCard` is a custom component — keep using it (Prompt 07 rewrites it)
- `AdCard`, `RemedyCard`, `LoadingSkeleton`, `OfflineBanner` are custom — keep using them as-is

**All hooks, services, and logic imports are unchanged:**
```tsx
import { useAuth } from '../hooks/useAuth';
import { useFeedItems } from '../hooks/useFeedItems';
import { useStreak } from '../hooks/useStreak';
import { useUserProfile } from '../hooks/useUserProfile';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
```

Constants `ZODIAC_EMOJI`, `AD_FREQUENCY`, `FOCUS_AREAS`, `FOCUS_MESSAGES` remain unchanged.

---

## Required Implementation

Replace `DailyFeedScreen.tsx` completely with:

```tsx
import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  Divider,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import FeedHeader from '../components/FeedHeader';
import FeedItemCard from '../components/FeedItemCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import OfflineBanner from '../components/OfflineBanner';
import RemedyCard from '../components/RemedyCard';
import AdCard from '../components/AdCard';
import { useAuth } from '../hooks/useAuth';
import { useFeedItems } from '../hooks/useFeedItems';
import { useStreak } from '../hooks/useStreak';
import { useUserProfile } from '../hooks/useUserProfile';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';

const ZODIAC_EMOJI: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const AD_FREQUENCY = 5;

const FOCUS_AREAS = [
  { label: 'Career',     icon: '💼', day: 1 },
  { label: 'Love',       icon: '❤️', day: 2 },
  { label: 'Health',     icon: '🌿', day: 3 },
  { label: 'Finance',    icon: '💰', day: 4 },
  { label: 'Growth',     icon: '🌱', day: 5 },
  { label: 'Family',     icon: '🏡', day: 6 },
  { label: 'Creativity', icon: '🎨', day: 0 },
];

const FOCUS_MESSAGES: Record<string, string> = {
  Career:     'Today favors career initiatives — take bold action.',
  Love:       'Open your heart; meaningful connections await.',
  Health:     'Prioritize rest and nourishment today.',
  Finance:    'A careful review of finances brings clarity.',
  Growth:     'Step outside your comfort zone to grow.',
  Family:     'Quality time with loved ones restores energy.',
  Creativity: 'Express yourself — inspiration is flowing.',
};

const DailyFeedScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { feedItems, isLoading, refetch } = useFeedItems();
  const { streak } = useStreak();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    analytics.screenView('DailyFeed');
  }, []);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const focus = FOCUS_AREAS.find(f => f.day === dayOfWeek) || FOCUS_AREAS[0];

  const rashi = profile?.birth_date
    ? horoscopeService.getRashiFromBirthDate(new Date(profile.birth_date))
    : astrologyEngine.getSunSign(new Date());

  const horoscope = horoscopeService.getDailyHoroscope(rashi, today);

  const userName = user?.username || user?.email?.split('@')[0];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <>
      <OfflineBanner />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Feed header (greeting + streak) — rewritten separately in Prompt 07 */}
        <FeedHeader date={today} userName={userName} streak={streak} />

        {/* Daily Horoscope Card */}
        <Card
          mode="elevated"
          elevation={1}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          accessibilityLabel={`Daily horoscope for ${rashi}`}
        >
          <Card.Content>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, letterSpacing: 1.5, marginBottom: 8 }}>
              DAILY HOROSCOPE
            </Text>
            <View style={styles.rashiRow}>
              <Text style={styles.rashiEmoji}>{ZODIAC_EMOJI[rashi] || '✨'}</Text>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                {rashi}
              </Text>
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 22 }}>
              {horoscope.prediction}
            </Text>
            <View style={styles.luckyChipRow}>
              <Chip
                icon="numeric"
                mode="flat"
                style={{ backgroundColor: theme.colors.secondaryContainer }}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
                accessibilityLabel={`Lucky number ${horoscope.luckyNumber}`}
              >
                {horoscope.luckyNumber}
              </Chip>
              <Chip
                icon="palette"
                mode="flat"
                style={{ backgroundColor: theme.colors.secondaryContainer, marginLeft: 8 }}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
                accessibilityLabel={`Lucky color ${horoscope.luckyColor}`}
              >
                {horoscope.luckyColor}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Focus Card */}
        <Card
          mode="contained"
          style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}
          accessibilityLabel={`Today's focus: ${focus.label}`}
        >
          <Card.Content style={styles.focusContent}>
            <Text style={styles.focusEmoji}>{focus.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                {focus.label} Focus
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.85, marginTop: 4 }}>
                {FOCUS_MESSAGES[focus.label]}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Remedy of the Day */}
        <RemedyCard date={today} />

        {/* Feed Section */}
        <View style={styles.feedSection}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 12 }}>
            Today's Feed
          </Text>
          {isLoading ? (
            <LoadingSkeleton />
          ) : feedItems.length > 0 ? (
            feedItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <FeedItemCard item={item} />
                {(index + 1) % AD_FREQUENCY === 0 && <AdCard />}
              </React.Fragment>
            ))
          ) : (
            <Card mode="outlined" style={{ marginBottom: 8 }}>
              <Card.Content>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                  No feed items today. Pull to refresh.
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  rashiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  rashiEmoji: {
    fontSize: 28,
  },
  luckyChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  focusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusEmoji: {
    fontSize: 32,
  },
  feedSection: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
});

export default DailyFeedScreen;
```

---

## Validation

- Horoscope card shows rashi emoji + name + prediction text + lucky Chips.
- Today's Focus card uses `primaryContainer` background.
- Pull-to-refresh spinner color matches `theme.colors.primary`.
- Empty feed state shows in an outlined `Card`.
- No hardcoded hex colors.
- All service/hook calls identical to the original.

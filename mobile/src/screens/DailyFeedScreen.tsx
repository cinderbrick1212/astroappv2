import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl, View, Platform, useWindowDimensions } from 'react-native';
import {
  Text,
  Card,
  Chip,
  Surface,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
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
  { label: 'Career', emoji: '💼', day: 1, message: 'Today favors career initiatives — take bold action.' },
  { label: 'Love', emoji: '❤️', day: 2, message: 'Open your heart; meaningful connections await.' },
  { label: 'Health', emoji: '🌿', day: 3, message: 'Prioritize rest and nourishment today.' },
  { label: 'Finance', emoji: '💰', day: 4, message: 'A careful review of finances brings clarity.' },
  { label: 'Growth', emoji: '🌱', day: 5, message: 'Step outside your comfort zone to grow.' },
  { label: 'Family', emoji: '🏡', day: 6, message: 'Quality time with loved ones restores energy.' },
  { label: 'Creativity', emoji: '🎨', day: 0, message: 'Express yourself — inspiration is flowing.' },
];

const DailyFeedScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { feedItems, isLoading, refetch } = useFeedItems();
  const { streak } = useStreak();
  const [refreshing, setRefreshing] = React.useState(false);
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

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

  const maxWidth = isWide ? 720 : '100%';

  return (
    <>
      <OfflineBanner />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={[styles.content, isWide && { alignItems: 'center' }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Feed header (greeting + streak) */}
        <View style={{ maxWidth, width: '100%' }}>
          <FeedHeader date={today} userName={userName} streak={streak} />
        </View>

        {/* ── Daily Horoscope ─────────────────────────────────── */}
        <Surface
          style={[
            styles.horoscopeCard,
            {
              backgroundColor: theme.dark ? theme.colors.elevation.level2 : theme.colors.surface,
              maxWidth,
              borderColor: theme.dark ? 'rgba(203,190,255,0.12)' : 'rgba(91,79,196,0.08)',
              borderWidth: 1,
            },
          ]}
          elevation={2}
        >
          <Text variant="labelSmall" style={[styles.sectionLabel, { color: theme.colors.primary }]}>
            DAILY HOROSCOPE
          </Text>
          <View style={styles.rashiRow}>
            <LinearGradient
              colors={theme.dark
                ? ['rgba(54,45,138,0.6)', 'rgba(91,79,196,0.3)']
                : [theme.colors.primaryContainer, 'rgba(230,222,255,0.5)']}
              style={styles.rashiEmojiWrap}
            >
              <Text style={styles.rashiEmoji}>{ZODIAC_EMOJI[rashi] || '✨'}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', letterSpacing: -0.3 }}>
                {rashi}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                Your Vedic moon sign
              </Text>
            </View>
          </View>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, lineHeight: 24, marginBottom: 16 }}
          >
            {horoscope.prediction}
          </Text>
          <View style={styles.chipRow}>
            <Chip
              icon="numeric"
              mode="flat"
              style={[styles.luckyChip, { backgroundColor: theme.dark ? 'rgba(94,66,0,0.5)' : theme.colors.secondaryContainer }]}
              textStyle={{ color: theme.dark ? '#FFC044' : theme.colors.onSecondaryContainer, fontWeight: '600' }}
              accessibilityLabel={`Lucky number ${horoscope.luckyNumber}`}
            >
              {horoscope.luckyNumber}
            </Chip>
            <Chip
              icon="palette"
              mode="flat"
              style={[styles.luckyChip, { backgroundColor: theme.dark ? 'rgba(94,66,0,0.5)' : theme.colors.secondaryContainer }]}
              textStyle={{ color: theme.dark ? '#FFC044' : theme.colors.onSecondaryContainer, fontWeight: '600' }}
              accessibilityLabel={`Lucky color ${horoscope.luckyColor}`}
            >
              {horoscope.luckyColor}
            </Chip>
          </View>
        </Surface>

        {/* ── Today's Focus ───────────────────────────────────── */}
        <Card
          mode="contained"
          style={[styles.focusCard, { maxWidth, backgroundColor: 'transparent', overflow: 'hidden' }]}
          accessibilityLabel={`Today's focus: ${focus.label}`}
        >
          <LinearGradient
            colors={theme.dark
              ? ['rgba(54,45,138,0.4)', 'rgba(91,79,196,0.15)']
              : [theme.colors.primaryContainer, 'rgba(230,222,255,0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.focusGradient}
          >
            <Text style={styles.focusEmoji}>{focus.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ color: theme.dark ? '#CBBEFF' : theme.colors.onPrimaryContainer, fontWeight: '700' }}>
                {focus.label} Focus
              </Text>
              <Text variant="bodySmall" style={{ color: theme.dark ? 'rgba(203,190,255,0.8)' : theme.colors.onPrimaryContainer, marginTop: 4 }}>
                {focus.message}
              </Text>
            </View>
          </LinearGradient>
        </Card>

        {/* ── Remedy of the Day ───────────────────────────────── */}
        <View style={{ maxWidth, width: '100%' }}>
          <RemedyCard date={today} />
        </View>

        {/* ── Feed Section ────────────────────────────────────── */}
        <View style={[styles.feedSection, { maxWidth }]}>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onBackground, fontWeight: '700', marginBottom: 12 }}
          >
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
            <Surface
              style={[
                styles.emptyState,
                {
                  backgroundColor: theme.dark ? theme.colors.elevation.level2 : theme.colors.surface,
                  borderColor: theme.dark ? 'rgba(203,190,255,0.08)' : theme.colors.outlineVariant,
                },
              ]}
              elevation={0}
            >
              <Text style={styles.emptyIcon}>🌌</Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}
              >
                The cosmic feed is quiet today.
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', opacity: 0.6, marginTop: 4 }}
              >
                Pull down to refresh
              </Text>
            </Surface>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 8 : 0,
  },
  horoscopeCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
    width: '100%',
  },
  sectionLabel: {
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 14,
  },
  rashiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  rashiEmojiWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rashiEmoji: {
    fontSize: 30,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  luckyChip: {
    borderRadius: 12,
  },
  focusCard: {
    marginTop: 14,
    borderRadius: 20,
    width: '100%',
  },
  focusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 20,
  },
  focusEmoji: {
    fontSize: 36,
  },
  feedSection: {
    marginTop: 24,
    marginBottom: 16,
    width: '100%',
  },
  emptyState: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
});

export default DailyFeedScreen;

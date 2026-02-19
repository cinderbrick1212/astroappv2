import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import FeedHeader from '../components/FeedHeader';
import FeedItemCard from '../components/FeedItemCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../hooks/useAuth';
import { useFeedItems } from '../hooks/useFeedItems';
import { useStreak } from '../hooks/useStreak';
import { useUserProfile } from '../hooks/useUserProfile';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';

const ZODIAC_EMOJI: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const FOCUS_AREAS = [
  { label: 'Career', icon: '💼', day: 1 },
  { label: 'Love', icon: '❤️', day: 2 },
  { label: 'Health', icon: '🌿', day: 3 },
  { label: 'Finance', icon: '💰', day: 4 },
  { label: 'Growth', icon: '🌱', day: 5 },
  { label: 'Family', icon: '🏡', day: 6 },
  { label: 'Creativity', icon: '🎨', day: 0 },
];

const FOCUS_MESSAGES: Record<string, string> = {
  Career: 'Today favors career initiatives — take bold action.',
  Love: 'Open your heart; meaningful connections await.',
  Health: 'Prioritize rest and nourishment today.',
  Finance: 'A careful review of finances brings clarity.',
  Growth: 'Step outside your comfort zone to grow.',
  Family: 'Quality time with loved ones restores energy.',
  Creativity: 'Express yourself — inspiration is flowing.',
};

const DailyFeedScreen: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { feedItems, isLoading, refetch } = useFeedItems();
  const { streak } = useStreak();
  const { profile } = useUserProfile();
  const [refreshing, setRefreshing] = React.useState(false);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const focus = FOCUS_AREAS.find(f => f.day === dayOfWeek) || FOCUS_AREAS[0];

  // Use moon sign from profile if birth_date available, else fall back to month-based
  const rashi = profile?.birth_date
    ? horoscopeService.getRashiFromBirthDate(new Date(profile.birth_date))
    : ZODIAC_SIGNS[today.getMonth() % 12];

  const horoscope = horoscopeService.getDailyHoroscope(rashi, today);

  const userName =
    user?.displayName ||
    (user?.isAnonymous ? undefined : user?.email?.split('@')[0]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Header */}
      <FeedHeader date={today} userName={userName} streak={streak} />

      {/* Daily Horoscope Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>DAILY HOROSCOPE</Text>
        </View>
        <View style={styles.rashiRow}>
          <Text style={styles.rashiEmoji}>{ZODIAC_EMOJI[rashi] || '✨'}</Text>
          <Text style={styles.rashiName}>{rashi}</Text>
        </View>
        <Text style={styles.horoscopePrediction}>{horoscope.prediction}</Text>
        <View style={styles.luckyRow}>
          <View style={styles.luckyItem}>
            <Text style={styles.luckyLabel}>Lucky Number</Text>
            <Text style={styles.luckyValue}>{horoscope.luckyNumber}</Text>
          </View>
          <View style={styles.luckyDivider} />
          <View style={styles.luckyItem}>
            <Text style={styles.luckyLabel}>Lucky Color</Text>
            <Text style={styles.luckyValue}>{horoscope.luckyColor}</Text>
          </View>
        </View>
      </View>

      {/* Today's Focus Card */}
      <View style={[styles.card, styles.focusCard]}>
        <Text style={styles.focusIcon}>{focus.icon}</Text>
        <Text style={styles.focusLabel}>Today's Focus: {focus.label}</Text>
        <Text style={styles.focusMessage}>{FOCUS_MESSAGES[focus.label]}</Text>
      </View>

      {/* Feed Items */}
      <View style={styles.feedSection}>
        <Text style={styles.sectionTitle}>Today's Feed</Text>
        {isLoading ? (
          <LoadingSkeleton />
        ) : feedItems.length > 0 ? (
          feedItems.map(item => (
            <FeedItemCard key={item.id} item={item} />
          ))
        ) : (
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyFeedText}>No feed items today. Pull to refresh.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: spacing.md,
    marginBottom: 0,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  rashiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rashiEmoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  rashiName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  horoscopePrediction: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  luckyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  luckyItem: {
    flex: 1,
    alignItems: 'center',
  },
  luckyDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.divider,
  },
  luckyLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  luckyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  focusCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  focusIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  focusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  focusMessage: {
    fontSize: 14,
    color: colors.textOnPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  feedSection: {
    margin: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyFeed: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyFeedText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default DailyFeedScreen;

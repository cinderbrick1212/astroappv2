import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, Platform, useWindowDimensions, Pressable, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Surface,
  Chip
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useFeedItems } from '../hooks/useFeedItems';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStreak } from '../hooks/useStreak';
import { AppStackParamList } from '../types';
import { analytics } from '../services/analytics';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';
import FeedItemCard from '../components/FeedItemCard';
import RemedyCard from '../components/RemedyCard';
import OfflineBanner from '../components/OfflineBanner';
import { gradients } from '../theme/md3Theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const ZODIAC_EMOJI: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return 'Still up? ✨';
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  if (hour < 21) return 'Good evening 🌅';
  return 'Good night 🌙';
};

const FOCUS_AREAS = [
  { label: 'Career', icon: 'briefcase-outline', emoji: '💼', day: 1, message: 'Today favors career initiatives — take bold action.' },
  { label: 'Love', icon: 'heart-outline', emoji: '❤️', day: 2, message: 'Open your heart; meaningful connections await.' },
  { label: 'Health', icon: 'leaf-circle-outline', emoji: '🌿', day: 3, message: 'Prioritize rest and nourishment today.' },
  { label: 'Finance', icon: 'currency-inr', emoji: '💰', day: 4, message: 'A careful review of finances brings clarity.' },
  { label: 'Growth', icon: 'sprout', emoji: '🌱', day: 5, message: 'Step outside your comfort zone to grow.' },
  { label: 'Family', icon: 'home-heart', emoji: '🏡', day: 6, message: 'Quality time with loved ones restores energy.' },
  { label: 'Creativity', icon: 'palette-outline', emoji: '🎨', day: 0, message: 'Express yourself — inspiration is flowing.' },
];

const QUICK_TOOLS: Array<{
  label: string;
  icon: string;
  description: string;
  screen: keyof AppStackParamList;
  accent: string;
}> = [
    { label: 'Kundli', icon: 'star-david', description: 'Birth chart', screen: 'Kundli', accent: '#7B6FDD' },
    { label: 'Compatibility', icon: 'heart-multiple', description: 'Match analysis', screen: 'Compatibility', accent: '#EC407A' },
    { label: 'Ask Question', icon: 'help-circle-outline', description: 'Expert advice', screen: 'AskQuestion', accent: '#26C6A0' },
    { label: 'Book Call', icon: 'phone-in-talk-outline', description: 'Live consult', screen: 'BookCall', accent: '#FFC044' },
    { label: 'Panchang', icon: 'calendar-month', description: 'Daily calendar', screen: 'Panchang', accent: '#42A5F5' },
    { label: 'Dasha', icon: 'orbit', description: 'Life timeline', screen: 'Dasha', accent: '#AB47BC' },
  ];

const SERVICES = [
  { label: 'Ask a Question', icon: 'chat-question-outline', price: '₹49', screen: 'AskQuestion' as const, description: 'Get a personalized answer', accent: '#26C6A0' },
  { label: 'Book a Call', icon: 'phone-in-talk-outline', price: '₹999', screen: 'BookCall' as const, description: 'Live consultation', accent: '#FFC044' },
  { label: 'Request Report', icon: 'file-chart-outline', price: '₹299', screen: 'RequestReport' as const, description: 'Detailed PDF analysis', accent: '#7B6FDD' },
];

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { feedItems, isLoading, refetch } = useFeedItems();
  const { streak } = useStreak();
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    analytics.screenView('Home');
  }, []);

  const today = React.useMemo(() => new Date(), []);
  const dayOfWeek = today.getDay();
  const focus = React.useMemo(
    () => FOCUS_AREAS.find(f => f.day === dayOfWeek) || FOCUS_AREAS[0],
    [dayOfWeek]
  );
  const userName = React.useMemo(
    () => user?.username || user?.email?.split('@')[0] || 'Explorer',
    [user?.email, user?.username]
  );

  const rashi = React.useMemo(
    () =>
      profile?.birth_date
        ? horoscopeService.getRashiFromBirthDate(new Date(profile.birth_date))
        : astrologyEngine.getSunSign(new Date()),
    [profile?.birth_date]
  );

  const horoscope = React.useMemo(
    () => horoscopeService.getDailyHoroscope(rashi, today),
    [rashi, today]
  );

  const dateStr = React.useMemo(
    () =>
      today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [today]
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const maxWidth = isWide ? 720 : '100%';

  return (
    <>
      <OfflineBanner />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={[
          styles.content,
          isWide && { alignItems: 'center' },
          { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 24) }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* ── Hero Header ────────────────────────────────────── */}
        <LinearGradient
          colors={gradients.cosmicHero as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroSurface, { maxWidth, width: '100%' }]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text variant="headlineMedium" style={styles.heroTitle}>
                {getGreeting()}
              </Text>
              <Text variant="titleLarge" style={styles.heroName}>
                {userName}
              </Text>
              <Text variant="bodyMedium" style={styles.heroDate}>
                {dateStr}
              </Text>
            </View>
            <View
              style={[
                styles.streakBadge,
                {
                  backgroundColor: theme.colors.secondaryContainer,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>🔥</Text>
              <Text
                style={{
                  color: theme.colors.onSecondaryContainer,
                  fontWeight: 'bold',
                  marginLeft: 4,
                }}
              >
                {streak} day{streak !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Daily Horoscope ─────────────────────────────────── */}
        <Surface
          style={[
            styles.horoscopeCard,
            {
              backgroundColor: theme.dark ? theme.colors.elevation.level2 : theme.colors.surface,
              maxWidth,
              borderColor: theme.colors.outlineVariant,
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
          style={[styles.card, { backgroundColor: 'transparent', maxWidth, overflow: 'hidden' }]}
          accessibilityLabel={`Today's focus: ${focus.label}`}
        >
          <LinearGradient
            colors={theme.dark
              ? ['rgba(54,45,138,0.4)', 'rgba(91,79,196,0.15)']
              : [theme.colors.secondaryContainer, 'rgba(255,221,179,0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.focusGradient}
          >
            <Text style={styles.focusEmoji}>{focus.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ color: theme.dark ? '#CBBEFF' : theme.colors.onSecondaryContainer, fontWeight: '700' }}>
                {focus.label} Focus
              </Text>
              <Text variant="bodySmall" style={{ color: theme.dark ? 'rgba(203,190,255,0.8)' : theme.colors.onSecondaryContainer, marginTop: 4 }}>
                {focus.message}
              </Text>
            </View>
          </LinearGradient>
        </Card>

        {/* ── Remedy of the Day ───────────────────────────────── */}
        <View style={{ maxWidth, width: '100%', marginBottom: 16 }}>
          <RemedyCard date={today} />
        </View>

        {/* ── Quick Tools Grid ───────────────────────────────── */}
        <Text variant="titleMedium" style={[styles.gridTitle, { color: theme.colors.onBackground, maxWidth }]}>
          Quick Tools
        </Text>
        <View style={[styles.toolGrid, { maxWidth }]}>
          {QUICK_TOOLS.map(tool => (
            <Pressable
              key={tool.label}
              style={({ pressed }) => [
                styles.toolItem,
                {
                  backgroundColor: theme.dark
                    ? theme.colors.elevation.level2
                    : theme.colors.surface,
                  borderColor: pressed
                    ? tool.accent + '50'
                    : theme.dark ? 'rgba(203,190,255,0.08)' : theme.colors.outlineVariant,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              onPress={() => navigation.navigate(tool.screen as any)}
              accessibilityLabel={`${tool.label} — ${tool.description}`}
              android_ripple={{ color: tool.accent + '30', borderless: false }}
            >
              <LinearGradient
                colors={[tool.accent + '25', tool.accent + '08']}
                style={styles.toolIconWrap}
              >
                <PhIcon name={tool.icon} size={28} color={tool.accent} />
              </LinearGradient>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 10 }}>
                {tool.label}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                {tool.description}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Premium Services ───────────────────────────────── */}
        <Text variant="titleMedium" style={[styles.gridTitle, { color: theme.colors.onBackground, maxWidth }]}>
          Premium Services
        </Text>
        <View style={{ maxWidth, width: '100%' }}>
          {SERVICES.map(service => (
            <Pressable
              key={service.label}
              onPress={() => navigation.navigate(service.screen)}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
              android_ripple={{ color: service.accent + '30' }}
            >
              <Card
                mode="elevated"
                elevation={1}
                style={[
                  styles.serviceCard,
                  { borderLeftWidth: 3, borderLeftColor: service.accent },
                ]}
                accessibilityLabel={`${service.label}, ${service.price}`}
              >
                <Card.Title
                  title={service.label}
                  subtitle={service.description}
                  subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                  titleVariant="titleMedium"
                  titleStyle={{ fontWeight: '600' }}
                  left={props => (
                    <LinearGradient
                      colors={[service.accent + '25', service.accent + '08']}
                      style={styles.serviceIconWrap}
                    >
                      <PhIcon name={service.icon} size={24} color={service.accent} />
                    </LinearGradient>
                  )}
                  right={() => (
                    <View style={[styles.priceBadge, { backgroundColor: theme.dark ? 'rgba(94,66,0,0.5)' : theme.colors.secondaryContainer }]}>
                      <Text variant="labelMedium" style={{ color: theme.dark ? '#FFC044' : theme.colors.onSecondaryContainer, fontWeight: '700' }}>
                        {service.price}
                      </Text>
                    </View>
                  )}
                />
              </Card>
            </Pressable>
          ))}
        </View>

        <View style={styles.bottomPad} />
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
  },
  heroSurface: {
    borderRadius: 24,
    padding: 28,
    marginTop: 16,
    marginBottom: 14,
  },
  heroTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  heroName: {
    color: '#CBBEFF',
    fontWeight: '700',
    marginTop: 4,
  },
  heroDate: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  horoscopeCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 4,
    marginBottom: 14,
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
  card: {
    marginBottom: 14,
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
  gridTitle: {
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 14,
    width: '100%',
    letterSpacing: -0.2,
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  toolItem: {
    width: '31%',
    flexGrow: 1,
    minWidth: 100,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' as any, transition: 'transform 0.15s ease' as any },
    }),
  },
  toolIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCard: {
    marginBottom: 10,
    borderRadius: 18,
  },
  serviceIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 12,
    alignSelf: 'center',
  },
  bottomPad: {
    height: 32,
  },
});

export default HomeScreen;

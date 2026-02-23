import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, Platform, useWindowDimensions, Pressable } from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Surface,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { AppStackParamList } from '../types';
import { analytics } from '../services/analytics';
import { gradients } from '../theme/md3Theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;

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
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  useEffect(() => {
    analytics.screenView('Home');
  }, []);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const focus = FOCUS_AREAS.find(f => f.day === dayOfWeek) || FOCUS_AREAS[0];
  const userName = user?.username || user?.email?.split('@')[0] || 'Explorer';

  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const maxWidth = isWide ? 720 : '100%';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, isWide && { alignItems: 'center' }]}
    >
      {/* ── Hero Header ────────────────────────────────────── */}
      <LinearGradient
        colors={gradients.cosmicHero as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroSurface, { maxWidth, width: '100%' }]}
      >
        <Text variant="headlineMedium" style={styles.heroTitle}>
          {getGreeting()}
        </Text>
        <Text variant="titleLarge" style={styles.heroName}>
          {userName}
        </Text>
        <Text variant="bodyMedium" style={styles.heroDate}>
          {dateStr}
        </Text>
      </LinearGradient>

      {/* ── Today's Focus ──────────────────────────────────── */}
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

      {/* ── Quick Tools Grid ───────────────────────────────── */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, maxWidth }]}>
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
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, maxWidth }]}>
        Premium Services
      </Text>
      <View style={{ maxWidth, width: '100%' }}>
        {SERVICES.map(service => (
          <Card
            key={service.label}
            mode="elevated"
            elevation={1}
            style={[
              styles.serviceCard,
              {
                borderLeftWidth: 3,
                borderLeftColor: service.accent,
              },
            ]}
            onPress={() => navigation.navigate(service.screen)}
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
        ))}
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 0,
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
  card: {
    marginBottom: 12,
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
  sectionTitle: {
    fontWeight: '700',
    marginTop: 22,
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

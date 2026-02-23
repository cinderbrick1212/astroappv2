import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, Platform, useWindowDimensions, Pressable } from 'react-native';
import {
  Text,
  Card,
  List,
  Divider,
  useTheme,
  Surface,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { AppStackParamList } from '../types';
import { analytics } from '../services/analytics';

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
    { label: 'Kundli', icon: 'star-david', description: 'Birth chart', screen: 'Kundli', accent: '#7E57C2' },
    { label: 'Compatibility', icon: 'heart-multiple', description: 'Match analysis', screen: 'Compatibility', accent: '#EC407A' },
    { label: 'Ask Question', icon: 'help-circle-outline', description: 'Expert advice', screen: 'AskQuestion', accent: '#26A69A' },
    { label: 'Book Call', icon: 'phone-in-talk-outline', description: 'Live consult', screen: 'BookCall', accent: '#FFA726' },
    { label: 'Panchang', icon: 'calendar-month', description: 'Daily calendar', screen: 'Panchang', accent: '#42A5F5' },
    { label: 'Dasha', icon: 'orbit', description: 'Life timeline', screen: 'Dasha', accent: '#AB47BC' },
  ];

const SERVICES = [
  { label: 'Ask a Question', icon: 'chat-question-outline', price: '₹49', screen: 'AskQuestion' as const, description: 'Get a personalized answer' },
  { label: 'Book a Call', icon: 'phone-in-talk-outline', price: '₹999', screen: 'BookCall' as const, description: 'Live consultation' },
  { label: 'Request Report', icon: 'file-chart-outline', price: '₹299', screen: 'RequestReport' as const, description: 'Detailed PDF analysis' },
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
      <Surface
        style={[
          styles.heroSurface,
          {
            backgroundColor: theme.colors.primaryContainer,
            maxWidth,
            width: '100%',
          },
        ]}
        elevation={0}
      >
        <Text variant="headlineMedium" style={[styles.heroTitle, { color: theme.colors.onPrimaryContainer }]}>
          {getGreeting()}
        </Text>
        <Text variant="titleLarge" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', marginTop: 2 }}>
          {userName}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, marginTop: 6 }}>
          {dateStr}
        </Text>
      </Surface>

      {/* ── Today's Focus ──────────────────────────────────── */}
      <Card
        mode="contained"
        style={[styles.card, { backgroundColor: theme.colors.secondaryContainer, maxWidth }]}
        accessibilityLabel={`Today's focus: ${focus.label}`}
      >
        <Card.Content style={styles.focusContent}>
          <Text style={styles.focusEmoji}>{focus.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>
              {focus.label} Focus
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer, opacity: 0.85, marginTop: 4 }}>
              {focus.message}
            </Text>
          </View>
        </Card.Content>
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
                backgroundColor: pressed
                  ? theme.colors.surfaceVariant
                  : theme.dark
                    ? theme.colors.elevation.level2
                    : theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => navigation.navigate(tool.screen as any)}
            accessibilityLabel={`${tool.label} — ${tool.description}`}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: tool.accent + '18' }]}>
              <List.Icon icon={tool.icon} color={tool.accent} style={{ margin: 0, width: 28, height: 28 }} />
            </View>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 8 }}>
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
            style={[styles.serviceCard]}
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
                <View style={[styles.serviceIconWrap, { backgroundColor: theme.colors.primaryContainer }]}>
                  <List.Icon {...props} icon={service.icon} color={theme.colors.primary} style={{ margin: 0 }} />
                </View>
              )}
              right={() => (
                <View style={[styles.priceBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>
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
    padding: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  heroTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  card: {
    marginBottom: 12,
    borderRadius: 20,
    width: '100%',
  },
  focusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  focusEmoji: {
    fontSize: 36,
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
    width: '100%',
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' as any },
    }),
  },
  toolIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCard: {
    marginBottom: 10,
    borderRadius: 16,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
    alignSelf: 'center',
  },
  bottomPad: {
    height: 32,
  },
});

export default HomeScreen;

import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  List,
  FAB,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { AppStackParamList } from '../types';
import { analytics } from '../services/analytics';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const FOCUS_AREAS = [
  { label: 'Career',     icon: 'briefcase-outline',   day: 1 },
  { label: 'Love',       icon: 'heart-outline',        day: 2 },
  { label: 'Health',     icon: 'leaf-circle-outline',  day: 3 },
  { label: 'Finance',    icon: 'currency-inr',         day: 4 },
  { label: 'Growth',     icon: 'sprout',               day: 5 },
  { label: 'Family',     icon: 'home-heart',           day: 6 },
  { label: 'Creativity', icon: 'palette-outline',      day: 0 },
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

const QUICK_ACTIONS: Array<{
  label: string;
  icon: string;
  description: string;
  screen: keyof AppStackParamList;
}> = [
  { label: 'Kundli',       icon: 'star-david',          description: 'Birth chart',       screen: 'Kundli' },
  { label: 'Compatibility',icon: 'heart-multiple',      description: 'Relationship match', screen: 'Compatibility' },
  { label: 'Ask Question', icon: 'help-circle-outline', description: 'Expert advice',      screen: 'AskQuestion' },
  { label: 'Book Call',    icon: 'phone-in-talk-outline',description: 'Live consultation', screen: 'BookCall' },
];

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    analytics.screenView('Home');
  }, []);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const focus = FOCUS_AREAS.find(f => f.day === dayOfWeek) || FOCUS_AREAS[0];

  const userName = user?.username || user?.email?.split('@')[0] || 'there';

  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Greeting header */}
      <Card
        mode="contained"
        style={[styles.greetingCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content>
          <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer }}>
            {getGreeting()}, {userName}!
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, marginTop: 4 }}>
            {dateStr}
          </Text>
        </Card.Content>
      </Card>

      {/* Today's Focus */}
      <Card
        mode="elevated"
        elevation={1}
        style={styles.card}
        accessibilityLabel={`Today's focus: ${focus.label}`}
      >
        <Card.Title
          title={`${focus.label} Focus`}
          subtitle={FOCUS_MESSAGES[focus.label]}
          subtitleNumberOfLines={2}
          titleVariant="titleMedium"
          subtitleVariant="bodySmall"
          left={props => <List.Icon {...props} icon={focus.icon} color={theme.colors.primary} />}
        />
      </Card>

      <Divider style={styles.divider} />

      {/* Quick Tools — 2×2 FAB grid */}
      <List.Subheader style={{ color: theme.colors.primary }}>Quick Tools</List.Subheader>
      <View style={styles.fabGrid}>
        {QUICK_ACTIONS.map(action => (
          <View key={action.label} style={styles.fabCell}>
            <FAB
              icon={action.icon}
              label={action.label}
              size="medium"
              variant="secondary"
              onPress={() => navigation.navigate(action.screen as any)}
              style={{ backgroundColor: theme.colors.secondaryContainer }}
              color={theme.colors.onSecondaryContainer}
              accessibilityLabel={`${action.label} — ${action.description}`}
            />
          </View>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Premium Services */}
      <List.Subheader style={{ color: theme.colors.primary }}>Premium Services</List.Subheader>

      {[
        { label: 'Ask a Question', icon: 'help-circle-outline', price: '₹49',  screen: 'AskQuestion' as const },
        { label: 'Book a Call',    icon: 'phone-in-talk-outline', price: '₹999', screen: 'BookCall' as const },
      ].map(service => (
        <Card
          key={service.label}
          mode="outlined"
          style={styles.card}
          onPress={() => navigation.navigate(service.screen)}
          accessibilityLabel={`${service.label}, price ${service.price}`}
        >
          <Card.Title
            title={service.label}
            subtitle={service.price}
            subtitleStyle={{ color: theme.colors.secondary, fontWeight: '600' }}
            titleVariant="titleMedium"
            left={props => <List.Icon {...props} icon={service.icon} color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
          />
        </Card>
      ))}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greetingCard: {
    margin: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  fabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  fabCell: {
    width: '48%',
  },
  bottomPad: {
    height: 24,
  },
});

export default HomeScreen;

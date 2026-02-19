import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../hooks/useAuth';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
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

const QUICK_ACTIONS = [
  { label: 'Kundli', icon: '🔯', description: 'Birth chart' },
  { label: 'Compatibility', icon: '💞', description: 'Relationship match' },
  { label: 'Panchang', icon: '📆', description: "Today's calendar" },
  { label: 'Lucky Factors', icon: '🍀', description: 'Numbers & colors' },
];

const HomeScreen: React.FC = () => {
  const { user } = useAuth();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const focus = FOCUS_AREAS.find(f => f.day === dayOfWeek) || FOCUS_AREAS[0];

  const userName =
    user?.displayName ||
    (user?.isAnonymous ? 'Guest' : user?.email?.split('@')[0] || 'there');

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>
          {getGreeting()}, {userName}!
        </Text>
        <Text style={styles.date}>
          {today.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Today's Focus Card */}
      <View style={[styles.card, styles.focusCard]}>
        <View style={styles.focusCardRow}>
          <Text style={styles.focusIcon}>{focus.icon}</Text>
          <View style={styles.focusCardText}>
            <Text style={styles.focusCardLabel}>Today's Focus: {focus.label}</Text>
            <Text style={styles.focusCardMessage}>{FOCUS_MESSAGES[focus.label]}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity key={action.label} style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
              <Text style={styles.quickActionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium Services</Text>
        {[
          { label: 'Ask a Question', icon: '❓', price: '₹49' },
          { label: 'Detailed Report', icon: '📋', price: '₹499' },
          { label: 'Book a Call', icon: '📞', price: '₹999' },
        ].map(service => (
          <TouchableOpacity key={service.label} style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>{service.icon}</Text>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceLabel}>{service.label}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </View>
            <Text style={styles.serviceArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  greetingSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  focusCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  focusCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusIcon: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  focusCardText: {
    flex: 1,
  },
  focusCardLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  focusCardMessage: {
    fontSize: 13,
    color: colors.textOnPrimary,
    opacity: 0.9,
    lineHeight: 18,
  },
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  quickActionCard: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  quickActionIcon: {
    fontSize: 30,
    marginBottom: spacing.xs,
    textAlign: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    width: '100%',
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  quickActionDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  servicePrice: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 2,
  },
  serviceArrow: {
    fontSize: 22,
    color: colors.textSecondary,
  },
});

export default HomeScreen;

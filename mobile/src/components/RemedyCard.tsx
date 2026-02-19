import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

// Seven planetary remedies indexed by day-of-week (0=Sun … 6=Sat)
const REMEDIES = [
  { planet: 'Sun', icon: '☀️', remedy: 'Offer water to the rising Sun today for health and vitality.' },
  { planet: 'Moon', icon: '🌙', remedy: 'Drink water stored in a silver vessel for emotional balance.' },
  { planet: 'Mars', icon: '🔴', remedy: 'Donate red lentils to strengthen courage and energy.' },
  { planet: 'Mercury', icon: '💚', remedy: 'Feed green grass to a cow — Mercury blesses intellect.' },
  { planet: 'Jupiter', icon: '🟡', remedy: 'Donate yellow items such as turmeric or gram dal for abundance.' },
  { planet: 'Venus', icon: '🩷', remedy: 'Wear white and offer white flowers for harmony in relationships.' },
  { planet: 'Saturn', icon: '⚫', remedy: 'Light a sesame oil lamp in the evening for Saturn\'s blessings.' },
];

interface RemedyCardProps {
  date?: Date;
}

const RemedyCard: React.FC<RemedyCardProps> = ({ date }) => {
  const today = date ?? new Date();
  const { planet, icon, remedy } = REMEDIES[today.getDay()];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.meta}>
          <Text style={styles.label}>REMEDY OF THE DAY</Text>
          <Text style={styles.planet}>{planet}</Text>
        </View>
      </View>
      <Text style={styles.remedyText}>{remedy}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: spacing.md,
    marginBottom: 0,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  meta: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.secondary,
    letterSpacing: 1,
  },
  planet: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  remedyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default RemedyCard;

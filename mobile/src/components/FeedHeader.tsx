import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface FeedHeaderProps {
  date: Date;
  userName?: string;
  streak?: number;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const FeedHeader: React.FC<FeedHeaderProps> = ({ date, userName, streak }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      {userName ? (
        <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
      ) : null}
      {streak != null && streak > 0 ? (
        <Text style={styles.streak}>🔥 {streak} day streak</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  streak: {
    fontSize: 16,
    color: colors.secondary,
  },
});

export default FeedHeader;

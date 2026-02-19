import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

/**
 * Placeholder ad card rendered between feed items.
 * Replace the inner content with a real ad SDK (e.g. Google AdMob) when ready.
 */
const AdCard: React.FC = () => (
  <View style={styles.card}>
    <Text style={styles.adLabel}>Ad</Text>
    <View style={styles.adContent}>
      <Text style={styles.adText}>Advertisement</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  adContent: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});

export default AdCard;

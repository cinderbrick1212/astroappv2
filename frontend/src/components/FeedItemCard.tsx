import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { FeedItem } from '../types';

interface FeedItemCardProps {
  item: FeedItem;
  onPress?: () => void;
}

const FeedItemCard: React.FC<FeedItemCardProps> = ({ item, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.type}>{item.type.toUpperCase()}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.summary}>{item.summary}</Text>
      {item.media && (
        <Text style={styles.mediaPlaceholder}>[Image: {item.media.alternativeText}]</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  type: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  mediaPlaceholder: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});

export default FeedItemCard;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { FeedItem } from '../types';

interface FeedItemCardProps {
  item: FeedItem;
}

const TYPE_ICONS: Record<FeedItem['type'], string> = {
  horoscope: 'star-crescent',
  tip:       'lightbulb-outline',
  blog:      'book-open-variant',
  remedy:    'flower-outline',
};

const TYPE_LABELS: Record<FeedItem['type'], string> = {
  horoscope: 'Horoscope',
  tip:       'Astro Tip',
  blog:      'Blog',
  remedy:    'Remedy',
};

const FeedItemCard: React.FC<FeedItemCardProps> = ({ item }) => {
  const theme = useTheme();

  const cardBg =
    item.type === 'tip'
      ? theme.colors.secondaryContainer
      : item.type === 'remedy'
      ? theme.colors.tertiaryContainer
      : theme.colors.surface;

  const isTonal = item.type === 'tip' || item.type === 'remedy';

  const titleElement = (
    <Card.Title
      title={item.title}
      titleVariant="titleSmall"
      titleStyle={{ color: theme.colors.onSurface }}
      subtitle={item.summary}
      subtitleVariant="bodySmall"
      subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
      subtitleNumberOfLines={2}
      right={() => (
        <Chip
          icon={TYPE_ICONS[item.type]}
          mode="flat"
          style={[styles.typeChip, { backgroundColor: theme.colors.surfaceVariant }]}
          textStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 11 }}
          compact
        >
          {TYPE_LABELS[item.type]}
        </Chip>
      )}
    />
  );

  if (isTonal) {
    return (
      <Card
        mode="contained"
        style={[styles.card, { backgroundColor: cardBg }]}
        accessibilityLabel={item.title}
      >
        {titleElement}
      </Card>
    );
  }

  return (
    <Card
      mode="elevated"
      elevation={1}
      style={[styles.card, { backgroundColor: cardBg }]}
      accessibilityLabel={item.title}
    >
      {titleElement}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  typeChip: {
    marginRight: 12,
  },
});

export default FeedItemCard;

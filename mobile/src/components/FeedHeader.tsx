import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';

interface FeedHeaderProps {
  date: Date;
  userName?: string;
  streak: number;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({ date, userName, streak }) => {
  const theme = useTheme();

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const hour = date.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
            {greeting}{userName ? `, ${userName}` : ''}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, marginTop: 2 }}>
            {dateStr}
          </Text>
        </View>
        {streak > 0 && (
          <Chip
            icon="fire"
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
            accessibilityLabel={`${streak} day streak`}
          >
            {streak} day{streak !== 1 ? 's' : ''}
          </Chip>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
});

export default FeedHeader;

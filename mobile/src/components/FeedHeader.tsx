import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme/md3Theme';

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

  const greeting = 'Namaste';

  return (
    <LinearGradient
      colors={gradients.cosmicHero as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text
            variant="headlineSmall"
            style={{
              color: '#FFFFFF',
              fontWeight: '700',
              letterSpacing: -0.3,
            }}
          >
            {greeting}{userName ? `, ${userName}` : ''} ✨
          </Text>
          <Text
            variant="bodySmall"
            style={{
              color: 'rgba(255,255,255,0.7)',
              marginTop: 4,
              letterSpacing: 0.3,
            }}
          >
            {dateStr}
          </Text>
        </View>
        {streak > 0 && (
          <Chip
            icon="fire"
            mode="flat"
            style={styles.streakChip}
            textStyle={styles.streakText}
            accessibilityLabel={`${streak} day streak`}
          >
            {streak} day{streak !== 1 ? 's' : ''}
          </Chip>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    marginHorizontal: 0,
    marginTop: Platform.OS === 'web' ? 8 : 0,
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
  streakChip: {
    backgroundColor: 'rgba(255,192,68,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,192,68,0.35)',
    borderRadius: 16,
  },
  streakText: {
    color: '#FFC044',
    fontWeight: '700',
  },
});

export default FeedHeader;

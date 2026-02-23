import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

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
  const theme = useTheme();
  const today = date ?? new Date();
  const remedy = REMEDIES[today.getDay()];

  return (
    <Card
      mode="contained"
      style={styles.card}
      accessibilityLabel={`Remedy of the day: ${remedy.remedy}`}
    >
      <LinearGradient
        colors={[
          theme.colors.tertiaryContainer,
          theme.dark ? 'rgba(124,41,92,0.6)' : 'rgba(255,216,232,0.8)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.icon}>{remedy.icon ?? '🪔'}</Text>
        <View style={{ flex: 1 }}>
          <Text
            variant="labelSmall"
            style={{
              color: theme.colors.onTertiaryContainer,
              letterSpacing: 1.5,
              fontWeight: '700',
              marginBottom: 4,
            }}
          >
            REMEDY OF THE DAY
          </Text>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onTertiaryContainer,
              lineHeight: 18,
              opacity: 0.9,
            }}
          >
            {remedy.remedy}
          </Text>
        </View>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  icon: {
    fontSize: 28,
    marginTop: 2,
  },
});

export default RemedyCard;

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import { getNakshatraByIndex } from '../data';

const PADA_DESCRIPTIONS = [
  'Pada 1 — Emphasises self-expression, initiative, and the core identity of this nakshatra.',
  'Pada 2 — Emphasises material security, speech, and practical application of nakshatra energy.',
  'Pada 3 — Emphasises communication, learning, and intellectual curiosity within this nakshatra.',
  'Pada 4 — Emphasises emotional depth, nurturing, and inner transformation of this nakshatra.',
];

const NakshatraScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();

  useEffect(() => {
    analytics.screenView('Nakshatra');
  }, []);

  const nakshatraResult = useMemo(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      return astrologyEngine.getMoonNakshatra(profile);
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          Loading…
        </Text>
      </View>
    );
  }

  const hasBirthDetails = !!(profile?.birth_date && profile?.birth_time && profile?.birth_place);
  if (!hasBirthDetails) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
          Birth Details Required
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}
        >
          Add your birth date, time, and place in your Profile to view your Nakshatra analysis.
        </Text>
      </View>
    );
  }

  if (!nakshatraResult) return null;

  const { nakshatraKey, pada, nakshatraIndex } = nakshatraResult;
  const nakData = getNakshatraByIndex(nakshatraIndex);
  const info = nakData ?? {
    name: nakshatraKey, nameHindi: '', ruler: 'Unknown', deity: 'Unknown',
    symbol: 'Unknown', quality: 'Unknown', compatibility: '',
    moonInterpretation: { brief: '', standard: '', deep: '' },
    lagnaInterpretation: { brief: '', standard: '', deep: '' },
  };
  const compatible = info.compatibility ? info.compatibility.split(', ') : [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text variant="displaySmall" style={{ textAlign: 'center' }}>⭐</Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8 }}
          >
            {info.name}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
          >
            Pada {pada} • {info.quality}
          </Text>
        </Card.Content>
      </Card>

      {/* Key Details */}
      <View style={styles.chipRow}>
        <Chip
          icon="orbit"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Ruler: ${info.ruler}`}
        >
          Ruler: {info.ruler}
        </Chip>
        <Chip
          icon="hands-pray"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Deity: ${info.deity}`}
        >
          Deity: {info.deity}
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Symbol: ${info.symbol}`}
        >
          {info.symbol}
        </Chip>
      </View>

      {/* Nakshatra Details */}
      <List.Subheader style={{ color: theme.colors.primary }}>Nakshatra Details</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        {[
          { label: 'Nakshatra', value: info.name, icon: 'star-four-points' },
          { label: 'Ruling Planet', value: info.ruler, icon: 'orbit' },
          { label: 'Deity', value: info.deity, icon: 'hands-pray' },
          { label: 'Symbol', value: info.symbol, icon: 'shape-outline' },
          { label: 'Quality', value: info.quality, icon: 'information-outline' },
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <List.Item
              title={item.value}
              description={item.label}
              left={(props) => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel={`${item.label}: ${item.value}`}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Pada Analysis */}
      <List.Subheader style={{ color: theme.colors.primary }}>Pada Analysis</List.Subheader>
      {PADA_DESCRIPTIONS.map((desc, i) => {
        const padaNum = i + 1;
        const isUserPada = padaNum === pada;
        return (
          <Card
            key={padaNum}
            mode={(isUserPada ? 'elevated' : 'outlined') as 'elevated'}
            elevation={isUserPada ? 2 : 0}
            style={[
              styles.card,
              isUserPada ? { backgroundColor: theme.colors.primaryContainer } : undefined,
            ]}
          >
            <List.Item
              title={`Pada ${padaNum}`}
              description={desc}
              titleStyle={{
                color: isUserPada ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                fontWeight: isUserPada ? '700' : '400',
              }}
              descriptionStyle={{
                color: isUserPada ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
              }}
              descriptionNumberOfLines={3}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isUserPada ? 'check-circle' : 'circle-outline'}
                  color={isUserPada ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
                />
              )}
            />
          </Card>
        );
      })}

      <Divider style={{ marginVertical: 8 }} />

      {/* Compatible Nakshatras */}
      <List.Subheader style={{ color: theme.colors.primary }}>Compatible Nakshatras</List.Subheader>
      <View style={styles.chipRow}>
        {compatible.map((n) => (
          <Chip
            key={n}
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
            accessibilityLabel={`Compatible nakshatra: ${n}`}
          >
            {n}
          </Chip>
        ))}
        {compatible.length === 0 && (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Compatibility data not available for this nakshatra.
          </Text>
        )}
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  heroCard: {
    margin: 16,
    marginBottom: 0,
  },
  heroContent: {
    paddingVertical: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomPad: {
    height: 24,
  },
});

export default NakshatraScreen;

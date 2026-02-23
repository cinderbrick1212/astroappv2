import React, { useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  DataTable,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { GocharResult } from '../services/astrologyEngine';
import type { GrahaPosition } from '../services/engine/ephemeris';

const PHASE_LABELS: Record<string, string> = {
  rising: 'Rising Phase (12th from Moon)',
  peak: 'Peak Phase (over Moon)',
  setting: 'Setting Phase (2nd from Moon)',
};

const GocharScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();

  useEffect(() => {
    analytics.screenView('Gochar');
  }, []);

  const gochar = useMemo<GocharResult | null>(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      return astrologyEngine.calculateGochar(profile);
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

  const currentPositions = useMemo<GrahaPosition[]>(() => {
    try {
      return astrologyEngine.getCurrentPositions();
    } catch {
      return [];
    }
  }, []);

  // Loading state
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

  // Missing birth details
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
          Add your birth date, time, and place in your Profile to view current transits.
        </Text>
      </View>
    );
  }

  if (!gochar) return null;

  const { sadeSatiStatus, ashtamaShaniActive, significantTransits } = gochar;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Sade Sati Banner */}
      {sadeSatiStatus.isActive && (
        <Card
          mode="elevated"
          elevation={2}
          style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}
        >
          <Card.Title
            title="Sade Sati Active"
            subtitle={PHASE_LABELS[sadeSatiStatus.phase] ?? sadeSatiStatus.phase}
            titleVariant="titleMedium"
            titleStyle={{ color: theme.colors.onErrorContainer }}
            subtitleStyle={{ color: theme.colors.onErrorContainer }}
            left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.onErrorContainer} />}
          />
          <Card.Content>
            <Text variant="bodySmall" style={{ color: theme.colors.onErrorContainer }}>
              Saturn in {sadeSatiStatus.saturnSign} transiting relative to natal Moon in {sadeSatiStatus.natalMoonSign}.
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Ashtama Shani Warning */}
      {ashtamaShaniActive && (
        <Card
          mode="elevated"
          elevation={2}
          style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}
        >
          <Card.Title
            title="Ashtama Shani Active"
            subtitle="Saturn transiting 8th from natal Moon"
            titleVariant="titleMedium"
            titleStyle={{ color: theme.colors.onErrorContainer }}
            subtitleStyle={{ color: theme.colors.onErrorContainer }}
            left={props => <List.Icon {...props} icon="alert" color={theme.colors.onErrorContainer} />}
          />
        </Card>
      )}

      {/* Transit Positions DataTable */}
      <List.Subheader style={{ color: theme.colors.primary }}>Current Transit Positions</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Planet</DataTable.Title>
            <DataTable.Title>Current Sign</DataTable.Title>
            <DataTable.Title numeric>House from Lagna</DataTable.Title>
          </DataTable.Header>
          {significantTransits.map(t => (
            <DataTable.Row key={t.transitingGraha} accessibilityLabel={`${t.transitingGraha} in house ${t.natalHouse}`}>
              <DataTable.Cell>
                <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  {t.transitingGraha.charAt(0).toUpperCase() + t.transitingGraha.slice(1)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                  {(() => {
                    const pos = currentPositions.find(p => p.graha === t.transitingGraha);
                    return pos ? astrologyEngine.getZodiacSign(pos.siderealLon) : '—';
                  })()}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t.natalHouse}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Key Placements */}
      <List.Subheader style={{ color: theme.colors.primary }}>Transit Summary</List.Subheader>
      <View style={styles.chipRow}>
        <Chip
          icon="moon-waning-crescent"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          Natal Moon: {sadeSatiStatus.natalMoonSign}
        </Chip>
        <Chip
          icon="orbit"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          Saturn: {sadeSatiStatus.saturnSign}
        </Chip>
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  placementChip: {
    marginBottom: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomPad: {
    height: 24,
  },
});

export default GocharScreen;

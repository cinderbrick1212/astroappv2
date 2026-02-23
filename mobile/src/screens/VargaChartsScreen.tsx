import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  DataTable,
  ActivityIndicator,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { VargaChart } from '../services/engine/vargas';

type Divisor = 3 | 7 | 9 | 10 | 12;

const VARGA_OPTIONS: { value: string; label: string }[] = [
  { value: '3', label: 'D3' },
  { value: '7', label: 'D7' },
  { value: '9', label: 'D9' },
  { value: '10', label: 'D10' },
  { value: '12', label: 'D12' },
];

const VARGA_NAMES: Record<number, string> = {
  3: 'Drekkana',
  7: 'Saptamsha',
  9: 'Navamsa',
  10: 'Dashamsha',
  12: 'Dwadashamsha',
};

const VargaChartsScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const [divisor, setDivisor] = useState<Divisor>(9);

  useEffect(() => {
    analytics.screenView('VargaCharts');
  }, []);

  const vargaChart = useMemo<VargaChart | null>(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      return astrologyEngine.calculateVargaChart(profile, divisor);
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place, divisor]);

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
          Add your birth date, time, and place in your Profile to view divisional charts.
        </Text>
      </View>
    );
  }

  if (!vargaChart) return null;

  const vargottamaPlanets = vargaChart.planets.filter(p => p.isVargottama);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Chart Type Selector */}
      <View style={styles.selectorRow}>
        <SegmentedButtons
          value={String(divisor)}
          onValueChange={val => setDivisor(Number(val) as Divisor)}
          buttons={VARGA_OPTIONS}
        />
      </View>

      {/* Chart Title */}
      <List.Subheader style={{ color: theme.colors.primary }}>
        {VARGA_NAMES[divisor]} Chart (D{divisor})
      </List.Subheader>

      {/* Lagna Info */}
      <View style={styles.chipRow}>
        <Chip
          icon="arrow-up-bold-circle-outline"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          {VARGA_NAMES[divisor]} Lagna: {vargaChart.lagna.vargaSign}
        </Chip>
      </View>

      {/* Vargottama Status (D9 only) */}
      {divisor === 9 && vargottamaPlanets.length > 0 && (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Vargottama Planets</List.Subheader>
          <View style={styles.chipRow}>
            {vargottamaPlanets.map(p => (
              <Chip
                key={p.graha}
                icon="check-decagram"
                mode="flat"
                style={[styles.placementChip, { backgroundColor: theme.colors.secondaryContainer }]}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
              >
                {p.graha.charAt(0).toUpperCase() + p.graha.slice(1)} — {p.vargaSign}
              </Chip>
            ))}
          </View>
        </>
      )}

      <Divider style={{ marginVertical: 8 }} />

      {/* Planet Positions DataTable */}
      <List.Subheader style={{ color: theme.colors.primary }}>Planet Positions</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Planet</DataTable.Title>
            <DataTable.Title>Varga Sign</DataTable.Title>
            {divisor === 9 && <DataTable.Title>Vargottama</DataTable.Title>}
          </DataTable.Header>
          {vargaChart.planets.map(p => (
            <DataTable.Row key={p.graha} accessibilityLabel={`${p.graha} in ${p.vargaSign}`}>
              <DataTable.Cell>
                <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  {p.graha.charAt(0).toUpperCase() + p.graha.slice(1)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                  {p.vargaSign}
                </Text>
              </DataTable.Cell>
              {divisor === 9 && (
                <DataTable.Cell>
                  <Text variant="bodySmall" style={{ color: p.isVargottama ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
                    {p.isVargottama ? '✓ Yes' : '—'}
                  </Text>
                </DataTable.Cell>
              )}
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>

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
  selectorRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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

export default VargaChartsScreen;

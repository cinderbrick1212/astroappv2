import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  DataTable,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { VarshaphalChart } from '../services/astrologyEngine';

const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const formatDegree = (lon: number): string => {
  const deg = lon % 30;
  return `${deg.toFixed(1)}°`;
};

const VarshaphalScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    analytics.screenView('Varshaphal');
  }, []);

  const varshaphal = useMemo<VarshaphalChart | null>(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      return astrologyEngine.calculateVarshaphal(profile, year);
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place, year]);

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
          Add your birth date, time, and place in your Profile to view your Solar Return chart.
        </Text>
      </View>
    );
  }

  if (!varshaphal) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Year Selector */}
      <View style={styles.yearRow}>
        <Button
          mode="outlined"
          compact
          onPress={() => setYear(y => y - 1)}
          icon="chevron-left"
          accessibilityLabel="Previous year"
        >
          {year - 1}
        </Button>
        <Text variant="titleLarge" style={{ color: theme.colors.onBackground }}>
          {year}
        </Text>
        <Button
          mode="outlined"
          compact
          onPress={() => setYear(y => y + 1)}
          icon="chevron-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
          accessibilityLabel="Next year"
        >
          {year + 1}
        </Button>
      </View>

      {/* Solar Return Date */}
      <Card mode="elevated" elevation={1} style={styles.card}>
        <Card.Title
          title="Solar Return"
          subtitle={formatDate(varshaphal.returnDate)}
          titleVariant="titleMedium"
          left={props => <List.Icon {...props} icon="white-balance-sunny" color={theme.colors.primary} />}
        />
      </Card>

      {/* Key Placements */}
      <List.Subheader style={{ color: theme.colors.primary }}>Key Placements</List.Subheader>
      <View style={styles.chipRow}>
        <Chip
          icon="arrow-up-bold-circle-outline"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          Varsha Lagna: {varshaphal.varshaLagna}
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.secondaryContainer }]}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
        >
          Muntha: {varshaphal.muntha} (House {varshaphal.munthaHouse})
        </Chip>
      </View>

      <Divider style={{ marginVertical: 8 }} />

      {/* Planet Positions DataTable */}
      <List.Subheader style={{ color: theme.colors.primary }}>Planet Positions</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Planet</DataTable.Title>
            <DataTable.Title>Sign</DataTable.Title>
            <DataTable.Title numeric>Degree</DataTable.Title>
          </DataTable.Header>
          {varshaphal.planets.map(p => (
            <DataTable.Row key={p.graha} accessibilityLabel={`${p.graha} in ${astrologyEngine.getZodiacSign(p.siderealLon)}`}>
              <DataTable.Cell>
                <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  {p.graha.charAt(0).toUpperCase() + p.graha.slice(1)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                  {astrologyEngine.getZodiacSign(p.siderealLon)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {formatDegree(p.siderealLon)}
                </Text>
              </DataTable.Cell>
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
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default VarshaphalScreen;

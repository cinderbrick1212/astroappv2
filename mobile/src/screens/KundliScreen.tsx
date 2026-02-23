import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  DataTable,
  ProgressBar,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { kundliService, KundliData } from '../services/kundli';
import { analytics } from '../services/analytics';
import { LagnaChart } from '../components/LagnaChart';

const KundliScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const [kundli, setKundli] = useState<KundliData | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    analytics.kundliViewed();
  }, []);

  useEffect(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return;
    setCalculating(true);
    setCalcError(false);
    kundliService
      .calculateKundliAsync(
        new Date(profile.birth_date),
        profile.birth_time,
        {
          latitude: profile.latitude ?? 28.6,
          longitude: profile.longitude ?? 77.2,
        },
        profile.timezone ?? 'Asia/Kolkata'
      )
      .then(setKundli)
      .catch(() => setCalcError(true))
      .finally(() => setCalculating(false));
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

  // Loading state
  if (isLoading || calculating) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          {calculating ? 'Calculating your chart…' : 'Loading…'}
        </Text>
      </View>
    );
  }

  // Error state
  if (calcError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
          Calculation Error
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}
        >
          Could not calculate your Kundli. Please check your birth details and try again.
        </Text>
      </View>
    );
  }

  // No birth details
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
          Add your birth date, time, and place in your Profile to view your Kundli.
        </Text>
      </View>
    );
  }

  if (!kundli) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Key Placements — as assist Chips */}
      <View style={styles.chipRow}>
        <Chip
          icon="arrow-up-bold-circle-outline"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
          accessibilityLabel={`Lagna: ${kundli.lagna}`}
        >
          Lagna: {kundli.lagna}
        </Chip>
        <Chip
          icon="moon-waning-crescent"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
          accessibilityLabel={`Rashi: ${kundli.rashi}`}
        >
          Rashi: {kundli.rashi}
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
          accessibilityLabel={`Nakshatra: ${kundli.nakshatra}`}
        >
          {kundli.nakshatra}
        </Chip>
      </View>

      {/* Lagna Chart Component */}
      <List.Subheader style={{ color: theme.colors.primary }}>Lagna Chart</List.Subheader>
      <LagnaChart chartData={kundli.chartData} size={Math.min(320, width - 32)} />

      {/* Current Dasha */}
      <List.Subheader style={{ color: theme.colors.primary }}>Current Mahadasha</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <Card.Title
          title={`${kundli.dasha.planet} Dasha`}
          subtitle={`Ends approx. ${kundli.dasha.endYear}`}
          titleVariant="titleMedium"
          left={props => <List.Icon {...props} icon="orbit" color={theme.colors.primary} />}
        />
        <Card.Content>
          <ProgressBar
            progress={0.55}
            color={theme.colors.primary}
            style={{ height: 6, borderRadius: 3, marginBottom: 4 }}
            theme={theme}
            accessibilityLabel="Dasha period progress"
          />
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Period in progress
          </Text>
        </Card.Content>
      </Card>

      {/* Planetary Insights */}
      <List.Subheader style={{ color: theme.colors.primary }}>Planetary Insights</List.Subheader>
      {kundli.insights.map((insight, i) => (
        <Card
          key={i}
          mode="elevated"
          elevation={1}
          style={styles.card}
          accessibilityLabel={`Insight: ${insight}`}
        >
          <Card.Title
            title={insight}
            titleVariant="bodyMedium"
            titleNumberOfLines={3}
            left={props => (
              <List.Icon {...props} icon="star-shooting" color={theme.colors.primary} />
            )}
          />
        </Card>
      ))}

      {/* Planet Positions — DataTable */}
      {kundli.chartData.planets.length > 0 && (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Planet Positions</List.Subheader>
          <Card mode="outlined" style={styles.card}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Planet</DataTable.Title>
                <DataTable.Title>Sign</DataTable.Title>
                <DataTable.Title numeric>House</DataTable.Title>
              </DataTable.Header>
              {kundli.chartData.planets.map(p => (
                <DataTable.Row key={p.planet} accessibilityLabel={`${p.planet} in ${p.sign}, house ${p.house}`}>
                  <DataTable.Cell>
                    <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                      {p.planet}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                      {p.sign}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {p.house}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card>
        </>
      )}

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

export default KundliScreen;

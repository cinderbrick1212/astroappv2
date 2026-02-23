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
import { panchangService } from '../services/panchang';
import { analytics } from '../services/analytics';
import type { PanchangData } from '../services/panchang';

const formatDateLabel = (d: Date): string =>
  d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const addDays = (d: Date, n: number): Date => {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
};

const PanchangVisheshScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    analytics.screenView('PanchangVishesh');
  }, []);

  const lat = profile?.latitude ?? 28.6;
  const lng = profile?.longitude ?? 77.2;

  const panchang = useMemo<PanchangData | null>(() => {
    try {
      return panchangService.calculatePanchang(date, lat, lng);
    } catch {
      return null;
    }
  }, [date, lat, lng]);

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

  if (!panchang) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Date Navigation */}
      <View style={styles.dateRow}>
        <Button
          mode="outlined"
          compact
          onPress={() => setDate(d => addDays(d, -1))}
          icon="chevron-left"
          accessibilityLabel="Previous day"
        >
          Prev
        </Button>
        <Text variant="titleSmall" style={{ color: theme.colors.onBackground, textAlign: 'center', flex: 1 }}>
          {formatDateLabel(date)}
        </Text>
        <Button
          mode="outlined"
          compact
          onPress={() => setDate(d => addDays(d, 1))}
          icon="chevron-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
          accessibilityLabel="Next day"
        >
          Next
        </Button>
      </View>

      {/* Core Panchang Elements */}
      <List.Subheader style={{ color: theme.colors.primary }}>Panchang Details</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <DataTable>
          <DataTable.Row accessibilityLabel={`Tithi: ${panchang.tithi}`}>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>Tithi</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>{panchang.tithi}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row accessibilityLabel={`Nakshatra: ${panchang.nakshatra}`}>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>Nakshatra</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>{panchang.nakshatra}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row accessibilityLabel={`Yoga: ${panchang.yoga}`}>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>Yoga</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>{panchang.yoga}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row accessibilityLabel={`Karana: ${panchang.karana}`}>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>Karana</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>{panchang.karana}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row accessibilityLabel={`Sunrise: ${panchang.sunrise}`}>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>Sunrise</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>{panchang.sunrise}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row accessibilityLabel={`Sunset: ${panchang.sunset}`}>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>Sunset</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>{panchang.sunset}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Rahu Kaal */}
      <List.Subheader style={{ color: theme.colors.primary }}>Rahu Kaal</List.Subheader>
      <View style={styles.chipRow}>
        <Chip
          icon="alert-circle-outline"
          mode="flat"
          style={[styles.placementChip, { backgroundColor: theme.colors.errorContainer }]}
          textStyle={{ color: theme.colors.onErrorContainer }}
        >
          {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
        </Chip>
      </View>

      <Divider style={{ marginVertical: 8 }} />

      {/* Auspicious Muhurats */}
      {panchang.muhurat.length > 0 && (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Auspicious Muhurats</List.Subheader>
          {panchang.muhurat.map((m, i) => (
            <Card key={i} mode="elevated" elevation={1} style={styles.card}>
              <Card.Title
                title={m.activity}
                subtitle={m.time}
                titleVariant="titleSmall"
                left={props => <List.Icon {...props} icon="clock-check-outline" color={theme.colors.primary} />}
              />
            </Card>
          ))}
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
  dateRow: {
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

export default PanchangVisheshScreen;

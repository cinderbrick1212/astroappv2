import React, { useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  List,
  Divider,
  DataTable,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { AshtakavargaResult } from '../services/engine/ashtakavarga';

const SIGN_ABBR = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

const AshtakavargaScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();

  useEffect(() => {
    analytics.screenView('Ashtakavarga');
  }, []);

  const result = useMemo<AshtakavargaResult | null>(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      return astrologyEngine.calculateAshtakavarga(profile);
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
          Add your birth date, time, and place in your Profile to view Ashtakavarga analysis.
        </Text>
      </View>
    );
  }

  if (!result) return null;

  const { sarva, individual } = result;

  const getCellBg = (value: number) => {
    if (value >= 4) return theme.colors.primaryContainer;
    if (value <= 2) return theme.colors.errorContainer;
    return undefined;
  };

  const getCellColor = (value: number) => {
    if (value >= 4) return theme.colors.onPrimaryContainer;
    if (value <= 2) return theme.colors.onErrorContainer;
    return theme.colors.onSurface;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* SAV Totals */}
      <List.Subheader style={{ color: theme.colors.primary }}>Sarva Ashtakavarga (SAV)</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DataTable>
            <DataTable.Header>
              {SIGN_ABBR.map((sign) => (
                <DataTable.Title key={sign} style={styles.cell}>
                  <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                    {sign}
                  </Text>
                </DataTable.Title>
              ))}
            </DataTable.Header>
            <DataTable.Row>
              {sarva.map((value, i) => (
                <DataTable.Cell
                  key={i}
                  style={[styles.cell, { backgroundColor: getCellBg(value) }]}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: getCellColor(value), fontWeight: '700' }}
                  >
                    {value}
                  </Text>
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          </DataTable>
        </ScrollView>
      </Card>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={[styles.legendItem, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
            ≥4 Strong
          </Text>
        </View>
        <View style={[styles.legendItem, { backgroundColor: theme.colors.errorContainer }]}>
          <Text variant="labelSmall" style={{ color: theme.colors.onErrorContainer }}>
            ≤2 Weak
          </Text>
        </View>
      </View>

      <Divider style={{ marginVertical: 8 }} />

      {/* Individual Planet Grids */}
      {individual.length > 0 && (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Individual Planet Grids</List.Subheader>
          {individual.map((grid) => {
            const grahaLabel = grid.graha.charAt(0).toUpperCase() + grid.graha.slice(1);
            const total = grid.points.reduce((a, b) => a + b, 0);
            return (
              <Card key={grid.graha} mode="outlined" style={styles.card}>
                <Card.Title
                  title={grahaLabel}
                  subtitle={`Total: ${total}`}
                  titleVariant="titleSmall"
                  titleStyle={{ color: theme.colors.onSurface }}
                  subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                  left={(props) => <PhIcon name="orbit" size={24} color={theme.colors.primary} />}
                />
                <Card.Content>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <DataTable>
                      <DataTable.Header>
                        {SIGN_ABBR.map((sign) => (
                          <DataTable.Title key={sign} style={styles.cell}>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                              {sign}
                            </Text>
                          </DataTable.Title>
                        ))}
                      </DataTable.Header>
                      <DataTable.Row>
                        {grid.points.map((value, i) => (
                          <DataTable.Cell
                            key={i}
                            style={[styles.cell, { backgroundColor: getCellBg(value) }]}
                          >
                            <Text
                              variant="bodySmall"
                              style={{ color: getCellColor(value), fontWeight: '600' }}
                            >
                              {value}
                            </Text>
                          </DataTable.Cell>
                        ))}
                      </DataTable.Row>
                    </DataTable>
                  </ScrollView>
                </Card.Content>
              </Card>
            );
          })}
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
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  cell: {
    justifyContent: 'center',
    minWidth: 40,
    paddingHorizontal: 4,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  legendItem: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bottomPad: {
    height: 24,
  },
});

export default AshtakavargaScreen;

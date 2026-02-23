import React, { useEffect, useMemo, useState } from 'react';
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
  Dialog,
  Portal,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  astrologyEngine,
  ChartData,
  PlanetPosition,
  AfflictedGraha,
} from '../services/astrologyEngine';
import type { DashaTimeline } from '../services/engine/dasha';
import type { DetectedYoga } from '../services/engine/yogas';
import type { GrahaPosition } from '../services/engine/ephemeris';
import type { HouseData } from '../services/engine/houses';
import { detectYogas } from '../services/engine/yogas';
import { toJulianDay } from '../services/engine/ephemeris';
import { getAllGrahaPositions } from '../services/engine/ephemeris';
import { getVedicLagna } from '../services/engine/houses';
import { analytics } from '../services/analytics';
import { getRemedyContent, getGrahaContent } from '../data';

const getGrahaRemedy = (grahaName: string): string => {
  const remedy = getRemedyContent(grahaName.toLowerCase());
  if (!remedy) return 'Consult an astrologer for personalised remedies.';
  return `${remedy.charity} Chant: ${remedy.mantraTransliteration}`;
};

// ── Planet Detail Dialog ─────────────────────────────────────────────────────

interface PlanetDetailDialogProps {
  planet: PlanetPosition | null;
  visible: boolean;
  onDismiss: () => void;
}

const PlanetDetailDialog: React.FC<PlanetDetailDialogProps> = ({ planet, visible, onDismiss }) => {
  const theme = useTheme();
  if (!planet) return null;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{planet.planet}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            Sign: {planet.sign}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
            House: {planet.house}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
            Longitude: {planet.longitude.toFixed(2)}°
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
            Latitude: {planet.latitude.toFixed(2)}°
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

// ── South Indian Chart Placeholder ───────────────────────────────────────────

const SouthIndianChartFallback = ({ theme }: { theme: any }) => {
  return (
    <Card mode="elevated" elevation={1} style={[styles.card, { backgroundColor: theme.colors.surfaceVariant, paddingVertical: 32 }]}>
      <Text variant="titleMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
        South Indian Chart Grid
      </Text>
      <Text variant="bodySmall" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
        Visual rendering of planetary positions
      </Text>
      <View style={{ alignSelf: 'center', marginTop: 16 }}>
        <List.Icon icon="grid" color={theme.colors.primary} />
      </View>
    </Card>
  );
};

// ── Main Screen ──────────────────────────────────────────────────────────────

const JanmaKundliScreen: React.FC = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { profile, isLoading } = useUserProfile();

  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    analytics.screenView('JanmaKundli');
  }, []);

  const hasBirthDetails = !!(profile?.birth_date && profile?.birth_time && profile?.birth_place);

  const chart: ChartData | null = useMemo(() => {
    if (!hasBirthDetails || !profile) return null;
    try {
      return astrologyEngine.calculateKundli(profile);
    } catch {
      return null;
    }
  }, [hasBirthDetails, profile]);

  const dasha: DashaTimeline | null = useMemo(() => {
    if (!hasBirthDetails || !profile) return null;
    try {
      return astrologyEngine.calculateDasha(profile);
    } catch {
      return null;
    }
  }, [hasBirthDetails, profile]);

  const afflicted: AfflictedGraha[] = useMemo(() => {
    if (!hasBirthDetails || !profile) return [];
    try {
      return astrologyEngine.getAfflictedGrahas(profile);
    } catch {
      return [];
    }
  }, [hasBirthDetails, profile]);

  const yogas: DetectedYoga[] = useMemo(() => {
    if (!hasBirthDetails || !profile) return [];
    try {
      const date = new Date(profile.birth_date);
      const [hours, minutes] = (profile.birth_time || '06:00').split(':').map(Number);
      date.setUTCHours(hours || 6, minutes || 0, 0, 0);
      const jd = toJulianDay(date);
      const positions = getAllGrahaPositions(jd);
      const houses = getVedicLagna(jd, profile.latitude ?? 28.6, profile.longitude ?? 77.2);
      return detectYogas(positions, houses, chart?.nakshatraIndex ?? 0);
    } catch {
      return [];
    }
  }, [hasBirthDetails, profile, chart?.nakshatraIndex]);

  // Dasha progress (0–1) for current Mahadasha
  const dashaProgress = useMemo(() => {
    if (!dasha) return 0;
    const { startDate, endDate } = dasha.currentMahadasha;
    const total = endDate.getTime() - startDate.getTime();
    if (total <= 0) return 0;
    const elapsed = Date.now() - startDate.getTime();
    return Math.max(0, Math.min(1, elapsed / total));
  }, [dasha]);

  const openPlanetDialog = (planet: PlanetPosition) => {
    setSelectedPlanet(planet);
    setDialogVisible(true);
  };

  // ── Loading state ──────────────────────────────────────────────────────────

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

  // ── Missing birth details ──────────────────────────────────────────────────

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
          Add your birth date, time, and place in your Profile to view your Janma Kundli.
        </Text>
      </View>
    );
  }

  if (!chart) return null;

  // ── Success state ──────────────────────────────────────────────────────────

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={isWide ? styles.twoColumn : undefined}>
        {/* Left / top column */}
        <View style={isWide ? styles.column : undefined}>

          {/* South Indian Chart Visual */}
          <SouthIndianChartFallback theme={theme} />

          {/* Key Placements */}
          <List.Subheader style={{ color: theme.colors.primary }}>Astrological Profile</List.Subheader>
          <View style={styles.placementsGrid}>
            <Card mode="contained" style={[styles.placementCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Card.Content style={styles.placementCardContent}>
                <List.Icon icon="arrow-up-bold-circle-outline" color={theme.colors.primary} />
                <View>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>LAGNA</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>{chart.lagnaSign}</Text>
                </View>
              </Card.Content>
            </Card>

            <Card mode="contained" style={[styles.placementCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Card.Content style={styles.placementCardContent}>
                <List.Icon icon="moon-waning-crescent" color={theme.colors.primary} />
                <View>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>RASHI</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>{chart.moonSign}</Text>
                </View>
              </Card.Content>
            </Card>

            <Card mode="contained" style={[styles.placementCard, { backgroundColor: theme.colors.primaryContainer, width: '100%' }]}>
              <Card.Content style={styles.placementCardContent}>
                <List.Icon icon="star-four-points" color={theme.colors.primary} />
                <View>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>NAKSHATRA</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
                    {chart.nakshatra} (Pada {chart.nakshatraPada})
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Current Dasha */}
          {dasha && (
            <>
              <List.Subheader style={{ color: theme.colors.primary }}>Current Mahadasha</List.Subheader>
              <Card mode="outlined" style={styles.card}>
                <Card.Title
                  title={`${dasha.currentMahadasha.lord} Mahadasha`}
                  subtitle={`Ends ${dasha.currentMahadasha.endDate.toLocaleDateString()}`}
                  titleVariant="titleMedium"
                  left={props => <List.Icon {...props} icon="orbit" color={theme.colors.primary} />}
                />
                <Card.Content>
                  <ProgressBar
                    progress={dashaProgress}
                    color={theme.colors.primary}
                    style={{ height: 6, borderRadius: 3, marginBottom: 4 }}
                    theme={theme}
                    accessibilityLabel="Mahadasha period progress"
                  />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {Math.round(dashaProgress * 100)}% elapsed
                  </Text>
                </Card.Content>
              </Card>

              <List.Subheader style={{ color: theme.colors.primary }}>Current Antardasha</List.Subheader>
              <Card mode="outlined" style={styles.card}>
                <Card.Title
                  title={`${dasha.currentAntardasha.antarLord} Antardasha`}
                  subtitle={`Ends ${dasha.currentAntardasha.endDate.toLocaleDateString()}`}
                  titleVariant="titleMedium"
                  left={props => <List.Icon {...props} icon="circle-double" color={theme.colors.secondary} />}
                />
              </Card>
            </>
          )}

          {/* Detected Yogas */}
          {yogas.length > 0 && (
            <>
              <List.Subheader style={{ color: theme.colors.primary }}>Yogas & Doshas</List.Subheader>
              <View style={styles.chipRow}>
                {yogas.map(yoga => (
                  <Chip
                    key={yoga.key}
                    mode="flat"
                    style={[
                      styles.placementChip,
                      {
                        backgroundColor:
                          yoga.quality === 'benefic'
                            ? theme.colors.primaryContainer
                            : yoga.quality === 'malefic'
                              ? theme.colors.errorContainer
                              : theme.colors.surfaceVariant,
                      },
                    ]}
                    textStyle={{
                      color:
                        yoga.quality === 'benefic'
                          ? theme.colors.onPrimaryContainer
                          : yoga.quality === 'malefic'
                            ? theme.colors.onErrorContainer
                            : theme.colors.onSurfaceVariant,
                    }}
                    accessibilityLabel={`${yoga.name}: ${yoga.formingCondition}`}
                  >
                    {yoga.name}
                  </Chip>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Right / bottom column */}
        <View style={isWide ? styles.column : undefined}>

          {/* Planet Positions DataTable */}
          {chart.planets.length > 0 && (
            <>
              <List.Subheader style={{ color: theme.colors.primary }}>Planet Positions</List.Subheader>
              <Card mode="outlined" style={styles.card}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Planet</DataTable.Title>
                    <DataTable.Title>Sign</DataTable.Title>
                    <DataTable.Title numeric>House</DataTable.Title>
                    <DataTable.Title numeric>Longitude</DataTable.Title>
                  </DataTable.Header>
                  {chart.planets.map(p => (
                    <DataTable.Row
                      key={p.planet}
                      onPress={() => openPlanetDialog(p)}
                      accessibilityLabel={`${p.planet} in ${p.sign}, house ${p.house}`}
                    >
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
                      <DataTable.Cell numeric>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          {p.longitude.toFixed(1)}°
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </Card>
            </>
          )}

          {/* Remedy Cards for Afflicted Grahas */}
          {afflicted.length > 0 && (
            <>
              <List.Subheader style={{ color: theme.colors.primary }}>Remedies</List.Subheader>
              {afflicted.map((a, i) => (
                <Card
                  key={`${a.graha}-${i}`}
                  mode="elevated"
                  elevation={1}
                  style={[styles.card, { backgroundColor: theme.colors.tertiaryContainer }]}
                  accessibilityLabel={`Remedy for ${a.graha}: ${a.reason}`}
                >
                  <Card.Title
                    title={`${a.graha} — ${a.reason}`}
                    subtitle={getGrahaRemedy(a.graha)}
                    titleVariant="titleSmall"
                    subtitleNumberOfLines={3}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon={a.severity === 'high' ? 'alert-circle' : 'alert'}
                        color={
                          a.severity === 'high'
                            ? theme.colors.error
                            : a.severity === 'medium'
                              ? theme.colors.tertiary
                              : theme.colors.onSurfaceVariant
                        }
                      />
                    )}
                  />
                  <Card.Content>
                    <Chip
                      mode="flat"
                      compact
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor:
                          a.severity === 'high' ? theme.colors.errorContainer : theme.colors.surfaceVariant,
                      }}
                      textStyle={{
                        color:
                          a.severity === 'high' ? theme.colors.onErrorContainer : theme.colors.onSurfaceVariant,
                      }}
                    >
                      Severity: {a.severity}
                    </Chip>
                  </Card.Content>
                </Card>
              ))}
            </>
          )}
        </View>
      </View>

      <View style={styles.bottomPad} />

      <PlanetDetailDialog
        planet={selectedPlanet}
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
      />
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
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  placementChip: {
    marginBottom: 4,
  },
  placementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  placementCard: {
    width: '48%',
    marginBottom: 8,
  },
  placementCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  twoColumn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
  },
  bottomPad: {
    height: 24,
  },
});

export default JanmaKundliScreen;

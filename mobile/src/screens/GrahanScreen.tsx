import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  Button,
  useTheme,
} from 'react-native-paper';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { EclipseEvent } from '../services/astrologyEngine';

const ECLIPSE_TYPE_LABELS: Record<string, string> = {
  total_solar: '🌑 Total Solar Eclipse',
  annular_solar: '🌘 Annular Solar Eclipse',
  partial_solar: '🌗 Partial Solar Eclipse',
  total_lunar: '🌕 Total Lunar Eclipse',
  penumbral_lunar: '🌖 Penumbral Lunar Eclipse',
};

const GrahanScreen: React.FC = () => {
  const theme = useTheme();
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    analytics.screenView('Grahan');
  }, []);

  const eclipses = useMemo<EclipseEvent[]>(() => {
    try {
      return astrologyEngine.getEclipses(year);
    } catch {
      return [];
    }
  }, [year]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Year Selector */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', opacity: 0.75 }}
          >
            Eclipse Calendar
          </Text>
          <View style={styles.yearSelector}>
            <Button
              mode="text"
              compact
              onPress={() => setYear((y) => y - 1)}
              textColor={theme.colors.onPrimaryContainer}
              accessibilityLabel="Previous year"
            >
              ‹
            </Button>
            <Text
              variant="headlineMedium"
              style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}
            >
              {year}
            </Text>
            <Button
              mode="text"
              compact
              onPress={() => setYear((y) => y + 1)}
              textColor={theme.colors.onPrimaryContainer}
              accessibilityLabel="Next year"
            >
              ›
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Eclipse List or Empty State */}
      {eclipses.length === 0 ? (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Eclipses</List.Subheader>
          <Card
            mode="elevated"
            elevation={1}
            style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}
          >
            <Card.Content style={styles.emptyContent}>
              <Text variant="displaySmall" style={{ textAlign: 'center' }}>🌓</Text>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSecondaryContainer, textAlign: 'center', marginTop: 12 }}
              >
                No Eclipse Data
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSecondaryContainer, textAlign: 'center', marginTop: 8, opacity: 0.75 }}
              >
                Eclipse data for {year} will be available soon.
              </Text>
            </Card.Content>
          </Card>
        </>
      ) : (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>
            {eclipses.length} Eclipse{eclipses.length !== 1 ? 's' : ''} in {year}
          </List.Subheader>
          {eclipses.map((eclipse, i) => {
            const typeLabel = ECLIPSE_TYPE_LABELS[eclipse.type] ?? eclipse.type;
            const dateStr = eclipse.date.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            const isSolar = eclipse.type.includes('solar');

            return (
              <Card
                key={`${eclipse.type}-${i}`}
                mode="elevated"
                elevation={1}
                style={styles.card}
              >
                <Card.Title
                  title={typeLabel}
                  subtitle={dateStr}
                  titleVariant="titleMedium"
                  titleStyle={{ color: theme.colors.onSurface }}
                  subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={isSolar ? 'white-balance-sunny' : 'moon-full'}
                      color={theme.colors.primary}
                    />
                  )}
                />
                <Card.Content>
                  <View style={styles.chipRow}>
                    <Chip
                      icon="zodiac-aries"
                      mode="flat"
                      compact
                      style={{ backgroundColor: theme.colors.secondaryContainer }}
                      textStyle={{ color: theme.colors.onSecondaryContainer }}
                    >
                      {eclipse.rashi}
                    </Chip>
                    <Chip
                      icon="star-four-points"
                      mode="flat"
                      compact
                      style={{ backgroundColor: theme.colors.secondaryContainer }}
                      textStyle={{ color: theme.colors.onSecondaryContainer }}
                    >
                      {eclipse.nakshatra}
                    </Chip>
                    <Chip
                      icon={eclipse.visibleFromIndia ? 'eye' : 'eye-off'}
                      mode="flat"
                      compact
                      style={{
                        backgroundColor: eclipse.visibleFromIndia
                          ? theme.colors.primaryContainer
                          : theme.colors.surfaceVariant,
                      }}
                      textStyle={{
                        color: eclipse.visibleFromIndia
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurfaceVariant,
                      }}
                    >
                      {eclipse.visibleFromIndia ? 'Visible from India' : 'Not visible from India'}
                    </Chip>
                  </View>
                </Card.Content>
                {i < eclipses.length - 1 && <Divider style={{ marginTop: 8 }} />}
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
  heroCard: {
    margin: 16,
    marginBottom: 0,
  },
  heroContent: {
    paddingVertical: 16,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 16,
  },
  emptyContent: {
    paddingVertical: 32,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomPad: {
    height: 24,
  },
});

export default GrahanScreen;

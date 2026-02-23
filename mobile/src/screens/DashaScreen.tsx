import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  ProgressBar,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { DashaTimeline, DashaPeriod, AntardashaPeriod } from '../services/engine/dasha';

// Planet → spiritual practice lookup
const PLANET_PRACTICES: Record<string, string> = {
  Ketu: 'Om Namah Shivaya — meditation and detachment practices',
  Venus: 'Om Shukraya Namaha — devotional music, art, and gratitude',
  Sun: 'Aditya Hridaya Stotra — Surya Namaskar at sunrise',
  Moon: 'Om Chandraya Namaha — chanting, calming pranayama',
  Mars: 'Om Mangalaya Namaha — Hanuman Chalisa, physical discipline',
  Rahu: 'Om Rahave Namaha — mindfulness, Durga mantra',
  Jupiter: 'Om Gurave Namaha — study of scriptures, guru seva',
  Saturn: 'Om Shanaischaraya Namaha — seva (selfless service), discipline',
  Mercury: 'Om Budhaya Namaha — japa, learning, Vishnu Sahasranama',
};

const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const formatRemaining = (end: Date): string => {
  const diffMs = end.getTime() - Date.now();
  if (diffMs <= 0) return 'Ended';
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0) parts.push(`${days}d`);
  return parts.join(' ') || 'Less than a day';
};

const elapsedFraction = (start: Date, end: Date): number => {
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 1;
  const elapsed = Date.now() - start.getTime();
  return Math.min(1, Math.max(0, elapsed / total));
};

const DashaScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const [expandedMaha, setExpandedMaha] = useState<string | null>(null);

  useEffect(() => {
    analytics.screenView('Dasha');
  }, []);

  const timeline = useMemo<DashaTimeline | null>(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      return astrologyEngine.calculateDasha(profile);
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

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
          Add your birth date, time, and place in your Profile to view your Dasha timeline.
        </Text>
      </View>
    );
  }

  if (!timeline) return null;

  const { currentMahadasha, currentAntardasha, sequence } = timeline;
  const nowMs = Date.now();

  const getAntardashasForMaha = (maha: DashaPeriod): AntardashaPeriod[] => {
    if (maha.lord === currentMahadasha.lord && maha.startDate.getTime() === currentMahadasha.startDate.getTime()) {
      return timeline.antardashas;
    }
    return [];
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Current Mahadasha highlight */}
      <List.Subheader style={{ color: theme.colors.primary }}>Current Mahadasha</List.Subheader>
      <Card mode="elevated" elevation={3} style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
        <Card.Title
          title={`${currentMahadasha.lord} Mahadasha`}
          subtitle={`${currentMahadasha.lordHindi}`}
          titleVariant="titleMedium"
          titleStyle={{ color: theme.colors.onPrimaryContainer }}
          subtitleStyle={{ color: theme.colors.onPrimaryContainer }}
          left={props => <List.Icon {...props} icon="orbit" color={theme.colors.onPrimaryContainer} />}
        />
        <Card.Content>
          <View style={styles.dateRow}>
            <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
              {formatDate(currentMahadasha.startDate)} — {formatDate(currentMahadasha.endDate)}
            </Text>
          </View>
          <ProgressBar
            progress={elapsedFraction(currentMahadasha.startDate, currentMahadasha.endDate)}
            color={theme.colors.primary}
            style={{ height: 6, borderRadius: 3, marginVertical: 8 }}
            accessibilityLabel="Mahadasha period progress"
          />
          <Chip
            mode="flat"
            compact
            style={{ alignSelf: 'flex-start', backgroundColor: theme.colors.primary }}
            textStyle={{ color: theme.colors.onPrimary }}
          >
            {formatRemaining(currentMahadasha.endDate)} remaining
          </Chip>
        </Card.Content>
      </Card>

      {/* Current Antardasha */}
      <List.Subheader style={{ color: theme.colors.primary }}>Current Antardasha</List.Subheader>
      <Card mode="elevated" elevation={1} style={styles.card}>
        <Card.Title
          title={`${currentAntardasha.antarLord} Antardasha`}
          subtitle={`Sub-lord: ${currentAntardasha.antarLordHindi}`}
          titleVariant="titleSmall"
          left={props => <List.Icon {...props} icon="star-four-points" color={theme.colors.primary} />}
        />
        <Card.Content>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {formatDate(currentAntardasha.startDate)} — {formatDate(currentAntardasha.endDate)}
          </Text>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Full timeline */}
      <List.Subheader style={{ color: theme.colors.primary }}>Full Dasha Timeline</List.Subheader>
      {sequence.map((maha) => {
        const isPast = nowMs >= maha.endDate.getTime();
        const isCurrent = maha.isCurrent;
        const cardMode = isCurrent ? 'elevated' as const : 'outlined' as const;
        const cardElevation = isCurrent ? 2 as const : 0 as const;
        const cardBg = isPast
          ? theme.colors.surfaceVariant
          : isCurrent
            ? theme.colors.primaryContainer
            : undefined;
        const textColor = isPast
          ? theme.colors.onSurfaceVariant
          : isCurrent
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurface;

        const antardashas = getAntardashasForMaha(maha);
        const isExpanded = expandedMaha === `${maha.lord}-${maha.startDate.getTime()}`;
        const mahaKey = `${maha.lord}-${maha.startDate.getTime()}`;

        return (
          <Card
            key={mahaKey}
            mode={cardMode as 'elevated'}
            elevation={cardElevation}
            style={[styles.card, cardBg ? { backgroundColor: cardBg } : undefined]}
          >
            <List.Accordion
              title={`${maha.lord} (${maha.lordHindi})`}
              description={`${formatDate(maha.startDate)} — ${formatDate(maha.endDate)}  •  ${maha.durationYears.toFixed(1)}y`}
              titleStyle={{ color: textColor, fontWeight: isCurrent ? '700' : '400' }}
              descriptionStyle={{ color: textColor, opacity: isPast ? 0.7 : 1 }}
              left={props => (
                <List.Icon
                  {...props}
                  icon={isCurrent ? 'circle-slice-8' : isPast ? 'check-circle-outline' : 'circle-outline'}
                  color={isCurrent ? theme.colors.primary : textColor}
                />
              )}
              expanded={isExpanded}
              onPress={() => setExpandedMaha(isExpanded ? null : mahaKey)}
              style={{ paddingVertical: 0 }}
            >
              {antardashas.length > 0 ? (
                antardashas.map((antar) => {
                  const antarIsCurrent = antar.isCurrent;
                  return (
                    <List.Item
                      key={`${antar.antarLord}-${antar.startDate.getTime()}`}
                      title={`${antar.antarLord} (${antar.antarLordHindi})`}
                      description={`${formatDate(antar.startDate)} — ${formatDate(antar.endDate)}`}
                      titleStyle={{
                        color: antarIsCurrent ? theme.colors.primary : theme.colors.onSurface,
                        fontWeight: antarIsCurrent ? '700' : '400',
                      }}
                      descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                      left={props => (
                        <List.Icon
                          {...props}
                          icon={antarIsCurrent ? 'arrow-right-bold' : 'minus'}
                          color={antarIsCurrent ? theme.colors.primary : theme.colors.onSurfaceVariant}
                        />
                      )}
                      style={{ paddingLeft: 16 }}
                    />
                  );
                })
              ) : (
                <List.Item
                  title="Expand current Mahadasha for sub-periods"
                  titleStyle={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}
                  style={{ paddingLeft: 16 }}
                />
              )}
            </List.Accordion>
          </Card>
        );
      })}

      <Divider style={{ marginVertical: 8 }} />

      {/* Spiritual practice recommendation */}
      <List.Subheader style={{ color: theme.colors.primary }}>Spiritual Practice</List.Subheader>
      <Card
        mode="elevated"
        elevation={1}
        style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}
      >
        <Card.Title
          title={`${currentMahadasha.lord} Dasha Recommendation`}
          titleVariant="titleSmall"
          titleStyle={{ color: theme.colors.onSecondaryContainer }}
          left={props => <List.Icon {...props} icon="hands-pray" color={theme.colors.onSecondaryContainer} />}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
            {PLANET_PRACTICES[currentMahadasha.lord] ?? 'Continue your regular spiritual practice.'}
          </Text>
        </Card.Content>
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
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  dateRow: {
    marginBottom: 4,
  },
  bottomPad: {
    height: 24,
  },
});

export default DashaScreen;

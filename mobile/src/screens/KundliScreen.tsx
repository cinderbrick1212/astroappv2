import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useUserProfile } from '../hooks/useUserProfile';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { kundliService, KundliData } from '../services/kundli';

const KundliScreen: React.FC = () => {
  const { profile, isLoading } = useUserProfile();
  const [kundli, setKundli] = useState<KundliData | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState(false);

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

  if (isLoading || calculating) {
    return <LoadingSkeleton />;
  }

  if (calcError) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Calculation Error</Text>
        <Text style={styles.emptyText}>
          Could not calculate your Kundli. Please check your birth details and try again.
        </Text>
      </View>
    );
  }

  const hasBirthDetails = !!(profile?.birth_date && profile?.birth_time && profile?.birth_place);

  if (!hasBirthDetails) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔯</Text>
        <Text style={styles.emptyTitle}>Birth Details Required</Text>
        <Text style={styles.emptyText}>
          Add your birth date, time, and place in your Profile to view your Kundli.
        </Text>
      </View>
    );
  }

  if (!kundli) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Key Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Placements</Text>
        <View style={styles.card}>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Lagna (Ascendant)</Text>
            <Text style={styles.insightValue}>{kundli.lagna}</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Rashi (Moon Sign)</Text>
            <Text style={styles.insightValue}>{kundli.rashi}</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Sun Sign</Text>
            <Text style={styles.insightValue}>{kundli.sunSign}</Text>
          </View>
          <View style={[styles.insightRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.insightLabel}>Nakshatra</Text>
            <Text style={styles.insightValue}>{kundli.nakshatra}</Text>
          </View>
        </View>
      </View>

      {/* Current Dasha */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Mahadasha</Text>
        <View style={styles.dashaCard}>
          <Text style={styles.dashaIcon}>🪐</Text>
          <View style={styles.dashaMeta}>
            <Text style={styles.dashaPlanet}>{kundli.dasha.planet} Dasha</Text>
            <Text style={styles.dashaEnds}>Ends approx. {kundli.dasha.endYear}</Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planetary Insights</Text>
        {kundli.insights.map((insight, i) => (
          <View key={i} style={styles.insightCard}>
            <Text style={styles.insightBullet}>✦</Text>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>

      {/* Planet positions */}
      {kundli.chartData.planets.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planet Positions</Text>
          <View style={styles.card}>
            {kundli.chartData.planets.map((p, i) => (
              <View
                key={p.planet}
                style={[
                  styles.insightRow,
                  i === kundli.chartData.planets.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.insightLabel}>{p.planet}</Text>
                <Text style={styles.insightValue}>
                  {p.sign} · House {p.house}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  insightLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  insightValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  dashaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dashaIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  dashaMeta: {
    flex: 1,
  },
  dashaPlanet: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dashaEnds: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightBullet: {
    fontSize: 14,
    color: colors.primary,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default KundliScreen;

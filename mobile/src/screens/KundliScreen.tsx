import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useUserProfile } from '../hooks/useUserProfile';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { kundliService } from '../services/kundli';

const KundliScreen: React.FC = () => {
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return <LoadingSkeleton />;
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

  const kundli = kundliService.calculateKundli(
    new Date(profile.birth_date),
    profile.birth_time,
    {
      latitude: profile.latitude ?? 28.6,
      longitude: profile.longitude ?? 77.2,
    },
    profile.timezone ?? 'Asia/Kolkata'
  );

  const dasha = kundliService.getCurrentDasha(new Date(profile.birth_date));

  return (
    <ScrollView style={styles.container}>
      {/* Key Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
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
            <Text style={styles.insightLabel}>Nakshatra</Text>
            <Text style={styles.insightValue}>{kundli.nakshatra}</Text>
          </View>
        </View>
      </View>

      {/* Planetary Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planetary Insights</Text>
        {kundli.insights.map((insight, i) => (
          <View key={i} style={styles.insightCard}>
            <Text style={styles.insightBullet}>✦</Text>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>

      {/* Current Dasha */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Dasha Period</Text>
        <View style={styles.card}>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Mahadasha Planet</Text>
            <Text style={styles.insightValue}>{dasha.planet}</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Start</Text>
            <Text style={styles.insightValue}>
              {dasha.startDate.getFullYear()}
            </Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>End</Text>
            <Text style={styles.insightValue}>
              {dasha.endDate.getFullYear()}
            </Text>
          </View>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.section}>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Calculations use simplified astronomical approximations. Full precision requires Swiss Ephemeris data integration.
          </Text>
        </View>
      </View>
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
  noteCard: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  noteText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default KundliScreen;

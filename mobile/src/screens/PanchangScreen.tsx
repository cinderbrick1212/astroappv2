import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { panchangService, PanchangData } from '../services/panchang';
import { useUserProfile } from '../hooks/useUserProfile';

const PanchangScreen: React.FC = () => {
  const { profile } = useUserProfile();
  const today = new Date();

  const lat = profile?.latitude ?? 28.6;
  const lon = profile?.longitude ?? 77.2;
  const panchang: PanchangData = panchangService.calculatePanchang(today, lat, lon);

  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{dateStr}</Text>
        {profile?.birth_place ? (
          <Text style={styles.locationText}>📍 {profile.birth_place}</Text>
        ) : (
          <Text style={styles.locationText}>📍 New Delhi (default)</Text>
        )}
      </View>

      {/* Five Elements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Panchang Elements</Text>
        <View style={styles.card}>
          {[
            { label: 'Tithi', value: panchang.tithi, icon: '🌙' },
            { label: 'Nakshatra', value: panchang.nakshatra, icon: '⭐' },
            { label: 'Yoga', value: panchang.yoga, icon: '🔆' },
            { label: 'Karana', value: panchang.karana, icon: '🌀' },
          ].map((item, idx, arr) => (
            <View
              key={item.label}
              style={[
                styles.row,
                idx < arr.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.rowIcon}>{item.icon}</Text>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Sun timings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sun Timings</Text>
        <View style={styles.timingsRow}>
          <View style={styles.timingCard}>
            <Text style={styles.timingIcon}>🌅</Text>
            <Text style={styles.timingLabel}>Sunrise</Text>
            <Text style={styles.timingValue}>{panchang.sunrise}</Text>
          </View>
          <View style={styles.timingCard}>
            <Text style={styles.timingIcon}>🌇</Text>
            <Text style={styles.timingLabel}>Sunset</Text>
            <Text style={styles.timingValue}>{panchang.sunset}</Text>
          </View>
        </View>
      </View>

      {/* Rahu Kaal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rahu Kaal</Text>
        <View style={[styles.card, styles.rahuCard]}>
          <Text style={styles.rahuIcon}>⚠️</Text>
          <View>
            <Text style={styles.rahuLabel}>Inauspicious Period</Text>
            <Text style={styles.rahuTime}>
              {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
            </Text>
            <Text style={styles.rahuHint}>Avoid new ventures during this window.</Text>
          </View>
        </View>
      </View>

      {/* Muhurat */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auspicious Muhurats</Text>
        <View style={styles.card}>
          {panchang.muhurat.map((m, idx, arr) => (
            <View
              key={m.activity}
              style={[
                styles.row,
                idx < arr.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.rowIcon}>✨</Text>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{m.activity}</Text>
                <Text style={styles.rowValue}>{m.time}</Text>
              </View>
            </View>
          ))}
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
  dateHeader: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  locationText: {
    fontSize: 13,
    color: colors.textOnPrimary,
    opacity: 0.85,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowIcon: {
    fontSize: 22,
    marginRight: spacing.md,
    width: 30,
    textAlign: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  timingsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timingCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  timingIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  timingLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  timingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  rahuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  rahuIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  rahuLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  rahuTime: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 2,
  },
  rahuHint: {
    fontSize: 12,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});

export default PanchangScreen;

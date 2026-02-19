import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { compatibilityService, CompatibilityResult } from '../services/compatibility';
import { validation } from '../utils/validation';
import { storage } from '../utils/storage';

interface CompatibilityHistoryEntry {
  partnerName: string;
  partnerDate: string;
  score: number;
  savedAt: string;
}

const getRatingLabel = (score: number): { label: string; color: string } => {
  if (score >= 28) return { label: 'Excellent Match', color: colors.success };
  if (score >= 19) return { label: 'Good Match', color: colors.warning };
  return { label: 'Needs Work', color: colors.error };
};

const CompatibilityScreen: React.FC = () => {
  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [dateError, setDateError] = useState('');

  const handleCheck = () => {
    setDateError('');
    if (!validation.isValidDate(partnerDate)) {
      setDateError('Please enter a valid date (YYYY-MM-DD)');
      return;
    }
    const partnerBirthDate = new Date(partnerDate);
    const userBirthDate = new Date();
    const res = compatibilityService.calculateCompatibility(userBirthDate, partnerBirthDate);
    setResult(res);
    setShowBreakdown(false);
  };

  const handleSave = async () => {
    if (!result) return;
    const history = (await storage.get<CompatibilityHistoryEntry[]>(storage.keys.COMPATIBILITY_HISTORY)) || [];
    const entry: CompatibilityHistoryEntry = {
      partnerName: partnerName || 'Partner',
      partnerDate,
      score: result.score,
      savedAt: new Date().toISOString(),
    };
    history.unshift(entry);
    await storage.set(storage.keys.COMPATIBILITY_HISTORY, history.slice(0, 20));
    Alert.alert('Saved', 'Compatibility check saved successfully.');
  };

  const rating = result ? getRatingLabel(result.score) : null;

  const BREAKDOWN_LABELS: Record<string, string> = {
    varna: 'Varna (1)',
    vashya: 'Vashya (2)',
    tara: 'Tara (3)',
    yoni: 'Yoni (4)',
    graha_maitri: 'Graha Maitri (5)',
    gana: 'Gana (6)',
    bhakoot: 'Bhakoot (7)',
    nadi: 'Nadi (8)',
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Partner Details</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Partner's Name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rahul"
            placeholderTextColor={colors.textTertiary}
            value={partnerName}
            onChangeText={setPartnerName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Partner's Date of Birth</Text>
          <TextInput
            style={[styles.input, dateError ? styles.inputError : null]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textTertiary}
            value={partnerDate}
            onChangeText={setPartnerDate}
            keyboardType="numbers-and-punctuation"
          />
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCheck}>
          <Text style={styles.primaryButtonText}>Check Compatibility</Text>
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      {result && rating && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Result</Text>
            <View style={styles.scoreCard}>
              <Text style={[styles.scoreText, { color: rating.color }]}>
                {result.score}/{result.maxScore}
              </Text>
              <Text style={[styles.ratingLabel, { color: rating.color }]}>{rating.label}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strengths</Text>
            {result.strengths.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>{s}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cautions</Text>
            {result.cautions.map((c, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bulletIcon, { color: colors.warning }]}>⚠</Text>
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
            <Text style={styles.adviceText}>{result.advice}</Text>
          </View>

          {/* Breakdown toggle */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowBreakdown(v => !v)}
            >
              <Text style={styles.secondaryButtonText}>
                {showBreakdown ? 'Hide Breakdown' : 'View Detailed Breakdown'}
              </Text>
            </TouchableOpacity>
            {showBreakdown && (
              <View style={styles.breakdownCard}>
                {Object.entries(result.breakdown).map(([key, val]) => (
                  <View key={key} style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>{BREAKDOWN_LABELS[key] ?? key}</Text>
                    <Text style={styles.breakdownValue}>{val}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save This Check</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bulletIcon: {
    fontSize: 16,
    color: colors.success,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  adviceText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  breakdownLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CompatibilityScreen;

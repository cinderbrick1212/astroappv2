import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  Chip,
  List,
  Divider,
  HelperText,
  Banner,
  useTheme,
} from 'react-native-paper';
import { compatibilityService, CompatibilityResult } from '../services/compatibility';
import { validation } from '../utils/validation';
import { storage } from '../utils/storage';
import { useUserProfile } from '../hooks/useUserProfile';
import { analytics } from '../services/analytics';
import { ASHTAKOOT_KOOTS } from '../data';
import type { AshtakootContent } from '../data';

interface CompatibilityHistoryEntry {
  partnerName: string;
  partnerDate: string;
  score: number;
  savedAt: string;
}

const getRatingLabel = (score: number): { label: string; colorKey: 'primary' | 'secondary' | 'error' } => {
  if (score >= 28) return { label: 'Excellent Match ✦', colorKey: 'primary' };
  if (score >= 19) return { label: 'Good Match', colorKey: 'secondary' };
  return { label: 'Needs Work', colorKey: 'error' };
};

/** Build Koot labels from the data layer */
const buildBreakdownLabels = (): Record<string, string> => {
  const labels: Record<string, string> = {};
  ASHTAKOOT_KOOTS.forEach((k: AshtakootContent) => { labels[k.key] = `${k.name} (${k.maxPoints})`; });
  return labels;
};
const BREAKDOWN_LABELS = buildBreakdownLabels();

const CompatibilityScreen: React.FC = () => {
  const theme = useTheme();
  const { profile } = useUserProfile();
  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    analytics.screenView('Compatibility');
  }, []);

  const handleCheck = () => {
    setDateError('');
    if (!profile?.birth_date) {
      Alert.alert(
        'Birth Date Required',
        'Please add your date of birth in the Profile tab before checking compatibility.',
      );
      return;
    }
    if (!validation.isValidDate(partnerDate)) {
      setDateError('Please enter a valid date (YYYY-MM-DD)');
      return;
    }
    const partnerBirthDate = new Date(partnerDate);
    const userBirthDate = new Date(profile.birth_date);
    const res = compatibilityService.calculateCompatibility(userBirthDate, partnerBirthDate);
    setResult(res);
    setShowBreakdown(false);
    analytics.compatibilityChecked();
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* No birth date banner */}
      <Banner
        visible={!profile?.birth_date}
        icon="information-outline"
        actions={[]}
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        Your birth date is required for compatibility. Please add it in your Profile.
      </Banner>

      {/* Input */}
      <List.Subheader style={{ color: theme.colors.primary }}>Enter Partner Details</List.Subheader>

      <View style={styles.inputSection}>
        <TextInput
          mode="outlined"
          label="Partner's name (optional)"
          value={partnerName}
          onChangeText={setPartnerName}
          style={styles.input}
          theme={theme}
          accessibilityLabel="Enter partner's name"
        />

        <TextInput
          mode="outlined"
          label="Partner's date of birth"
          placeholder="YYYY-MM-DD"
          value={partnerDate}
          onChangeText={setPartnerDate}
          keyboardType="numbers-and-punctuation"
          error={!!dateError}
          style={styles.input}
          theme={theme}
          accessibilityLabel="Enter partner's date of birth"
        />
        <HelperText type="error" visible={!!dateError}>
          {dateError}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleCheck}
          style={styles.checkButton}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Check compatibility"
        >
          Check Compatibility
        </Button>
      </View>

      {/* Results */}
      {result && rating && (
        <>
          <Divider style={styles.divider} />
          <List.Subheader style={{ color: theme.colors.primary }}>Result</List.Subheader>

          {/* Score card */}
          <Card
            mode="contained"
            style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}
            accessibilityLabel={`Compatibility score: ${result.score} out of ${result.maxScore}. ${rating.label}`}
          >
            <Card.Content style={styles.scoreContent}>
              <Text
                variant="displayMedium"
                style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}
              >
                {result.score}/{result.maxScore}
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4 }}
              >
                {rating.label}
              </Text>
            </Card.Content>
          </Card>

          {/* Strengths */}
          <List.Subheader style={{ color: theme.colors.primary }}>Strengths</List.Subheader>
          <View style={styles.chipRow}>
            {result.strengths.map((s, i) => (
              <Chip
                key={i}
                icon="check-circle-outline"
                mode="flat"
                style={[styles.strengthChip, { backgroundColor: theme.colors.secondaryContainer }]}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
                accessibilityLabel={`Strength: ${s}`}
              >
                {s}
              </Chip>
            ))}
          </View>

          {/* Cautions */}
          <List.Subheader style={{ color: theme.colors.error }}>Cautions</List.Subheader>
          <View style={styles.chipRow}>
            {result.cautions.map((c, i) => (
              <Chip
                key={i}
                icon="alert-outline"
                mode="flat"
                style={[styles.strengthChip, { backgroundColor: theme.colors.errorContainer }]}
                textStyle={{ color: theme.colors.onErrorContainer }}
                accessibilityLabel={`Caution: ${c}`}
              >
                {c}
              </Chip>
            ))}
          </View>
          <Text
            variant="bodySmall"
            style={[styles.advice, { color: theme.colors.onSurfaceVariant }]}
          >
            {result.advice}
          </Text>

          {/* Breakdown accordion */}
          <Card mode="outlined" style={[styles.card, { marginTop: 8 }]}>
            <List.Accordion
              title="View Ashtakoot Breakdown"
              expanded={showBreakdown}
              onPress={() => setShowBreakdown(v => !v)}
              left={props => <List.Icon {...props} icon="chart-bar" color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.primary }}
            >
              {Object.entries(result.breakdown).map(([key, val], i, arr) => (
                <React.Fragment key={key}>
                  <List.Item
                    title={BREAKDOWN_LABELS[key] ?? key}
                    right={() => (
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.primary, fontWeight: '600', alignSelf: 'center', marginRight: 16 }}
                      >
                        {val}
                      </Text>
                    )}
                  />
                  {i < arr.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List.Accordion>
          </Card>

          {/* Save */}
          <View style={styles.saveSection}>
            <Button
              mode="outlined"
              onPress={handleSave}
              icon="content-save-outline"
              accessibilityLabel="Save this compatibility check"
            >
              Save This Check
            </Button>
          </View>
        </>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  input: {
    marginBottom: 4,
  },
  checkButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scoreContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  strengthChip: {
    marginBottom: 4,
  },
  advice: {
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  saveSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
});

export default CompatibilityScreen;

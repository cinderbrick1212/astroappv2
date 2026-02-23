import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Alert, useWindowDimensions } from 'react-native';
import {
  Text,
  Card,
  Chip,
  TextInput,
  Button,
  DataTable,
  List,
  Divider,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { UserProfile } from '../types';
import type { AshtakootResult } from '../services/engine/ashtakoot';

type ScreenState = 'form' | 'calculating' | 'results';

const getScoreColorKey = (score: number): 'primary' | 'secondary' | 'error' => {
  if (score >= 28) return 'primary';
  if (score >= 18) return 'secondary';
  return 'error';
};

const getVerdictLabel = (verdict: AshtakootResult['verdict']): string => {
  switch (verdict) {
    case 'excellent':
      return 'Excellent Match ✦';
    case 'good':
      return 'Good Match';
    case 'acceptable':
      return 'Acceptable';
    case 'inauspicious':
      return 'Inauspicious';
  }
};

const KundliMilanScreen: React.FC = () => {
  const theme = useTheme();
  const { profile } = useUserProfile();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  const [partnerTime, setPartnerTime] = useState('');
  const [screenState, setScreenState] = useState<ScreenState>('form');
  const [result, setResult] = useState<AshtakootResult | null>(null);

  useEffect(() => {
    analytics.screenView('KundliMilan');
  }, []);

  const handleCalculate = () => {
    if (!profile?.birth_date || !profile?.birth_time) {
      Alert.alert(
        'Profile Incomplete',
        'Please add your date and time of birth in the Profile tab before using Kundli Milan.',
      );
      return;
    }
    if (!partnerDate.trim()) {
      Alert.alert('Missing Date', 'Please enter the partner\'s date of birth.');
      return;
    }
    if (!partnerTime.trim()) {
      Alert.alert('Missing Time', 'Please enter the partner\'s time of birth.');
      return;
    }

    setScreenState('calculating');

    const profileB: UserProfile = {
      id: 'partner',
      birth_date: partnerDate.trim(),
      birth_time: partnerTime.trim(),
      birth_place: profile.birth_place ?? '',
      timezone: profile.timezone ?? '',
      gender: 'other',
    };

    try {
      const res = astrologyEngine.calculateKundliMilan(profile, profileB);
      setResult(res);
      setScreenState('results');
    } catch {
      Alert.alert('Error', 'Could not calculate Kundli Milan. Please check the entered details.');
      setScreenState('form');
    }
  };

  const handleReset = () => {
    setResult(null);
    setScreenState('form');
  };

  const scoreColorKey = useMemo(
    () => (result ? getScoreColorKey(result.totalScore) : 'primary'),
    [result],
  );

  // ── Form view ──────────────────────────────────────────────────────────────

  const renderForm = () => (
    <View style={styles.inputSection}>
      <List.Subheader style={{ color: theme.colors.primary }}>
        Person A (You)
      </List.Subheader>
      <Card mode="outlined" style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Birth Date: {profile?.birth_date ?? 'Not set'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Birth Time: {profile?.birth_time ?? 'Not set'}
          </Text>
        </Card.Content>
      </Card>

      <List.Subheader style={{ color: theme.colors.primary }}>
        Person B (Partner)
      </List.Subheader>
      <TextInput
        mode="outlined"
        label="Name"
        value={partnerName}
        onChangeText={setPartnerName}
        style={styles.input}
        accessibilityLabel="Enter partner name"
      />
      <TextInput
        mode="outlined"
        label="Date of Birth"
        placeholder="YYYY-MM-DD"
        value={partnerDate}
        onChangeText={setPartnerDate}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
        accessibilityLabel="Enter partner date of birth"
      />
      <TextInput
        mode="outlined"
        label="Time of Birth"
        placeholder="HH:MM"
        value={partnerTime}
        onChangeText={setPartnerTime}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
        accessibilityLabel="Enter partner time of birth"
      />
      <Button
        mode="contained"
        onPress={handleCalculate}
        style={styles.actionButton}
        contentStyle={styles.buttonContent}
        accessibilityLabel="Calculate Kundli Milan"
      >
        Calculate Kundli Milan
      </Button>
    </View>
  );

  // ── Calculating view ───────────────────────────────────────────────────────

  const renderCalculating = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating size="large" color={theme.colors.primary} />
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.onBackground, marginTop: 16, textAlign: 'center' }}
      >
        Calculating Ashtakoot compatibility…
      </Text>
    </View>
  );

  // ── Mangal Dosha card ──────────────────────────────────────────────────────

  const renderMangalCard = (
    label: string,
    dosha: AshtakootResult['mangalDoshaA'],
  ) => (
    <Card mode="outlined" style={[styles.card, { flex: isWide ? 1 : undefined }]}>
      <Card.Content>
        <Text variant="titleSmall" style={{ color: theme.colors.primary, marginBottom: 4 }}>
          {label}
        </Text>
        <Chip
          mode="flat"
          icon={dosha.hasDosha ? 'alert-circle-outline' : 'check-circle-outline'}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: dosha.hasDosha
              ? theme.colors.errorContainer
              : theme.colors.secondaryContainer,
          }}
          textStyle={{
            color: dosha.hasDosha
              ? theme.colors.onErrorContainer
              : theme.colors.onSecondaryContainer,
          }}
        >
          {dosha.hasDosha ? `Mangal Dosha (${dosha.severity})` : 'No Mangal Dosha'}
        </Chip>
        {dosha.hasDosha && (
          <>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 6 }}
            >
              Affected houses: {dosha.affectedHouses.join(', ')}
            </Text>
            {dosha.cancellation && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.secondary, marginTop: 2 }}
              >
                Cancellation applies
              </Text>
            )}
          </>
        )}
      </Card.Content>
    </Card>
  );

  // ── Results view ───────────────────────────────────────────────────────────

  const renderResults = () => {
    if (!result) return null;

    return (
      <View>
        {/* Score card */}
        <Card
          mode="contained"
          style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}
          accessibilityLabel={`Score ${result.totalScore} out of ${result.maxScore}`}
        >
          <Card.Content style={styles.scoreContent}>
            <Text
              variant="displayMedium"
              style={{ color: theme.colors[scoreColorKey], textAlign: 'center' }}
            >
              {result.totalScore}/{result.maxScore}
            </Text>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4 }}
            >
              {getVerdictLabel(result.verdict)} — {result.verdictHindi}
            </Text>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {/* Koot DataTable */}
        <List.Subheader style={{ color: theme.colors.primary }}>
          Ashtakoot Breakdown
        </List.Subheader>
        <Card mode="outlined" style={styles.card}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Koot</DataTable.Title>
              <DataTable.Title>Hindi</DataTable.Title>
              <DataTable.Title numeric>Max</DataTable.Title>
              <DataTable.Title numeric>Scored</DataTable.Title>
            </DataTable.Header>
            {result.koots.map((k) => (
              <DataTable.Row key={k.koot}>
                <DataTable.Cell>{k.koot.replace(/_/g, ' ')}</DataTable.Cell>
                <DataTable.Cell>{k.kootHindi}</DataTable.Cell>
                <DataTable.Cell numeric>{k.max}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text
                    style={{
                      color:
                        k.scored === k.max
                          ? theme.colors.primary
                          : k.scored === 0
                            ? theme.colors.error
                            : theme.colors.onSurface,
                      fontWeight: '600',
                    }}
                  >
                    {k.scored}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card>

        <Divider style={styles.divider} />

        {/* Mangal Dosha */}
        <List.Subheader style={{ color: theme.colors.primary }}>
          Mangal Dosha
        </List.Subheader>
        <View style={isWide ? styles.rowWide : undefined}>
          {renderMangalCard(
            `Person A${profile?.birth_date ? ` (${profile.birth_date})` : ''}`,
            result.mangalDoshaA,
          )}
          {renderMangalCard(
            `Person B${partnerName ? ` (${partnerName})` : ''}`,
            result.mangalDoshaB,
          )}
        </View>

        {/* Reset */}
        <View style={styles.resetSection}>
          <Button
            mode="outlined"
            onPress={handleReset}
            icon="refresh"
            accessibilityLabel="Check another pair"
          >
            Check Another Pair
          </Button>
        </View>
      </View>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      {screenState === 'form' && renderForm()}
      {screenState === 'calculating' && renderCalculating()}
      {screenState === 'results' && renderResults()}
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
  actionButton: {
    marginTop: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scoreContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  rowWide: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  resetSection: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
});

export default KundliMilanScreen;

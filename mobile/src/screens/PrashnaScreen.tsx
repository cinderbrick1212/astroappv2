import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  DataTable,
  Button,
  ActivityIndicator,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import { storage } from '../utils/storage';
import { LagnaChart } from '../components/LagnaChart';
import type { ChartData } from '../services/astrologyEngine';
import type { PrashnaHistoryEntry } from '../utils/storageTypes';
import { getRashiByIndex } from '../data';

const RASHI_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const CATEGORIES = [
  'Career', 'Relationship', 'Health', 'Finance', 'Travel', 'Education', 'Spiritual', 'General',
] as const;

type ScreenState = 'form' | 'calculating' | 'result';

const PrashnaScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();
  const { width } = useWindowDimensions();

  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<string>('General');
  const [screenState, setScreenState] = useState<ScreenState>('form');
  const [chartResult, setChartResult] = useState<ChartData | null>(null);
  const [history, setHistory] = useState<PrashnaHistoryEntry[]>([]);

  const lat = profile?.latitude ?? 28.6;
  const lng = profile?.longitude ?? 77.2;

  useEffect(() => {
    analytics.screenView('Prashna');
  }, []);

  useEffect(() => {
    storage.getPrashnaHistory().then(setHistory);
  }, []);

  const handleAsk = useCallback(async () => {
    if (!question.trim()) return;
    setScreenState('calculating');
    try {
      const now = new Date();
      const chart = astrologyEngine.calculatePrashna(now, lat, lng);
      setChartResult(chart);

      const entry: PrashnaHistoryEntry = {
        id: now.getTime().toString(),
        question: question.trim(),
        category,
        verdict: chart.lagnaSign,
        askedAt: now.getTime(),
      };
      await storage.savePrashnaHistory(entry);
      const updated = await storage.getPrashnaHistory();
      setHistory(updated);
      setScreenState('result');
    } catch {
      setScreenState('form');
    }
  }, [question, category, lat, lng]);

  const handleNewQuestion = () => {
    setQuestion('');
    setCategory('General');
    setChartResult(null);
    setScreenState('form');
  };

  // Calculating state
  if (screenState === 'calculating') {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          Casting Prashna chart…
        </Text>
      </View>
    );
  }

  // Result state
  if (screenState === 'result' && chartResult) {
    const rashiIndex = RASHI_NAMES.indexOf(chartResult.lagnaSign);
    const rashiData = rashiIndex >= 0 ? getRashiByIndex(rashiIndex) : null;
    const interpretation = rashiData?.rashiInterpretation.standard ?? 'Consult the chart details for deeper insight.';
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

        {/* Question recap */}
        <Card
          mode="contained"
          style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Card.Content style={styles.heroContent}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}
            >
              {question}
            </Text>
            <Chip
              mode="flat"
              compact
              style={{ alignSelf: 'center', marginTop: 8, backgroundColor: theme.colors.primary }}
              textStyle={{ color: theme.colors.onPrimary }}
            >
              {category}
            </Chip>
          </Card.Content>
        </Card>

        {/* Key placements */}
        <View style={styles.chipRow}>
          <Chip
            icon="arrow-up-bold-circle-outline"
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
          >
            Lagna: {chartResult.lagnaSign}
          </Chip>
          <Chip
            icon="moon-waning-crescent"
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
          >
            Moon: {chartResult.moonSign}
          </Chip>
          <Chip
            icon="star-four-points"
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
          >
            {chartResult.nakshatra}
          </Chip>
        </View>

        {/* Prashna Chart Visual */}
        <List.Subheader style={{ color: theme.colors.primary }}>Prashna Chart</List.Subheader>
        <LagnaChart chartData={chartResult} size={Math.min(320, width - 32)} />


        {/* Interpretation */}
        <List.Subheader style={{ color: theme.colors.primary }}>Interpretation</List.Subheader>
        <Card
          mode="elevated"
          elevation={1}
          style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}
        >
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
              {interpretation}
            </Text>
          </Card.Content>
        </Card>

        {/* Planet Positions */}
        <List.Subheader style={{ color: theme.colors.primary }}>Planet Positions</List.Subheader>
        <Card mode="outlined" style={styles.card}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Planet</DataTable.Title>
              <DataTable.Title>Sign</DataTable.Title>
              <DataTable.Title numeric>House</DataTable.Title>
            </DataTable.Header>
            {chartResult.planets.map(p => (
              <DataTable.Row key={p.planet} accessibilityLabel={`${p.planet} in ${p.sign}`}>
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
              </DataTable.Row>
            ))}
          </DataTable>
        </Card>

        <Button
          mode="contained"
          onPress={handleNewQuestion}
          style={styles.actionButton}
          icon="plus"
        >
          Ask Another Question
        </Button>

        <Divider style={{ marginVertical: 8 }} />

        {/* History */}
        {history.length > 0 && (
          <>
            <List.Subheader style={{ color: theme.colors.primary }}>Past Questions</List.Subheader>
            {history.map((entry, i) => (
              <Card key={`${entry.askedAt}-${i}`} mode="outlined" style={styles.card}>
                <List.Item
                  title={entry.question}
                  description={`${entry.category} • Lagna: ${entry.verdict} • ${new Date(entry.askedAt).toLocaleDateString('en-IN')}`}
                  titleNumberOfLines={2}
                  titleStyle={{ color: theme.colors.onSurface }}
                  descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                  left={props => <PhIcon name="help-circle-outline" size={24} color={theme.colors.primary} />}
                />
              </Card>
            ))}
          </>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    );
  }

  // Form state (default)
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text variant="displaySmall" style={{ textAlign: 'center' }}>❓</Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8 }}
          >
            Prashna Kundli
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
          >
            Ask a question and receive guidance from the chart of this moment.
          </Text>
        </Card.Content>
      </Card>

      {/* Question Input */}
      <View style={styles.formSection}>
        <TextInput
          label="Your Question"
          value={question}
          onChangeText={setQuestion}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.textInput}
          accessibilityLabel="Type your question"
        />
      </View>

      {/* Category Chips */}
      <List.Subheader style={{ color: theme.colors.primary }}>Category</List.Subheader>
      <View style={styles.chipRow}>
        {CATEGORIES.map(cat => (
          <Chip
            key={cat}
            mode="flat"
            selected={category === cat}
            onPress={() => setCategory(cat)}
            style={{
              backgroundColor: category === cat
                ? theme.colors.primaryContainer
                : theme.colors.surfaceVariant,
            }}
            textStyle={{
              color: category === cat
                ? theme.colors.onPrimaryContainer
                : theme.colors.onSurfaceVariant,
            }}
            accessibilityLabel={`Category: ${cat}`}
          >
            {cat}
          </Chip>
        ))}
      </View>

      {/* Ask Button */}
      <Button
        mode="contained"
        onPress={handleAsk}
        disabled={!question.trim()}
        style={styles.actionButton}
        icon="chart-box-outline"
      >
        Ask
      </Button>

      <Divider style={{ marginVertical: 8 }} />

      {/* History */}
      {history.length > 0 && (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Past Questions</List.Subheader>
          {history.map((entry, i) => (
            <Card key={`${entry.askedAt}-${i}`} mode="outlined" style={styles.card}>
              <List.Item
                title={entry.question}
                description={`${entry.category} • Lagna: ${entry.verdict} • ${new Date(entry.askedAt).toLocaleDateString('en-IN')}`}
                titleNumberOfLines={2}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                left={props => <PhIcon name="help-circle-outline" size={24} color={theme.colors.primary} />}
              />
            </Card>
          ))}
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
  heroCard: {
    margin: 16,
    marginBottom: 0,
  },
  heroContent: {
    paddingVertical: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  textInput: {
    marginBottom: 8,
  },
  actionButton: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  bottomPad: {
    height: 24,
  },
});

export default PrashnaScreen;

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';
import type { AfflictedGraha } from '../services/astrologyEngine';
import { getRemedyContent } from '../data';

const getSeverityStyle = (severity: string, colors: Record<string, unknown>) => {
  switch (severity) {
    case 'high':
      return { bg: colors.errorContainer as string, text: colors.onErrorContainer as string };
    case 'medium':
      return { bg: colors.secondaryContainer as string, text: colors.onSecondaryContainer as string };
    default:
      return { bg: colors.surfaceVariant as string, text: colors.onSurfaceVariant as string };
  }
};

const GrahaShantScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();

  useEffect(() => {
    analytics.screenView('GrahaShant');
  }, []);

  const afflicted = useMemo<AfflictedGraha[]>(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return [];
    try {
      return astrologyEngine.getAfflictedGrahas(profile);
    } catch {
      return [];
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
          Add your birth date, time, and place in your Profile to view Graha Shanti remedies.
        </Text>
      </View>
    );
  }

  // No afflictions
  if (afflicted.length === 0) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card
          mode="contained"
          style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Card.Content style={styles.heroContent}>
            <Text variant="displaySmall" style={{ textAlign: 'center' }}>✨</Text>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8 }}
            >
              No Significant Afflictions
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
            >
              Your chart shows no significant afflictions. Continue your regular spiritual practices.
            </Text>
          </Card.Content>
        </Card>
        <View style={styles.bottomPad} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text variant="displaySmall" style={{ textAlign: 'center' }}>🙏</Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8 }}
          >
            Graha Shanti Remedies
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
          >
            {afflicted.length} afflicted graha{afflicted.length > 1 ? 's' : ''} found in your chart
          </Text>
        </Card.Content>
      </Card>

      {/* Affliction Summary Chips */}
      <View style={styles.chipRow}>
        {afflicted.map((a, i) => {
          const severity = getSeverityStyle(a.severity, theme.colors as unknown as Record<string, unknown>);
          return (
            <Chip
              key={`${a.graha}-${a.reason}-${i}`}
              mode="flat"
              style={{ backgroundColor: severity.bg }}
              textStyle={{ color: severity.text }}
              accessibilityLabel={`${a.graha}: ${a.reason}, ${a.severity} severity`}
            >
              {a.graha} — {a.reason} ({a.severity})
            </Chip>
          );
        })}
      </View>

      <Divider style={{ marginVertical: 8 }} />

      {/* Remedy Cards */}
      <List.Subheader style={{ color: theme.colors.primary }}>Remedies</List.Subheader>
      {afflicted.map((a, i) => {
        const remedy = getRemedyContent(a.graha.toLowerCase());
        if (!remedy) return null;
        const severity = getSeverityStyle(a.severity, theme.colors as unknown as Record<string, unknown>);
        return (
          <Card key={`${a.graha}-${a.reason}-${i}`} mode="outlined" style={styles.card}>
            <List.Accordion
              title={a.graha}
              description={`${a.reason} • ${a.severity} severity`}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '700' }}
              descriptionStyle={{ color: severity.text }}
              left={props => <PhIcon name="shield-sun-outline" size={24} color={theme.colors.primary} />}
              right={() => (
                <Chip
                  mode="flat"
                  compact
                  style={{ backgroundColor: severity.bg }}
                  textStyle={{ color: severity.text }}
                >
                  {a.severity}
                </Chip>
              )}
            >
              <List.Item
                title={remedy.gemstone}
                description="Gemstone"
                left={props => <PhIcon name="diamond-stone" size={24} color={theme.colors.primary} />}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
              <Divider />
              <List.Item
                title={remedy.mantraTransliteration}
                description="Mantra"
                titleNumberOfLines={2}
                left={props => <PhIcon name="hands-pray" size={24} color={theme.colors.primary} />}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
              <Divider />
              <List.Item
                title={remedy.charity}
                description="Charity"
                titleNumberOfLines={2}
                left={props => <PhIcon name="gift-outline" size={24} color={theme.colors.primary} />}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
              <Divider />
              <List.Item
                title={remedy.fastingDay}
                description="Fasting Day"
                left={props => <PhIcon name="calendar-blank" size={24} color={theme.colors.primary} />}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
              <Divider />
              <List.Item
                title={remedy.deity}
                description="Deity"
                left={props => <PhIcon name="account-heart-outline" size={24} color={theme.colors.primary} />}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
              <Divider />
              <List.Item
                title={remedy.colour}
                description="Auspicious Color"
                left={props => <PhIcon name="palette-outline" size={24} color={theme.colors.primary} />}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
            </List.Accordion>
          </Card>
        );
      })}

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
  bottomPad: {
    height: 24,
  },
});

export default GrahaShantScreen;

import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { panchangService, PanchangData } from '../services/panchang';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PanchangScreen: React.FC = () => {
  const theme = useTheme();
  const { profile } = useUserProfile();
  const insets = useSafeAreaInsets();
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ padding: 16, paddingBottom: Math.max(insets.bottom, 24) }}
    >

      {/* Date hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}
          >
            {dateStr}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, textAlign: 'center', marginTop: 4 }}
          >
            {profile?.birth_place ? `📍 ${profile.birth_place}` : '📍 New Delhi (default)'}
          </Text>
        </Card.Content>
      </Card>

      {/* Key elements as Chips */}
      <View style={styles.chipRow}>
        <Chip
          icon="moon-waning-crescent"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Tithi: ${panchang.tithi}`}
        >
          {panchang.tithi}
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Nakshatra: ${panchang.nakshatra}`}
        >
          {panchang.nakshatra}
        </Chip>
        <Chip
          icon="alert"
          mode="flat"
          style={{ backgroundColor: theme.colors.errorContainer }}
          textStyle={{ color: theme.colors.onErrorContainer }}
          accessibilityLabel={`Rahu Kaal: ${panchang.rahuKaal.start} to ${panchang.rahuKaal.end}`}
        >
          Rahu {panchang.rahuKaal.start}–{panchang.rahuKaal.end}
        </Chip>
      </View>

      {/* Panchang Elements */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Panchang Elements</Text>
      <Card mode="outlined" style={styles.card}>
        {[
          { label: 'Tithi', value: panchang.tithi, icon: 'moon-waning-crescent' },
          { label: 'Nakshatra', value: panchang.nakshatra, icon: 'star-four-points' },
          { label: 'Yoga', value: panchang.yoga, icon: 'sun-wireless-outline' },
          { label: 'Karana', value: panchang.karana, icon: 'rotate-360' },
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <List.Item
              title={item.value}
              description={item.label}
              left={props => <PhIcon name={item.icon} size={24} color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel={`${item.label}: ${item.value}`}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      {/* Sun Timings */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Sun Timings</Text>
      <View style={styles.timingsRow}>
        <Card
          mode="elevated"
          elevation={1}
          style={[styles.timingCard, { flex: 1 }]}
          accessibilityLabel={`Sunrise at ${panchang.sunrise}`}
        >
          <Card.Content style={styles.timingContent}>
            <Text variant="displaySmall" style={{ textAlign: 'center' }}>🌅</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }}>
              Sunrise
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 2 }}>
              {panchang.sunrise}
            </Text>
          </Card.Content>
        </Card>
        <Card
          mode="elevated"
          elevation={1}
          style={[styles.timingCard, { flex: 1, marginLeft: 8 }]}
          accessibilityLabel={`Sunset at ${panchang.sunset}`}
        >
          <Card.Content style={styles.timingContent}>
            <Text variant="displaySmall" style={{ textAlign: 'center' }}>🌇</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }}>
              Sunset
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 2 }}>
              {panchang.sunset}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Rahu Kaal */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.error }]}>Rahu Kaal</Text>
      <Card
        mode="outlined"
        style={[styles.card, { borderColor: theme.colors.error }]}
        accessibilityLabel={`Rahu Kaal from ${panchang.rahuKaal.start} to ${panchang.rahuKaal.end}`}
      >
        <Card.Title
          title={`${panchang.rahuKaal.start} – ${panchang.rahuKaal.end}`}
          titleVariant="titleMedium"
          titleStyle={{ color: theme.colors.error }}
          subtitle="Avoid new ventures during this window."
          left={props => <PhIcon name="alert-circle-outline" size={24} color={theme.colors.error} />}
        />
      </Card>

      {/* Auspicious Muhurats */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Auspicious Muhurats</Text>
      <Card mode="outlined" style={styles.card}>
        {panchang.muhurat.map((m, i, arr) => (
          <React.Fragment key={m.activity}>
            <List.Item
              title={m.time}
              description={m.activity}
              left={props => <PhIcon name="star-shooting" size={24} color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel={`${m.activity} at ${m.time}`}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      <View style={{ height: 8 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCard: {
    marginBottom: 0,
  },
  heroContent: {
    paddingVertical: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 16,
  },
  card: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 4,
    letterSpacing: -0.2,
  },
  timingsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 8,
  },
  timingCard: {
    marginBottom: 0,
  },
  timingContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});

export default PanchangScreen;

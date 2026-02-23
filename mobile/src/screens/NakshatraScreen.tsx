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
import { useUserProfile } from '../hooks/useUserProfile';
import { astrologyEngine } from '../services/astrologyEngine';
import { analytics } from '../services/analytics';

interface NakshatraInfo {
  name: string;
  ruler: string;
  deity: string;
  symbol: string;
  quality: string;
}

const NAKSHATRA_DATA: Record<string, NakshatraInfo> = {
  ashwini:       { name: 'Ashwini',       ruler: 'Ketu',    deity: 'Ashwini Kumaras', symbol: 'Horse head',        quality: 'Swift / Light' },
  bharani:       { name: 'Bharani',       ruler: 'Venus',   deity: 'Yama',            symbol: 'Yoni',              quality: 'Fierce / Severe' },
  krittika:      { name: 'Krittika',      ruler: 'Sun',     deity: 'Agni',            symbol: 'Razor / Flame',     quality: 'Mixed' },
  rohini:        { name: 'Rohini',        ruler: 'Moon',    deity: 'Brahma',          symbol: 'Chariot / Ox cart',  quality: 'Fixed / Steady' },
  mrigashira:    { name: 'Mrigashira',    ruler: 'Mars',    deity: 'Soma',            symbol: 'Deer head',         quality: 'Soft / Tender' },
  ardra:         { name: 'Ardra',         ruler: 'Rahu',    deity: 'Rudra',           symbol: 'Teardrop / Diamond', quality: 'Sharp / Dreadful' },
  punarvasu:     { name: 'Punarvasu',     ruler: 'Jupiter', deity: 'Aditi',           symbol: 'Bow / Quiver',      quality: 'Movable / Temporary' },
  pushya:        { name: 'Pushya',        ruler: 'Saturn',  deity: 'Brihaspati',      symbol: 'Lotus / Circle',    quality: 'Swift / Light' },
  ashlesha:      { name: 'Ashlesha',      ruler: 'Mercury', deity: 'Naga',            symbol: 'Serpent',           quality: 'Sharp / Dreadful' },
  magha:         { name: 'Magha',         ruler: 'Ketu',    deity: 'Pitris',          symbol: 'Throne / Palanquin', quality: 'Fierce / Severe' },
  'purva phalguni': { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga',        symbol: 'Hammock / Fig tree', quality: 'Fierce / Severe' },
  'uttara phalguni': { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman',      symbol: 'Bed / Fig tree',    quality: 'Fixed / Steady' },
  hasta:         { name: 'Hasta',         ruler: 'Moon',    deity: 'Savitar',         symbol: 'Hand / Fist',       quality: 'Swift / Light' },
  chitra:        { name: 'Chitra',        ruler: 'Mars',    deity: 'Tvashtar',        symbol: 'Bright jewel',      quality: 'Soft / Tender' },
  swati:         { name: 'Swati',         ruler: 'Rahu',    deity: 'Vayu',            symbol: 'Coral / Sword',     quality: 'Movable / Temporary' },
  vishakha:      { name: 'Vishakha',      ruler: 'Jupiter', deity: 'Indra-Agni',      symbol: 'Triumphal arch',    quality: 'Mixed' },
  anuradha:      { name: 'Anuradha',      ruler: 'Saturn',  deity: 'Mitra',           symbol: 'Lotus',             quality: 'Soft / Tender' },
  jyeshtha:      { name: 'Jyeshtha',      ruler: 'Mercury', deity: 'Indra',           symbol: 'Earring / Umbrella', quality: 'Sharp / Dreadful' },
  moola:         { name: 'Moola',         ruler: 'Ketu',    deity: 'Nirriti',         symbol: 'Roots / Lion tail', quality: 'Sharp / Dreadful' },
  'purva ashadha': { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apas',           symbol: 'Elephant tusk / Fan', quality: 'Fierce / Severe' },
  'uttara ashadha': { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishvadevas',    symbol: 'Elephant tusk / Bed', quality: 'Fixed / Steady' },
  shravana:      { name: 'Shravana',      ruler: 'Moon',    deity: 'Vishnu',          symbol: 'Ear / Three footprints', quality: 'Movable / Temporary' },
  dhanishtha:    { name: 'Dhanishtha',    ruler: 'Mars',    deity: 'Vasu',            symbol: 'Drum / Flute',      quality: 'Movable / Temporary' },
  shatabhisha:   { name: 'Shatabhisha',   ruler: 'Rahu',    deity: 'Varuna',          symbol: 'Empty circle / Flower', quality: 'Movable / Temporary' },
  'purva bhadrapada': { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Sword / Two front legs of bed', quality: 'Fierce / Severe' },
  'uttara bhadrapada': { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahir Budhnya', symbol: 'Twin / Back legs of bed', quality: 'Fixed / Steady' },
  revati:        { name: 'Revati',        ruler: 'Mercury', deity: 'Pushan',          symbol: 'Fish / Drum',       quality: 'Soft / Tender' },
};

const COMPATIBLE_NAKSHATRAS: Record<string, string[]> = {
  ashwini: ['Ashwini', 'Bharani', 'Pushya', 'Hasta'],
  bharani: ['Bharani', 'Rohini', 'Ashwini', 'Revati'],
  krittika: ['Krittika', 'Uttara Phalguni', 'Uttara Ashadha', 'Pushya'],
  rohini: ['Rohini', 'Uttara Phalguni', 'Hasta', 'Shravana'],
  mrigashira: ['Mrigashira', 'Chitra', 'Dhanishtha', 'Revati'],
  ardra: ['Ardra', 'Swati', 'Shatabhisha', 'Punarvasu'],
  punarvasu: ['Punarvasu', 'Pushya', 'Vishakha', 'Purva Bhadrapada'],
  pushya: ['Pushya', 'Ashwini', 'Punarvasu', 'Anuradha'],
  ashlesha: ['Ashlesha', 'Jyeshtha', 'Revati', 'Pushya'],
  magha: ['Magha', 'Moola', 'Ashwini', 'Purva Phalguni'],
  'purva phalguni': ['Purva Phalguni', 'Purva Ashadha', 'Magha', 'Bharani'],
  'uttara phalguni': ['Uttara Phalguni', 'Uttara Ashadha', 'Rohini', 'Krittika'],
  hasta: ['Hasta', 'Ashwini', 'Shravana', 'Rohini'],
  chitra: ['Chitra', 'Mrigashira', 'Swati', 'Dhanishtha'],
  swati: ['Swati', 'Ardra', 'Chitra', 'Shatabhisha'],
  vishakha: ['Vishakha', 'Punarvasu', 'Purva Bhadrapada', 'Anuradha'],
  anuradha: ['Anuradha', 'Pushya', 'Vishakha', 'Uttara Bhadrapada'],
  jyeshtha: ['Jyeshtha', 'Ashlesha', 'Revati', 'Anuradha'],
  moola: ['Moola', 'Magha', 'Ashwini', 'Purva Ashadha'],
  'purva ashadha': ['Purva Ashadha', 'Purva Phalguni', 'Moola', 'Bharani'],
  'uttara ashadha': ['Uttara Ashadha', 'Uttara Phalguni', 'Krittika', 'Rohini'],
  shravana: ['Shravana', 'Hasta', 'Rohini', 'Dhanishtha'],
  dhanishtha: ['Dhanishtha', 'Mrigashira', 'Chitra', 'Shravana'],
  shatabhisha: ['Shatabhisha', 'Ardra', 'Swati', 'Purva Bhadrapada'],
  'purva bhadrapada': ['Purva Bhadrapada', 'Vishakha', 'Punarvasu', 'Shatabhisha'],
  'uttara bhadrapada': ['Uttara Bhadrapada', 'Anuradha', 'Pushya', 'Revati'],
  revati: ['Revati', 'Ashlesha', 'Jyeshtha', 'Mrigashira'],
};

const PADA_DESCRIPTIONS = [
  'Pada 1 — Emphasises self-expression, initiative, and the core identity of this nakshatra.',
  'Pada 2 — Emphasises material security, speech, and practical application of nakshatra energy.',
  'Pada 3 — Emphasises communication, learning, and intellectual curiosity within this nakshatra.',
  'Pada 4 — Emphasises emotional depth, nurturing, and inner transformation of this nakshatra.',
];

const NakshatraScreen: React.FC = () => {
  const theme = useTheme();
  const { profile, isLoading } = useUserProfile();

  useEffect(() => {
    analytics.screenView('Nakshatra');
  }, []);

  const nakshatraResult = useMemo(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      return astrologyEngine.getMoonNakshatra(profile);
    } catch {
      return null;
    }
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_place]);

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
          Add your birth date, time, and place in your Profile to view your Nakshatra analysis.
        </Text>
      </View>
    );
  }

  if (!nakshatraResult) return null;

  const { nakshatraKey, pada } = nakshatraResult;
  const info = NAKSHATRA_DATA[nakshatraKey.toLowerCase()] ?? {
    name: nakshatraKey,
    ruler: 'Unknown',
    deity: 'Unknown',
    symbol: 'Unknown',
    quality: 'Unknown',
  };
  const compatible = COMPATIBLE_NAKSHATRAS[nakshatraKey.toLowerCase()] ?? [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text variant="displaySmall" style={{ textAlign: 'center' }}>⭐</Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8 }}
          >
            {info.name}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
          >
            Pada {pada} • {info.quality}
          </Text>
        </Card.Content>
      </Card>

      {/* Key Details */}
      <View style={styles.chipRow}>
        <Chip
          icon="orbit"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Ruler: ${info.ruler}`}
        >
          Ruler: {info.ruler}
        </Chip>
        <Chip
          icon="hands-pray"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Deity: ${info.deity}`}
        >
          Deity: {info.deity}
        </Chip>
        <Chip
          icon="star-four-points"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Symbol: ${info.symbol}`}
        >
          {info.symbol}
        </Chip>
      </View>

      {/* Nakshatra Details */}
      <List.Subheader style={{ color: theme.colors.primary }}>Nakshatra Details</List.Subheader>
      <Card mode="outlined" style={styles.card}>
        {[
          { label: 'Nakshatra', value: info.name, icon: 'star-four-points' },
          { label: 'Ruling Planet', value: info.ruler, icon: 'orbit' },
          { label: 'Deity', value: info.deity, icon: 'hands-pray' },
          { label: 'Symbol', value: info.symbol, icon: 'shape-outline' },
          { label: 'Quality', value: info.quality, icon: 'information-outline' },
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <List.Item
              title={item.value}
              description={item.label}
              left={(props) => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel={`${item.label}: ${item.value}`}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      <Divider style={{ marginVertical: 8 }} />

      {/* Pada Analysis */}
      <List.Subheader style={{ color: theme.colors.primary }}>Pada Analysis</List.Subheader>
      {PADA_DESCRIPTIONS.map((desc, i) => {
        const padaNum = i + 1;
        const isUserPada = padaNum === pada;
        return (
          <Card
            key={padaNum}
            mode={isUserPada ? 'elevated' : 'outlined'}
            elevation={isUserPada ? 2 : 0}
            style={[
              styles.card,
              isUserPada ? { backgroundColor: theme.colors.primaryContainer } : undefined,
            ]}
          >
            <List.Item
              title={`Pada ${padaNum}`}
              description={desc}
              titleStyle={{
                color: isUserPada ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                fontWeight: isUserPada ? '700' : '400',
              }}
              descriptionStyle={{
                color: isUserPada ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
              }}
              descriptionNumberOfLines={3}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isUserPada ? 'check-circle' : 'circle-outline'}
                  color={isUserPada ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
                />
              )}
            />
          </Card>
        );
      })}

      <Divider style={{ marginVertical: 8 }} />

      {/* Compatible Nakshatras */}
      <List.Subheader style={{ color: theme.colors.primary }}>Compatible Nakshatras</List.Subheader>
      <View style={styles.chipRow}>
        {compatible.map((n) => (
          <Chip
            key={n}
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
            accessibilityLabel={`Compatible nakshatra: ${n}`}
          >
            {n}
          </Chip>
        ))}
        {compatible.length === 0 && (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Compatibility data not available for this nakshatra.
          </Text>
        )}
      </View>

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

export default NakshatraScreen;

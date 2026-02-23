import React from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Platform } from 'react-native';
import {
  Text,
  Card,
  List,
  Chip,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { panchangService } from '../services/panchang';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';
import { useUserProfile } from '../hooks/useUserProfile';
import { AppStackParamList } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const ToolsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { profile } = useUserProfile();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const maxWidth = isWide ? 720 : '100%';

  const today = new Date();
  const panchang = panchangService.calculatePanchang(today, 28.6, 77.2);

  const nakshatra = React.useMemo(() => {
    if (!profile?.birth_date) return 'Pushya';
    const jd = astrologyEngine.toJulianDay(new Date(profile.birth_date));
    const moonVedic = astrologyEngine.tropicalToVedic(
      astrologyEngine.calcMoonLongitude(jd),
      jd
    );
    return astrologyEngine.getNakshatra(moonVedic);
  }, [profile?.birth_date]);

  const lucky = horoscopeService.getLuckyFactors(nakshatra, today);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, isWide && { alignItems: 'center' }]}
    >
      <View style={{ maxWidth, width: '100%' }}>
        {/* ── DAILY TOOLS ── */}
        <List.Subheader style={{ color: theme.colors.primary }}>Daily Tools</List.Subheader>

        {/* Panchang Card */}
        <Card
          mode="elevated"
          elevation={1}
          style={styles.card}
          onPress={() => navigation.navigate('Panchang')}
          accessibilityLabel="Daily Panchang — tap for details"
        >
          <Card.Title
            title="Daily Panchang"
            subtitle="Hindu calendar essentials"
            titleVariant="titleMedium"
            left={props => <List.Icon {...props} icon="calendar-month" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
          />
          <Card.Content>
            <View style={styles.panchangChips}>
              <Chip
                icon="moon-waning-crescent"
                mode="flat"
                compact
                style={{ backgroundColor: theme.colors.secondaryContainer, marginRight: 8 }}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
                accessibilityLabel={`Tithi: ${panchang.tithi}`}
              >
                {panchang.tithi}
              </Chip>
              <Chip
                icon="star-four-points"
                mode="flat"
                compact
                style={{ backgroundColor: theme.colors.secondaryContainer, marginRight: 8 }}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
                accessibilityLabel={`Nakshatra: ${panchang.nakshatra}`}
              >
                {panchang.nakshatra}
              </Chip>
              <Chip
                icon="alert-outline"
                mode="flat"
                compact
                style={{ backgroundColor: theme.colors.errorContainer }}
                textStyle={{ color: theme.colors.onErrorContainer }}
                accessibilityLabel={`Rahu Kaal: ${panchang.rahuKaal.start} to ${panchang.rahuKaal.end}`}
              >
                {panchang.rahuKaal.start}–{panchang.rahuKaal.end}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Lucky Factors Card */}
        <Card mode="elevated" elevation={1} style={styles.card} accessibilityLabel="Lucky factors for today">
          <Card.Title
            title="Lucky Factors"
            subtitle="Your auspicious elements today"
            titleVariant="titleMedium"
            left={props => <List.Icon {...props} icon="clover" color={theme.colors.primary} />}
          />
          <Card.Content>
            <View style={styles.panchangChips}>
              <Chip
                icon="numeric"
                mode="flat"
                compact
                style={{ backgroundColor: theme.colors.primaryContainer, marginRight: 8 }}
                textStyle={{ color: theme.colors.onPrimaryContainer }}
                accessibilityLabel={`Lucky number: ${lucky.number}`}
              >
                {lucky.number}
              </Chip>
              <Chip
                icon="palette"
                mode="flat"
                compact
                style={{ backgroundColor: theme.colors.primaryContainer, marginRight: 8 }}
                textStyle={{ color: theme.colors.onPrimaryContainer }}
                accessibilityLabel={`Lucky color: ${lucky.color}`}
              >
                {lucky.color}
              </Chip>
              <Chip
                icon="clock-outline"
                mode="flat"
                compact
                style={{ backgroundColor: theme.colors.primaryContainer }}
                textStyle={{ color: theme.colors.onPrimaryContainer }}
                accessibilityLabel={`Lucky time: ${lucky.time}`}
              >
                {lucky.time}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {/* ── PERSONAL TOOLS ── */}
        <List.Subheader style={{ color: theme.colors.primary }}>Personal Tools</List.Subheader>

        {[
          { icon: 'star-david', label: 'Janma Kundli', subtitle: 'Full Vedic birth chart with yogas & remedies', screen: 'JanmaKundli' as const },
          { icon: 'heart-multiple', label: 'Kundli Milan', subtitle: 'Ashtakoot compatibility (36 Guna)', screen: 'KundliMilan' as const },
          { icon: 'orbit', label: 'Vimshottari Dasha', subtitle: 'Planetary period timeline', screen: 'Dasha' as const },
          { icon: 'swap-horizontal', label: 'Gochar — Transits', subtitle: 'Current transits & Sade Sati', screen: 'Gochar' as const },
          { icon: 'calendar-star', label: 'Varshaphal', subtitle: 'Annual solar return chart', screen: 'Varshaphal' as const },
          { icon: 'chart-pie', label: 'Varga Charts', subtitle: 'Navamsa & divisional charts', screen: 'VargaCharts' as const },
          { icon: 'star-four-points', label: 'Nakshatra Vishesh', subtitle: 'Deep nakshatra analysis', screen: 'NakshatraVishesh' as const },
          { icon: 'grid', label: 'Ashtakavarga', subtitle: 'Planetary strength grid', screen: 'Ashtakavarga' as const },
          { icon: 'shield-sun', label: 'Graha Shanti', subtitle: 'Remedies for afflicted planets', screen: 'GrahaShanti' as const },
          { icon: 'zodiac-aries', label: 'Dainik Rashifal', subtitle: 'Daily Vedic horoscope', screen: 'DainikRashifal' as const },
        ].map(tool => (
          <Card
            key={tool.label}
            mode="elevated"
            elevation={1}
            style={styles.card}
            onPress={() => navigation.navigate(tool.screen)}
            accessibilityLabel={`${tool.label} — ${tool.subtitle}`}
          >
            <Card.Title
              title={tool.label}
              subtitle={tool.subtitle}
              titleVariant="titleMedium"
              left={props => <List.Icon {...props} icon={tool.icon} color={theme.colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            />
          </Card>
        ))}

        <Divider style={styles.divider} />

        {/* ── CALENDAR & TIMING TOOLS ── */}
        <List.Subheader style={{ color: theme.colors.primary }}>Calendar & Timing</List.Subheader>

        {[
          { icon: 'calendar-text', label: 'Panchang Vishesh', subtitle: 'Extended daily Panchang', screen: 'PanchangVishesh' as const },
          { icon: 'clock-check', label: 'Muhurta', subtitle: 'Auspicious timing calculator', screen: 'Muhurta' as const },
          { icon: 'moon-waning-crescent', label: 'Tithi & Chandra', subtitle: 'Moon phase & lunar calendar', screen: 'TithiChandra' as const },
          { icon: 'weather-night', label: 'Grahan — Eclipses', subtitle: 'Eclipse calendar & impact', screen: 'Grahan' as const },
          { icon: 'clock-outline', label: 'Hora', subtitle: 'Vedic planetary hours', screen: 'Hora' as const },
          { icon: 'help-circle', label: 'Prashna — Horary', subtitle: 'Ask a question to the stars', screen: 'Prashna' as const },
        ].map(tool => (
          <Card
            key={tool.label}
            mode="elevated"
            elevation={1}
            style={styles.card}
            onPress={() => navigation.navigate(tool.screen)}
            accessibilityLabel={`${tool.label} — ${tool.subtitle}`}
          >
            <Card.Title
              title={tool.label}
              subtitle={tool.subtitle}
              titleVariant="titleMedium"
              left={props => <List.Icon {...props} icon={tool.icon} color={theme.colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            />
          </Card>
        ))}

        <Divider style={styles.divider} />

        {/* ── PREMIUM SERVICES ── */}
        <List.Subheader style={{ color: theme.colors.primary }}>Premium Services</List.Subheader>

        {[
          { icon: 'help-circle-outline', label: 'Ask a Question', subtitle: 'Get a personalized answer from an astrologer', price: '₹49', screen: 'AskQuestion' as const },
          { icon: 'phone-in-talk-outline', label: 'Book a Call', subtitle: 'Live consultation with an astrologer', price: '₹999', screen: 'BookCall' as const },
          { icon: 'file-chart-outline', label: 'Request a Report', subtitle: 'Detailed PDF report from an astrologer', price: '₹299', screen: 'RequestReport' as const },
        ].map(service => (
          <Card
            key={service.label}
            mode="elevated"
            elevation={1}
            style={styles.card}
            onPress={() => navigation.navigate(service.screen)}
            accessibilityLabel={`${service.label} — ${service.price}`}
          >
            <Card.Title
              title={service.label}
              subtitle={service.subtitle}
              titleVariant="titleMedium"
              left={props => <List.Icon {...props} icon={service.icon} color={theme.colors.primary} />}
              right={() => (
                <Chip
                  mode="flat"
                  style={[styles.priceChip, { backgroundColor: theme.colors.secondaryContainer }]}
                  textStyle={{ color: theme.colors.onSecondaryContainer }}
                >
                  {service.price}
                </Chip>
              )}
            />
          </Card>
        ))}

        <View style={styles.bottomPad} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: Platform.OS === 'web' ? 8 : 0,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  panchangChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingBottom: 8,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  priceChip: {
    marginRight: 12,
  },
  bottomPad: {
    height: 24,
  },
});

export default ToolsScreen;

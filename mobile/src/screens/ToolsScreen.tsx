import React from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Platform, Pressable } from 'react-native';
import {
  Text,
  Card,
  Chip,
  useTheme,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { panchangService } from '../services/panchang';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';
import { useUserProfile } from '../hooks/useUserProfile';
import { AppStackParamList } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Category accent colors ──────────────────────────────────────────────────
const CATEGORY_ACCENTS = {
  daily: '#42A5F5',  // Sky blue for daily/utility tools
  personal: '#7B6FDD', // Indigo for personal charts
  calendar: '#26C6A0', // Teal for calendar/timing
  premium: '#FFC044', // Gold for premium services
};

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

  const renderSectionHeader = (title: string, accent: string) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionAccent, { backgroundColor: accent }]} />
      <Text variant="labelLarge" style={[styles.sectionTitle, { color: accent }]}>
        {title.toUpperCase()}
      </Text>
    </View>
  );

  const renderToolCard = (
    tool: { icon: string; label: string; subtitle: string; screen: keyof AppStackParamList },
    accent: string,
  ) => (
    <Pressable
      key={tool.label}
      style={({ pressed }) => [
        styles.toolPressable,
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
      onPress={() => navigation.navigate(tool.screen as any)}
      accessibilityLabel={`${tool.label} — ${tool.subtitle}`}
    >
      <Card
        mode="elevated"
        elevation={1}
        style={[
          styles.card,
          {
            borderLeftWidth: 3,
            borderLeftColor: accent,
          },
        ]}
      >
        <Card.Title
          title={tool.label}
          subtitle={tool.subtitle}
          titleVariant="titleMedium"
          titleStyle={{ fontWeight: '600' }}
          subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
          left={props => (
            <LinearGradient
              colors={[accent + '25', accent + '08']}
              style={styles.iconWrap}
            >
              <PhIcon name={tool.icon} size={24} color={accent} />
            </LinearGradient>
          )}
          right={() => <PhIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />}
        />
      </Card>
    </Pressable>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, isWide && { alignItems: 'center' }]}
    >
      <View style={{ maxWidth, width: '100%' }}>
        {/* ── DAILY TOOLS ── */}
        {renderSectionHeader('Daily Tools', CATEGORY_ACCENTS.daily)}

        {/* Panchang Card */}
        <Pressable
          style={({ pressed }) => [
            styles.toolPressable,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={() => navigation.navigate('Panchang')}
          accessibilityLabel="Daily Panchang — tap for details"
        >
          <Card
            mode="elevated"
            elevation={1}
            style={[styles.card, { borderLeftWidth: 3, borderLeftColor: CATEGORY_ACCENTS.daily }]}
          >
            <Card.Title
              title="Daily Panchang"
              subtitle="Hindu calendar essentials"
              titleVariant="titleMedium"
              titleStyle={{ fontWeight: '600' }}
              left={props => (
                <LinearGradient
                  colors={[CATEGORY_ACCENTS.daily + '25', CATEGORY_ACCENTS.daily + '08']}
                  style={styles.iconWrap}
                >
                  <PhIcon name="calendar-month" size={24} color={CATEGORY_ACCENTS.daily} />
                </LinearGradient>
              )}
              right={() => <PhIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />}
            />
            <Card.Content>
              <View style={styles.panchangChips}>
                <Chip
                  icon="moon-waning-crescent"
                  mode="flat"
                  compact
                  style={[styles.chip, { backgroundColor: theme.dark ? 'rgba(94,66,0,0.5)' : theme.colors.secondaryContainer }]}
                  textStyle={{ color: theme.dark ? '#FFC044' : theme.colors.onSecondaryContainer }}
                  accessibilityLabel={`Tithi: ${panchang.tithi}`}
                >
                  {panchang.tithi}
                </Chip>
                <Chip
                  icon="star-four-points"
                  mode="flat"
                  compact
                  style={[styles.chip, { backgroundColor: theme.dark ? 'rgba(94,66,0,0.5)' : theme.colors.secondaryContainer }]}
                  textStyle={{ color: theme.dark ? '#FFC044' : theme.colors.onSecondaryContainer }}
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
        </Pressable>

        {/* Lucky Factors Card */}
        <Card mode="elevated" elevation={1} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: CATEGORY_ACCENTS.daily }]} accessibilityLabel="Lucky factors for today">
          <Card.Title
            title="Lucky Factors"
            subtitle="Your auspicious elements today"
            titleVariant="titleMedium"
            titleStyle={{ fontWeight: '600' }}
            left={props => (
              <LinearGradient
                colors={[CATEGORY_ACCENTS.daily + '25', CATEGORY_ACCENTS.daily + '08']}
                style={styles.iconWrap}
              >
                <PhIcon name="clover" size={24} color={CATEGORY_ACCENTS.daily} />
              </LinearGradient>
            )}
          />
          <Card.Content>
            <View style={styles.panchangChips}>
              <Chip icon="numeric" mode="flat" compact style={[styles.chip, { backgroundColor: theme.dark ? 'rgba(54,45,138,0.4)' : theme.colors.primaryContainer }]} textStyle={{ color: theme.dark ? '#CBBEFF' : theme.colors.onPrimaryContainer }} accessibilityLabel={`Lucky number: ${lucky.number}`}>
                {lucky.number}
              </Chip>
              <Chip icon="palette" mode="flat" compact style={[styles.chip, { backgroundColor: theme.dark ? 'rgba(54,45,138,0.4)' : theme.colors.primaryContainer }]} textStyle={{ color: theme.dark ? '#CBBEFF' : theme.colors.onPrimaryContainer }} accessibilityLabel={`Lucky color: ${lucky.color}`}>
                {lucky.color}
              </Chip>
              <Chip icon="clock-outline" mode="flat" compact style={[styles.chip, { backgroundColor: theme.dark ? 'rgba(54,45,138,0.4)' : theme.colors.primaryContainer }]} textStyle={{ color: theme.dark ? '#CBBEFF' : theme.colors.onPrimaryContainer }} accessibilityLabel={`Lucky time: ${lucky.time}`}>
                {lucky.time}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* ── PERSONAL TOOLS ── */}
        {renderSectionHeader('Personal Tools', CATEGORY_ACCENTS.personal)}

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
        ].map(tool => renderToolCard(tool, CATEGORY_ACCENTS.personal))}

        {/* ── CALENDAR & TIMING TOOLS ── */}
        {renderSectionHeader('Calendar & Timing', CATEGORY_ACCENTS.calendar)}

        {[
          { icon: 'calendar-text', label: 'Panchang Vishesh', subtitle: 'Extended daily Panchang', screen: 'PanchangVishesh' as const },
          { icon: 'clock-check', label: 'Muhurta', subtitle: 'Auspicious timing calculator', screen: 'Muhurta' as const },
          { icon: 'moon-waning-crescent', label: 'Tithi & Chandra', subtitle: 'Moon phase & lunar calendar', screen: 'TithiChandra' as const },
          { icon: 'weather-night', label: 'Grahan — Eclipses', subtitle: 'Eclipse calendar & impact', screen: 'Grahan' as const },
          { icon: 'clock-outline', label: 'Hora', subtitle: 'Vedic planetary hours', screen: 'Hora' as const },
          { icon: 'help-circle', label: 'Prashna — Horary', subtitle: 'Ask a question to the stars', screen: 'Prashna' as const },
        ].map(tool => renderToolCard(tool, CATEGORY_ACCENTS.calendar))}

        {/* ── PREMIUM SERVICES ── */}
        {renderSectionHeader('Premium Services', CATEGORY_ACCENTS.premium)}

        {[
          { icon: 'help-circle-outline', label: 'Ask a Question', subtitle: 'Get a personalized answer from an astrologer', price: '₹49', screen: 'AskQuestion' as const },
          { icon: 'phone-in-talk-outline', label: 'Book a Call', subtitle: 'Live consultation with an astrologer', price: '₹999', screen: 'BookCall' as const },
          { icon: 'file-chart-outline', label: 'Request a Report', subtitle: 'Detailed PDF report from an astrologer', price: '₹299', screen: 'RequestReport' as const },
        ].map(service => (
          <Pressable
            key={service.label}
            style={({ pressed }) => [
              styles.toolPressable,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
            onPress={() => navigation.navigate(service.screen)}
            accessibilityLabel={`${service.label} — ${service.price}`}
          >
            <Card
              mode="elevated"
              elevation={1}
              style={[styles.card, { borderLeftWidth: 3, borderLeftColor: CATEGORY_ACCENTS.premium }]}
            >
              <Card.Title
                title={service.label}
                subtitle={service.subtitle}
                titleVariant="titleMedium"
                titleStyle={{ fontWeight: '600' }}
                subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                left={props => (
                  <LinearGradient
                    colors={[CATEGORY_ACCENTS.premium + '25', CATEGORY_ACCENTS.premium + '08']}
                    style={styles.iconWrap}
                  >
                    <PhIcon name={service.icon} size={24} color={CATEGORY_ACCENTS.premium} />
                  </LinearGradient>
                )}
                right={() => (
                  <Chip
                    mode="flat"
                    style={[styles.priceChip, { backgroundColor: theme.dark ? 'rgba(94,66,0,0.5)' : theme.colors.secondaryContainer }]}
                    textStyle={{ color: theme.dark ? '#FFC044' : theme.colors.onSecondaryContainer, fontWeight: '700' }}
                  >
                    {service.price}
                  </Chip>
                )}
              />
            </Card>
          </Pressable>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  sectionAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 1.2,
    fontSize: 12,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 18,
  },
  toolPressable: {
    ...Platform.select({
      web: { cursor: 'pointer' as any, transition: 'transform 0.12s ease' as any } as any,
    }),
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panchangChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingBottom: 8,
  },
  chip: {
    marginRight: 0,
  },
  priceChip: {
    marginRight: 12,
  },
  bottomPad: {
    height: 24,
  },
});

export default ToolsScreen;

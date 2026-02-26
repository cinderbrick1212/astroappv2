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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { panchangService } from '../services/panchang';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';
import { useUserProfile } from '../hooks/useUserProfile';
import { AppStackParamList } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Category accent colors ──────────────────────────────────────────────────
const CATEGORY_ACCENTS = {
  daily: '#42A5F5',    // Sky blue
  personal: '#7B6FDD', // Indigo
  calendar: '#26C6A0', // Teal
  premium: '#FFC044',  // Gold
};

const ToolsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { profile } = useUserProfile();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const maxWidth = isWide ? 720 : '100%';
  const insets = useSafeAreaInsets();

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

  const renderSectionHeader = (title: string, subtitle: string, accent: string) => (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );

  const renderGridToolCard = (
    tool: { icon: string; label: string; screen: keyof AppStackParamList },
    accent: string,
  ) => (
    <Pressable
      key={tool.label}
      style={({ pressed }) => [
        styles.gridToolItem,
        {
          backgroundColor: theme.dark
            ? theme.colors.elevation.level2
            : theme.colors.surface,
          borderColor: pressed
            ? accent + '50'
            : theme.dark ? 'rgba(203,190,255,0.08)' : theme.colors.outlineVariant,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
      onPress={() => navigation.navigate(tool.screen as any)}
      accessibilityLabel={tool.label}
      android_ripple={{ color: accent + '30' }}
    >
      <LinearGradient
        colors={[accent + '25', accent + '08']}
        style={styles.gridIconWrap}
      >
        <PhIcon name={tool.icon} size={28} color={accent} />
      </LinearGradient>
      <Text variant="labelMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 10, textAlign: 'center' }} numberOfLines={2}>
        {tool.label}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content,
        isWide && { alignItems: 'center' },
        { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 24) }
      ]}
    >
      <View style={{ maxWidth, width: '100%', paddingHorizontal: 16 }}>

        {/* ── DAILY INSIGHTS ── */}
        <View style={{ marginTop: 20, marginBottom: 16 }}>
          <Text variant="headlineMedium" style={{ fontWeight: '700', color: theme.colors.onBackground, letterSpacing: -0.5 }}>
            Astro Hub
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            Your complete astrological toolkit
          </Text>
        </View>

        {renderSectionHeader('Daily Insights', 'Cosmic factors for today', CATEGORY_ACCENTS.daily)}

        {/* Panchang Card */}
        <Pressable
          style={({ pressed }) => [
            styles.toolPressable,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={() => navigation.navigate('Panchang')}
          accessibilityLabel="Daily Panchang — tap for details"
          android_ripple={{ color: CATEGORY_ACCENTS.daily + '30' }}
        >
          <Card
            mode="elevated"
            elevation={1}
            style={[styles.fullWidthCard, { borderLeftWidth: 3, borderLeftColor: CATEGORY_ACCENTS.daily }]}
          >
            <Card.Title
              title="Daily Panchang"
              subtitle="Hindu calendar essentials"
              titleVariant="titleMedium"
              titleStyle={{ fontWeight: '600' }}
              left={props => (
                <LinearGradient
                  colors={[CATEGORY_ACCENTS.daily + '25', CATEGORY_ACCENTS.daily + '08']}
                  style={styles.fullWidthIconWrap}
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
        <Card mode="elevated" elevation={1} style={[styles.fullWidthCard, { borderLeftWidth: 3, borderLeftColor: CATEGORY_ACCENTS.daily }]} accessibilityLabel="Lucky factors for today">
          <Card.Title
            title="Lucky Factors"
            subtitle="Your auspicious elements today"
            titleVariant="titleMedium"
            titleStyle={{ fontWeight: '600' }}
            left={props => (
              <LinearGradient
                colors={[CATEGORY_ACCENTS.daily + '25', CATEGORY_ACCENTS.daily + '08']}
                style={styles.fullWidthIconWrap}
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
        {renderSectionHeader('Personal Analytics', 'Deep dive into your birth chart', CATEGORY_ACCENTS.personal)}

        <View style={styles.toolGrid}>
          {[
            { icon: 'star-david', label: 'Janma Kundli', screen: 'JanmaKundli' as const },
            { icon: 'heart-multiple', label: 'Kundli Milan', screen: 'KundliMilan' as const },
            { icon: 'orbit', label: 'Dasha Timeline', screen: 'Dasha' as const },
            { icon: 'swap-horizontal', label: 'Transits (Gochar)', screen: 'Gochar' as const },
            { icon: 'calendar-star', label: 'Varshaphal', screen: 'Varshaphal' as const },
            { icon: 'chart-pie', label: 'Varga Charts', screen: 'VargaCharts' as const },
            { icon: 'star-four-points', label: 'Nakshatras', screen: 'NakshatraVishesh' as const },
            { icon: 'grid', label: 'Ashtakavarga', screen: 'Ashtakavarga' as const },
            { icon: 'shield-sun', label: 'Remedies', screen: 'GrahaShanti' as const },
            { icon: 'zodiac-aries', label: 'Rashifal', screen: 'DainikRashifal' as const },
          ].map(tool => renderGridToolCard(tool, CATEGORY_ACCENTS.personal))}
        </View>

        {/* ── CALENDAR & TIMING TOOLS ── */}
        {renderSectionHeader('Timing & Events', 'Auspicious times and celestial body movements', CATEGORY_ACCENTS.calendar)}

        <View style={styles.toolGrid}>
          {[
            { icon: 'calendar-text', label: 'Panchang Ext.', screen: 'PanchangVishesh' as const },
            { icon: 'clock-check', label: 'Muhurta', screen: 'Muhurta' as const },
            { icon: 'moon-waning-crescent', label: 'Moon Phases', screen: 'TithiChandra' as const },
            { icon: 'weather-night', label: 'Eclipses', screen: 'Grahan' as const },
            { icon: 'clock-outline', label: 'Planetary Hours', screen: 'Hora' as const },
            { icon: 'help-circle', label: 'Prashna', screen: 'Prashna' as const },
          ].map(tool => renderGridToolCard(tool, CATEGORY_ACCENTS.calendar))}
        </View>

        {/* ── PREMIUM SERVICES ── */}
        {renderSectionHeader('Premium Services', 'Expert consultations and reports', CATEGORY_ACCENTS.premium)}

        {[
          { icon: 'help-circle-outline', label: 'Ask a Question', subtitle: 'Get a personalized answer', price: '₹49', screen: 'AskQuestion' as const },
          { icon: 'phone-in-talk-outline', label: 'Book a Call', subtitle: 'Live 30m consultation', price: '₹999', screen: 'BookCall' as const },
          { icon: 'file-chart-outline', label: 'Request a Report', subtitle: 'Detailed 25-page PDF', price: '₹299', screen: 'RequestReport' as const },
        ].map(service => (
          <Pressable
            key={service.label}
            style={({ pressed }) => [
              styles.toolPressable,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
            onPress={() => navigation.navigate(service.screen)}
            accessibilityLabel={`${service.label} — ${service.price}`}
            android_ripple={{ color: CATEGORY_ACCENTS.premium + '30' }}
          >
            <Card
              mode="elevated"
              elevation={1}
              style={[styles.fullWidthCard, { borderLeftWidth: 3, borderLeftColor: CATEGORY_ACCENTS.premium }]}
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
                    style={styles.fullWidthIconWrap}
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
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    marginBottom: 8,
  },
  gridToolItem: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' as any, transition: 'transform 0.15s ease' as any },
    }),
  },
  gridIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthCard: {
    marginBottom: 10,
    borderRadius: 18,
  },
  fullWidthIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolPressable: {
    ...Platform.select({
      web: { cursor: 'pointer' as any, transition: 'transform 0.12s ease' as any } as any,
    }),
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

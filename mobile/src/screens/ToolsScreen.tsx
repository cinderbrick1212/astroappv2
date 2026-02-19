import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { panchangService } from '../services/panchang';
import { horoscopeService } from '../services/horoscope';
import { astrologyEngine } from '../services/astrologyEngine';
import { useUserProfile } from '../hooks/useUserProfile';
import { AppStackParamList } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const ToolsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useUserProfile();
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Astrology Tools</Text>
      </View>

      {/* Daily Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Tools</Text>

        {/* Panchang Card */}
        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate('Panchang')}
        >
          <View style={styles.toolCardHeader}>
            <Text style={styles.toolIcon}>📆</Text>
            <View style={styles.toolCardMeta}>
              <Text style={styles.toolCardTitle}>Daily Panchang</Text>
              <Text style={styles.toolCardSubtitle}>Hindu calendar essentials</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </View>
          <View style={styles.panchangRow}>
            <View style={styles.panchangItem}>
              <Text style={styles.panchangLabel}>Tithi</Text>
              <Text style={styles.panchangValue}>{panchang.tithi}</Text>
            </View>
            <View style={styles.panchangItem}>
              <Text style={styles.panchangLabel}>Nakshatra</Text>
              <Text style={styles.panchangValue}>{panchang.nakshatra}</Text>
            </View>
          </View>
          <View style={styles.panchangItem}>
            <Text style={styles.panchangLabel}>Rahu Kaal</Text>
            <Text style={styles.panchangValue}>
              {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
            </Text>
          </View>
          <Text style={styles.ctaText}>Tap for full Panchang details</Text>
        </TouchableOpacity>

        {/* Lucky Factors Card */}
        <View style={styles.toolCard}>
          <View style={styles.toolCardHeader}>
            <Text style={styles.toolIcon}>🍀</Text>
            <View style={styles.toolCardMeta}>
              <Text style={styles.toolCardTitle}>Lucky Factors</Text>
              <Text style={styles.toolCardSubtitle}>Your auspicious elements today</Text>
            </View>
          </View>
          <View style={styles.panchangRow}>
            <View style={styles.panchangItem}>
              <Text style={styles.panchangLabel}>Number</Text>
              <Text style={styles.luckyNumber}>{lucky.number}</Text>
            </View>
            <View style={styles.panchangItem}>
              <Text style={styles.panchangLabel}>Color</Text>
              <Text style={styles.panchangValue}>{lucky.color}</Text>
            </View>
            <View style={styles.panchangItem}>
              <Text style={styles.panchangLabel}>Time</Text>
              <Text style={styles.panchangValue}>{lucky.time}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Personal Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Tools</Text>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate('Kundli')}
        >
          <View style={styles.toolCardHeader}>
            <Text style={styles.toolIcon}>🔯</Text>
            <View style={styles.toolCardMeta}>
              <Text style={styles.toolCardTitle}>Kundli Lite</Text>
              <Text style={styles.toolCardSubtitle}>Your birth chart summary</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </View>
          <Text style={styles.ctaText}>Tap to view your birth chart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate('Compatibility')}
        >
          <View style={styles.toolCardHeader}>
            <Text style={styles.toolIcon}>💞</Text>
            <View style={styles.toolCardMeta}>
              <Text style={styles.toolCardTitle}>Compatibility</Text>
              <Text style={styles.toolCardSubtitle}>Relationship match score</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </View>
          <Text style={styles.ctaText}>Check your compatibility with a partner</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium Services</Text>

        {[
          {
            icon: '❓',
            label: 'Ask a Question',
            subtitle: 'Get a personalized answer from an astrologer',
            price: '₹49',
            screen: 'AskQuestion' as const,
          },
          {
            icon: '📞',
            label: 'Book a Call',
            subtitle: 'Live consultation with an astrologer',
            price: '₹999',
            screen: 'BookCall' as const,
          },
          {
            icon: '📋',
            label: 'Request a Report',
            subtitle: 'Detailed PDF report from an astrologer',
            price: '₹299',
            screen: 'RequestReport' as const,
          },
        ].map(service => (
          <TouchableOpacity
            key={service.label}
            style={styles.serviceCard}
            onPress={() => navigation.navigate(service.screen)}
          >
            <Text style={styles.serviceIcon}>{service.icon}</Text>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceLabel}>{service.label}</Text>
              <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
            </View>
            <View style={styles.servicePriceBadge}>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
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
    marginBottom: spacing.md,
  },
  toolCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  toolIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  toolCardMeta: {
    flex: 1,
  },
  toolCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  toolCardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  panchangRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  panchangItem: {
    flex: 1,
    marginRight: spacing.sm,
  },
  panchangLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  panchangValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  luckyNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  ctaText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  servicePriceBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
});

export default ToolsScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { storage } from '../utils/storage';
import DatePickerModal from '../components/DatePickerModal';
import TimePickerModal from '../components/TimePickerModal';

const { width } = Dimensions.get('window');

const COMMON_CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Patna', lat: 25.6093, lng: 85.1376 },
];

const GENDERS: Array<'male' | 'female' | 'other'> = ['male', 'female', 'other'];

const GENDER_ICONS: Record<string, string> = {
  male: '♂️',
  female: '♀️',
  other: '⚧️',
};

interface OnboardingData {
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude: number;
  longitude: number;
  gender: 'male' | 'female' | 'other';
  timezone: string;
}

interface Props {
  onComplete: () => void;
}

const LAST_STEP = 4;

const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    latitude: 28.6139,
    longitude: 77.209,
    gender: 'other',
    timezone: 'Asia/Kolkata',
  });
  const [error, setError] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const next = () => {
    setError('');
    if (step === 1) {
      if (!data.name.trim()) {
        setError('Please enter your name');
        return;
      }
    }
    if (step === 2) {
      if (!data.birth_date) {
        setError('Please select your date of birth');
        return;
      }
      if (!data.birth_time) {
        setError('Please select your birth time');
        return;
      }
    }
    if (step === 3) {
      if (!data.birth_place.trim()) {
        setError('Please select or enter your birth place');
        return;
      }
    }
    if (step < LAST_STEP) {
      setStep(step + 1);
    }
  };

  const back = () => {
    setError('');
    if (step > 0) setStep(step - 1);
  };

  const finish = async () => {
    // Save profile data locally
    await storage.set(storage.keys.ONBOARDING_PROFILE, data);
    await storage.set(storage.keys.ONBOARDING_COMPLETE, true);
    onComplete();
  };

  const selectCity = (city: typeof COMMON_CITIES[0]) => {
    setData(d => ({
      ...d,
      birth_place: city.name,
      latitude: city.lat,
      longitude: city.lng,
    }));
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.welcomeIcon}>✨</Text>
            <Text style={styles.welcomeTitle}>Welcome to Astrology App</Text>
            <Text style={styles.welcomeSubtitle}>
              Discover your cosmic blueprint with personalized Vedic astrology insights
            </Text>
            <View style={styles.featureList}>
              {[
                { icon: '🔯', text: 'Personalized Kundli & Birth Chart' },
                { icon: '💞', text: 'Ashtakoot Compatibility Matching' },
                { icon: '📅', text: 'Daily Panchang & Horoscope' },
                { icon: '🪐', text: 'Mahadasha & Planet Insights' },
              ].map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepIcon}>👤</Text>
            <Text style={styles.stepTitle}>What's your name?</Text>
            <Text style={styles.stepSubtitle}>We'll personalize your experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.textTertiary}
              value={data.name}
              onChangeText={v => setData(d => ({ ...d, name: v }))}
              autoFocus
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepIcon}>🗓️</Text>
            <Text style={styles.stepTitle}>Birth Date & Time</Text>
            <Text style={styles.stepSubtitle}>
              Accurate birth details are essential for precise astrological calculations
            </Text>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text style={styles.pickerButtonIcon}>🗓️</Text>
                <Text
                  style={[
                    styles.pickerButtonText,
                    !data.birth_date && styles.pickerButtonPlaceholder,
                  ]}
                >
                  {data.birth_date || 'Select date of birth'}
                </Text>
                <Text style={styles.pickerButtonArrow}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Time of Birth (24hr)</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setTimePickerVisible(true)}
              >
                <Text style={styles.pickerButtonIcon}>🕐</Text>
                <Text
                  style={[
                    styles.pickerButtonText,
                    !data.birth_time && styles.pickerButtonPlaceholder,
                  ]}
                >
                  {data.birth_time || 'Select time of birth'}
                </Text>
                <Text style={styles.pickerButtonArrow}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDERS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderPill, data.gender === g && styles.genderPillActive]}
                    onPress={() => setData(d => ({ ...d, gender: g }))}
                  >
                    <Text style={styles.genderEmoji}>{GENDER_ICONS[g]}</Text>
                    <Text style={[styles.genderPillText, data.gender === g && styles.genderPillTextActive]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepIcon}>📍</Text>
            <Text style={styles.stepTitle}>Place of Birth</Text>
            <Text style={styles.stepSubtitle}>Select a city or enter your birth place</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your city name"
              placeholderTextColor={colors.textTertiary}
              value={data.birth_place}
              onChangeText={v => setData(d => ({ ...d, birth_place: v }))}
            />
            <Text style={styles.cityListLabel}>Popular Cities</Text>
            <View style={styles.cityGrid}>
              {COMMON_CITIES.map(city => (
                <TouchableOpacity
                  key={city.name}
                  style={[
                    styles.cityChip,
                    data.birth_place === city.name && styles.cityChipActive,
                  ]}
                  onPress={() => selectCity(city)}
                >
                  <Text
                    style={[
                      styles.cityChipText,
                      data.birth_place === city.name && styles.cityChipTextActive,
                    ]}
                  >
                    {city.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepIcon}>🌟</Text>
            <Text style={styles.stepTitle}>All Set!</Text>
            <Text style={styles.stepSubtitle}>Here's a summary of your details</Text>
            <View style={styles.summaryCard}>
              {[
                { label: 'Name', value: data.name, icon: '👤' },
                { label: 'Date of Birth', value: data.birth_date, icon: '🎂' },
                { label: 'Time of Birth', value: data.birth_time, icon: '🕐' },
                { label: 'Place of Birth', value: data.birth_place, icon: '📍' },
                { label: 'Gender', value: data.gender.charAt(0).toUpperCase() + data.gender.slice(1), icon: GENDER_ICONS[data.gender] },
              ].map((item, i) => (
                <View key={i} style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>{item.icon}</Text>
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryLabel}>{item.label}</Text>
                    <Text style={styles.summaryValue}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${(step / LAST_STEP) * 100}%` }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        {step > 0 && step <= LAST_STEP ? (
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {step < LAST_STEP ? (
          <TouchableOpacity style={styles.nextButton} onPress={next}>
            <Text style={styles.nextButtonText}>
              {step === 0 ? "Let's Begin" : 'Next'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.finishButton} onPress={finish}>
            <Text style={styles.nextButtonText}>Start Exploring ✨</Text>
          </TouchableOpacity>
        )}
      </View>

      <DatePickerModal
        visible={datePickerVisible}
        value={data.birth_date}
        onConfirm={date => {
          setData(d => ({ ...d, birth_date: date }));
          setDatePickerVisible(false);
          setError('');
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
      <TimePickerModal
        visible={timePickerVisible}
        value={data.birth_time}
        onConfirm={time => {
          setData(d => ({ ...d, birth_time: time }));
          setTimePickerVisible(false);
          setError('');
        }}
        onCancel={() => setTimePickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.md,
  },
  featureList: {
    width: '100%',
    maxWidth: 400,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  stepIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  formGroup: {
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  pickerButton: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerButtonIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  pickerButtonPlaceholder: {
    color: colors.textTertiary,
  },
  pickerButtonArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  genderPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderEmoji: {
    fontSize: 16,
  },
  genderPillText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  genderPillTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  cityListLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
    maxWidth: 400,
  },
  cityChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cityChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityChipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cityChipTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  summaryCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    marginLeft: 'auto',
  },
  finishButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    marginLeft: 'auto',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
});

export default OnboardingScreen;

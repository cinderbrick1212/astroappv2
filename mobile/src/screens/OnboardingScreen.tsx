import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Chip,
  Card,
  ProgressBar,
  SegmentedButtons,
  useTheme,
  List,
} from 'react-native-paper';
import { storage } from '../utils/storage';
import { dateHelpers } from '../utils/dateHelpers';
import DatePickerModal from '../components/DatePickerModal';
import TimePickerModal from '../components/TimePickerModal';

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
  const theme = useTheme();
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
            <Text variant="displaySmall" style={[styles.centeredText, { color: theme.colors.primary }]}>
              ✦ AstroApp
            </Text>
            <Text variant="headlineSmall" style={[styles.centeredText, { color: theme.colors.onBackground, marginTop: 8 }]}>
              Welcome
            </Text>
            <Text
              variant="bodyLarge"
              style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginTop: 8, marginBottom: 32 }]}
            >
              Discover your cosmic blueprint with personalized Vedic astrology insights
            </Text>
            {[
              { icon: 'star-david', text: 'Personalized Kundli & Birth Chart' },
              { icon: 'heart-multiple', text: 'Ashtakoot Compatibility Matching' },
              { icon: 'calendar-today', text: 'Daily Panchang & Horoscope' },
              { icon: 'orbit', text: 'Mahadasha & Planet Insights' },
            ].map((f, i) => (
              <Card
                key={i}
                mode="outlined"
                style={[styles.featureCard, { borderColor: theme.colors.outlineVariant }]}
              >
                <Card.Title
                  title={f.text}
                  titleVariant="bodyLarge"
                  left={props => (
                    <List.Icon {...props} icon={f.icon} color={theme.colors.primary} />
                  )}
                />
              </Card>
            ))}
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.onBackground }]}>
              What's your name?
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
            >
              We'll personalize your experience
            </Text>
            <TextInput
              mode="outlined"
              label="Your name"
              value={data.name}
              onChangeText={v => setData(d => ({ ...d, name: v }))}
              autoFocus
              style={styles.inputFull}
              theme={theme}
              accessibilityLabel="Enter your name"
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.onBackground }]}>
              Birth Date & Time
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
            >
              Accurate details are essential for precise calculations
            </Text>

            {/* Date picker trigger */}
            <Button
              mode="outlined"
              icon="calendar"
              onPress={() => setDatePickerVisible(true)}
              style={styles.pickerButton}
              contentStyle={styles.pickerButtonContent}
              accessibilityLabel="Select date of birth"
            >
              {data.birth_date || 'Select date of birth'}
            </Button>

            {/* Time picker trigger */}
            <Button
              mode="outlined"
              icon="clock-outline"
              onPress={() => setTimePickerVisible(true)}
              style={[styles.pickerButton, { marginTop: 12 }]}
              contentStyle={styles.pickerButtonContent}
              accessibilityLabel="Select time of birth"
            >
              {data.birth_time ? dateHelpers.formatTimeAmPm(data.birth_time) : 'Select time of birth'}
            </Button>

            {/* Gender segmented buttons */}
            <Text
              variant="labelLarge"
              style={[{ color: theme.colors.onSurface, marginTop: 20, marginBottom: 8, alignSelf: 'flex-start' }]}
            >
              Gender
            </Text>
            <SegmentedButtons
              value={data.gender}
              onValueChange={v => setData(d => ({ ...d, gender: v as typeof data.gender }))}
              buttons={GENDERS.map(g => ({
                value: g,
                label: `${GENDER_ICONS[g]} ${g.charAt(0).toUpperCase() + g.slice(1)}`,
                accessibilityLabel: g,
              }))}
              style={styles.inputFull}
              theme={theme}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.onBackground }]}>
              Place of Birth
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
            >
              Select a city or type your birth place
            </Text>
            <TextInput
              mode="outlined"
              label="City name"
              value={data.birth_place}
              onChangeText={v => setData(d => ({ ...d, birth_place: v }))}
              style={styles.inputFull}
              theme={theme}
              accessibilityLabel="Enter birth place city"
            />
            <Text
              variant="labelLarge"
              style={[{ color: theme.colors.onSurfaceVariant, marginTop: 20, marginBottom: 12, alignSelf: 'flex-start' }]}
            >
              Popular Cities
            </Text>
            <View style={styles.cityGrid}>
              {COMMON_CITIES.map(city => (
                <Chip
                  key={city.name}
                  mode={data.birth_place === city.name ? 'flat' : 'outlined'}
                  selected={data.birth_place === city.name}
                  onPress={() => selectCity(city)}
                  style={styles.cityChip}
                  accessibilityLabel={`Select ${city.name}`}
                  theme={theme}
                >
                  {city.name}
                </Chip>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.primary }]}>
              All Set!
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
            >
              Here's a summary of your details
            </Text>
            <Card mode="outlined" style={[styles.inputFull, { borderColor: theme.colors.outlineVariant }]}>
              <Card.Content>
                {[
                  { label: 'Name',          value: data.name,                                                    icon: 'account-outline' },
                  { label: 'Date of Birth', value: data.birth_date,                                              icon: 'calendar-outline' },
                  { label: 'Time of Birth', value: dateHelpers.formatTimeAmPm(data.birth_time),                  icon: 'clock-outline' },
                  { label: 'Place of Birth',value: data.birth_place,                                             icon: 'map-marker-outline' },
                  { label: 'Gender',        value: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),   icon: 'gender-male-female' },
                ].map((item, i, arr) => (
                  <List.Item
                    key={item.label}
                    title={item.value}
                    description={item.label}
                    left={props => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
                    style={i < arr.length - 1 ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.outlineVariant } : undefined}
                  />
                ))}
              </Card.Content>
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* MD3 ProgressBar */}
      <ProgressBar
        progress={step / LAST_STEP}
        color={theme.colors.primary}
        style={{ height: 4 }}
        theme={theme}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
        {error ? (
          <Text
            variant="bodySmall"
            style={[styles.centeredText, { color: theme.colors.error, marginTop: 8 }]}
          >
            {error}
          </Text>
        ) : null}
      </ScrollView>

      {/* Footer navigation */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
        {step > 0 && step <= LAST_STEP ? (
          <Button
            mode="text"
            onPress={back}
            accessibilityLabel="Go back"
          >
            Back
          </Button>
        ) : (
          <View />
        )}
        {step < LAST_STEP ? (
          <Button
            mode="contained"
            onPress={next}
            accessibilityLabel={step === 0 ? "Let's begin" : 'Next step'}
          >
            {step === 0 ? "Let's Begin" : 'Next'}
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={finish}
            buttonColor={theme.colors.secondary}
            textColor={theme.colors.onSecondary}
            accessibilityLabel="Start exploring the app"
          >
            Start Exploring ✦
          </Button>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  centeredText: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  featureCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 8,
  },
  inputFull: {
    width: '100%',
    maxWidth: 400,
  },
  pickerButton: {
    width: '100%',
    maxWidth: 400,
  },
  pickerButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    maxWidth: 400,
  },
  cityChip: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default OnboardingScreen;

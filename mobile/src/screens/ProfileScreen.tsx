import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Card,
  Avatar,
  List,
  Switch,
  Button,
  Chip,
  Divider,
  SegmentedButtons,
  useTheme,
  Portal,
  Modal,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { kundliService } from '../services/kundli';
import { analytics } from '../services/analytics';
import { storage } from '../utils/storage';
import { dateHelpers } from '../utils/dateHelpers';
import DatePickerModal from '../components/DatePickerModal';
import TimePickerModal from '../components/TimePickerModal';
import { astrologyEngine } from '../services/astrologyEngine';
import { horoscopeService } from '../services/horoscope';
import CityAutocomplete from '../components/CityAutocomplete';

const GENDERS: Array<'male' | 'female' | 'other'> = ['male', 'female', 'other'];

interface EditForm {
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  gender: 'male' | 'female' | 'other';
}

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile();
  const { t, i18n } = useTranslation();
  const [editVisible, setEditVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [form, setForm] = useState<EditForm>({
    birth_date: '',
    birth_time: '',
    birth_place: '',
    latitude: undefined,
    longitude: undefined,
    timezone: 'Asia/Kolkata',
    gender: 'other',
  });

  // Load persisted notification preference
  useEffect(() => {
    storage.get<boolean>(storage.keys.NOTIFICATIONS_ENABLED).then(val => {
      // Guard against non-boolean values from storage to prevent
      // native "String cannot be cast to Boolean" crash on the Switch component
      if (typeof val === 'boolean') setNotificationsEnabled(val);
    });
  }, []);

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await storage.set(storage.keys.NOTIFICATIONS_ENABLED, value);
  };

  const handleLanguageToggle = async () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    await i18n.changeLanguage(newLang);
    await storage.set(storage.keys.LANGUAGE_PREFERENCE, newLang);
    analytics.languageChanged(newLang);
  };

  const displayName =
    user?.username ||
    user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const openEditModal = () => {
    setForm({
      birth_date: profile?.birth_date ?? '',
      birth_time: profile?.birth_time ?? '',
      birth_place: profile?.birth_place ?? '',
      latitude: profile?.latitude,
      longitude: profile?.longitude,
      timezone: profile?.timezone ?? 'Asia/Kolkata',
      gender: profile?.gender ?? 'other',
    });
    setEditVisible(true);
  };

  const handleSave = () => {
    if (!form.birth_date) {
      Alert.alert('Missing field', 'Please select your date of birth.');
      return;
    }
    updateProfile(
      {
        birth_date: form.birth_date,
        birth_time: form.birth_time || '06:00',
        birth_place: form.birth_place,
        latitude: form.latitude,
        longitude: form.longitude,
        timezone: form.timezone,
        gender: form.gender,
      },
      {
        onSuccess: async () => {
          await kundliService.clearCache();
          analytics.birthDetailsUpdated();
          setEditVisible(false);
          Alert.alert('Saved', 'Birth details updated successfully.');
        },
        onError: () => {
          Alert.alert('Error', 'Could not save birth details. Please try again.');
        },
      }
    );
  };

  // Calculate astrological details for display
  const astProps = React.useMemo(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      const chart = astrologyEngine.calculateKundli(profile);
      return {
        lagna: chart.lagnaSign,
        rashi: chart.moonSign,
        nakshatra: `${chart.nakshatra} (Pada ${chart.nakshatraPada})`
      };
    } catch {
      return null;
    }
  }, [profile]);

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

        {/* Profile Header */}
        <Card
          mode="contained"
          style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Card.Content style={styles.headerContent}>
            <Avatar.Text
              size={72}
              label={initials}
              style={{ backgroundColor: theme.colors.primary }}
              labelStyle={{ color: theme.colors.onPrimary }}
              accessibilityLabel={`Avatar for ${displayName}`}
            />
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimaryContainer, marginTop: 12, textAlign: 'center' }}
            >
              {displayName}
            </Text>
            {user?.email ? (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, textAlign: 'center', marginTop: 4 }}
              >
                {user.email}
              </Text>
            ) : null}
            <Button
              mode="outlined"
              onPress={openEditModal}
              style={{ marginTop: 16, borderColor: theme.colors.primary }}
              textColor={theme.colors.primary}
              accessibilityLabel="Edit profile details"
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>

        {/* Birth Details */}
        <List.Subheader style={{ color: theme.colors.primary, marginTop: 8 }}>Birth Details</List.Subheader>
        <Card mode="outlined" style={styles.card}>
          <List.Item
            title={profile?.birth_date ?? 'Not set'}
            description="Date of Birth"
            left={props => <List.Icon {...props} icon="cake-variant-outline" color={theme.colors.primary} />}
            titleStyle={{ color: profile?.birth_date ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}
          />
          <Divider />
          <List.Item
            title={profile?.birth_time ? dateHelpers.formatTimeAmPm(profile.birth_time) : 'Not set'}
            description="Time of Birth"
            left={props => <List.Icon {...props} icon="clock-outline" color={theme.colors.primary} />}
            titleStyle={{ color: profile?.birth_time ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}
          />
          <Divider />
          <List.Item
            title={profile?.birth_place ?? 'Not set'}
            description="Place of Birth"
            left={props => <List.Icon {...props} icon="map-marker-outline" color={theme.colors.primary} />}
            titleStyle={{ color: profile?.birth_place ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}
          />
          {astProps && (
            <>
              <Divider />
              <List.Item
                title={`${astProps.lagna}`}
                description="Lagna (Ascendant)"
                left={props => <List.Icon {...props} icon="arrow-up-circle-outline" color={theme.colors.primary} />}
              />
              <Divider />
              <List.Item
                title={`${astProps.rashi}`}
                description="Moon Sign (Rashi)"
                left={props => <List.Icon {...props} icon="moon-waning-crescent" color={theme.colors.primary} />}
              />
              <Divider />
              <List.Item
                title={`${astProps.nakshatra}`}
                description="Nakshatra"
                left={props => <List.Icon {...props} icon="star-four-points-outline" color={theme.colors.primary} />}
              />
            </>
          )}
        </Card>

        {/* Subscription Card */}
        <Card
          mode="contained"
          style={[styles.card, { backgroundColor: theme.colors.tertiaryContainer, marginTop: 16 }]}
        >
          <Card.Title
            title="✨ AstroWitt Pro"
            subtitle="Unlimited reports, priority support, ad-free experience"
            subtitleNumberOfLines={2}
            titleVariant="titleMedium"
            titleStyle={{ color: theme.colors.onTertiaryContainer, fontWeight: 'bold' }}
            subtitleStyle={{ color: theme.colors.onTertiaryContainer, opacity: 0.9, marginTop: 4, lineHeight: 20 }}
          />
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => { }}
              buttonColor={theme.colors.tertiary}
              textColor={theme.colors.onTertiary}
            >
              Upgrade
            </Button>
          </Card.Actions>
        </Card>

        {/* Settings */}
        <List.Subheader style={{ color: theme.colors.primary, marginTop: 8 }}>{t('profile.settings')}</List.Subheader>
        <Card mode="outlined" style={styles.card}>
          <List.Item
            title={t('profile.language')}
            description={i18n.language === 'hi' ? 'हिंदी' : 'English'}
            left={props => <List.Icon {...props} icon="translate" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            onPress={handleLanguageToggle}
            accessibilityLabel="Toggle language"
          />
          <Divider />
          <List.Item
            title={t('profile.notifications') || 'Notifications'}
            left={props => <List.Icon {...props} icon="bell-outline" color={theme.colors.primary} />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                color={theme.colors.primary}
                accessibilityLabel="Toggle notifications"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" color={theme.colors.primary} />}
            right={() => (
              <Switch
                value={true}
                onValueChange={() => { }}
                color={theme.colors.primary}
                accessibilityLabel="Toggle dark mode"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Chart Style"
            description="South Indian"
            left={props => <List.Icon {...props} icon="chart-box-outline" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            accessibilityLabel="Select chart style"
          />
        </Card>

        {/* About Section */}
        <List.Subheader style={{ color: theme.colors.primary, marginTop: 8 }}>About</List.Subheader>
        <Card mode="outlined" style={styles.card}>
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="lock-outline" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            accessibilityLabel="Privacy Policy"
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document-outline" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            accessibilityLabel="Terms of Service"
          />
          <Divider />
          <List.Item
            title="Rate AstroWitt"
            left={props => <List.Icon {...props} icon="star-outline" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            accessibilityLabel="Rate on App Store"
          />
          <Divider />
          <List.Item
            title="Version"
            description="2.1.0"
            left={props => <List.Icon {...props} icon="information-outline" color={theme.colors.primary} />}
          />
        </Card>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            mode="text"
            onPress={handleLogout}
            textColor={theme.colors.error}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Sign out"
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>

      {/* Edit modal */}
      <Portal>
        <Modal
          visible={editVisible}
          onDismiss={() => setEditVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          {/* Modal header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
            <Button
              mode="text"
              onPress={() => setEditVisible(false)}
              accessibilityLabel="Cancel edit"
            >
              Cancel
            </Button>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Edit Birth Details
            </Text>
            <Button
              mode="text"
              onPress={handleSave}
              loading={isUpdating}
              disabled={isUpdating}
              accessibilityLabel="Save birth details"
            >
              Save
            </Button>
          </View>

          {/* Modal body */}
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            {/* Date of birth */}
            <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.onSurface }]}>
              Date of Birth
            </Text>
            <Button
              mode="outlined"
              icon="calendar"
              onPress={() => setDatePickerVisible(true)}
              style={styles.pickerButton}
              contentStyle={styles.pickerButtonContent}
              accessibilityLabel="Select date of birth"
            >
              {form.birth_date || 'Select date of birth'}
            </Button>

            {/* Time of birth */}
            <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.onSurface }]}>
              Time of Birth
            </Text>
            <Button
              mode="outlined"
              icon="clock-outline"
              onPress={() => setTimePickerVisible(true)}
              style={styles.pickerButton}
              contentStyle={styles.pickerButtonContent}
              accessibilityLabel="Select time of birth"
            >
              {form.birth_time ? dateHelpers.formatTimeAmPm(form.birth_time) : 'Select time of birth'}
            </Button>

            {/* Place of birth */}
            <CityAutocomplete
              value={form.birth_place}
              onSelect={city => setForm(f => ({
                ...f,
                birth_place: city.name,
                latitude: city.latitude,
                longitude: city.longitude
              }))}
              label="Place of Birth"
              placeholder="City, Country"
              containerStyle={styles.formInput}
            />

            {/* Timezone */}
            <TextInput
              mode="outlined"
              label="Timezone"
              placeholder="e.g. Asia/Kolkata"
              value={form.timezone}
              onChangeText={v => setForm(f => ({ ...f, timezone: v }))}
              style={styles.formInput}
              theme={theme}
              accessibilityLabel="Enter timezone"
            />

            {/* Gender */}
            <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.onSurface }]}>
              Gender
            </Text>
            <SegmentedButtons
              value={form.gender}
              onValueChange={v => setForm(f => ({ ...f, gender: v as EditForm['gender'] }))}
              buttons={GENDERS.map(g => ({
                value: g,
                label: g.charAt(0).toUpperCase() + g.slice(1),
                accessibilityLabel: g,
              }))}
              style={styles.genderButtons}
              theme={theme}
            />

            <View style={styles.modalBottomPad} />
          </ScrollView>
        </Modal>
      </Portal>

      <DatePickerModal
        visible={datePickerVisible}
        value={form.birth_date}
        onConfirm={date => {
          setForm(f => ({ ...f, birth_date: date }));
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
      <TimePickerModal
        visible={timePickerVisible}
        value={form.birth_time}
        onConfirm={time => {
          setForm(f => ({ ...f, birth_time: time }));
          setTimePickerVisible(false);
        }}
        onCancel={() => setTimePickerVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginBottom: 0,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  tierChip: {
    marginTop: 12,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  logoutSection: {
    margin: 16,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalBody: {
    padding: 16,
  },
  formLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  pickerButton: {
    marginBottom: 4,
  },
  pickerButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
  formInput: {
    marginTop: 16,
    marginBottom: 4,
  },
  genderButtons: {
    marginBottom: 8,
  },
  modalBottomPad: {
    height: 32,
  },
});

export default ProfileScreen;

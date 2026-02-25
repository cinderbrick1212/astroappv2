import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert, Platform } from 'react-native';
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
  Surface,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { LinearGradient } from 'expo-linear-gradient';
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
import CityAutocomplete from '../components/CityAutocomplete';
import { gradients } from '../theme/md3Theme';

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
  const { profile, isUpdating, updateProfile } = useUserProfile();
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

  useEffect(() => {
    storage.get<boolean>(storage.keys.NOTIFICATIONS_ENABLED).then(val => {
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

  const displayName = user?.username || user?.email?.split('@')[0] || 'Seeker';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Cosmic Departure', 'Are you sure you want to sign out?', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
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
        },
        onError: () => {
          Alert.alert('Error', 'Could not save birth details. Please try again.');
        },
      }
    );
  };

  const astProps = React.useMemo(() => {
    if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) return null;
    try {
      const chart = astrologyEngine.calculateKundli(profile);
      return {
        lagna: chart.lagnaSign,
        rashi: chart.moonSign,
        nakshatra: `${chart.nakshatra} (${chart.nakshatraPada})`
      };
    } catch {
      return null;
    }
  }, [profile]);

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>

        {/* ── Profile Header ── */}
        <LinearGradient
          colors={gradients.cosmicHero as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSurface}
        >
          <View style={styles.heroContent}>
            <View style={styles.avatarBorder}>
              <Avatar.Text
                size={84}
                label={initials}
                style={{ backgroundColor: theme.colors.surface }}
                labelStyle={{ color: theme.colors.primary, fontWeight: '700' }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 20 }}>
              <Text variant="headlineSmall" style={styles.heroName}>
                {displayName}
              </Text>
              {user?.email && (
                <Text variant="bodyMedium" style={styles.heroEmail}>
                  {user.email}
                </Text>
              )}
              <Button
                mode="contained-tonal"
                onPress={openEditModal}
                style={styles.editButton}
                labelStyle={styles.editButtonLabel}
                icon="pencil-outline"
                buttonColor="rgba(255,255,255,0.15)"
                textColor="#FFFFFF"
                compact
              >
                Edit Details
              </Button>
            </View>
          </View>
        </LinearGradient>

        {/* ── Premium Banner ── */}
        <Card mode="elevated" elevation={1} style={[styles.proCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <Card.Title
            title="✨ AstroWitt Pro"
            subtitle="Unlimited reports & ad-free experience"
            titleVariant="titleMedium"
            titleStyle={{ color: theme.colors.onTertiaryContainer, fontWeight: '700' }}
            subtitleStyle={{ color: theme.colors.onTertiaryContainer, opacity: 0.9, marginTop: 2 }}
            right={() => (
              <Button
                mode="contained"
                onPress={() => { }}
                buttonColor={theme.colors.tertiary}
                textColor={theme.colors.onTertiary}
                style={styles.upgradeBtn}
                compact
              >
                Upgrade
              </Button>
            )}
            rightStyle={{ marginRight: 16 }}
          />
        </Card>

        {/* ── Birth Details Panel ── */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Birth Details
        </Text>
        <Surface style={[styles.panelGroup, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : theme.colors.surface, borderColor: theme.dark ? 'rgba(255,255,255,0.05)' : theme.colors.outlineVariant }]} elevation={0}>
          <List.Item
            title={profile?.birth_date ?? 'Not set'}
            description="Date of Birth"
            left={props => <PhIcon name="cake-variant-outline" size={24} color={theme.colors.primary} style={styles.listIcon} />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDesc}
          />
          <Divider style={styles.divider} />
          <List.Item
            title={profile?.birth_time ? dateHelpers.formatTimeAmPm(profile.birth_time) : 'Not set'}
            description="Time of Birth"
            left={props => <PhIcon name="clock-outline" size={24} color={theme.colors.primary} style={styles.listIcon} />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDesc}
          />
          <Divider style={styles.divider} />
          <List.Item
            title={profile?.birth_place ?? 'Not set'}
            description="Place of Birth"
            left={props => <PhIcon name="map-marker-outline" size={24} color={theme.colors.primary} style={styles.listIcon} />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDesc}
          />
          {astProps && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.astroPillsRow}>
                <View style={[styles.astroPill, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, opacity: 0.7 }}>LAGNA</Text>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>{astProps.lagna}</Text>
                </View>
                <View style={[styles.astroPill, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, opacity: 0.7 }}>RASHI</Text>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>{astProps.rashi}</Text>
                </View>
                <View style={[styles.astroPill, { backgroundColor: theme.colors.secondaryContainer, flex: 2 }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, opacity: 0.7 }}>NAKSHATRA</Text>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }} numberOfLines={1}>{astProps.nakshatra}</Text>
                </View>
              </View>
            </>
          )}
        </Surface>

        {/* ── App Settings ── */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          {t('profile.settings')}
        </Text>
        <Surface style={[styles.panelGroup, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : theme.colors.surface, borderColor: theme.dark ? 'rgba(255,255,255,0.05)' : theme.colors.outlineVariant }]} elevation={0}>
          <List.Item
            title={t('profile.language')}
            description={i18n.language === 'hi' ? 'हिंदी' : 'English'}
            left={props => <PhIcon name="translate" size={24} color={theme.colors.primary} style={styles.listIcon} />}
            right={props => <PhIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} style={styles.listIconRight} />}
            onPress={handleLanguageToggle}
            titleStyle={styles.listTitle}
          />
          <Divider style={styles.divider} />
          <List.Item
            title={t('profile.notifications') || 'Notifications'}
            left={props => <PhIcon name="bell-outline" size={24} color={theme.colors.primary} style={styles.listIcon} />}
            right={() => <Switch value={notificationsEnabled} onValueChange={handleNotificationsToggle} color={theme.colors.primary} style={{ marginRight: 8 }} />}
            titleStyle={styles.listTitle}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Dark Mode"
            left={props => <PhIcon name="theme-light-dark" size={24} color={theme.colors.primary} style={styles.listIcon} />}
            right={() => <Switch value={theme.dark} onValueChange={() => { }} color={theme.colors.primary} style={{ marginRight: 8 }} />}
            titleStyle={styles.listTitle}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Chart Style"
            description="South Indian"
            left={props => <PhIcon name="chart-box-outline" size={24} color={theme.colors.primary} style={styles.listIcon} />}
            right={props => <PhIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} style={styles.listIconRight} />}
            titleStyle={styles.listTitle}
          />
        </Surface>

        {/* ── About & Support ── */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          About AstroWitt
        </Text>
        <Surface style={[styles.panelGroup, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : theme.colors.surface, borderColor: theme.dark ? 'rgba(255,255,255,0.05)' : theme.colors.outlineVariant }]} elevation={0}>
          <List.Item
            title="Privacy Policy"
            left={props => <PhIcon name="lock-outline" size={22} color={theme.colors.onSurfaceVariant} style={styles.listIcon} />}
            right={props => <PhIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} style={styles.listIconRight} />}
            titleStyle={styles.listTitleInfo}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Terms of Service"
            left={props => <PhIcon name="file-document-outline" size={22} color={theme.colors.onSurfaceVariant} style={styles.listIcon} />}
            right={props => <PhIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} style={styles.listIconRight} />}
            titleStyle={styles.listTitleInfo}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Rate the App"
            left={props => <PhIcon name="star-outline" size={22} color={theme.colors.onSurfaceVariant} style={styles.listIcon} />}
            right={props => <PhIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} style={styles.listIconRight} />}
            titleStyle={styles.listTitleInfo}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Version"
            description="2.1.0"
            left={props => <PhIcon name="information-outline" size={22} color={theme.colors.onSurfaceVariant} style={styles.listIcon} />}
            titleStyle={styles.listTitleInfo}
          />
        </Surface>

        {/* ── Logout Button ── */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          textColor={theme.colors.error}
          style={[styles.logoutBtn, { borderColor: theme.colors.error + '50' }]}
          icon="logout"
        >
          Sign Out of AstroWitt
        </Button>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── Edit Modal ── */}
      <Portal>
        <Modal
          visible={editVisible}
          onDismiss={() => setEditVisible(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
            <Button mode="text" onPress={() => setEditVisible(false)}>Cancel</Button>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Edit Details</Text>
            <Button mode="text" onPress={handleSave} loading={isUpdating} disabled={isUpdating}>Save</Button>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.primary }]}>Date of Birth</Text>
            <Button mode="outlined" icon="calendar" onPress={() => setDatePickerVisible(true)} style={styles.pickerButton} contentStyle={styles.pickerButtonContent}>
              {form.birth_date || 'Select date of birth'}
            </Button>

            <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.primary }]}>Time of Birth</Text>
            <Button mode="outlined" icon="clock-outline" onPress={() => setTimePickerVisible(true)} style={styles.pickerButton} contentStyle={styles.pickerButtonContent}>
              {form.birth_time ? dateHelpers.formatTimeAmPm(form.birth_time) : 'Select time of birth'}
            </Button>

            <CityAutocomplete
              value={form.birth_place}
              onSelect={city => setForm(f => ({ ...f, birth_place: city.name, latitude: city.latitude, longitude: city.longitude }))}
              label="Place of Birth"
              placeholder="City, Country"
              containerStyle={styles.formInput}
            />

            <TextInput
              mode="outlined"
              label="Timezone"
              placeholder="e.g. Asia/Kolkata"
              value={form.timezone}
              onChangeText={v => setForm(f => ({ ...f, timezone: v }))}
              style={styles.formInput}
              theme={theme}
            />

            <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.primary }]}>Gender</Text>
            <SegmentedButtons
              value={form.gender}
              onValueChange={v => setForm(f => ({ ...f, gender: v as EditForm['gender'] }))}
              buttons={GENDERS.map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }))}
              style={styles.genderButtons}
              theme={theme}
            />
            <View style={{ height: 40 }} />
          </ScrollView>
        </Modal>
      </Portal>

      <DatePickerModal
        visible={datePickerVisible}
        value={form.birth_date}
        onConfirm={date => { setForm(f => ({ ...f, birth_date: date })); setDatePickerVisible(false); }}
        onCancel={() => setDatePickerVisible(false)}
      />
      <TimePickerModal
        visible={timePickerVisible}
        value={form.birth_time}
        onConfirm={time => { setForm(f => ({ ...f, birth_time: time })); setTimePickerVisible(false); }}
        onCancel={() => setTimePickerVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingTop: Platform.OS === 'web' ? 24 : 16 },
  heroSurface: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroName: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heroEmail: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  editButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  editButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  proCard: {
    borderRadius: 20,
    marginBottom: 24,
  },
  upgradeBtn: {
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: -0.2,
  },
  panelGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  listIcon: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  listIconRight: {
    alignSelf: 'center',
    marginRight: 8,
  },
  listTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  listTitleInfo: {
    fontSize: 15,
  },
  listDesc: {
    marginTop: 2,
  },
  divider: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
  astroPillsRow: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    gap: 8,
  },
  astroPill: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutBtn: {
    marginVertical: 12,
    borderRadius: 16,
    paddingVertical: 4,
    borderWidth: 1.5,
  },
  bottomPad: { height: 32 },
  modalContainer: { margin: 20, borderRadius: 24, maxHeight: '90%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  modalBody: { padding: 20 },
  formLabel: { marginTop: 12, marginBottom: 8, fontWeight: '600' },
  pickerButton: { marginBottom: 8, borderRadius: 12 },
  pickerButtonContent: { justifyContent: 'flex-start', paddingVertical: 6 },
  formInput: { marginTop: 12, marginBottom: 8 },
  genderButtons: { marginBottom: 12 },
});

export default ProfileScreen;
